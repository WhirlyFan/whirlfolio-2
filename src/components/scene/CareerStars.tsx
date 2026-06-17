import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import { orbitClock, type PlacedNode } from '@/scene/layout'
import { CareerStar } from './CareerStar'

/**
 * Advances the shared orbit clock that all career stars read. Each star moves on
 * its own orbit (see CareerStar); the clock just pauses while a node is selected
 * (so the camera keeps it framed) and freezes under reduced motion.
 */
export function CareerStars({ placed }: { placed: PlacedNode[] }) {
  const selectedId = useStore((s) => s.selectedId)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useFrame((_, delta) => {
    if (!reducedMotion && selectedId === null) {
      orbitClock.t += delta
    }
  })

  return (
    <>
      {placed.map((p, i) => (
        <CareerStar key={p.node.id} placed={p} phase={i * 1.7} />
      ))}
    </>
  )
}
