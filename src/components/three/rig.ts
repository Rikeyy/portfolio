export const SPACING = 24
export const FOV = 40

interface Key {
  /** camera offset relative to stage centre */
  p: [number, number, number]
  /** look-at offset relative to stage centre */
  l: [number, number, number]
  /** shift scene content to the right on wide screens (world units) */
  sx: number
}

export const KEYS: Key[] = [
  { p: [0, 0, 7.5], l: [0, 0, 0], sx: 0 },
  { p: [0, 0, 9], l: [0, 0, 0], sx: 0 },
  { p: [0, 0, 11], l: [0, 0, 0], sx: 3.1 },
  { p: [0, 0, 8.5], l: [0, 0, 0], sx: 1.4 },
  { p: [0, 0, 6], l: [0, 0, -6], sx: 0 },
  { p: [0, 0, 9], l: [0, 0, 0], sx: 2.8 },
  { p: [0, 0, 8], l: [0, 0, 0], sx: 0 },
]

export const stageY = (i: number) => -i * SPACING

/** Pull the camera back on narrow (portrait) viewports so the composition still fits. */
export const zScale = (aspect: number) => (aspect >= 1 ? 1 : 1 + (1 - aspect) * 0.85)

export function stageDistance(i: number, aspect: number) {
  const k = KEYS[i]
  const dz = k.p[2] - k.l[2]
  return Math.hypot(k.p[0] - k.l[0], k.p[1] - k.l[1], dz) * zScale(aspect)
}

export function viewSize(i: number, aspect: number) {
  const d = stageDistance(i, aspect)
  const h = 2 * d * Math.tan((FOV * Math.PI) / 360)
  return { h, w: h * aspect, d }
}
