export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt))
export const smooth = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}
export const smoothRange = (a: number, b: number, v: number) => smooth((v - a) / (b - a))
