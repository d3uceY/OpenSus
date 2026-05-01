import type { types } from '../../../wailsjs/go/models'
import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime'

interface Props {
  tags: types.Tag[]
}

export function TagList({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6">
      <div className="text-xs font-semibold tracking-[0.96px] uppercase text-muted mb-4">
        Recent Tags
      </div>
      <div className="flex flex-col divide-y divide-hairline">
        {tags.map(tag => (
          <div key={tag.name} className="flex items-center gap-3 py-[10px]">
            {/* Tag name */}
            <span className="bg-surface-strong rounded-full px-3 py-1 text-[13px] font-medium text-body-strong shrink-0">
              {tag.name}
            </span>
            {/* Short commit SHA */}
            {tag.commit_sha && (
              <span className="font-mono text-[12px] text-muted-soft bg-surface-strong rounded px-2 py-[2px] shrink-0">
                {tag.commit_sha.slice(0, 7)}
              </span>
            )}
            <span className="flex-1" />
            {/* Archive download links */}
            {tag.zipball_url && (
              <button
                onClick={() => BrowserOpenURL(tag.zipball_url)}
                className="text-[12px] font-medium text-muted hover:text-ink transition-colors cursor-default px-2 py-1 rounded-lg hover:bg-surface-strong"
              >
                .zip
              </button>
            )}
            {tag.tarball_url && (
              <button
                onClick={() => BrowserOpenURL(tag.tarball_url)}
                className="text-[12px] font-medium text-muted hover:text-ink transition-colors cursor-default px-2 py-1 rounded-lg hover:bg-surface-strong"
              >
                .tar.gz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
