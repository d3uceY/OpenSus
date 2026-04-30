import type { types } from '../../../wailsjs/go/models'
import { timeAgo, activityIcon } from '../../helpers/format'

interface Props {
  events: types.ActivityEvent[]
}

export function ActivityFeed({ events }: Props) {
  if (!events || events.length === 0) {
    return <span className="text-muted-soft text-sm">No recent activity</span>
  }

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {events.map((e, i) => (
        <div key={e.id || i} className="flex items-start gap-[10px] py-[9px]">
          <span className="w-[22px] h-[22px] rounded-full bg-surface-strong flex items-center justify-center text-[11px] font-bold text-body-strong shrink-0">
            {activityIcon(e.activity_type)}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-body font-medium">{e.actor}</span>
            <span className="text-[13px] text-muted"> · {e.activity_type.replace(/_/g, ' ')}</span>
            {e.ref && (
              <div className="text-xs text-muted-soft mt-[1px] overflow-hidden text-ellipsis whitespace-nowrap">
                {e.ref}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-soft shrink-0">{timeAgo(e.timestamp)}</span>
        </div>
      ))}
    </div>
  )
}
