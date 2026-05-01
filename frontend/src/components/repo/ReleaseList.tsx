import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { types } from '../../../wailsjs/go/models'
import { HugeiconsIcon } from '@hugeicons/react'
import { Download01Icon, Package01Icon } from '@hugeicons/core-free-icons'
import { timeAgo, fmt } from '../../helpers/format'

interface Props {
  releases: types.Release[]
}

function AssetsTooltip({ assets, anchorEl }: { assets: types.ReleaseAsset[]; anchorEl: HTMLElement | null }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    if (!anchorEl) return
    const rect = anchorEl.getBoundingClientRect()
    setPos({
      top: rect.bottom + window.scrollY + 6,
      right: window.innerWidth - rect.right,
    })
  }, [anchorEl])

  if (!assets || assets.length === 0 || !pos) return null

  return createPortal(
    <div
      style={{ position: 'absolute', top: pos.top, right: pos.right }}
      className="z-[9999] bg-surface-card border border-hairline rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-3 min-w-[200px] flex flex-col gap-1.5 pointer-events-none"
    >
      <div className="text-[11px] font-semibold tracking-[0.8px] uppercase text-muted mb-1">Assets</div>
      {assets.map(a => (
        <div key={a.name} className="flex items-center gap-2">
          <HugeiconsIcon icon={Package01Icon} size={13} className="text-muted-soft shrink-0" />
          <span className="flex-1 text-[13px] text-body truncate">{a.name}</span>
          <span className="text-[12px] text-muted shrink-0 flex items-center gap-1">
            <HugeiconsIcon icon={Download01Icon} size={12} className="text-muted-soft" />
            {fmt(a.download_count)}
          </span>
        </div>
      ))}
    </div>,
    document.body
  )
}

export function ReleaseList({ releases }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const anchorRefs = useRef<Record<string, HTMLDivElement | null>>({})

  if (!releases || releases.length === 0) {
    return <span className="text-muted-soft text-sm">No releases</span>
  }

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {releases.map(r => (
        <div key={r.tag_name} className="flex items-center gap-3 py-[10px]">
          <div className="bg-surface-strong rounded-full px-[10px] py-[3px] text-xs font-semibold tracking-[0.5px] text-body-strong shrink-0">
            {r.tag_name}
          </div>
          <span className="flex-1 text-[13px] text-muted">{timeAgo(r.published_at)}</span>
          {r.total_downloads > 0 && (
            <span className="text-[13px] text-body flex items-center gap-1">
              <HugeiconsIcon icon={Download01Icon} size={14} className="text-muted-soft" />
              {fmt(r.total_downloads)}
            </span>
          )}
          {r.assets && r.assets.length > 0 && (
            <div
              ref={el => { anchorRefs.current[r.tag_name] = el }}
              onMouseEnter={() => setHovered(r.tag_name)}
              onMouseLeave={() => setHovered(null)}
            >
              <button className="w-[26px] h-[26px] rounded-full bg-surface-strong flex items-center justify-center cursor-default">
                <HugeiconsIcon icon={Package01Icon} size={13} className="text-body-strong" />
              </button>
              {hovered === r.tag_name && (
                <AssetsTooltip assets={r.assets} anchorEl={anchorRefs.current[r.tag_name]} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
