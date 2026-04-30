
import { useState, useCallback } from 'react'
import { FetchRepo, ForceRefresh, SetToken } from '../wailsjs/go/main/App'
import type { main } from '../wailsjs/go/models'

// ─── Design tokens ──────────────────────────────────────────────────────────

const t = {
  canvas: '#f5f5f5',
  canvasSoft: '#fafafa',
  surfaceCard: '#ffffff',
  surfaceStrong: '#f0efed',
  surfaceDark: '#0c0a09',
  surfaceDarkElevated: '#1c1917',
  hairline: '#e7e5e4',
  hairlineStrong: '#d6d3d1',
  ink: '#0c0a09',
  body: '#4e4e4e',
  bodyStrong: '#292524',
  muted: '#777169',
  mutedSoft: '#a8a29e',
  primary: '#292524',
  onPrimary: '#ffffff',
  onDark: '#ffffff',
  onDarkSoft: '#a8a29e',
  gradientMint: '#a7e5d3',
  gradientPeach: '#f4c5a8',
  gradientLavender: '#c8b8e0',
  gradientSky: '#a8c8e8',
  gradientRose: '#e8b8c4',
  semanticSuccess: '#16a34a',
  semanticError: '#dc2626',
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return String(n)
}

function timeAgo(iso: string): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d}d ago`
  if (d < 365) return `${Math.floor(d / 30)}mo ago`
  return `${Math.floor(d / 365)}y ago`
}

function langColors(langs: Record<string, number>): Array<{ name: string; pct: number; color: string }> {
  const palette = [t.gradientMint, t.gradientPeach, t.gradientLavender, t.gradientSky, t.gradientRose, '#d4b5a0', '#b8d4c8']
  const total = Object.values(langs).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  return Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes], i) => ({
      name,
      pct: Math.round((bytes / total) * 100 * 10) / 10,
      color: palette[i % palette.length],
    }))
}

function activityIcon(type: string): string {
  const m: Record<string, string> = {
    push: '↑',
    force_push: '↑↑',
    branch_creation: '+',
    branch_deletion: '−',
    pr_merge: '⊕',
    branch_protection_rule_deletion: '✕',
  }
  return m[type] ?? '·'
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: t.surfaceCard,
      border: `1px solid ${t.hairline}`,
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.96px', textTransform: 'uppercase', color: t.muted }}>
        {label}
      </span>
      <span style={{ fontSize: 32, fontWeight: 300, color: t.ink, lineHeight: 1.13, letterSpacing: '-0.32px', fontFamily: "'EB Garamond', 'Times New Roman', serif" }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 14, color: t.mutedSoft }}>{sub}</span>}
    </div>
  )
}

function CommitSparkline({ weeks }: { weeks: main.WeeklyCommitActivity[] }) {
  if (!weeks || weeks.length === 0) return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  const max = Math.max(...weeks.map(w => w.total), 1)
  const h = 56
  const barW = 8
  const gap = 3
  const totalW = weeks.length * (barW + gap)

  return (
    <svg width={totalW} height={h} style={{ display: 'block' }}>
      {weeks.map((w, i) => {
        const barH = Math.max(2, Math.round((w.total / max) * h))
        return (
          <rect
            key={w.week}
            x={i * (barW + gap)}
            y={h - barH}
            width={barW}
            height={barH}
            rx={2}
            fill={w.total === max ? t.gradientMint : t.hairlineStrong}
          />
        )
      })}
    </svg>
  )
}

function LanguageBar({ langs }: { langs: Record<string, number> }) {
  const items = langColors(langs)
  if (items.length === 0) return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 9999, overflow: 'hidden', gap: 2 }}>
        {items.map(l => (
          <div key={l.name} style={{ flex: l.pct, background: l.color, minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {items.map(l => (
          <span key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: t.body }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            {l.name}
            <span style={{ color: t.mutedSoft }}>{l.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ContributorList({ contributors }: { contributors: main.Contributor[] }) {
  if (!contributors || contributors.length === 0)
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {contributors.map((c, i) => (
        <div key={c.login} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 0',
          borderBottom: i < contributors.length - 1 ? `1px solid ${t.hairline}` : 'none',
        }}>
          <img
            src={c.avatar_url}
            alt={c.login}
            style={{ width: 32, height: 32, borderRadius: '50%', background: t.surfaceStrong, flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: t.ink }}>{c.login}</span>
          <span style={{ fontSize: 13, color: t.muted }}>{fmt(c.contributions)} commits</span>
        </div>
      ))}
    </div>
  )
}

function ReleaseList({ releases }: { releases: main.Release[] }) {
  if (!releases || releases.length === 0)
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No releases</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {releases.map((r, i) => (
        <div key={r.tag_name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 0',
          borderBottom: i < releases.length - 1 ? `1px solid ${t.hairline}` : 'none',
        }}>
          <div style={{
            background: t.surfaceStrong,
            borderRadius: 9999,
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: t.bodyStrong,
            flexShrink: 0,
          }}>
            {r.tag_name}
          </div>
          <span style={{ flex: 1, fontSize: 13, color: t.muted }}>{timeAgo(r.published_at)}</span>
          {r.total_downloads > 0 && (
            <span style={{ fontSize: 13, color: t.body }}>
              ↓ {fmt(r.total_downloads)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function ActivityFeed({ events }: { events: main.ActivityEvent[] }) {
  if (!events || events.length === 0)
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No recent activity</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {events.map((e, i) => (
        <div key={e.id || i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '9px 0',
          borderBottom: i < events.length - 1 ? `1px solid ${t.hairline}` : 'none',
        }}>
          <span style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: t.surfaceStrong,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: t.bodyStrong,
            flexShrink: 0,
          }}>
            {activityIcon(e.activity_type)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, color: t.body, fontWeight: 500 }}>{e.actor}</span>
            <span style={{ fontSize: 13, color: t.muted }}> · {e.activity_type.replace(/_/g, ' ')}</span>
            {e.ref && (
              <div style={{ fontSize: 12, color: t.mutedSoft, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.ref}
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: t.mutedSoft, flexShrink: 0 }}>{timeAgo(e.timestamp)}</span>
        </div>
      ))}
    </div>
  )
}

function ErrorBanner({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors)
  if (entries.length === 0) return null
  return (
    <div style={{
      background: '#fef2f2',
      border: `1px solid #fecaca`,
      borderRadius: 12,
      padding: '12px 16px',
      marginBottom: 24,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.96px', textTransform: 'uppercase', color: t.semanticError, marginBottom: 6 }}>
        Partial errors
      </div>
      {entries.map(([k, v]) => (
        <div key={k} style={{ fontSize: 13, color: t.body }}>
          <strong>{k}:</strong> {v}
        </div>
      ))}
    </div>
  )
}

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      background: t.surfaceCard,
      border: `1px solid ${t.hairline}`,
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && (
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.96px',
        textTransform: 'uppercase',
        color: t.muted,
      }}>
        {title}
      </span>
      <div>{children}</div>
    </div>
  )
}

// ─── Token modal ─────────────────────────────────────────────────────────────

function TokenModal({ onClose }: { onClose: () => void }) {
  const [val, setVal] = useState('')
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await SetToken(val.trim())
    setSaved(true)
    setTimeout(onClose, 800)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(12,10,9,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: t.surfaceCard, borderRadius: 16, padding: 32,
          width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: `1px solid ${t.hairline}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 20, fontWeight: 500, color: t.ink, marginBottom: 8 }}>GitHub Token</div>
        <div style={{ fontSize: 14, color: t.body, marginBottom: 20, lineHeight: 1.5 }}>
          A Personal Access Token raises the API limit from 60 to 5,000 requests/hour.
          Only <code>public_repo</code> scope is needed.
        </div>
        <input
          type="password"
          placeholder="ghp_••••••••••••••••••"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 8,
            border: `1px solid ${t.hairlineStrong}`, fontSize: 15,
            color: t.ink, background: t.surfaceCard, outline: 'none',
            fontFamily: 'monospace', marginBottom: 16,
          }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: 9999, border: `1px solid ${t.hairlineStrong}`,
              background: 'transparent', fontSize: 14, fontWeight: 500, color: t.ink,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              padding: '8px 18px', borderRadius: 9999, background: t.primary,
              border: 'none', fontSize: 14, fontWeight: 500, color: t.onPrimary,
              cursor: 'pointer',
            }}
          >
            {saved ? 'Saved ✓' : 'Save token'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [url, setUrl] = useState('')
  const [bundle, setBundle] = useState<main.RepoBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)

  const fetch = useCallback(async (force = false) => {
    const trimmed = url.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const result = force ? await ForceRefresh(trimmed) : await FetchRepo(trimmed)
      setBundle(result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [url])

  // Derived stats
  const mostActiveWeek = bundle?.commit_activity?.length
    ? bundle.commit_activity.reduce((best, w) => w.total > best.total ? w : best)
    : null

  const topContribPct = bundle?.contributors?.length && bundle.commit_activity?.length
    ? (() => {
      const total = bundle.commit_activity.reduce((s, w) => s + w.total, 0)
      if (!total) return null
      const top = bundle.contrib_stats?.[0]?.total ?? 0
      return Math.round((top / total) * 100)
    })()
    : null

  const daysSinceLastPush = bundle?.meta?.pushed_at
    ? Math.floor((Date.now() - new Date(bundle.meta.pushed_at).getTime()) / 86_400_000)
    : null

  return (
    <div style={{
      minHeight: '100vh',
      background: t.canvas,
      fontFamily: "'Inter', sans-serif",
      color: t.ink,
    }}>
      {/* ── Top Nav ── */}
      <nav style={{
        height: 64,
        background: t.canvasSoft,
        borderBottom: `1px solid ${t.hairline}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 300,
          letterSpacing: '-0.5px',
          color: t.ink,
          fontFamily: "'EB Garamond', 'Times New Roman', serif",
          flex: 1,
        }}>
          OpenSus
        </span>
        <button
          onClick={() => setShowToken(true)}
          style={{
            padding: '7px 16px',
            borderRadius: 9999,
            border: `1px solid ${t.hairlineStrong}`,
            background: 'transparent',
            fontSize: 14,
            fontWeight: 500,
            color: t.body,
            cursor: 'pointer',
            letterSpacing: 0,
          }}
        >
          GitHub Token
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '64px 32px 48px',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Atmospheric orbs */}
        <div style={{
          position: 'absolute', top: -60, left: '10%', width: 320, height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${t.gradientMint}40 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 20, right: '5%', width: 240, height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${t.gradientLavender}35 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <h1 style={{
          fontSize: 48,
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: '-0.96px',
          color: t.ink,
          fontFamily: "'EB Garamond', 'Times New Roman', serif",
          marginBottom: 12,
        }}>
          Repository Intelligence
        </h1>
        <p style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: '0.16px',
          color: t.body,
          marginBottom: 28,
          maxWidth: 560,
        }}>
          Paste any GitHub repository URL to surface stars, contributors, releases, commit activity, and more — fetched concurrently from the GitHub REST API.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch(false)}
            style={{
              flex: '1 1 320px',
              padding: '10px 16px',
              borderRadius: 8,
              border: `1px solid ${t.hairlineStrong}`,
              fontSize: 15,
              color: t.ink,
              background: t.surfaceCard,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            onClick={() => fetch(false)}
            disabled={loading || !url.trim()}
            style={{
              padding: '10px 22px',
              borderRadius: 9999,
              background: loading ? t.muted : t.primary,
              border: 'none',
              fontSize: 15,
              fontWeight: 500,
              color: t.onPrimary,
              cursor: loading ? 'default' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Fetching…' : 'Fetch'}
          </button>
          {bundle && (
            <button
              onClick={() => fetch(true)}
              disabled={loading}
              style={{
                padding: '10px 18px',
                borderRadius: 9999,
                background: 'transparent',
                border: `1px solid ${t.hairlineStrong}`,
                fontSize: 15,
                fontWeight: 500,
                color: t.body,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              Refresh
            </button>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 8,
            background: '#fef2f2',
            border: `1px solid #fecaca`,
            fontSize: 14,
            color: t.semanticError,
          }}>
            {error}
          </div>
        )}
      </section>

      {/* ── Results ── */}
      {bundle && (
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
          {/* Repo header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
              <h2 style={{
                fontSize: 24,
                fontWeight: 300,
                letterSpacing: 0,
                color: t.ink,
                fontFamily: "'EB Garamond', 'Times New Roman', serif",
              }}>
                {bundle.meta?.full_name || '—'}
              </h2>
              {bundle.meta?.language && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.96px',
                  textTransform: 'uppercase',
                  color: t.muted,
                  background: t.surfaceStrong,
                  borderRadius: 9999,
                  padding: '3px 10px',
                }}>
                  {bundle.meta.language}
                </span>
              )}
              {bundle.meta?.license && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.96px',
                  textTransform: 'uppercase',
                  color: t.muted,
                  background: t.surfaceStrong,
                  borderRadius: 9999,
                  padding: '3px 10px',
                }}>
                  {bundle.meta.license}
                </span>
              )}
            </div>
            {bundle.meta?.description && (
              <p style={{ fontSize: 15, color: t.body, lineHeight: 1.5, maxWidth: 640 }}>
                {bundle.meta.description}
              </p>
            )}
            <div style={{ fontSize: 13, color: t.mutedSoft, marginTop: 4 }}>
              Cached {timeAgo(bundle.cached_at)}
              {' · '}
              Created {timeAgo(bundle.meta?.created_at)}
            </div>
          </div>

          {/* Partial error banner */}
          {bundle.errors && <ErrorBanner errors={bundle.errors} />}

          {/* ── Stat row ── */}
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

          {/* ── Derived insights row ── */}
          {(mostActiveWeek || topContribPct !== null || daysSinceLastPush !== null) && (
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
                  value={fmt(bundle.releases.reduce((s, r) => s + r.total_downloads, 0))}
                  sub={`across ${bundle.releases.length} releases`}
                />
              )}
            </div>
          )}

          {/* ── 3-up grid: Commit activity, Languages, Contributors ── */}
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

          {/* ── 2-up grid: Releases, Activity ── */}
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

          {/* ── Tags ── */}
          {bundle.tags?.length > 0 && (
            <div style={{
              background: t.surfaceCard,
              border: `1px solid ${t.hairline}`,
              borderRadius: 16,
              padding: 24,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.96px',
                textTransform: 'uppercase',
                color: t.muted,
                marginBottom: 12,
              }}>
                Recent Tags
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {bundle.tags.map(tag => (
                  <span key={tag.name} style={{
                    background: t.surfaceStrong,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: t.bodyStrong,
                  }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── Empty state ── */}
      {!bundle && !loading && (
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px 96px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          paddingTop: 32,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            width: '100%',
            opacity: 0.4,
          }}>
            {[t.gradientMint, t.gradientPeach, t.gradientLavender].map((color, i) => (
              <div key={i} style={{
                height: 80,
                borderRadius: 16,
                background: `radial-gradient(circle at 30% 50%, ${color}80 0%, ${t.hairline} 100%)`,
                border: `1px solid ${t.hairline}`,
              }} />
            ))}
          </div>
          <p style={{ fontSize: 15, color: t.mutedSoft, letterSpacing: '0.15px' }}>
            Enter a GitHub repository URL above to begin
          </p>
        </div>
      )}

      {showToken && <TokenModal onClose={() => setShowToken(false)} />}
    </div>
  )
}
