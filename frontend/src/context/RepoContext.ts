import { createContext, useContext } from 'react'
import type { main } from '../../wailsjs/go/models'

export interface RepoState {
  bundle: main.RepoBundle | null
  loading: boolean
  error: string | null
  url: string
  setUrl: (url: string) => void
  fetchRepo: (force?: boolean) => Promise<void>
}

export const RepoContext = createContext<RepoState | null>(null)

export function useRepo(): RepoState {
  const ctx = useContext(RepoContext)
  if (!ctx) throw new Error('useRepo must be used inside <RepoProvider>')
  return ctx
}
