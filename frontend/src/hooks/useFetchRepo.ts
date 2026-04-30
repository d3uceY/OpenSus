import { useState, useCallback } from 'react'
import { FetchRepo, ForceRefresh } from '../../wailsjs/go/main/App'
import type { main } from '../../wailsjs/go/models'

export interface UseFetchRepoReturn {
  bundle: main.RepoBundle | null
  loading: boolean
  error: string | null
  url: string
  setUrl: (url: string) => void
  fetchRepo: (force?: boolean) => Promise<void>
}

export function useFetchRepo(): UseFetchRepoReturn {
  const [bundle, setBundle] = useState<main.RepoBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState('')

  const fetchRepo = useCallback(
    async (force = false) => {
      const trimmed = url.trim()
      if (!trimmed) return
      setLoading(true)
      setError(null)
      try {
        const result = force ? await ForceRefresh(trimmed) : await FetchRepo(trimmed)
        setBundle(result)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoading(false)
      }
    },
    [url],
  )

  return { bundle, loading, error, url, setUrl, fetchRepo }
}
