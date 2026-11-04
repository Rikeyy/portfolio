import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/smooth'
import { intro, ui, useUI } from '../../lib/store'
import { getQuality } from '../../lib/device'

/** Black screen → red light → portrait dissolve → typography. */
export default function Loader() {
  const ready = useUI((s) => s.ready)
  const root = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)
  const started = useRef(false)

  // fake-but-honest progress: eases toward 90% until the scene reports ready
  useEffect(() => {
    let p = 0
    const id = window.setInterval(() => {
      p += (90 - p) * 0.06
      if (!ui.get().ready) setPct(Math.round(p))
    }, 80)
    const failsafe = window.setTimeout(() => ui.set({ ready: true }), 9000)
    return () => {
      clearInterval(id)
      clearTimeout(failsafe)
    }
  }, [])

  useEffect(() => {
    if (!ready || started.current) return
    started.current = true
    setPct(100)
    const reduced = getQuality().reduced
    const finish = () => {
      setGone(true)
      ui.set({ introDone: true })
      document.documentElement.classList.add('intro-done')
    }
    if (reduced) {
      intro.light = 1
      intro.reveal = 1
      finish()
      return
    }
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(root.current!.querySelector('.loader__inner'), { opacity: 0, duration: 0.4, delay: 0.25 })
      .to(intro, { light: 1, duration: 1.8, ease: 'power2.inOut' }, 0.5)
      .to(root.current, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.9)
      .to(intro, { reveal: 1, duration: 2.2, ease: 'power2.inOut' }, 1.2)
      .add(() => document.documentElement.classList.add('intro-text'), 1.9)
    return () => {
      tl.kill()
    }
  }, [ready])

  if (gone) return null
  return (
    <div ref={root} className="loader" role="status" aria-live="polite">
      <div className="loader__inner">
        <span className="mono loader__pct">{String(pct).padStart(3, '0')}</span>
        <span className="mono loader__label">LOADING EXPERIENCE</span>
        <span className="loader__bar">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </span>
      </div>
    </div>
  )
}
