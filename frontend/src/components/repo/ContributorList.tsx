import type { main } from '../../../wailsjs/go/models'
import { t } from '../../tokens'
import { fmt } from '../../helpers/format'

interface Props {
  contributors: main.Contributor[]
}

export function ContributorList({ contributors }: Props) {
  if (!contributors || contributors.length === 0) {
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {contributors.map((c, i) => (
        <div
          key={c.login}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 0',
            borderBottom: i < contributors.length - 1 ? `1px solid ${t.hairline}` : 'none',
          }}
        >
          <img
            src={c.avatar_url}
            alt={c.login}
            style={{ width: 32, height: 32, borderRadius: '50%', background: t.surfaceStrong, flexShrink: 0 }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: t.ink }}>{c.login}</span>
          <span style={{ fontSize: 13, color: t.muted }}>{fmt(c.contributions)} commits</span>
        </div>
      ))}
    </div>
  )
}
