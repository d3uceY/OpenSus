
import { t } from './tokens'
import { RepoProvider } from './context/RepoProvider'
import { useRepo } from './context/RepoContext'
import { TopNav } from './components/layout/TopNav'
import { HeroSearch } from './components/layout/HeroSearch'
import { EmptyState } from './components/layout/EmptyState'
import { RepoResults } from './pages/RepoResults'

function AppShell() {
  const { bundle, loading } = useRepo()
  return (
    <div style={{ minHeight: '100vh', background: t.canvas, fontFamily: "'Inter', sans-serif", color: t.ink }}>
      <TopNav />
      <HeroSearch />
      {bundle ? <RepoResults /> : !loading && <EmptyState />}
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
