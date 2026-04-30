interface Props {
  label: string
  value: string
  sub?: string
}

export function StatCard({ label, value, sub }: Props) {
  return (
    <div className="bg-surface-card border border-hairline rounded-2xl py-5 px-6 flex flex-col gap-1">
      <span className="text-xs font-semibold tracking-[0.96px] uppercase text-muted">
        {label}
      </span>
      <span className="text-[32px] font-light text-ink leading-[1.13] tracking-[-0.32px] font-display">
        {value}
      </span>
      {sub && (
        <span className="text-sm text-muted-soft">{sub}</span>
      )}
    </div>
  )
}
