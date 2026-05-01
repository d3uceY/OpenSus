import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { types } from '../../../wailsjs/go/models'
import { HugeiconsIcon } from '@hugeicons/react'
import { Download01Icon, Package01Icon } from '@hugeicons/core-free-icons'
import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime'
import { timeAgo, fmt, fmtBytes } from '../../helpers/format'

interface Props {
  releases: types.Release[]
}

const SLICE_COLORS = [
  '#7C9EF8', '#F4A96A', '#6DD9A8', '#E87B9A', '#A78BF5',
  '#F9D36A', '#60C9E8', '#F47B6A', '#82D96E', '#C87BE8',
  '#F9A06A', '#6AB8F9', '#E8C46A', '#7BE8A0', '#E86AC8',
  '#A0E86A', '#6A9EF9', '#F9E06A', '#E86A7C', '#6AE8D9',
]

function DownloadPieChart({ assets }: { assets: types.ReleaseAsset[] }) {
  const withDownloads = assets.filter(a => a.download_count > 0)
  if (withDownloads.length === 0) return null

  const total = withDownloads.reduce((s, a) => s + a.download_count, 0)
  const size = 80
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2

  // Build pie slices
  const slices: { d: string; color: string }[] = []
  let startAngle = -Math.PI / 2

  for (let i = 0; i < withDownloads.length; i++) {
    const asset = withDownloads[i]
    // Find original index for color
    const origIdx = assets.indexOf(asset)
    const sweep = (asset.download_count / total) * 2 * Math.PI
    const endAngle = startAngle + sweep

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = sweep > Math.PI ? 1 : 0

    // Single asset gets a full circle
    if (withDownloads.length === 1) {
      slices.push({
        d: `M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`,
        color: SLICE_COLORS[origIdx % SLICE_COLORS.length],
      })
    } else {
      slices.push({
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: SLICE_COLORS[origIdx % SLICE_COLORS.length],
      })
    }

    startAngle = endAngle
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} />
      ))}
    </svg>
  )
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

  const hasAnyDownloads = assets.some(a => a.download_count > 0)

  return createPortal(
    <div
      style={{ position: 'absolute', top: pos.top, right: pos.right }}
      className="z-[9999] bg-surface-card border border-hairline rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-3 min-w-[240px] flex flex-col gap-1.5 pointer-events-auto"
    >
      <div className="text-[11px] font-semibold tracking-[0.8px] uppercase text-muted mb-1">Assets</div>
      {assets.map((a, i) => (
        <div key={a.name} className="flex items-center gap-2 group">
          <span
            className="w-2 h-2 rounded-sm shrink-0"
            style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
          />
          <span className="flex-1 text-[13px] text-body truncate">{a.name}</span>
          {a.size_bytes > 0 && (
            <span className="text-[11px] text-muted-soft shrink-0">{fmtBytes(a.size_bytes)}</span>
          )}
          <span className="text-[12px] text-muted shrink-0 flex items-center gap-1">
            <HugeiconsIcon icon={Download01Icon} size={12} className="text-muted-soft" />
            {fmt(a.download_count)}
          </span>
          {a.browser_download_url && (
            <button
              className="shrink-0 text-[11px] font-medium text-muted hover:text-ink transition-colors cursor-default"
              onClick={() => BrowserOpenURL(a.browser_download_url)}
            >
              ↗
            </button>
          )}
        </div>
      ))}
      {hasAnyDownloads && (
        <div className="mt-2 pt-2 border-t border-hairline flex justify-center">
          <DownloadPieChart assets={assets} />
        </div>
      )}
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
        <div key={r.tag_name} className="flex flex-col gap-1 py-[10px]">
          {/* Top row: tag + badges + downloads + assets button */}
          <div className="flex items-center gap-2">
            <div className="bg-surface-strong rounded-full px-[10px] py-[3px] text-xs font-semibold tracking-[0.5px] text-body-strong shrink-0">
              {r.tag_name}
            </div>
            {r.prerelease && (
              <span className="rounded-full bg-amber-100 px-[8px] py-[2px] text-[11px] font-semibold text-amber-700">
                pre-release
              </span>
            )}
            {r.draft && (
              <span className="rounded-full bg-surface-strong px-[8px] py-[2px] text-[11px] font-semibold text-muted">
                draft
              </span>
            )}
            <span className="flex-1" />
            {r.total_downloads > 0 && (
              <span className="text-[13px] text-body flex items-center gap-1 shrink-0">
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
          {/* Bottom row: release name + author + date */}
          <div className="flex items-center gap-2 pl-1">
            {r.name && r.name !== r.tag_name && (
              <span className="text-[13px] font-medium text-body-strong truncate flex-1">{r.name}</span>
            )}
            {r.author && (
              <span className="text-[12px] text-muted-soft shrink-0">by {r.author}</span>
            )}
            <span className="text-[12px] text-muted shrink-0 ml-auto">{timeAgo(r.published_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
