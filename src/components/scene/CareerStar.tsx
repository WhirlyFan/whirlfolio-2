import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { typeLabel } from '@/content'
import { useStore } from '@/store/useStore'
import { orbitClock, starPositions, starWorldPos, type PlacedNode } from '@/scene/layout'
import { getCircleTexture, getStarTexture } from '@/scene/textures'

export function CareerStar({ placed, phase }: { placed: PlacedNode; phase: number }) {
  const { node, color } = placed
  const groupRef = useRef<THREE.Group>(null)
  const scaleRef = useRef<THREE.Group>(null)
  const closeTimer = useRef<number | null>(null)
  const starTex = getStarTexture()
  const coreTex = getCircleTexture()

  const select = useStore((s) => s.select)
  const setHovered = useStore((s) => s.setHovered)
  const selectedId = useStore((s) => s.selectedId)
  const hoveredId = useStore((s) => s.hoveredId)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const isSelected = selectedId === node.id
  const isHovered = hoveredId === node.id
  const active = isSelected || isHovered

  // Debounced hover so moving the cursor onto the floating label doesn't flicker.
  const openHover = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setHovered(node.id)
    document.body.style.cursor = 'pointer'
  }
  const scheduleClose = () => {
    document.body.style.cursor = 'default'
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      if (useStore.getState().hoveredId === node.id) setHovered(null)
      closeTimer.current = null
    }, 140)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const initial = starWorldPos(placed, 0)

  useFrame((state, delta) => {
    // Follow this star's own orbit and publish its live world position.
    const pos = starWorldPos(placed, orbitClock.t)
    if (groupRef.current) groupRef.current.position.set(pos[0], pos[1], pos[2])
    starPositions.set(node.id, pos)

    if (scaleRef.current) {
      const t = reducedMotion ? 0 : state.clock.elapsedTime
      const twinkle = 1 + Math.sin(t * 2 + phase) * 0.1
      const target = (active ? 1.55 : 1) * twinkle
      const s = THREE.MathUtils.damp(scaleRef.current.scale.x, target, 9, delta)
      scaleRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} position={initial}>
      {/* Star sprites (billboarded). No pointer handlers — the hit sphere owns it. */}
      <group ref={scaleRef}>
        {/* tinted glow + diffraction spikes */}
        <sprite scale={[2.1, 2.1, 1]}>
          <spriteMaterial
            map={starTex}
            color={color}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
        {/* white-hot core */}
        <sprite scale={[0.6, 0.6, 1]}>
          <spriteMaterial
            map={coreTex}
            color="#ffffff"
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      </group>

      {/* Larger invisible hit area for reliable hovering/clicking. */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          select(node.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          openHover()
        }}
        onPointerOut={scheduleClose}
      >
        <sphereGeometry args={[0.95, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {active && (
        <Html position={[0, 0.62, 0]} center distanceFactor={12} zIndexRange={[20, 0]}>
          <div
            onPointerEnter={openHover}
            onPointerLeave={scheduleClose}
            onClick={() => select(node.id)}
            className="w-max max-w-[200px] cursor-pointer select-none rounded-md border border-white/15 bg-black/70 px-2.5 py-1.5 text-center backdrop-blur-sm"
          >
            <p className="text-xs font-semibold text-white">{node.title}</p>
            <p className="text-[10px] text-white/60">{node.org || typeLabel[node.type]}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
