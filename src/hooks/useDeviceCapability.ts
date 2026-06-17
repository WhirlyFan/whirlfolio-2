import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Detect device capability once on mount and set the quality tier, reduced-motion
 * preference, and — for weak devices — fall back to the list view. Honors the
 * mobile-first / graceful-degradation goal from the plan.
 */
export function useDeviceCapability() {
  const setQuality = useStore((s) => s.setQuality)
  const setReducedMotion = useStore((s) => s.setReducedMotion)
  const setViewMode = useStore((s) => s.setViewMode)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const smallScreen = window.innerWidth < 768
    // navigator.deviceMemory is non-standard; treat <4GB as low when present.
    const lowMemory =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number' &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4
    const webgl = hasWebGL()

    setReducedMotion(reduced)

    const lowTier = coarse || smallScreen || lowMemory
    setQuality(lowTier ? 'low' : 'high')

    // The galaxy is the default experience everywhere. Only fall back to the
    // list when WebGL is unavailable (small/mobile devices still get the galaxy,
    // at the 'low' quality tier, and can switch to the list via the top bar).
    if (!webgl) {
      setViewMode('list')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
