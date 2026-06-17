import { useEffect, useRef } from 'react'
import type { ElementRef } from 'react'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { FUNFACTS_ID, PHOTOS_ID, PROFILE_ID } from '@/scene/constants'
import { selectedStarPosition } from '@/scene/layout'

const OVERVIEW: [number, number, number] = [0, 9, 15]

/**
 * Owns the camera. drei <CameraControls> (camera-controls v3) handles
 * drag/zoom/pinch; on selection we fly smoothly to the star's live position and
 * back to the overview on deselect.
 */
export function CameraRig() {
  const controls = useRef<ElementRef<typeof CameraControls>>(null)
  const selectedId = useStore((s) => s.selectedId)
  const cameraResetToken = useStore((s) => s.cameraResetToken)

  useEffect(() => {
    const c = controls.current
    if (!c) return

    // Comet is moving — open the panel but leave the camera where it is.
    if (selectedId === FUNFACTS_ID) return

    // Normalize trackpad pinch-zoom (camera.zoom) — setLookAt only resets
    // position/target, so without this a pinch-zoom would persist across resets.
    c.zoomTo(1, true)

    if (selectedId === PROFILE_ID) {
      c.setLookAt(0, 3.5, 8, 0, 0, 0, true)
      return
    }

    if (selectedId === PHOTOS_ID) {
      const p = selectedStarPosition(PHOTOS_ID)
      if (p) {
        const target = new THREE.Vector3(p[0], p[1], p[2])
        const radial = new THREE.Vector3(p[0], 0, p[2]).normalize()
        const cam = target
          .clone()
          .add(radial.multiplyScalar(4.5))
          .add(new THREE.Vector3(0, 2.5, 0))
        c.setLookAt(cam.x, cam.y, cam.z, target.x, target.y, target.z, true)
      } else {
        c.setLookAt(OVERVIEW[0], OVERVIEW[1], OVERVIEW[2], 0, 0, 0, true)
      }
      return
    }

    // The orbit clock is frozen while selected, so the star's live position is
    // stable for the duration of the flight.
    const p = selectedStarPosition(selectedId)
    if (p) {
      const target = new THREE.Vector3(p[0], p[1], p[2])
      const radial = new THREE.Vector3(p[0], 0, p[2]).normalize()
      const cam = target
        .clone()
        .add(radial.multiplyScalar(2.8))
        .add(new THREE.Vector3(0, 1.6, 0))
      c.setLookAt(cam.x, cam.y, cam.z, target.x, target.y, target.z, true)
    } else {
      c.setLookAt(OVERVIEW[0], OVERVIEW[1], OVERVIEW[2], 0, 0, 0, true)
    }
  }, [selectedId, cameraResetToken])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.5}
      draggingSmoothTime={0.18}
      minDistance={2.5}
      maxDistance={42}
      dollyToCursor
    />
  )
}
