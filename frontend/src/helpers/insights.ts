import type { types } from '../../wailsjs/go/models'

/**
 * Returns the week with the highest commit total, or null if no data.
 */
export function getMostActiveWeek(
  weeks: types.WeeklyCommitActivity[] | null | undefined,
): types.WeeklyCommitActivity | null {
  if (!weeks || weeks.length === 0) return null
  return weeks.reduce((best, w) => (w.total > best.total ? w : best))
}

/**
 * Returns the top contributor's share of all commits as a percentage (0–100),
 * or null if the data is unavailable.
 */
export function getTopContribPercent(
  contribStats: types.ContributorStats[] | null | undefined,
  commitActivity: types.WeeklyCommitActivity[] | null | undefined,
): number | null {
  if (!contribStats?.length || !commitActivity?.length) return null
  const totalCommits = commitActivity.reduce((s, w) => s + w.total, 0)
  if (!totalCommits) return null
  const topTotal = contribStats[0]?.total ?? 0
  return Math.round((topTotal / totalCommits) * 100)
}

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
