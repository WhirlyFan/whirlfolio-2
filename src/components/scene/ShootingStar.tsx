import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { FUNFACTS_ID } from '@/scene/constants'

const R = 15
const TILT = 0.4

/** Comet position at orbit time t. */
function cometPos(t: number): [number, number, number] {
  return [Math.cos(t) * R, Math.sin(t * 1.3) * R * TILT + 2, Math.sin(t) * R]
}

/**
 * A comet on a slow, tilted orbit = fun facts.
 *
 * The comet MESH is moved directly (parent group stays at the origin) so its
 * LOCAL position equals its WORLD position. drei's Trail initializes its point
 * buffer from target.position (local) but updates from getWorldPosition (world)
 * — if those differ (e.g. a moved parent group), the trail streaks in from the
 * origin. Keeping them equal avoids that entirely. The hit area + label are
 * children of the comet so they follow it.
 */
export function ShootingStar() {
  const cometRef = useRef<THREE.Mesh>(null)
  const frames = useRef(0)
  const [trailReady, setTrailReady] = useState(false)

  const select = useStore((s) => s.select)
  const setHovered = useStore((s) => s.setHovered)
  const isHovered = useStore((s) => s.hoveredId) === FUNFACTS_ID
  const reducedMotion = useStore((s) => s.reducedMotion)

  const initial = cometPos(reducedMotion ? 2.1 : 0)

  useFrame((state) => {
    if (!cometRef.current) return
    const t = reducedMotion ? 2.1 : state.clock.elapsedTime * 0.16
    const [x, y, z] = cometPos(t)
    cometRef.current.position.set(x, y, z)
    if (!trailReady) {
      frames.current += 1
      if (frames.current >= 2) setTrailReady(true)
    }
  })

  return (
    <group>
      <mesh ref={cometRef} position={initial}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#fff7cc"
          emissive="#fde68a"
          emissiveIntensity={5}
          toneMapped={false}
        />

        {/* Hit area + label are children, so they follow the comet. */}
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            select(FUNFACTS_ID)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(FUNFACTS_ID)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(null)
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {isHovered && (
          <Html position={[0, 0.7, 0]} center distanceFactor={12} pointerEvents="none" zIndexRange={[20, 0]}>
            <div className="pointer-events-none w-max select-none rounded-md border border-white/15 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              ✨ Fun facts
            </div>
          </Html>
        )}
      </mesh>

      {trailReady && !reducedMotion && (
        <Trail
          target={cometRef as unknown as RefObject<THREE.Object3D>}
          width={2.5}
          length={6}
          color="#fde68a"
          attenuation={(w) => w * w}
          decay={1}
        />
      )}
    </group>
  )
}
