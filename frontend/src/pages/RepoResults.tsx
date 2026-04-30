import { useRepo } from '../../context/RepoContext'
import { t } from '../../tokens'
import { fmt, timeAgo } from '../../helpers/format'
import { getMostActiveWeek, getTopContribPercent, getDaysSinceLastPush, getTotalDownloads } from '../../helpers/insights'
import { StatCard } from '../ui/StatCard'
import { Card } from '../ui/Card'
import { ErrorBanner } from '../ui/ErrorBanner'
import { CommitSparkline } from '../charts/CommitSparkline'
import { LanguageBar } from '../charts/LanguageBar'
import { RepoHeader } from '../repo/RepoHeader'
import { ContributorList } from '../repo/ContributorList'
import { ReleaseList } from '../repo/ReleaseList'
import { ActivityFeed } from '../repo/ActivityFeed'
import { TagList } from '../repo/TagList'

export function RepoResults() {
  const { bundle } = useRepo()
  if (!bundle) return null

  const mostActiveWeek = getMostActiveWeek(bundle.commit_activity)
  const topContribPct = getTopContribPercent(bundle.contrib_stats, bundle.commit_activity)
  const daysSinceLastPush = getDaysSinceLastPush(bundle.meta?.pushed_at)
  const totalDownloads = getTotalDownloads(bundle.releases)
  const showInsights = mostActiveWeek || topContribPct !== null || daysSinceLastPush !== null

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
      <RepoHeader meta={bundle.meta} cachedAt={bundle.cached_at} />

      {bundle.errors && <ErrorBanner errors={bundle.errors} />}

      {/* Core stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        <StatCard label="Stars" value={fmt(bundle.meta?.stars ?? 0)} />
        <StatCard label="Forks" value={fmt(bundle.meta?.forks ?? 0)} />
        <StatCard label="Watchers" value={fmt(bundle.meta?.watchers ?? 0)} />
        <StatCard label="Open Issues" value={fmt(bundle.meta?.open_issues ?? 0)} />
        <StatCard label="Branches" value={String(bundle.branch_count ?? 0)} />
        <StatCard label="Last Push" value={timeAgo(bundle.meta?.pushed_at)} />
      </div>

      {/* Derived insights */}
      {showInsights && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}>
          {mostActiveWeek && (
            <StatCard
              label="Most active week"
              value={`${mostActiveWeek.total} commits`}
              sub={new Date(mostActiveWeek.week * 1000).toLocaleDateString()}
            />
          )}
          {topContribPct !== null && (
            <StatCard
              label="Top contributor"
              value={`${topContribPct}%`}
              sub={bundle.contrib_stats?.[0]?.author?.login}
            />
          )}
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
      )}

      {/* 3-up grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 16,
      }}>
        <Card title="52-week Commit Activity" accent={t.gradientMint}>
          <CommitSparkline weeks={bundle.commit_activity ?? []} />
        </Card>
        <Card title="Language Distribution" accent={t.gradientLavender}>
          <LanguageBar langs={bundle.languages ?? {}} />
        </Card>
        <Card title="Top Contributors" accent={t.gradientPeach}>
          <ContributorList contributors={bundle.contributors ?? []} />
        </Card>
      </div>

      {/* 2-up grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
        marginBottom: 16,
      }}>
        <Card title="Releases" accent={t.gradientSky}>
          <ReleaseList releases={bundle.releases ?? []} />
        </Card>
        <Card title="Recent Activity" accent={t.gradientRose}>
          <ActivityFeed events={bundle.activity ?? []} />
        </Card>
      </div>

      <TagList tags={bundle.tags ?? []} />
    </main>
  )
}
