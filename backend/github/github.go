package github

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"OpenSus/backend/types"
)

const apiBase = "https://api.github.com"

// client wraps an HTTP client and an optional GitHub PAT.
type client struct {
	http  *http.Client
	token string
}

// newClient returns a configured GitHub API client.
func newClient(token string) *client {
	return &client{
		http:  &http.Client{Timeout: 20 * time.Second},
		token: token,
	}
}

func (c *client) newRequest(url string) (*http.Request, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	if c.token != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}
	return req, nil
}

// get performs a GET and decodes the JSON body into out.
func (c *client) get(url string, out interface{}) error {
	req, err := c.newRequest(url)
	if err != nil {
		return err
	}
	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("HTTP %d: %s", resp.StatusCode, string(body))
	}
	return json.NewDecoder(resp.Body).Decode(out)
}

// ParseOwnerRepo extracts owner and repo from GitHub URL variants:
//   - https://github.com/owner/repo
//   - github.com/owner/repo
//   - owner/repo
func ParseOwnerRepo(repoURL string) (owner, repo string, err error) {
	s := strings.TrimSpace(repoURL)
	s = strings.TrimPrefix(s, "https://")
	s = strings.TrimPrefix(s, "http://")
	s = strings.TrimPrefix(s, "github.com/")
	s = strings.TrimSuffix(s, "/")
	s = strings.TrimSuffix(s, ".git")

	parts := strings.SplitN(s, "/", 2)
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", fmt.Errorf("invalid GitHub repository URL: %q", repoURL)
	}
	return parts[0], parts[1], nil
}

// FetchBundle calls all 9 GitHub REST endpoints concurrently and returns a RepoBundle.
// Individual endpoint errors are recorded in bundle.Errors without aborting the fetch.
func FetchBundle(owner, repo, token string) types.RepoBundle {
	c := newClient(token)
	bundle := types.RepoBundle{
		Errors: make(map[string]string),
	}

	var mu sync.Mutex
	var wg sync.WaitGroup

	fail := func(key, msg string) {
		mu.Lock()
		bundle.Errors[key] = msg
		mu.Unlock()
	}

	base := fmt.Sprintf("%s/repos/%s/%s", apiBase, owner, repo)

	// Core metadata
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw struct {
			FullName    string   `json:"full_name"`
			Description string   `json:"description"`
			Stars       int      `json:"stargazers_count"`
			Forks       int      `json:"forks_count"`
			Watchers    int      `json:"subscribers_count"`
			OpenIssues  int      `json:"open_issues_count"`
			Language    string   `json:"language"`
			License     *struct {
				Name string `json:"name"`
			} `json:"license"`
			CreatedAt      time.Time `json:"created_at"`
			UpdatedAt      time.Time `json:"updated_at"`
			PushedAt       time.Time `json:"pushed_at"`
			HTMLURL        string    `json:"html_url"`
			Homepage       string    `json:"homepage"`
			Topics         []string  `json:"topics"`
			Size           int       `json:"size"`
			DefaultBranch  string    `json:"default_branch"`
			Archived       bool      `json:"archived"`
			HasIssues      bool      `json:"has_issues"`
			HasWiki        bool      `json:"has_wiki"`
			HasDiscussions bool      `json:"has_discussions"`
			HasPages       bool      `json:"has_pages"`
			NetworkCount   int       `json:"network_count"`
		}
		if err := c.get(base, &raw); err != nil {
			fail("meta", err.Error())
			return
		}
		license := ""
		if raw.License != nil {
			license = raw.License.Name
		}
		mu.Lock()
		bundle.Meta = types.RepoMeta{
			FullName:       raw.FullName,
			Description:    raw.Description,
			Stars:          raw.Stars,
			Forks:          raw.Forks,
			Watchers:       raw.Watchers,
			OpenIssues:     raw.OpenIssues,
			Language:       raw.Language,
			License:        license,
			CreatedAt:      raw.CreatedAt,
			UpdatedAt:      raw.UpdatedAt,
			PushedAt:       raw.PushedAt,
			HTMLURL:        raw.HTMLURL,
			Homepage:       raw.Homepage,
			Topics:         raw.Topics,
			SizeKB:         raw.Size,
			DefaultBranch:  raw.DefaultBranch,
			Archived:       raw.Archived,
			HasIssues:      raw.HasIssues,
			HasWiki:        raw.HasWiki,
			HasDiscussions: raw.HasDiscussions,
			HasPages:       raw.HasPages,
			NetworkCount:   raw.NetworkCount,
		}
		mu.Unlock()
	}()

	// Top contributors
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw []struct {
			Login         string `json:"login"`
			AvatarURL     string `json:"avatar_url"`
			Contributions int    `json:"contributions"`
			HTMLURL       string `json:"html_url"`
		}
		if err := c.get(base+"/contributors?per_page=10", &raw); err != nil {
			fail("contributors", err.Error())
			return
		}
		result := make([]types.Contributor, len(raw))
		for i, r := range raw {
			result[i] = types.Contributor{
				Login:         r.Login,
				AvatarURL:     r.AvatarURL,
				Contributions: r.Contributions,
				HTMLURL:       r.HTMLURL,
			}
		}
		mu.Lock()
		bundle.Contributors = result
		mu.Unlock()
	}()

	// 3. Releases
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw []struct {
			TagName     string    `json:"tag_name"`
			Name        string    `json:"name"`
			Body        string    `json:"body"`
			PublishedAt time.Time `json:"published_at"`
			CreatedAt   time.Time `json:"created_at"`
			Prerelease  bool      `json:"prerelease"`
			Draft       bool      `json:"draft"`
			Author      struct {
				Login string `json:"login"`
			} `json:"author"`
			Assets []struct {
				Name               string `json:"name"`
				DownloadCount      int    `json:"download_count"`
				Size               int64  `json:"size"`
				ContentType        string `json:"content_type"`
				BrowserDownloadURL string `json:"browser_download_url"`
			} `json:"assets"`
		}
		if err := c.get(base+"/releases?per_page=10", &raw); err != nil {
			fail("releases", err.Error())
			return
		}
		result := make([]types.Release, len(raw))
		for i, r := range raw {
			assets := make([]types.ReleaseAsset, len(r.Assets))
			total := 0
			for j, a := range r.Assets {
				assets[j] = types.ReleaseAsset{
					Name:               a.Name,
					DownloadCount:      a.DownloadCount,
					SizeBytes:          a.Size,
					ContentType:        a.ContentType,
					BrowserDownloadURL: a.BrowserDownloadURL,
				}
				total += a.DownloadCount
			}
			result[i] = types.Release{
				TagName:        r.TagName,
				Name:           r.Name,
				Body:           r.Body,
				PublishedAt:    r.PublishedAt,
				CreatedAt:      r.CreatedAt,
				Assets:         assets,
				TotalDownloads: total,
				Prerelease:     r.Prerelease,
				Draft:          r.Draft,
				Author:         r.Author.Login,
			}
		}
		mu.Lock()
		bundle.Releases = result
		mu.Unlock()
	}()

	// 4. Languages
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw map[string]int64
		if err := c.get(base+"/languages", &raw); err != nil {
			fail("languages", err.Error())
			return
		}
		mu.Lock()
		bundle.Languages = raw
		mu.Unlock()
	}()

	// 5. Recent activity feed
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw []struct {
			ID           int64  `json:"id"`
			ActivityType string `json:"activity_type"`
			Actor        struct {
				Login string `json:"login"`
			} `json:"actor"`
			Ref       string    `json:"ref"`
			Timestamp time.Time `json:"timestamp"`
		}
		if err := c.get(base+"/activity?per_page=15", &raw); err != nil {
			fail("activity", err.Error())
			return
		}
		result := make([]types.ActivityEvent, len(raw))
		for i, a := range raw {
			result[i] = types.ActivityEvent{
				ID:        a.ID,
				Type:      a.ActivityType,
				Actor:     a.Actor.Login,
				Ref:       a.Ref,
				Timestamp: a.Timestamp,
			}
		}
		mu.Lock()
		bundle.Activity = result
		mu.Unlock()
	}()

	// 8. Branch count
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw []struct {
			Name string `json:"name"`
		}
		if err := c.get(base+"/branches?per_page=100", &raw); err != nil {
			fail("branches", err.Error())
			return
		}
		mu.Lock()
		bundle.BranchCount = len(raw)
		mu.Unlock()
	}()

	// 9. Tags
	wg.Add(1)
	go func() {
		defer wg.Done()
		var raw []struct {
			Name       string `json:"name"`
			ZipballURL string `json:"zipball_url"`
			TarballURL string `json:"tarball_url"`
			Commit     struct {
				SHA string `json:"sha"`
			} `json:"commit"`
		}
		if err := c.get(base+"/tags?per_page=5", &raw); err != nil {
			fail("tags", err.Error())
			return
		}
		result := make([]types.Tag, len(raw))
		for i, tag := range raw {
			result[i] = types.Tag{
				Name:       tag.Name,
				CommitSHA:  tag.Commit.SHA,
				ZipballURL: tag.ZipballURL,
				TarballURL: tag.TarballURL,
			}
		}
		mu.Lock()
		bundle.Tags = result
		mu.Unlock()
	}()

	wg.Wait()
	bundle.CachedAt = time.Now()
	return bundle
}
