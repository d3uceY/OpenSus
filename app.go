package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"OpenSus/backend/cache"
	"OpenSus/backend/github"
	"OpenSus/backend/types"
)

// App is the Wails application struct. All exported methods become IPC bindings.
type App struct {
	ctx   context.Context
	cache *cache.RepoCache
	mu    sync.RWMutex
	token string
}

// NewApp creates a new App application struct.
func NewApp() *App {
	return &App{
		cache: cache.New(),
	}
}

// startup is called when the app starts. Creates the config directory if needed.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.ensureConfigDir()
}

// historyPath returns the absolute path to history.json.
func (a *App) historyPath() (string, error) {
	base, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(base, "OpenSus", "history", "history.json"), nil
}

// ensureConfigDir creates the OpenSus/history directory if it doesn't exist.
func (a *App) ensureConfigDir() {
	path, err := a.historyPath()
	if err != nil {
		return
	}
	os.MkdirAll(filepath.Dir(path), 0755)
}

// saveHistory writes the history slice to disk.
func (a *App) saveHistory(history []string) error {
	path, err := a.historyPath()
	if err != nil {
		return err
	}
	data, err := json.Marshal(history)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

// LoadHistory returns the list of previously fetched repository URLs, newest first.
func (a *App) LoadHistory() []string {
	path, err := a.historyPath()
	if err != nil {
		return []string{}
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return []string{}
	}
	var history []string
	if err := json.Unmarshal(data, &history); err != nil {
		return []string{}
	}
	return history
}

// AddHistory prepends repoURL to history. Does nothing if already present.
func (a *App) AddHistory(repoURL string) {
	history := a.LoadHistory()
	for _, h := range history {
		if h == repoURL {
			return
		}
	}
	history = append([]string{repoURL}, history...)
	a.saveHistory(history)
}

// DeleteHistory removes a specific URL from history.
func (a *App) DeleteHistory(repoURL string) {
	history := a.LoadHistory()
	filtered := make([]string, 0, len(history))
	for _, h := range history {
		if h != repoURL {
			filtered = append(filtered, h)
		}
	}
	a.saveHistory(filtered)
}

// ClearHistory removes all history entries.
func (a *App) ClearHistory() {
	a.saveHistory([]string{})
}

// SetToken stores a GitHub Personal Access Token used for authenticated API requests.
// Without a token, the GitHub REST API is limited to 60 requests per hour.
func (a *App) SetToken(token string) {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.token = token
}

// FetchRepo fetches and returns intelligence for the given GitHub repository URL.
// Results are cached in memory for 5 minutes.
func (a *App) FetchRepo(repoURL string) (types.RepoBundle, error) {
	owner, repo, err := github.ParseOwnerRepo(repoURL)
	if err != nil {
		return types.RepoBundle{}, err
	}
	key := fmt.Sprintf("%s/%s", owner, repo)
	if cached, ok := a.cache.Get(key); ok {
		return cached, nil
	}
	a.mu.RLock()
	tok := a.token
	a.mu.RUnlock()
	bundle := github.FetchBundle(owner, repo, tok)
	a.cache.Set(key, bundle)
	a.AddHistory(repoURL)
	return bundle, nil
}

// ForceRefresh bypasses the cache and re-fetches the repository data.
func (a *App) ForceRefresh(repoURL string) (types.RepoBundle, error) {
	owner, repo, err := github.ParseOwnerRepo(repoURL)
	if err != nil {
		return types.RepoBundle{}, err
	}
	key := fmt.Sprintf("%s/%s", owner, repo)
	a.cache.Bust(key)
	a.mu.RLock()
	tok := a.token
	a.mu.RUnlock()
	bundle := github.FetchBundle(owner, repo, tok)
	a.cache.Set(key, bundle)
	a.AddHistory(repoURL)
	return bundle, nil
}

