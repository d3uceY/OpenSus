import type { types } from '../../../wailsjs/go/models'

interface Props {
  tags: types.Tag[]
}

export function TagList({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6">
      <div className="text-xs font-semibold tracking-[0.96px] uppercase text-muted mb-3">
        Recent Tags
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map(tag => (
          <span
            key={tag.name}
            className="bg-surface-strong rounded-full px-3 py-1 text-[13px] font-medium text-body-strong"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  )
}
