import { useState } from 'react'
import { t } from '../../tokens'
import { TokenModal } from '../ui/TokenModal'

export function TopNav() {
  const [showToken, setShowToken] = useState(false)

  return (
    <>
      <nav style={{
        height: 64,
        background: t.canvasSoft,
        borderBottom: `1px solid ${t.hairline}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 300,
          letterSpacing: '-0.5px',
          color: t.ink,
          fontFamily: "'EB Garamond', 'Times New Roman', serif",
          flex: 1,
        }}>
          OpenSus
        </span>
        <button
          onClick={() => setShowToken(true)}
          style={{
            padding: '7px 16px',
            borderRadius: 9999,
            border: `1px solid ${t.hairlineStrong}`,
            background: 'transparent',
            fontSize: 14,
            fontWeight: 500,
            color: t.body,
            cursor: 'pointer',
          }}
        >
          GitHub Token
        </button>
      </nav>
      {showToken && <TokenModal onClose={() => setShowToken(false)} />}
    </>
  )
}
