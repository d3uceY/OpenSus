import { useState, useCallback } from 'react'
import { SetToken } from '../../wailsjs/go/main/App'

export interface UseGitHubTokenReturn {
  setToken: (token: string) => Promise<void>
  saving: boolean
  saved: boolean
}

export function useGitHubToken(): UseGitHubTokenReturn {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setToken = useCallback(async (token: string) => {
    setSaving(true)
    try {
      await SetToken(token.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [])

  return { setToken, saving, saved }
}
