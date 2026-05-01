/**
 * Formats a number into a compact human-readable string.
 * e.g. 1_200_000 → "1.2M", 4500 → "4.5k"
 */
export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return String(n)
}

/**
 * Formats raw bytes into a human-readable size string.
 * e.g. 5_051_754 → "4.8 MB"
 */
export function fmtBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GB'
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
  if (bytes >= 1_024) return (bytes / 1_024).toFixed(1) + ' KB'
  return bytes + ' B'
}

/**
 * Formats a size given in kilobytes (as returned by the GitHub repo size field).
 * e.g. 3659 → "3.6 MB"
 */
export function fmtKB(kb: number): string {
  if (kb >= 1_048_576) return (kb / 1_048_576).toFixed(1) + ' GB'
  if (kb >= 1_024) return (kb / 1_024).toFixed(1) + ' MB'
  return kb + ' KB'
}

/**
 * Returns a relative time string from an ISO timestamp.
 * e.g. "3d ago", "2mo ago", "today"
 */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d}d ago`
  if (d < 365) return `${Math.floor(d / 30)}mo ago`
  return `${Math.floor(d / 365)}y ago`
}

/**
 * Returns a display icon character for a GitHub activity event type.
 */
export function activityIcon(type: string): string {
  const map: Record<string, string> = {
    push: '↑',
    force_push: '↑↑',
    branch_creation: '+',
    branch_deletion: '−',
    pr_merge: '⊕',
    branch_protection_rule_deletion: '✕',
  }
  return map[type] ?? '·'
}
