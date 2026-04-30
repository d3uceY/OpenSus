import { useState } from 'react'
import { t } from '../../tokens'
import { useGitHubToken } from '../../hooks/useGitHubToken'

interface Props {
  onClose: () => void
}

export function TokenModal({ onClose }: Props) {
  const [val, setVal] = useState('')
  const { setToken, saved } = useGitHubToken()

  const save = async () => {
    await setToken(val)
    setTimeout(onClose, 800)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(12,10,9,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: t.surfaceCard,
          borderRadius: 16,
          padding: 32,
          width: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: `1px solid ${t.hairline}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 20, fontWeight: 500, color: t.ink, marginBottom: 8 }}>
          GitHub Token
        </div>
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
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: `1px solid ${t.hairlineStrong}`,
            fontSize: 15,
            color: t.ink,
            background: t.surfaceCard,
            outline: 'none',
            fontFamily: 'monospace',
            marginBottom: 16,
          }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 9999,
              border: `1px solid ${t.hairlineStrong}`,
              background: 'transparent',
              fontSize: 14,
              fontWeight: 500,
              color: t.ink,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              padding: '8px 18px',
              borderRadius: 9999,
              background: t.primary,
              border: 'none',
              fontSize: 14,
              fontWeight: 500,
              color: t.onPrimary,
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
