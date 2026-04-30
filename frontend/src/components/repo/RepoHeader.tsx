import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'
import { timeAgo } from '../../helpers/format'

interface Props {
  meta: main.RepoMeta
  cachedAt: string
}

export function RepoHeader({ meta, cachedAt }: Props) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 300,
          letterSpacing: 0,
          color: t.ink,
          fontFamily: "'EB Garamond', 'Times New Roman', serif",
          margin: 0,
        }}>
          {meta?.full_name || '—'}
        </h2>
        {meta?.language && (
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
            {meta.language}
          </span>
        )}
        {meta?.license && (
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
            {meta.license}
          </span>
        )}
      </div>
      {meta?.description && (
        <p style={{ fontSize: 15, color: t.body, lineHeight: 1.5, maxWidth: 640, margin: '0 0 4px' }}>
          {meta.description}
        </p>
      )}
      <div style={{ fontSize: 13, color: t.mutedSoft }}>
        Cached {timeAgo(cachedAt)}
        {' · '}
        Created {timeAgo(meta?.created_at)}
      </div>
    </div>
  )
}
