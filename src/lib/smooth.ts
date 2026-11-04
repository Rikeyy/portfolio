import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null

export function initSmoothScroll(reduced: boolean) {
  if (reduced) return () => undefined
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: false })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: immediate ? 0 : 1.6, immediate, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
}

export function lockScroll(lock: boolean) {
  if (lock) lenis?.stop()
  else lenis?.start()
  document.documentElement.classList.toggle('scroll-locked', lock)
}

export { gsap, ScrollTrigger }
