interface Props {
  errors: Record<string, string>
}

export function ErrorBanner({ errors }: Props) {
  const entries = Object.entries(errors)
  if (entries.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
      <div className="text-xs font-semibold tracking-[0.96px] uppercase text-semantic-error mb-1.5">
        Partial errors
      </div>
      {entries.map(([k, v]) => (
        <div key={k} className="text-[13px] text-body">
          <strong>{k}:</strong> {v}
        </div>
      ))}
    </div>
  )
}
