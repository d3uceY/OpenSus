import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Refresh01Icon } from '@hugeicons/core-free-icons'
import { t } from '../../tokens'
import { useRepo } from '../../context/RepoContext'
import { useHistory } from '../../hooks/useHistory'
import { HistoryPopover } from '../ui/HistoryPopover'

export function HeroSearch() {
  const { url, setUrl, loading, error, bundle, fetchRepo } = useRepo()
  const { history, remove, clear } = useHistory()
  const [inputFocused, setInputFocused] = useState(false)
  const showPopover = inputFocused && history.length > 0

  return (
    <section className="pt-16 px-8 pb-12 max-w-[1200px] mx-auto relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div
        className="absolute -top-[60px] left-[10%] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.gradientMint}40 0%, transparent 70%)` }}
      />
      <div
        className="absolute top-5 right-[5%] w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.gradientLavender}35 0%, transparent 70%)` }}
      />

      <h1 className="text-5xl font-light leading-[1.08] tracking-[-0.96px] text-ink font-display mb-3">
        Repository Intelligence
      </h1>
      <p className="text-base leading-relaxed tracking-[0.16px] text-body mb-7 max-w-[560px]">
        Paste any GitHub repository URL to surface stars, contributors, releases, commit
        activity, and more — fetched concurrently from the GitHub REST API.
      </p>

      <div className="flex gap-[10px] flex-wrap items-start">
        <div className="relative flex-[1_1_320px]">
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchRepo(false)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="w-full px-4 py-[10px] rounded-lg border border-hairline-strong text-[15px] text-ink bg-surface-card outline-none font-sans"
          />
          {showPopover && (
            <HistoryPopover
              history={history}
              onSelect={url => { setUrl(url); setInputFocused(false) }}
              onRemove={remove}
              onClear={clear}
            />
          )}
        </div>
        <button
          onClick={() => fetchRepo(false)}
          disabled={loading || !url.trim()}
          className={`flex items-center gap-2 px-[22px] py-[10px] rounded-full border-none text-[15px] font-medium text-on-primary transition-colors duration-150 ${
            loading ? 'bg-muted cursor-default' : 'bg-primary cursor-pointer'
          }`}
        >
          <HugeiconsIcon icon={Search01Icon} size={15} className="text-on-primary" />
          {loading ? 'Fetching…' : 'Fetch'}
        </button>
        {bundle && (
          <button
            onClick={() => fetchRepo(true)}
            disabled={loading}
            className="flex items-center gap-2 px-[18px] py-[10px] rounded-full bg-transparent border border-hairline-strong text-[15px] font-medium text-body cursor-pointer"
          >
            <HugeiconsIcon icon={Refresh01Icon} size={15} className="text-muted" />
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 px-4 py-[10px] rounded-lg bg-red-50 border border-red-200 text-sm text-semantic-error">
          {error}
        </div>
      )}
    </section>
  )
}

