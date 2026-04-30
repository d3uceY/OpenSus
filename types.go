package main

import "time"

// RepoBundle aggregates all GitHub API data for a repository.
type RepoBundle struct {
	Meta           RepoMeta               `json:"meta"`
	Contributors   []Contributor          `json:"contributors"`
	Releases       []Release              `json:"releases"`
	Languages      map[string]int64       `json:"languages"`
	CommitActivity []WeeklyCommitActivity `json:"commit_activity"`
	ContribStats   []ContributorStats     `json:"contrib_stats"`
	Activity       []ActivityEvent        `json:"activity"`
	BranchCount    int                    `json:"branch_count"`
	Tags           []Tag                  `json:"tags"`
	Errors         map[string]string      `json:"errors"`
	CachedAt       time.Time              `json:"cached_at"`
}

// RepoMeta holds core repository metadata.
type RepoMeta struct {
	FullName    string    `json:"full_name"`
	Description string    `json:"description"`
	Stars       int       `json:"stars"`
	Forks       int       `json:"forks"`
	Watchers    int       `json:"watchers"`
	OpenIssues  int       `json:"open_issues"`
	Language    string    `json:"language"`
	License     string    `json:"license"`
	CreatedAt   time.Time `json:"created_at"`
	PushedAt    time.Time `json:"pushed_at"`
	HTMLURL     string    `json:"html_url"`
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
	Name          string `json:"name"`
	DownloadCount int    `json:"download_count"`
}

// Release holds data for a single GitHub release.
type Release struct {
	TagName        string         `json:"tag_name"`
	PublishedAt    time.Time      `json:"published_at"`
	Assets         []ReleaseAsset `json:"assets"`
	TotalDownloads int            `json:"total_downloads"`
}

// WeeklyCommitActivity holds a single week's commit data from the commit_activity endpoint.
type WeeklyCommitActivity struct {
	Week  int64 `json:"week"`
	Total int   `json:"total"`
	Days  []int `json:"days"`
}

// ContributorWeek holds a single week's stats for one contributor.
type ContributorWeek struct {
	Week    int64 `json:"w"`
	Adds    int   `json:"a"`
	Deletes int   `json:"d"`
	Commits int   `json:"c"`
}

// ContributorStats holds per-contributor weekly stats.
type ContributorStats struct {
	Author struct {
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	} `json:"author"`
	Total int               `json:"total"`
	Weeks []ContributorWeek `json:"weeks"`
}

// ActivityEvent holds a single repo activity event.
type ActivityEvent struct {
	ID        string    `json:"id"`
	Type      string    `json:"activity_type"`
	Actor     string    `json:"actor"`
	Ref       string    `json:"ref"`
	Timestamp time.Time `json:"timestamp"`
}

// Tag holds a single git tag name.
type Tag struct {
	Name string `json:"name"`
}
