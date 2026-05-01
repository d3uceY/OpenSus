import type { types } from '../../../wailsjs/go/models'
import logo from '../../assets/opensus_logo.png'
import { fmt, fmtKB, timeAgo } from '../../helpers/format'
import { buildLangSlices } from '../../helpers/language'
import { getDaysSinceLastPush, getTotalDownloads } from '../../helpers/insights'
import { t } from '../../tokens'

interface Props {
  bundle: types.RepoBundle
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: t.surfaceStrong,
      color: t.muted,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.8px',
      textTransform: 'uppercase' as const,
      padding: '3px 10px',
      borderRadius: 99,
    }}>
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.9px',
      textTransform: 'uppercase' as const,
      color: t.muted,
      marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

export function ExportCard({ bundle }: Props) {
  const meta = bundle.meta
  const daysSinceLastPush = getDaysSinceLastPush(meta?.pushed_at)
  const totalDownloads = getTotalDownloads(bundle.releases)
  const langSlices = buildLangSlices(bundle.languages ?? {})

  const stats = [
    { label: 'Stars', value: fmt(meta?.stars ?? 0) },
    { label: 'Forks', value: fmt(meta?.forks ?? 0) },
    { label: 'Watchers', value: fmt(meta?.watchers ?? 0) },
    { label: 'Open Issues', value: fmt(meta?.open_issues ?? 0) },
    { label: 'Branches', value: String(bundle.branch_count ?? 0) },
    ...(meta?.size_kb > 0 ? [{ label: 'Size', value: fmtKB(meta.size_kb) }] : []),
    ...(daysSinceLastPush !== null ? [{ label: 'Days Since Push', value: String(daysSinceLastPush) }] : []),
    ...(bundle.releases?.length > 0 ? [{ label: 'Total Downloads', value: fmt(totalDownloads), sub: `${bundle.releases.length} releases` }] : []),
  ]

  return (
    <div style={{
      width: 1200,
      background: t.canvasSoft,
      padding: '48px 52px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      boxSizing: 'border-box' as const,
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>

        {/* Left: repo identity */}
        <div style={{ flex: 1, marginRight: 40 }}>
          <h1 style={{
            fontSize: 30,
            fontWeight: 300,
            color: t.ink,
            margin: '0 0 10px 0',
            letterSpacing: '-0.3px',
            lineHeight: 1.15,
          }}>
            {meta?.full_name || '—'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center' }}>
            {meta?.language && <Chip>{meta.language}</Chip>}
            {meta?.license && <Chip>{meta.license}</Chip>}
            {meta?.default_branch && (
              <span style={{ fontSize: 12, color: t.mutedSoft, display: 'flex', alignItems: 'center', gap: 4 }}>
                ⎇ {meta.default_branch}
              </span>
            )}
          </div>
          {meta?.description && (
            <p style={{
              fontSize: 14,
              color: t.body,
              margin: '12px 0 0 0',
              maxWidth: 600,
              lineHeight: 1.6,
            }}>
              {meta.description}
            </p>
          )}
          {meta?.topics && meta.topics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginTop: 12 }}>
              {meta.topics.map(topic => (
                <span key={topic} style={{
                  background: '#ede9fe',
                  color: '#6d28d9',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: 99,
                }}>
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: OpenSus brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <img src={logo} alt="OpenSus" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: 20, fontWeight: 600, color: t.ink, letterSpacing: '-0.2px' }}>OpenSus</span>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: t.surfaceCard,
            border: `1px solid ${t.hairline}`,
            borderRadius: 16,
            padding: '18px 20px',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.8px',
              textTransform: 'uppercase' as const,
              color: t.muted,
              marginBottom: 6,
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 28,
              fontWeight: 300,
              color: t.ink,
              lineHeight: 1.15,
              letterSpacing: '-0.28px',
            }}>
              {s.value}
            </div>
            {s.sub && (
              <div style={{ fontSize: 11, color: t.mutedSoft, marginTop: 3 }}>{s.sub}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Languages + Contributors (2-col) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Language Distribution */}
        <div style={{
          background: t.surfaceCard,
          border: `1px solid ${t.hairline}`,
          borderRadius: 16,
          padding: '24px',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute' as const,
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${t.gradientLavender}55 0%, transparent 70%)`,
            pointerEvents: 'none' as const,
          }} />
          <SectionLabel>Language Distribution</SectionLabel>
          {langSlices.length > 0 ? (
            <>
              <div style={{
                display: 'flex',
                height: 8,
                borderRadius: 4,
                overflow: 'hidden',
                gap: 2,
                marginBottom: 14,
              }}>
                {langSlices.map(l => (
                  <div key={l.name} style={{ flex: l.pct, background: l.color, minWidth: 2 }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 20px' }}>
                {langSlices.map(l => (
                  <span key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: t.body }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: l.color,
                      display: 'inline-block',
                      flexShrink: 0,
                    }} />
                    {l.name}
                    <span style={{ color: t.mutedSoft }}>{l.pct}%</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span style={{ color: t.mutedSoft, fontSize: 13 }}>No data</span>
          )}
        </div>

        {/* Top Contributors */}
        <div style={{
          background: t.surfaceCard,
          border: `1px solid ${t.hairline}`,
          borderRadius: 16,
          padding: '24px',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute' as const,
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${t.gradientPeach}55 0%, transparent 70%)`,
            pointerEvents: 'none' as const,
          }} />
          <SectionLabel>Top Contributors</SectionLabel>
          {(bundle.contributors ?? []).length > 0 ? (
            <div>
              {(bundle.contributors ?? []).slice(0, 8).map((c, i, arr) => (
                <div key={c.login} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${t.hairline}` : 'none',
                }}>
                  <img
                    src={c.avatar_url}
                    alt={c.login}
                    width={28}
                    height={28}
                    style={{ borderRadius: '50%', flexShrink: 0 }}
                  />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.ink }}>{c.login}</span>
                  <span style={{ fontSize: 12, color: t.muted }}>{fmt(c.contributions)} commits</span>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: t.mutedSoft, fontSize: 13 }}>No data</span>
          )}
        </div>
      </div>

      {/* ── Tags ── */}
      {(bundle.tags ?? []).length > 0 && (
        <div style={{
          background: t.surfaceCard,
          border: `1px solid ${t.hairline}`,
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 16,
        }}>
          <SectionLabel>Tags</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
            {(bundle.tags ?? []).slice(0, 30).map(tag => (
              <span key={tag.name} style={{
                background: t.surfaceStrong,
                color: t.muted,
                fontSize: 12,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 99,
              }}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        borderTop: `1px solid ${t.hairline}`,
        paddingTop: 16,
        marginTop: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: t.mutedSoft }}>
          Cached {timeAgo(bundle.cached_at)}
          {meta?.created_at ? ` · Created ${timeAgo(meta.created_at)}` : ''}
          {meta?.updated_at ? ` · Updated ${timeAgo(meta.updated_at)}` : ''}
        </span>
        <span style={{ fontSize: 12, color: t.mutedSoft }}>Generated by OpenSus</span>
      </div>
    </div>
  )
}
