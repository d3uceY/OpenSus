import { t } from '../../tokens'

interface Props {
  label: string
  value: string
  sub?: string
}

export function StatCard({ label, value, sub }: Props) {
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
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.96px',
        textTransform: 'uppercase',
        color: t.muted,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 32,
        fontWeight: 300,
        color: t.ink,
        lineHeight: 1.13,
        letterSpacing: '-0.32px',
        fontFamily: "'EB Garamond', 'Times New Roman', serif",
      }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 14, color: t.mutedSoft }}>{sub}</span>
      )}
    </div>
  )
}
