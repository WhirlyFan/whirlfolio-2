import { useMemo } from 'react'
import { Vector2 } from 'three'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'

/**
 * Cinematic post-processing (high tier only):
 * - Bloom — selective glow on the over-bright emissive materials (core, stars).
 * - ChromaticAberration — a faint lens fringe at the edges.
 * - Vignette — gently darkens the corners to focus the eye on the galaxy.
 */
export function Effects() {
  const caOffset = useMemo(() => new Vector2(0.0007, 0.0007), [])

  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.25}
        radius={0.7}
      />
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.4} />
      <Vignette offset={0.3} darkness={0.7} eskil={false} />
    </EffectComposer>
  )
}
