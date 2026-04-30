import { t } from '../tokens'

const LANG_PALETTE = [
  t.gradientMint,
  t.gradientPeach,
  t.gradientLavender,
  t.gradientSky,
  t.gradientRose,
  '#d4b5a0',
  '#b8d4c8',
]

export interface LangSlice {
  name: string
  pct: number
  color: string
}

/**
 * Converts a language→bytes map into sorted percentage slices with colors.
 */
export function buildLangSlices(langs: Record<string, number>): LangSlice[] {
  const total = Object.values(langs).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  return Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes], i) => ({
      name,
      pct: Math.round((bytes / total) * 100 * 10) / 10,
      color: LANG_PALETTE[i % LANG_PALETTE.length],
    }))
}
