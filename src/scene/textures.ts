import * as THREE from 'three'

let circleTexture: THREE.CanvasTexture | null = null
let starTexture: THREE.CanvasTexture | null = null

/** A soft radial (white→transparent) sprite texture for round, glowy points. */
export function getCircleTexture(): THREE.CanvasTexture {
  if (circleTexture) return circleTexture
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  circleTexture = new THREE.CanvasTexture(canvas)
  return circleTexture
}

/**
 * A white star sprite: a soft radial glow plus diffraction spikes (4 long +
 * 4 short = an 8-point sparkle). Drawn in white so it can be tinted per node.
 */
export function getStarTexture(): THREE.CanvasTexture {
  if (starTexture) return starTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2
  ctx.clearRect(0, 0, size, size)
  ctx.globalCompositeOperation = 'lighter'

  // Soft radial glow
  const glow = ctx.createRadialGradient(c, c, 0, c, c, c)
  glow.addColorStop(0, 'rgba(255,255,255,0.95)')
  glow.addColorStop(0.16, 'rgba(255,255,255,0.5)')
  glow.addColorStop(0.45, 'rgba(255,255,255,0.08)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  // Diffraction spikes
  const spike = (angle: number, len: number, width: number, peak: number) => {
    ctx.save()
    ctx.translate(c, c)
    ctx.rotate(angle)
    const g = ctx.createLinearGradient(0, -len, 0, len)
    g.addColorStop(0, 'rgba(255,255,255,0)')
    g.addColorStop(0.5, `rgba(255,255,255,${peak})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(-width / 2, -len, width, len * 2)
    ctx.restore()
  }
  spike(0, c * 0.96, 4, 0.9) // vertical
  spike(Math.PI / 2, c * 0.96, 4, 0.9) // horizontal
  spike(Math.PI / 4, c * 0.5, 2.5, 0.4) // diagonals (shorter, dimmer)
  spike(-Math.PI / 4, c * 0.5, 2.5, 0.4)

  starTexture = new THREE.CanvasTexture(canvas)
  return starTexture
}
