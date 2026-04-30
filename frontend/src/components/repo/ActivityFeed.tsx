import type { types } from '../../../wailsjs/go/models'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  GitBranchIcon,
  GitMergeIcon,
  Delete01Icon,
  Activity01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { timeAgo } from '../../helpers/format'

interface Props {
  events: types.ActivityEvent[]
}

function activityHugeIcon(type: string): IconSvgElement {
  const map: Record<string, IconSvgElement> = {
    push: ArrowUp01Icon as unknown as IconSvgElement,
    force_push: ArrowUp01Icon as unknown as IconSvgElement,
    branch_creation: GitBranchIcon as unknown as IconSvgElement,
    branch_deletion: Delete01Icon as unknown as IconSvgElement,
    pr_merge: GitMergeIcon as unknown as IconSvgElement,
    branch_protection_rule_deletion: Shield01Icon as unknown as IconSvgElement,
  }
  return (map[type] ?? Activity01Icon) as unknown as IconSvgElement
}

export function ActivityFeed({ events }: Props) {
  if (!events || events.length === 0) {
    return <span className="text-muted-soft text-sm">No recent activity</span>
  }

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {events.map((e, i) => (
        <div key={e.id || i} className="flex items-start gap-[10px] py-[9px]">
          <span className="w-[22px] h-[22px] rounded-full bg-surface-strong flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={activityHugeIcon(e.activity_type)} size={12} className="text-body-strong" />
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
