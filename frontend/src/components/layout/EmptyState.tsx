import { t } from '../../tokens'

export function EmptyState() {
  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 32px 96px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        width: '100%',
        opacity: 0.4,
      }}>
        {[t.gradientMint, t.gradientPeach, t.gradientLavender].map((color, i) => (
          <div
            key={i}
            style={{
              height: 80,
              borderRadius: 16,
              background: `radial-gradient(circle at 30% 50%, ${color}80 0%, ${t.hairline} 100%)`,
              border: `1px solid ${t.hairline}`,
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 15, color: t.mutedSoft, letterSpacing: '0.15px' }}>
        Enter a GitHub repository URL above to begin
      </p>
    </div>
  )
}
