import type { ReactNode } from 'react'
import { RepoContext } from './RepoContext'
import { useFetchRepo } from '../hooks/useFetchRepo'

interface Props {
  children: ReactNode
}

export function RepoProvider({ children }: Props) {
  const value = useFetchRepo()
  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>
}
