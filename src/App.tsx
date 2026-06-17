import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { TopBar } from '@/components/chrome/TopBar'
import { GalaxyHud } from '@/components/chrome/GalaxyHud'
import { ListView } from '@/components/list/ListView'
import { DetailPanel } from '@/components/panel/DetailPanel'

// Heavy three.js scene — only loaded when the galaxy view is shown.
const Galaxy = lazy(() => import('@/components/scene/Galaxy'))

function App() {
  useDeviceCapability()
  const viewMode = useStore((s) => s.viewMode)

  return (
    <>
      {viewMode === '3d' ? (
        <Suspense fallback={<GalaxyLoading />}>
          <Galaxy />
          <GalaxyHud />
        </Suspense>
      ) : (
        <ListView />
      )}

      <TopBar />
      <DetailPanel />
    </>
  )
}

function GalaxyLoading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[#070912] text-white/70">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm">Charting the galaxy…</p>
      </div>
    </div>
  )
}

export default App
