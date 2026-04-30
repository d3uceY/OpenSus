import type { ReactNode } from 'react'
import { t } from '../../tokens'

interface Props {
  title: string
  children: ReactNode
  accent?: string
}

export function Card({ title, children, accent }: Props) {
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
