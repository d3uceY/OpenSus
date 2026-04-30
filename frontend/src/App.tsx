
import { RepoProvider } from './context/RepoProvider'
import { useRepo } from './context/RepoContext'
import { TitleBar } from './components/layout/TitleBar'
import { TopNav } from './components/layout/TopNav'
import { HeroSearch } from './components/layout/HeroSearch'
import { EmptyState } from './components/layout/EmptyState'
import { RepoResults } from './pages/RepoResults'

function AppShell() {
  const { bundle, loading } = useRepo()
  return (
    <div className="h-screen flex flex-col bg-canvas font-sans text-ink overflow-hidden">
      <TitleBar />
      <div className="flex-1 overflow-y-auto">
        <TopNav />
        <HeroSearch />
        {bundle ? <RepoResults /> : !loading && <EmptyState />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <RepoProvider>
      <AppShell />
    </RepoProvider>
  )
}
