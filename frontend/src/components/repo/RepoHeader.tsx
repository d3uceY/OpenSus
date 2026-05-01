import type { types } from '../../../wailsjs/go/models'
import { timeAgo } from '../../helpers/format'
import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime'
import { HugeiconsIcon } from '@hugeicons/react'
import { Archive01Icon, GitBranchIcon, Link01Icon } from '@hugeicons/core-free-icons'

interface Props {
  meta: types.RepoMeta
  cachedAt: string
}

export function RepoHeader({ meta, cachedAt }: Props) {
  const enabledFeatures = [
    meta?.has_issues && 'Issues',
    meta?.has_wiki && 'Wiki',
    meta?.has_discussions && 'Discussions',
    meta?.has_pages && 'Pages',
  ].filter(Boolean) as string[]

  return (
    <div className="mb-8">
      {/* Archived banner */}
      {meta?.archived && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] font-medium text-amber-700">
          <HugeiconsIcon icon={Archive01Icon} size={14} />
          This repository is archived and read-only
        </div>
      )}

      {/* Name row */}
      <div className="flex items-center gap-3 flex-wrap mb-1.5">
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
        {meta?.default_branch && (
          <span className="flex items-center gap-1 text-xs font-medium text-muted-soft">
            <HugeiconsIcon icon={GitBranchIcon} size={12} />
            {meta.default_branch}
          </span>
        )}
      </div>

      {/* Description */}
      {meta?.description && (
        <p className="text-[15px] text-body leading-relaxed max-w-[640px] mb-2">
          {meta.description}
        </p>
      )}

      {/* Homepage */}
      {meta?.homepage && (
        <button
          onClick={() => BrowserOpenURL(meta.homepage)}
          className="mb-3 inline-flex cursor-default items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink"
        >
          <HugeiconsIcon icon={Link01Icon} size={13} />
          {meta.homepage}
        </button>
      )}

      {/* Topics */}
      {meta?.topics && meta.topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {meta.topics.map(topic => (
            <span
              key={topic}
              className="rounded-full bg-accent-soft px-[10px] py-[3px] text-[12px] font-medium text-accent"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Enabled feature flags */}
      {enabledFeatures.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {enabledFeatures.map(f => (
            <span
              key={f}
              className="rounded-full bg-surface-strong px-[10px] py-[3px] text-[12px] font-medium text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {/* Footer meta line */}
      <div className="text-[13px] text-muted-soft">
        Cached {timeAgo(cachedAt)}
        {' · '}
        Created {timeAgo(meta?.created_at)}
        {meta?.updated_at && <> · Updated {timeAgo(meta.updated_at)}</>}
        {meta?.network_count > 0 && (
          <> · {meta.network_count} network {meta.network_count === 1 ? 'fork' : 'forks'}</>
        )}
      </div>
    </div>
  )
}
