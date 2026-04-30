import type { types } from '../../../wailsjs/go/models'
import { fmt } from '../../helpers/format'

interface Props {
  contributors: types.Contributor[]
}

export function ContributorList({ contributors }: Props) {
  if (!contributors || contributors.length === 0) {
    return <span className="text-muted-soft text-sm">No data</span>
  }

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {contributors.map(c => (
        <div key={c.login} className="flex items-center gap-3 py-[10px]">
          <img
            src={c.avatar_url}
            alt={c.login}
            className="w-8 h-8 rounded-full bg-surface-strong shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="flex-1 text-[15px] font-medium text-ink">{c.login}</span>
          <span className="text-[13px] text-muted">{fmt(c.contributions)} commits</span>
        </div>
      ))}
    </div>
  )
}
