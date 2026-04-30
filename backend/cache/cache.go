package cache

import (
	"sync"
	"time"

	"OpenSus/backend/types"
)

const TTL = 5 * time.Minute

type entry struct {
	bundle    types.RepoBundle
	expiresAt time.Time
}

// RepoCache is a thread-safe in-memory cache keyed by "owner/repo".
type RepoCache struct {
	mu      sync.RWMutex
	entries map[string]entry
}

// New returns a ready-to-use RepoCache.
func New() *RepoCache {
	return &RepoCache{
		entries: make(map[string]entry),
	}
}

// Get returns the cached bundle and true if the key exists and has not expired.
func (c *RepoCache) Get(key string) (types.RepoBundle, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.entries[key]
	if !ok || time.Now().After(e.expiresAt) {
		return types.RepoBundle{}, false
	}
	return e.bundle, true
}

// Set stores a bundle under the given key with a fresh TTL.
func (c *RepoCache) Set(key string, bundle types.RepoBundle) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.entries[key] = entry{
		bundle:    bundle,
		expiresAt: time.Now().Add(TTL),
	}
}

// Bust removes the entry for the given key, forcing the next Get to miss.
func (c *RepoCache) Bust(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.entries, key)
}
