import { useEffect, useState } from 'react'
import { Version } from '../../wailsjs/go/main/App'

interface UpdateState {
  hasUpdate: boolean
  latestVersion: string
  currentVersion: string
}

function parseVersion(v: string): number[] {
  return v.replace(/^v/, '').split('.').map(Number)
}

function isNewer(latest: string, current: string): boolean {
  const l = parseVersion(latest)
  const c = parseVersion(current)
  for (let i = 0; i < Math.max(l.length, c.length); i++) {
    const lv = l[i] ?? 0
    const cv = c[i] ?? 0
    if (lv > cv) return true
    if (lv < cv) return false
  }
  return false
}

export function useUpdateCheck(): UpdateState & { dismiss: () => void } {
  const [state, setState] = useState<UpdateState>({
    hasUpdate: false,
    latestVersion: '',
    currentVersion: '',
  })
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const current = await Version()
        const res = await fetch('https://api.github.com/repos/d3uceY/OpenSus/releases/latest', {
          headers: { Accept: 'application/vnd.github+json' },
        })
        if (!res.ok) return
        const data = await res.json()
        const latest: string = data.tag_name ?? ''
        if (!cancelled && latest && isNewer(latest, current)) {
          setState({ hasUpdate: true, latestVersion: latest, currentVersion: current })
        }
      } catch {
        // silently ignore — update check is best-effort
      }
    }
    check()
    return () => { cancelled = true }
  }, [])

  return { ...state, hasUpdate: state.hasUpdate && !dismissed, dismiss: () => setDismissed(true) }
}
