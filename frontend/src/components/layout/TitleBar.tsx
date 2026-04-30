import { WindowMinimise, WindowToggleMaximise, Quit, BrowserOpenURL } from '../../../wailsjs/runtime/runtime'
import { HugeiconsIcon } from '@hugeicons/react'
import { Minimize01Icon, SquareIcon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { useUpdateCheck } from '../../hooks/useUpdateCheck'

export function TitleBar() {
  const { currentVersion} = useUpdateCheck()

  return (
    <div
      // @ts-ignore — wails drag region data attribute
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
      className="h-10 bg-canvas-soft border-b border-hairline flex items-center select-none shrink-0"
    >
      {/* Drag region fills all space except the control buttons */}
      <div
        className="flex-1 h-full flex items-center px-4"
        // @ts-ignore
        style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
      >
        <span className="text-[13px] flex items-center font-medium tracking-[-0.2px] text-muted">
          <span className="pointer-events-none">OpenSus</span>
          {currentVersion && (
            <button
              onClick={() => BrowserOpenURL('https://github.com/d3uceY/OpenSus')}
              // @ts-ignore
              style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
              className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-strong text-muted border border-hairline cursor-pointer hover:border-hairline-strong hover:text-ink transition-colors"
            >
              v{currentVersion}
            </button>
          )}
        </span>
      </div>

      {/* Window controls — no-drag zone */}
      <div
        className="flex items-center h-full"
        style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={WindowMinimise}
          title="Minimize"
          className="w-10 h-full flex items-center justify-center text-muted hover:bg-surface-strong hover:text-ink transition-colors cursor-pointer border-none bg-transparent"
        >
          <HugeiconsIcon icon={Minimize01Icon} size={14} />
        </button>
        <button
          onClick={WindowToggleMaximise}
          title="Maximize / Restore"
          className="w-10 h-full flex items-center justify-center text-muted hover:bg-surface-strong hover:text-ink transition-colors cursor-pointer border-none bg-transparent"
        >
          <HugeiconsIcon icon={SquareIcon} size={13} />
        </button>
        <button
          onClick={Quit}
          title="Close"
          className="w-10 h-full flex items-center justify-center text-muted hover:bg-red-500 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      </div>
    </div>
  )
}
