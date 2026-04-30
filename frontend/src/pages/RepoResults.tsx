import { useRepo } from '../context/RepoContext'
import { t } from '../tokens'
import { fmt, timeAgo } from '../helpers/format'
import { getDaysSinceLastPush, getTotalDownloads } from '../helpers/insights'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LanguageBar } from '../components/charts/LanguageBar'
import { RepoHeader } from '../components/repo/RepoHeader'
import { ContributorList } from '../components/repo/ContributorList'
import { ReleaseList } from '../components/repo/ReleaseList'
import { ActivityFeed } from '../components/repo/ActivityFeed'
import { TagList } from '../components/repo/TagList'

export function RepoResults() {
  const { bundle } = useRepo()
  if (!bundle) return null

  const daysSinceLastPush = getDaysSinceLastPush(bundle.meta?.pushed_at)
  const totalDownloads = getTotalDownloads(bundle.releases)

  return (
    <main className="max-w-300 mx-auto px-8 pb-24">
      <RepoHeader meta={bundle.meta} cachedAt={bundle.cached_at} />

      {bundle.errors && <ErrorBanner errors={bundle.errors} />}

      {/* Core stats */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-3 mb-6">
        <StatCard label="Stars" value={fmt(bundle.meta?.stars ?? 0)} />
        <StatCard label="Forks" value={fmt(bundle.meta?.forks ?? 0)} />
        <StatCard label="Watchers" value={fmt(bundle.meta?.watchers ?? 0)} />
        <StatCard label="Open Issues" value={fmt(bundle.meta?.open_issues ?? 0)} />
        <StatCard label="Branches" value={String(bundle.branch_count ?? 0)} />
        <StatCard label="Last Push" value={timeAgo(bundle.meta?.pushed_at)} />
        {daysSinceLastPush !== null && (
          <StatCard
            label="Days since push"
            value={String(daysSinceLastPush)}
            sub={daysSinceLastPush > 365 ? 'possibly inactive' : undefined}
          />
        )}
        {bundle.releases?.length > 0 && (
          <StatCard
            label="Total downloads"
            value={fmt(totalDownloads)}
            sub={`across ${bundle.releases.length} releases`}
          />
        )}
      </div>

      {/* 2-up grid */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 mb-4">
        <Card title="Language Distribution" accent={t.gradientLavender}>
          <LanguageBar langs={bundle.languages ?? {}} />
        </Card>
        <Card title="Top Contributors" accent={t.gradientPeach}>
          <ContributorList contributors={bundle.contributors ?? []} />
        </Card>
      </div>

      {/* 2-up grid: scrollable */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-4 mb-4">
        <Card title="Releases" accent={t.gradientSky}>
          <div className="max-h-[340px] overflow-y-auto pr-1">
            <ReleaseList releases={bundle.releases ?? []} />
          </div>
        </Card>
        <Card title="Recent Activity" accent={t.gradientRose}>
          <div className="max-h-[340px] overflow-y-auto pr-1">
            <ActivityFeed events={bundle.activity ?? []} />
          </div>
        </Card>
      </div>

      <TagList tags={bundle.tags ?? []} />
    </main>
  )
}
