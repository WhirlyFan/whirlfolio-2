import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { GALAXY } from '@/scene/constants'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute vec3 aColor;

  varying vec3 vColor;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // GPU rotation: spin around Y, faster near the core (the "whirl").
    // Sign is negative so the dust rotates the SAME direction as the career-star
    // group (whose rotation.y increases → clockwise from above).
    float dist = length(modelPosition.xz);
    float angle = atan(modelPosition.z, modelPosition.x);
    angle -= (1.0 / (dist + 0.4)) * uTime * 0.22;
    modelPosition.x = cos(angle) * dist;
    modelPosition.z = sin(angle) * dist;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Reimplement size + sizeAttenuation (ShaderMaterial has neither).
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = aColor;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    // Soft round point (radial falloff).
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.0, 0.5, d);
    strength = pow(strength, 1.6);
    gl_FragColor = vec4(vColor, strength);
  }
`

export function GalaxyArms() {
  const quality = useStore((s) => s.quality)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const { geometry, material } = useMemo(() => {
    const count = quality === 'high' ? 7000 : 2800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    const inside = new THREE.Color(GALAXY.insideColor)
    const outside = new THREE.Color(GALAXY.outsideColor)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // sqrt → even areal density across the disk (no dense clump at the center,
      // which otherwise stretches into an unnatural vertical column).
      const radius = Math.sqrt(Math.random()) * GALAXY.radius
      const branch = ((i % GALAXY.branches) / GALAXY.branches) * Math.PI * 2
      const spin = radius * GALAXY.spin

      const rand = () =>
        Math.pow(Math.random(), GALAXY.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        GALAXY.randomness *
        radius

      const angle = branch + spin
      // Vertical thickness: gently thicker toward the core, thinning to the rim.
      // Sized to cover the career stars' vertical range so they sit inside the swirl.
      const yspread = 1.6 + (1 - radius / GALAXY.radius) * 2.6
      const y = Math.pow(Math.random(), 1.5) * (Math.random() < 0.5 ? 1 : -1) * yspread

      positions[i3] = Math.cos(angle) * radius + rand()
      positions[i3 + 1] = y
      positions[i3 + 2] = Math.sin(angle) * radius + rand()

      color.copy(inside).lerp(outside, radius / GALAXY.radius)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      scales[i] = 0.4 + Math.random() * 0.9
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 22 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [quality])

  // Dispose GPU resources when regenerated or unmounted (useMemo doesn't auto-dispose).
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((_, delta) => {
    if (!reducedMotion) {
      material.uniforms.uTime.value += delta
    }
  })

  return <points geometry={geometry} material={material} />
}
