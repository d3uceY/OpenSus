import { WindowMinimise, WindowToggleMaximise, Quit } from '../../../wailsjs/runtime/runtime'
import { HugeiconsIcon } from '@hugeicons/react'
import { Minimize01Icon, SquareIcon, Cancel01Icon } from '@hugeicons/core-free-icons'

export function TitleBar() {
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
        <span className="text-[13px] font-medium tracking-[-0.2px] text-muted pointer-events-none">
          OpenSus
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
