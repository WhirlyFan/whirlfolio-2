import { Bloom, EffectComposer } from '@react-three/postprocessing'

/**
 * Selective bloom — only the over-bright emissive materials (core + career
 * stars, which set emissiveIntensity > 1 and toneMapped={false}) glow. Mounted
 * on the high quality tier only.
 */
export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.25}
        radius={0.7}
      />
    </EffectComposer>
  )
}
