import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Key01Icon } from '@hugeicons/core-free-icons'
import { TokenModal } from '../ui/TokenModal'
import { UpdateModal } from '../ui/UpdateModal'
import { useUpdateCheck } from '../../hooks/useUpdateCheck'
import logo from '../../assets/opensus_logo.png'

export function TopNav() {
  const [showToken, setShowToken] = useState(false)
  const { hasUpdate, latestVersion, currentVersion, dismiss } = useUpdateCheck()

  return (
    <>
      <nav className="h-16 bg-canvas-soft border-b border-hairline flex items-center px-8 gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 flex-1">
          <img src={logo} alt="OpenSus" className="h-8 w-auto object-contain object-left" />
        </div>
        <button
          onClick={() => setShowToken(true)}
          className="flex items-center gap-[7px] px-4 py-[7px] rounded-full border border-hairline-strong bg-transparent text-sm font-medium text-body cursor-pointer"
        >
          <HugeiconsIcon icon={Key01Icon} size={14} className="text-muted" />
          GitHub Token
        </button>
      </nav>
      {showToken && <TokenModal onClose={() => setShowToken(false)} />}
      {hasUpdate && (
        <UpdateModal
          latestVersion={latestVersion}
          currentVersion={currentVersion}
          onClose={dismiss}
        />
      )}
    </>
  )
}
