import { t } from '../../tokens'

export function EmptyState() {
  return (
    <div className="max-w-300 mx-auto pt-8 px-8 pb-24 flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-4 w-full opacity-40">
        {[t.gradientMint, t.gradientPeach, t.gradientLavender].map((color, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl border border-hairline"
            style={{ background: `radial-gradient(circle at 30% 50%, ${color}80 0%, ${t.hairline} 100%)` }}
          />
        ))}
      </div>
      <p className="text-[15px] text-muted-soft tracking-[0.15px]">
        Enter a GitHub repository URL above to begin
      </p>
    </div>
  )
}
