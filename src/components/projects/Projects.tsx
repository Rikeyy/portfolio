import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../ui/SectionLabel'
import Words from '../ui/Words'
import Mockup from './Mockup'
import { PROJECTS } from '../../data/projects'
import { gsap } from '../../lib/smooth'
import { getQuality } from '../../lib/device'
import { openCase } from '../../lib/route'
import { scroll } from '../../lib/scroll'
import { ui } from '../../lib/store'

export default function Projects() {
  const root = useRef<HTMLElement>(null)

  // per-project entrance (staggered type, tech labels flying in)
  useEffect(() => {
    if (getQuality().reduced || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project').forEach((p) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top 65%', once: true } })
        tl.from(p.querySelector('.project__num'), { opacity: 0, x: -40, duration: 1, ease: 'power3.out' })
          .from(p.querySelectorAll('.project__title .word__in'), { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.06 }, 0.1)
          .from(p.querySelectorAll('.project__cat, .project__desc, .project__cta'), { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.3)
          .from(p.querySelectorAll('.chips li'), { opacity: 0, y: 18, scale: 0.9, duration: 0.7, stagger: 0.06, ease: 'back.out(1.7)' }, 0.55)
          .from(p.querySelector('.mockup'), { opacity: 0, y: 80, rotateX: 18, duration: 1.4, ease: 'power4.out' }, 0.2)
        gsap.to(p.querySelector('.mockup-wrap'), {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // keep UI state in sync with the project in view (for the 3D scene + progress rail)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      ui.set({ project: Math.round(scroll.projectF) })
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(tick)
    })
    if (root.current) io.observe(root.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="work" ref={root} className="work" aria-labelledby="work-title">
      <div className="wrap work__head">
        <SectionLabel num="03">SELECTED WORK</SectionLabel>
        <h2 id="work-title" className="display" data-reveal="words">
          <Words text="SELECTED PROJECTS." />
        </h2>
        <p className="lede" data-reveal="fade">
          Real-world project themes. Each opens a short case study — high-level by design, with no confidential data.
        </p>
      </div>

      {PROJECTS.map((p) => (
        <article key={p.slug} className="project" data-project aria-labelledby={`t-${p.slug}`}>
          <div className="wrap project__grid">
            <div className="project__copy">
              <span className="project__num mono" aria-hidden="true">
                {p.index}
              </span>
              <p className="project__cat mono">{p.category}</p>
              <h3 id={`t-${p.slug}`} className="project__title">
                <Words text={p.title.toUpperCase()} />
              </h3>
              <p className="project__desc">{p.description}</p>
              <ul className="chips" aria-label="Technology">
                {p.tech.map((t) => (
                  <li key={t} className="mono">
                    {t}
                  </li>
                ))}
              </ul>
              <a className="project__cta mono" href={`#/work/${p.slug}`} onClick={(e) => (e.preventDefault(), openCase(p.slug))} data-cursor>
                VIEW CASE STUDY <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="mockup-wrap">
              <button type="button" className="mockup-btn" onClick={() => openCase(p.slug)} aria-label={`Open case study: ${p.title}`}>
                <Mockup kind={p.mockup} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
