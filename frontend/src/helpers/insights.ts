import type { types } from '../../wailsjs/go/models'

/**
 * Returns the number of calendar days since the last push, or null if unavailable.
 */
export function getDaysSinceLastPush(pushedAt: string | null | undefined): number | null {
  if (!pushedAt) return null
  return Math.floor((Date.now() - new Date(pushedAt).getTime()) / 86_400_000)
}

/**
 * Returns the sum of download counts across all releases.
 */
export function getTotalDownloads(releases: types.Release[] | null | undefined): number {
  if (!releases) return 0
  return releases.reduce((s, r) => s + r.total_downloads, 0)
}
