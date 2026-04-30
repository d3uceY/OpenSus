import { buildLangSlices } from '../../helpers/language'
import { t } from '../../tokens'

interface Props {
  langs: Record<string, number>
}

export function LanguageBar({ langs }: Props) {
  const items = buildLangSlices(langs)

  if (items.length === 0) {
    return <span style={{ color: t.mutedSoft, fontSize: 14 }}>No data</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 9999, overflow: 'hidden', gap: 2 }}>
        {items.map(l => (
          <div key={l.name} style={{ flex: l.pct, background: l.color, minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {items.map(l => (
          <span key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: t.body }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            {l.name}
            <span style={{ color: t.mutedSoft }}>{l.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
