import type { types } from '../../../wailsjs/go/models'
import { timeAgo } from '../../helpers/format'

interface Props {
  meta: types.RepoMeta
  cachedAt: string
}

export function RepoHeader({ meta, cachedAt }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
        <h2 className="text-2xl font-light tracking-[0] text-ink font-display m-0">
          {meta?.full_name || '—'}
        </h2>
        {meta?.language && (
          <span className="text-xs font-semibold tracking-[0.96px] uppercase text-muted bg-surface-strong rounded-full px-[10px] py-[3px]">
            {meta.language}
          </span>
        )}
        {meta?.license && (
          <span className="text-xs font-semibold tracking-[0.96px] uppercase text-muted bg-surface-strong rounded-full px-[10px] py-[3px]">
            {meta.license}
          </span>
        )}
      </div>
      {meta?.description && (
        <p className="text-[15px] text-body leading-relaxed max-w-[640px] mb-1">
          {meta.description}
        </p>
      )}
      <div className="text-[13px] text-muted-soft">
        Cached {timeAgo(cachedAt)}
        {' · '}
        Created {timeAgo(meta?.created_at)}
      </div>
    </div>
  )
}
