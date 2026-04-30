import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'
import { timeAgo, activityIcon } from '../../helpers/format'

interface Props {
  events: main.ActivityEvent[]
}

export function ActivityFeed({ events }: Props) {
  if (!events || events.length === 0) {
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No recent activity</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {events.map((e, i) => (
        <div
          key={e.id || i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '9px 0',
            borderBottom: i < events.length - 1 ? `1px solid ${t.hairline}` : 'none',
          }}
        >
          <span style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: t.surfaceStrong,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: t.bodyStrong,
            flexShrink: 0,
          }}>
            {activityIcon(e.activity_type)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, color: t.body, fontWeight: 500 }}>{e.actor}</span>
            <span style={{ fontSize: 13, color: t.muted }}> · {e.activity_type.replace(/_/g, ' ')}</span>
            {e.ref && (
              <div style={{
                fontSize: 12,
                color: t.mutedSoft,
                marginTop: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {e.ref}
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: t.mutedSoft, flexShrink: 0 }}>{timeAgo(e.timestamp)}</span>
        </div>
      ))}
    </div>
  )
}
