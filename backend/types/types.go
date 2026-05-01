package types

import "time"

// RepoBundle aggregates all GitHub API data for a repository.
type RepoBundle struct {
	Meta         RepoMeta          `json:"meta"`
	Contributors []Contributor     `json:"contributors"`
	Releases     []Release         `json:"releases"`
	Languages    map[string]int64  `json:"languages"`
	Activity     []ActivityEvent   `json:"activity"`
	BranchCount  int               `json:"branch_count"`
	Tags         []Tag             `json:"tags"`
	Errors       map[string]string `json:"errors"`
	CachedAt     time.Time         `json:"cached_at"`
}

// RepoMeta holds core repository metadata.
type RepoMeta struct {
	FullName        string    `json:"full_name"`
	Description     string    `json:"description"`
	Stars           int       `json:"stars"`
	Forks           int       `json:"forks"`
	Watchers        int       `json:"watchers"`
	OpenIssues      int       `json:"open_issues"`
	Language        string    `json:"language"`
	License         string    `json:"license"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	PushedAt        time.Time `json:"pushed_at"`
	HTMLURL         string    `json:"html_url"`
	Homepage        string    `json:"homepage"`
	Topics          []string  `json:"topics"`
	SizeKB          int       `json:"size_kb"`
	DefaultBranch   string    `json:"default_branch"`
	Archived        bool      `json:"archived"`
	HasIssues       bool      `json:"has_issues"`
	HasWiki         bool      `json:"has_wiki"`
	HasDiscussions  bool      `json:"has_discussions"`
	HasPages        bool      `json:"has_pages"`
	NetworkCount    int       `json:"network_count"`
}

// Contributor holds per-contributor data from the contributors endpoint.
type Contributor struct {
	Login         string `json:"login"`
	AvatarURL     string `json:"avatar_url"`
	Contributions int    `json:"contributions"`
	HTMLURL       string `json:"html_url"`
}

// ReleaseAsset holds download data for a single release asset.
type ReleaseAsset struct {
	Name               string `json:"name"`
	DownloadCount      int    `json:"download_count"`
	SizeBytes          int64  `json:"size_bytes"`
	ContentType        string `json:"content_type"`
	BrowserDownloadURL string `json:"browser_download_url"`
}

// Release holds data for a single GitHub release.
type Release struct {
	TagName        string         `json:"tag_name"`
	Name           string         `json:"name"`
	Body           string         `json:"body"`
	PublishedAt    time.Time      `json:"published_at"`
	CreatedAt      time.Time      `json:"created_at"`
	Assets         []ReleaseAsset `json:"assets"`
	TotalDownloads int            `json:"total_downloads"`
	Prerelease     bool           `json:"prerelease"`
	Draft          bool           `json:"draft"`
	Author         string         `json:"author"`
}

// ActivityEvent holds a single repo activity event.
type ActivityEvent struct {
	ID        int64     `json:"id"`
	Type      string    `json:"activity_type"`
	Actor     string    `json:"actor"`
	Ref       string    `json:"ref"`
	Timestamp time.Time `json:"timestamp"`
}

// Tag holds a single git tag name.
type Tag struct {
	Name        string `json:"name"`
	CommitSHA   string `json:"commit_sha"`
	ZipballURL  string `json:"zipball_url"`
	TarballURL  string `json:"tarball_url"`
}
