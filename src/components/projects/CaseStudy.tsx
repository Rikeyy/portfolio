import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Mockup from './Mockup'
import { PROJECTS } from '../../data/projects'
import { closeCase, openCase } from '../../lib/route'
import { gsap, lockScroll } from '../../lib/smooth'
import { useUI } from '../../lib/store'
import { getQuality } from '../../lib/device'

export default function CaseStudy() {
  const slug = useUI((s) => s.caseStudy)
  const root = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const idx = PROJECTS.findIndex((p) => p.slug === slug)
  const live = PROJECTS[idx]
  const lastRef = useRef(live)
  if (live) lastRef.current = live
  const p = live ?? lastRef.current

  useEffect(() => {
    if (!slug) return
    opener.current ??= document.activeElement as HTMLElement
    lockScroll(true)
    scroller.current?.scrollTo(0, 0)
    root.current?.querySelector<HTMLElement>('.case__close')?.focus()
    if (!getQuality().reduced && root.current) {
      const ctx = gsap.context(() => {
        gsap.from('.case [data-in]', { opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.25 })
      }, root)
      return () => ctx.revert()
    }
  }, [slug])

  useEffect(() => {
    if (!slug) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCase()
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slug])

  useEffect(() => {
    if (slug) return
    lockScroll(false)
    opener.current?.focus?.()
    opener.current = null
  }, [slug])

  const next = PROJECTS[(idx + 1) % PROJECTS.length]
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length]

  return (
    <div ref={root} className="case" data-open={!!live} role="dialog" aria-modal="true" aria-label={p ? `Case study: ${p.title}` : 'Case study'} aria-hidden={!live} inert={!live ? '' : undefined}>
      <div className="case__scroll" ref={scroller} data-lenis-prevent>
        {p && (
          <div className="wrap case__inner">
            <button type="button" className="case__close mono" onClick={closeCase}>
              <X size={16} aria-hidden="true" /> CLOSE
            </button>

            <header className="case__head">
              <p className="mono case__idx" data-in>
                {p.index} / 0{PROJECTS.length} — {p.category}
              </p>
              <h2 className="case__title" data-in>
                {p.title}
              </h2>
              <ul className="chips" data-in>
                {p.tech.map((t) => (
                  <li key={t} className="mono">
                    {t}
                  </li>
                ))}
              </ul>
            </header>

            <div className="case__hero" data-in>
              <Mockup kind={p.mockup} />
            </div>

            <div className="case__cols">
              <section data-in>
                <h3 className="mono">OVERVIEW</h3>
                <p className="case__lead">{p.overview}</p>
              </section>
              <section data-in>
                <h3 className="mono">THE PROBLEM</h3>
                <p>{p.problem}</p>
              </section>
              <section data-in>
                <h3 className="mono">THE SOLUTION</h3>
                <p>{p.solution}</p>
              </section>
            </div>

            <section className="case__arch" data-in>
              <h3 className="mono">ARCHITECTURE</h3>
              <ol>
                {p.architecture.map((a) => (
                  <li key={a.label}>
                    <span className="mono">{a.label}</span>
                    <b>{a.detail}</b>
                  </li>
                ))}
              </ol>
            </section>

            <div className="case__cols case__cols--two">
              <section data-in>
                <h3 className="mono">TECHNOLOGIES</h3>
                <ul className="chips">
                  {p.tech.map((t) => (
                    <li key={t} className="mono">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
              <section data-in>
                <h3 className="mono">MY CONTRIBUTION</h3>
                <ul className="case__list">
                  {p.contribution.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            </div>

            <p className="case__note mono" data-in>
              High-level summary. Confidential details, client data, metrics and real screenshots are intentionally omitted.
            </p>

            <nav className="case__pager" aria-label="Other case studies" data-in>
              <button type="button" onClick={() => openCase(prev.slug)}>
                <ArrowLeft size={18} aria-hidden="true" />
                <span className="mono">PREVIOUS</span>
                <b>{prev.title}</b>
              </button>
              <button type="button" onClick={() => openCase(next.slug)}>
                <span className="mono">NEXT</span>
                <b>{next.title}</b>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
