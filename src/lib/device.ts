export interface Quality {
  mobile: boolean
  reduced: boolean
  dpr: number
  particles: number
  fine: boolean
}

export function getQuality(): Quality {
  const mobile = matchMedia('(max-width: 820px)').matches || matchMedia('(pointer: coarse)').matches
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const nav = navigator as Navigator & { deviceMemory?: number }
  const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4
  const dpr = Math.min(window.devicePixelRatio || 1, mobile || weak ? 1.25 : 1.75)
  return {
    mobile,
    reduced,
    dpr,
    particles: mobile ? 500 : weak ? 1100 : 2400,
    fine: matchMedia('(pointer: fine)').matches,
  }
}
