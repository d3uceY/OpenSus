import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons'

interface Props {
  history: string[]
  onSelect: (url: string) => void
  onRemove: (url: string) => void
  onClear: () => void
}

export function HistoryPopover({ history, onSelect, onRemove, onClear }: Props) {
  if (history.length === 0) return null

  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-surface-card border border-hairline rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-hairline">
        <span className="text-[11px] font-semibold tracking-[0.8px] uppercase text-muted">
          Recent
        </span>
        <button
          onMouseDown={e => { e.preventDefault(); onClear() }}
          className="text-[12px] text-muted-soft hover:text-semantic-error transition-colors cursor-pointer bg-transparent border-none px-0 py-0"
        >
          Clear all
        </button>
      </div>
      <ul className="max-h-[220px] overflow-y-auto">
        {history.map(url => (
          <li
            key={url}
            className="flex items-center gap-2 px-4 py-[9px] hover:bg-surface-strong transition-colors group"
          >
            <button
              onMouseDown={e => { e.preventDefault(); onSelect(url) }}
              className="flex-1 text-left text-[13px] text-body truncate bg-transparent border-none cursor-pointer px-0 py-0"
            >
              {url}
            </button>
            <button
              onMouseDown={e => { e.preventDefault(); onRemove(url) }}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-transparent border-none cursor-pointer p-0.5 rounded"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} className="text-muted-soft hover:text-semantic-error" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
