import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/smooth'
import { getQuality } from '../../lib/device'

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const q = getQuality()
    if (!q.fine || q.reduced || !ring.current) return
    const el = ring.current
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      el.style.opacity = '1'
      x(e.clientX)
      y(e.clientY)
      const t = e.target as HTMLElement | null
      el.classList.toggle('is-link', !!t?.closest('a, button, [data-cursor], input, textarea, summary'))
    }
    const leave = () => (el.style.opacity = '0')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  return <div ref={ring} className="cursor" aria-hidden="true" />
}
