import { t } from '../../tokens'
import { useRepo } from '../../context/RepoContext'

export function HeroSearch() {
  const { url, setUrl, loading, error, bundle, fetchRepo } = useRepo()

  return (
    <section style={{
      padding: '64px 32px 48px',
      maxWidth: 1200,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Atmospheric orbs */}
      <div style={{
        position: 'absolute',
        top: -60,
        left: '10%',
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${t.gradientMint}40 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 20,
        right: '5%',
        width: 240,
        height: 240,
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
        Paste any GitHub repository URL to surface stars, contributors, releases, commit
        activity, and more — fetched concurrently from the GitHub REST API.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="https://github.com/owner/repo"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchRepo(false)}
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
          onClick={() => fetchRepo(false)}
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
            onClick={() => fetchRepo(true)}
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
          border: '1px solid #fecaca',
          fontSize: 14,
          color: t.semanticError,
        }}>
          {error}
        </div>
      )}
    </section>
  )
}
