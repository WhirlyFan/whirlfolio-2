import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { PHOTOS_ID } from '@/scene/constants'
import { orbitClock, starPositions } from '@/scene/layout'
import { getCircleTexture, getStarTexture } from '@/scene/textures'

// Orbit params (own slow orbit around the core; shares the orbit clock so it
// pauses while selected — keeping it framed for the camera).
const RADIUS = 8
const BASE_ANGLE = 2.3
const SPEED = 0.05
const Y = 2.4

// A small cluster of "captured moments" — mini stars in warm/cool photo tones.
const MEMBERS: { pos: [number, number, number]; color: string; scale: number }[] = [
  { pos: [0, 0, 0], color: '#fda4af', scale: 0.7 },
  { pos: [0.55, 0.3, -0.2], color: '#67e8f9', scale: 0.5 },
  { pos: [-0.5, -0.15, 0.3], color: '#f0abfc', scale: 0.5 },
  { pos: [0.2, 0.55, 0.35], color: '#ffffff', scale: 0.4 },
  { pos: [-0.55, 0.35, -0.3], color: '#fbcfe8', scale: 0.42 },
  { pos: [0.45, -0.45, 0.15], color: '#a5f3fc', scale: 0.45 },
  { pos: [-0.2, -0.5, -0.45], color: '#ffffff', scale: 0.34 },
]

/**
 * The wildlife-photography hobby as a small, orbiting star cluster with a soft
 * colored haze — distinct from the career stars, but consistent with the star
 * aesthetic. Click to open the gallery.
 */
export function PhotoCluster() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  const select = useStore((s) => s.select)
  const setHovered = useStore((s) => s.setHovered)
  const isHovered = useStore((s) => s.hoveredId) === PHOTOS_ID
  const reducedMotion = useStore((s) => s.reducedMotion)

  const starTex = getStarTexture()
  const haze = getCircleTexture()

  const initial: [number, number, number] = [
    Math.cos(BASE_ANGLE) * RADIUS,
    Y,
    Math.sin(BASE_ANGLE) * RADIUS,
  ]

  useFrame((_, delta) => {
    const a = BASE_ANGLE - SPEED * orbitClock.t
    const pos: [number, number, number] = [Math.cos(a) * RADIUS, Y, Math.sin(a) * RADIUS]
    if (groupRef.current) groupRef.current.position.set(pos[0], pos[1], pos[2])
    starPositions.set(PHOTOS_ID, pos)
    if (innerRef.current && !reducedMotion) innerRef.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={groupRef} position={initial}>
      <group ref={innerRef}>
        {/* soft colored haze (two tones) */}
        <sprite scale={[3, 3, 1]}>
          <spriteMaterial map={haze} color="#f472b6" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
        <sprite scale={[2.2, 2.2, 1]}>
          <spriteMaterial map={haze} color="#22d3ee" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>

        {/* mini stars = captured moments */}
        {MEMBERS.map((m, i) => (
          <sprite key={i} position={m.pos} scale={[m.scale, m.scale, 1]}>
            <spriteMaterial map={starTex} color={m.color} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
        ))}
      </group>

      {/* invisible click target */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          select(PHOTOS_ID)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(PHOTOS_ID)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {isHovered && (
        <Html position={[0, 1.7, 0]} center distanceFactor={13} pointerEvents="none" zIndexRange={[20, 0]}>
          <div className="pointer-events-none w-max select-none rounded-md border border-white/15 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            📷 Wildlife Photography
          </div>
        </Html>
      )}
    </group>
  )
}
