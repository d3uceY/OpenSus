
import { RepoProvider } from './context/RepoProvider'
import { useRepo } from './context/RepoContext'
import { TitleBar } from './components/layout/TitleBar'
import { TopNav } from './components/layout/TopNav'
import { HeroSearch } from './components/layout/HeroSearch'
import { EmptyState } from './components/layout/EmptyState'
import { RepoResults } from './pages/RepoResults'
import logo from './assets/opensus_logo.png'

function AppShell() {
  const { bundle, loading } = useRepo()
  return (
    <div className="h-screen flex flex-col bg-canvas font-sans text-ink overflow-hidden">
      <TitleBar />
      <div className="flex-1 overflow-y-auto">
        <TopNav />
        <HeroSearch />
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: 'calc(50vh - 160px)' }}>
            <img src={logo} alt="Loading…" className="h-16 w-auto animate-spin" style={{ animationDuration: '1.4s' }} />
          </div>
        ) : bundle ? (
          <RepoResults />
        ) : (
          <EmptyState />
        )}
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
