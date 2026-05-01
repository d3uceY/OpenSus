import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { useRepo } from '../context/RepoContext'
import { ExportCard } from '../components/export/ExportCard'
import { SaveExportPNG } from '../../wailsjs/go/main/App'
import { t } from '../tokens'
import { fmt, fmtKB, timeAgo } from '../helpers/format'
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
import { HugeiconsIcon } from '@hugeicons/react'
import { GitBranchIcon } from '@hugeicons/core-free-icons'
import type { types } from '../../wailsjs/go/models'

function RepoDetailsCard({ meta }: { meta: types.RepoMeta }) {
  const flags = [
    { label: 'Issues', on: meta?.has_issues },
    { label: 'Wiki', on: meta?.has_wiki },
    { label: 'Discussions', on: meta?.has_discussions },
    { label: 'Pages', on: meta?.has_pages },
  ]

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 w-30 h-30 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.gradientMint}55 0%, transparent 70%)` }}
      />
      <span className="text-xs font-semibold tracking-[0.96px] uppercase text-muted">
        Repository Details
      </span>
      <div className="flex flex-col gap-3">
        {meta?.default_branch && (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={GitBranchIcon} size={14} className="text-muted-soft shrink-0" />
            <span className="text-[13px] text-muted">Default branch</span>
            <span className="ml-auto text-[13px] font-medium text-body-strong bg-surface-strong rounded-full px-[10px] py-[2px]">
              {meta.default_branch}
            </span>
          </div>
        )}
        {meta?.size_kb > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted">Repository size</span>
            <span className="text-[13px] font-medium text-body-strong">{fmtKB(meta.size_kb)}</span>
          </div>
        )}
        {meta?.network_count > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted">Network forks</span>
            <span className="text-[13px] font-medium text-body-strong">{fmt(meta.network_count)}</span>
          </div>
        )}
        <div className="border-t border-hairline pt-3">
          <div className="text-[11px] font-semibold tracking-[0.8px] uppercase text-muted mb-2">
            Features
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {flags.map(f => (
              <div key={f.label} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${f.on ? 'bg-semantic-success' : 'bg-hairline-strong'}`} />
                <span className={`text-[12px] ${f.on ? 'text-body' : 'text-muted-soft'}`}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        {meta?.pushed_at && (
          <div className="flex items-center justify-between border-t border-hairline pt-3">
            <span className="text-[13px] text-muted">Last pushed</span>
            <span className="text-[13px] text-body-strong">{timeAgo(meta.pushed_at)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function RepoResults() {
  const { bundle } = useRepo()
  const exportCardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  if (!bundle) return null

  const daysSinceLastPush = getDaysSinceLastPush(bundle.meta?.pushed_at)
  const totalDownloads = getTotalDownloads(bundle.releases)

  async function handleExport() {
    if (!exportCardRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(exportCardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#fafafa',
      })
      const base64 = dataUrl.split(',')[1]
      const slug = bundle!.meta?.full_name?.replace('/', '_') ?? 'repo'
      await SaveExportPNG(base64, `${slug}_opensus.png`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      {/* Off-screen export card — rendered but not visible */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={exportCardRef}>
          <ExportCard bundle={bundle} />
        </div>
      </div>

    <main className="max-w-300 mx-auto px-8 pb-24">
      <RepoHeader meta={bundle.meta} cachedAt={bundle.cached_at} onExport={handleExport} exporting={exporting} />

      {bundle.errors && <ErrorBanner errors={bundle.errors} />}

      {/* Core stats */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-3 mb-6">
        <StatCard label="Stars" value={fmt(bundle.meta?.stars ?? 0)} />
        <StatCard label="Forks" value={fmt(bundle.meta?.forks ?? 0)} />
        <StatCard label="Watchers" value={fmt(bundle.meta?.watchers ?? 0)} />
        <StatCard label="Open Issues" value={fmt(bundle.meta?.open_issues ?? 0)} />
        <StatCard label="Branches" value={String(bundle.branch_count ?? 0)} />
        {bundle.meta?.size_kb > 0 && (
          <StatCard label="Size" value={fmtKB(bundle.meta.size_kb)} />
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

      {/* 3-up grid: Languages · Contributors · Repo Details */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-4 mb-4">
        <Card title="Language Distribution" accent={t.gradientLavender}>
          <LanguageBar langs={bundle.languages ?? {}} />
        </Card>
        <Card title="Top Contributors" accent={t.gradientPeach}>
          <ContributorList contributors={bundle.contributors ?? []} />
        </Card>
        <RepoDetailsCard meta={bundle.meta} />
      </div>

      {/* 2-up grid: Releases · Activity */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))] gap-4 mb-4">
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
    </>
  )
}
