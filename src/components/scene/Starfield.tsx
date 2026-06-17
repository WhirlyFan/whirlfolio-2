import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { getCircleTexture } from '@/scene/textures'

/**
 * Deep-space backdrop. Points sit on a sphere that re-centers on the camera each
 * frame (an infinitely-distant skybox), and the material uses sizeAttenuation:
 * false so stars keep a constant on-screen size at any zoom. Together that means
 * the background never parallaxes, scales, fades to tiny, or leaves a void — and
 * the galaxy (at the origin) always renders in front of it.
 */
export function Starfield() {
  const groupRef = useRef<THREE.Group>(null)
  const quality = useStore((s) => s.quality)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const { geometry, material } = useMemo(() => {
    const count = quality === 'high' ? 4500 : 2000
    const R = 80
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const col = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // uniform direction on the sphere
      const u = Math.random() * 2 - 1
      const a = Math.random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      positions[i3] = Math.cos(a) * s * R
      positions[i3 + 1] = u * R
      positions[i3 + 2] = Math.sin(a) * s * R
      // brightness variation + faint blue/warm tint
      const b = 0.6 + Math.random() * 0.4
      const t = Math.random()
      col.setRGB(b * (0.85 + 0.15 * t), b * 0.92, b * (0.95 + 0.05 * (1 - t)))
      colors[i3] = col.r
      colors[i3 + 1] = col.g
      colors[i3 + 2] = col.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 4.5,
      sizeAttenuation: false, // constant on-screen size → true skybox feel
      map: getCircleTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [quality])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.copy(state.camera.position)
    if (!reducedMotion) groupRef.current.rotation.y += delta * 0.004
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} />
    </group>
  )
}
