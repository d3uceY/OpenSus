import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  accent?: string
}

export function Card({ title, children, accent }: Props) {
  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
      {accent && (
        <div
          className="absolute -top-10 -right-10 w-30 h-30 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)` }}
        />
      )}
      <span className="text-xs font-semibold tracking-[0.96px] uppercase text-muted">
        {title}
      </span>
      <div>{children}</div>
    </div>
  )
}
