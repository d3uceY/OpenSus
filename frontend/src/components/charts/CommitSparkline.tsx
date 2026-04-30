import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'

interface Props {
  weeks: main.WeeklyCommitActivity[]
}

export function CommitSparkline({ weeks }: Props) {
  if (!weeks || weeks.length === 0) {
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  }

  const max = Math.max(...weeks.map(w => w.total), 1)
  const h = 56
  const barW = 8
  const gap = 3
  const totalW = weeks.length * (barW + gap)

  return (
    <svg width={totalW} height={h} style={{ display: 'block' }}>
      {weeks.map((w, i) => {
        const barH = Math.max(2, Math.round((w.total / max) * h))
        return (
          <rect
            key={w.week}
            x={i * (barW + gap)}
            y={h - barH}
            width={barW}
            height={barH}
            rx={2}
            fill={w.total === max ? t.gradientMint : t.hairlineStrong}
          />
        )
      })}
    </svg>
  )
}
