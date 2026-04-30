import { buildLangSlices } from '../../helpers/language'

interface Props {
  langs: Record<string, number>
}

export function LanguageBar({ langs }: Props) {
  const items = buildLangSlices(langs)

  if (items.length === 0) {
    return <span className="text-muted-soft text-sm">No data</span>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {items.map(l => (
          <div
            key={l.name}
            className="min-w-[2px]"
            style={{ flex: l.pct, background: l.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map(l => (
          <span key={l.name} className="flex items-center gap-1.5 text-sm text-body">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: l.color }}
            />
            {l.name}
            <span className="text-muted-soft">{l.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
