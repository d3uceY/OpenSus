import { t } from '../../tokens'

interface Props {
  errors: Record<string, string>
}

export function ErrorBanner({ errors }: Props) {
  const entries = Object.entries(errors)
  if (entries.length === 0) return null

  return (
    <div style={{
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 12,
      padding: '12px 16px',
      marginBottom: 24,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.96px',
        textTransform: 'uppercase',
        color: t.semanticError,
        marginBottom: 6,
      }}>
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
