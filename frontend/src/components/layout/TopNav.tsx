import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Key01Icon } from '@hugeicons/core-free-icons'
import { TokenModal } from '../ui/TokenModal'

export function TopNav() {
  const [showToken, setShowToken] = useState(false)

  return (
    <>
      <nav className="h-16 bg-canvas-soft border-b border-hairline flex items-center px-8 gap-4 sticky top-0 z-50">
        <span className="text-[18px] font-light tracking-[-0.5px] text-ink font-display flex-1">
          OpenSus
        </span>
        <button
          onClick={() => setShowToken(true)}
          className="flex items-center gap-[7px] px-4 py-[7px] rounded-full border border-hairline-strong bg-transparent text-sm font-medium text-body cursor-pointer"
        >
          <HugeiconsIcon icon={Key01Icon} size={14} className="text-muted" />
          GitHub Token
        </button>
      </nav>
      {showToken && <TokenModal onClose={() => setShowToken(false)} />}
    </>
  )
}
