package main

import (
	"sync"
	"time"
)

const cacheTTL = 5 * time.Minute

type cacheEntry struct {
	bundle    RepoBundle
	expiresAt time.Time
}

type repoCache struct {
	mu      sync.RWMutex
	entries map[string]cacheEntry
}

func newRepoCache() *repoCache {
	return &repoCache{
		entries: make(map[string]cacheEntry),
	}
}

func (c *repoCache) get(key string) (RepoBundle, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.entries[key]
	if !ok || time.Now().After(e.expiresAt) {
		return RepoBundle{}, false
	}
	return e.bundle, true
}

func (c *repoCache) set(key string, bundle RepoBundle) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.entries[key] = cacheEntry{
		bundle:    bundle,
		expiresAt: time.Now().Add(cacheTTL),
	}
}

func (c *repoCache) bust(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.entries, key)
}
