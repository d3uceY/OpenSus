import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'

interface Props {
  tags: main.Tag[]
}

export function TagList({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  return (
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
        {tags.map(tag => (
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
  )
}
