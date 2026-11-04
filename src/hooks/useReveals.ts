import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../lib/smooth'
import { getQuality } from '../lib/device'

/**
 * Scroll-triggered reveals for any `[data-reveal]` inside the scope:
 *   data-reveal="words" → staggered masked word rise
 *   data-reveal="fade"  → fade + rise
 *   data-reveal="mask"  → clip-path wipe
 * Everything is created inside a gsap.context so it cleans up on unmount.
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!scope.current || getQuality().reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const type = el.dataset.reveal
        const st = { trigger: el, start: 'top 90%', once: true }
        if (type === 'words') {
          gsap.from(el.querySelectorAll('.word__in'), { yPercent: 115, rotate: 4, duration: 1.1, ease: 'power4.out', stagger: 0.045, scrollTrigger: st })
        } else if (type === 'mask') {
          gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: st })
        } else {
          gsap.from(el, { opacity: 0, y: 28, duration: 1, ease: 'power3.out', delay: Number(el.dataset.delay ?? 0), scrollTrigger: st })
        }
      })
    }, scope)
    const r = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(r)
      ctx.revert()
    }
  }, [scope])
}
