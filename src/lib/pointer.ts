/** Normalised (-1..1) pointer position, shared by the 3D scene and DOM effects. */
export const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false }

let installed = false
export function installPointer() {
  if (installed) return
  installed = true
  const onMove = (e: PointerEvent) => {
    pointer.px = e.clientX
    pointer.py = e.clientY
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    pointer.moved = true
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
}
