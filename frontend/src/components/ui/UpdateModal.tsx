import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime'
import logo from '../../assets/opensus_logo.png'

const REPO_URL = 'https://github.com/d3uceY/OpenSus#downloads'

interface Props {
  latestVersion: string
  currentVersion: string
  onClose: () => void
}

export function UpdateModal({ latestVersion, currentVersion, onClose }: Props) {
  function handleDownload() {
    BrowserOpenURL(REPO_URL)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(12,10,9,0.45)]">
      <div className="w-[380px] bg-surface-card border border-hairline rounded-2xl shadow-xl flex flex-col items-center gap-5 px-8 py-8">
        <img src={logo} alt="OpenSus" className="h-12 w-auto" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[15px] font-semibold text-ink">Update available</p>
          <p className="text-sm text-muted">
            <span className="text-body">{latestVersion}</span> is out — you're on <span className="text-body">v{currentVersion}</span>.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 rounded-xl bg-ink text-canvas text-sm font-medium cursor-pointer"
          >
            Download latest
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-hairline text-sm font-medium text-muted cursor-pointer"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
