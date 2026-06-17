import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

interface Trajectory {
  start: THREE.Vector3
  velocity: THREE.Vector3
  duration: number
}

function randomTrajectory(): Trajectory {
  const R = 55
  // a random point on a sphere
  const u = Math.random() * 2 - 1
  const a = Math.random() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  const start = new THREE.Vector3(Math.cos(a) * s * R, u * R * 0.6 + 8, Math.sin(a) * s * R)
  // velocity roughly across the view (tangent-ish), random
  const velocity = new THREE.Vector3(
    Math.random() * 2 - 1,
    (Math.random() * 2 - 1) * 0.3,
    Math.random() * 2 - 1,
  )
    .normalize()
    .multiplyScalar(38 + Math.random() * 26)
  return { start, velocity, duration: 1.0 + Math.random() * 0.5 }
}

function Meteor({ index }: { index: number }) {
  const headRef = useRef<THREE.Mesh>(null)
  const traj = useRef<Trajectory>(randomTrajectory())
  const tRef = useRef(0)
  const waitRef = useRef(3 + index * 5 + Math.random() * 6) // initial stagger
  const [flying, setFlying] = useState(false)
  const [cycle, setCycle] = useState(0)

  useFrame((_, delta) => {
    if (!flying) {
      waitRef.current -= delta
      if (waitRef.current <= 0) {
        traj.current = randomTrajectory()
        tRef.current = 0
        if (headRef.current) headRef.current.position.copy(traj.current.start)
        setFlying(true)
        setCycle((c) => c + 1)
      }
      return
    }
    tRef.current += delta
    const { start, velocity, duration } = traj.current
    if (headRef.current) headRef.current.position.copy(start).addScaledVector(velocity, tRef.current)
    if (tRef.current >= duration) {
      setFlying(false)
      waitRef.current = 8 + Math.random() * 14
    }
  })

  return (
    <>
      {flying && (
        <Trail
          key={cycle}
          target={headRef as unknown as RefObject<THREE.Object3D>}
          width={1.5}
          length={7}
          color="#cfe8ff"
          decay={1.3}
          attenuation={(w) => w * w}
        />
      )}
      <mesh ref={headRef} visible={flying}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#eaf6ff" toneMapped={false} />
      </mesh>
    </>
  )
}

/** A few ambient meteors that occasionally streak across the background. */
export function Meteors() {
  const quality = useStore((s) => s.quality)
  const reducedMotion = useStore((s) => s.reducedMotion)
  if (reducedMotion) return null
  const n = quality === 'high' ? 3 : 1
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <Meteor key={i} index={i} />
      ))}
    </>
  )
}
