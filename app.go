package main

import (
	"context"
	"fmt"
	"sync"
)

// App is the Wails application struct. All exported methods become IPC bindings.
type App struct {
	ctx   context.Context
	cache *repoCache
	mu    sync.RWMutex
	token string
}

// NewApp creates a new App application struct.
func NewApp() *App {
	return &App{
		cache: newRepoCache(),
	}
}

// startup is called when the app starts.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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
func (a *App) FetchRepo(repoURL string) (RepoBundle, error) {
	owner, repo, err := parseOwnerRepo(repoURL)
	if err != nil {
		return RepoBundle{}, err
	}
	key := fmt.Sprintf("%s/%s", owner, repo)
	if cached, ok := a.cache.get(key); ok {
		return cached, nil
	}
	a.mu.RLock()
	tok := a.token
	a.mu.RUnlock()
	bundle := fetchBundle(owner, repo, tok)
	a.cache.set(key, bundle)
	return bundle, nil
}

// ForceRefresh bypasses the cache and re-fetches the repository data.
func (a *App) ForceRefresh(repoURL string) (RepoBundle, error) {
	owner, repo, err := parseOwnerRepo(repoURL)
	if err != nil {
		return RepoBundle{}, err
	}
	key := fmt.Sprintf("%s/%s", owner, repo)
	a.cache.bust(key)
	a.mu.RLock()
	tok := a.token
	a.mu.RUnlock()
	bundle := fetchBundle(owner, repo, tok)
	a.cache.set(key, bundle)
	return bundle, nil
}
