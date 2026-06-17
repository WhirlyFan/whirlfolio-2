import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import { computeLayout } from '@/scene/layout'
import { GalaxyArms } from './GalaxyArms'
import { Starfield } from './Starfield'
import { Core } from './Core'
import { CareerStars } from './CareerStars'
import { ShootingStar } from './ShootingStar'
import { PhotoCluster } from './PhotoCluster'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'

/**
 * The galaxy scene root. Default export so it can be React.lazy'd — the heavy
 * three.js bundle only loads when the 3D view is shown.
 */
export default function Galaxy() {
  const quality = useStore((s) => s.quality)
  const select = useStore((s) => s.select)
  const placed = useMemo(() => computeLayout(), [])
  const dpr: [number, number] = quality === 'high' ? [1, 2] : [1, 1.5]

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0 }}
      camera={{ position: [0, 9, 15], fov: 55, near: 0.1, far: 120 }}
      dpr={dpr}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#070912']} />
      <ambientLight intensity={0.6} />

      <Suspense fallback={null}>
        <Starfield />
        <GalaxyArms />
        <Core />
        <CareerStars placed={placed} />
        <PhotoCluster />
        <ShootingStar />
        <CameraRig />
        {quality === 'high' && <Effects />}
      </Suspense>
    </Canvas>
  )
}
