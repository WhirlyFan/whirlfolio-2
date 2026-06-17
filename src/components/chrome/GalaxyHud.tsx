import { useState } from 'react'
import { Compass, MousePointerClick, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'

const HINT_KEY = 'whirlfolio-hint-dismissed'

/** On-screen controls for the galaxy: a first-time hint and a reset-view button. */
export function GalaxyHud() {
  const resetCamera = useStore((s) => s.resetCamera)
  const [hintDismissed, setHintDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(HINT_KEY) === '1',
  )

  const dismissHint = () => {
    setHintDismissed(true)
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {!hintDismissed && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/60 py-2 pr-2 pl-4 text-sm text-white/85 backdrop-blur-md">
            <MousePointerClick className="size-4 shrink-0 text-primary" />
            <span>
              Drag to orbit · scroll to zoom · <strong className="font-medium text-white">click a star</strong> to explore
            </span>
            <button
              onClick={dismissHint}
              aria-label="Dismiss hint"
              className="grid size-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-auto fixed right-4 bottom-6 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={resetCamera}
          className="border-white/15 bg-black/50 text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
        >
          <Compass className="size-4" />
          <span className="hidden sm:inline">Reset view</span>
        </Button>
      </div>
    </>
  )
}
