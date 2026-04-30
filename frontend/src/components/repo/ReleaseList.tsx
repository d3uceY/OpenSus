import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'
import { timeAgo, fmt } from '../../helpers/format'

interface Props {
  releases: main.Release[]
}

export function ReleaseList({ releases }: Props) {
  if (!releases || releases.length === 0) {
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No releases</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {releases.map((r, i) => (
        <div
          key={r.tag_name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 0',
            borderBottom: i < releases.length - 1 ? `1px solid ${t.hairline}` : 'none',
          }}
        >
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
            <span style={{ fontSize: 13, color: t.body }}>↓ {fmt(r.total_downloads)}</span>
          )}
        </div>
      ))}
    </div>
  )
}
