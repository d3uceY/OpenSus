import { useState } from 'react'
import { useGitHubToken } from '../../hooks/useGitHubToken'

interface Props {
  onClose: () => void
}

export function TokenModal({ onClose }: Props) {
  const [val, setVal] = useState('')
  const { setToken, saved } = useGitHubToken()

  const save = async () => {
    if (!val.trim()) return
    await setToken(val)
    setTimeout(onClose, 800)
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(12,10,9,0.4)] flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-2xl p-8 w-[420px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-hairline"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-xl font-medium text-ink mb-2">
          GitHub Token
        </div>
        <div className="text-sm text-body mb-5 leading-relaxed">
          A Personal Access Token raises the API limit from 60 to 5,000 requests/hour.
          Only <code>public_repo</code> scope is needed.
        </div>
        <input
          type="password"
          placeholder="ghp_......................................."
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          className="w-full px-[14px] py-[10px] rounded-lg border border-hairline-strong text-[15px] text-ink bg-surface-card outline-none font-mono mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-[10px]">
          <button
            onClick={onClose}
            className="px-[18px] py-2 rounded-full border border-hairline-strong bg-transparent text-sm font-medium text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-[18px] py-2 rounded-full bg-primary border-none text-sm font-medium text-on-primary cursor-pointer"
          >
            {saved ? 'Saved' : 'Save token'}
          </button>
        </div>
      </div>
    </div>
  )
}

