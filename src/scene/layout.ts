import { allNodes, typeColor } from '@/content'
import { GALAXY } from './constants'

export interface PlacedNode {
  node: (typeof allNodes)[number]
  radius: number
  baseAngle: number
  y: number
  /** Angular speed in rad/s (faster near the core, like the dust). */
  speed: number
  color: string
}

/** Shared orbit clock — advances only when nothing is selected (and motion is on),
 *  so the selected star stays framed while the camera flies to it. */
export const orbitClock = { t: 0 }

/** Each star's CURRENT world position, written every frame. The camera reads this
 *  to fly to a star's live position (stars move independently). */
export const starPositions = new Map<string, [number, number, number]>()

/** Deterministic PRNG so orbits are stable across renders/HMR. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Give each career node its own orbit: an even-ish starting angle (with jitter),
 * a random radius and height, and a radius-dependent speed. Because radii differ,
 * orbital periods are incommensurate — so the stars only rarely line up.
 */
export function computeLayout(): PlacedNode[] {
  const rnd = mulberry32(20260616)
  const n = allNodes.length
  const minR = 3.5
  const maxR = GALAXY.radius - 1

  return allNodes.map((node, i) => {
    // Draw all rnd() values up front so the sequence stays deterministic even
    // when we override a node's placement below.
    const aJit = (rnd() - 0.5) * 1.4
    const rRand = rnd()
    const yRand = rnd()
    const sRand = rnd()

    let baseAngle = (i / n) * Math.PI * 2 + aJit
    let radius = minR + rRand * (maxR - minR)
    let y = (yRand - 0.5) * 2 * (1.6 + (1 - radius / GALAXY.radius) * 2.6)

    // Current role starts dead-center-front (toward the camera) so it's the
    // most prominent first click on load.
    if (node.id === 'usul') {
      baseAngle = Math.PI / 2
      radius = 5.5
      y = 0.6
    }

    // Faster near the core; all slow. Tiny per-star jitter further desyncs them.
    const speed = (0.5 / (radius + 2)) * (0.85 + sRand * 0.3)
    return {
      node,
      radius,
      baseAngle,
      y,
      speed,
      color: node.color ?? typeColor[node.type],
    }
  })
}

/** World position of a star at orbit time t. Angle decreases so it matches the
 *  dust swirl's rotation direction. */
export function starWorldPos(p: PlacedNode, t: number): [number, number, number] {
  const a = p.baseAngle - p.speed * t
  return [Math.cos(a) * p.radius, p.y, Math.sin(a) * p.radius]
}

/** Live world position of a star by id (for camera fly-to). */
export function selectedStarPosition(id: string | null): [number, number, number] | null {
  if (!id) return null
  return starPositions.get(id) ?? null
}
