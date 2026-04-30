import type { types } from '../../../wailsjs/go/models'
import { timeAgo, fmt } from '../../helpers/format'

interface Props {
  releases: types.Release[]
}

export function ReleaseList({ releases }: Props) {
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
            <span className="text-[13px] text-body">↓ {fmt(r.total_downloads)}</span>
          )}
        </div>
      ))}
    </div>
  )
}
