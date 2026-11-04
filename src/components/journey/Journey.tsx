import { useEffect, useRef } from 'react'
import SectionLabel from '../ui/SectionLabel'
import Words from '../ui/Words'
import { gsap } from '../../lib/smooth'
import { getQuality } from '../../lib/device'

const MILESTONES = [
  {
    marker: '2023',
    count: 2023,
    when: 'AUGUST 2023 — FEBRUARY 2024',
    title: 'FINEXUS',
    body: 'Backend Developer Intern. My first professional engineering experience, building backend services.',
  },
  {
    marker: '2024',
    count: 2024,
    when: 'AUGUST 2024 — FEBRUARY 2025',
    title: 'SILVERLAKE AXIS SDN BHD',
    body: 'Backend Developer working on enterprise systems.',
  },
  {
    marker: 'NOW',
    count: 0,
    when: 'CURRENT ROLE',
    title: 'SELANGKAH VENTURES',
    body: 'Started as a Backend Developer, grew into Full Stack Developer, and now Head of Engineering — leading the team behind digital healthcare platforms, enterprise systems and public-sector solutions.',
  },
  {
    marker: 'NEXT',
    count: 0,
    when: 'CURRENT FOCUS',
    title: 'FOCUS',
    body: 'Full-stack engineering, enterprise systems, healthcare technology and interactive digital experiences.',
  },
]

export default function Journey() {
  const root = useRef<HTMLElement>(null)
  const line = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = getQuality().reduced
    if (!root.current) return
    if (reduced) {
      if (line.current) line.current.style.transform = 'scaleY(1)'
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      gsap.utils.toArray<HTMLElement>('.milestone').forEach((m) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 72%', once: true } })
        tl.from(m.querySelector('.milestone__node'), { scale: 0, duration: 0.7, ease: 'back.out(3)' })
          .from(m.querySelectorAll('.milestone__when, .milestone__title, .milestone__body'), { opacity: 0, y: 30, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.1)
          .from(m.querySelector('.milestone__marker'), { opacity: 0, x: -50, duration: 1.1, ease: 'power3.out' }, 0)
        const counter = m.querySelector<HTMLElement>('[data-count]')
        if (counter) {
          const to = Number(counter.dataset.count)
          const o = { v: to - 24 }
          tl.to(o, { v: to, duration: 1.4, ease: 'power3.out', onUpdate: () => (counter.textContent = String(Math.round(o.v))) }, 0)
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" ref={root} className="section journey" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionLabel num="04">PROFESSIONAL JOURNEY</SectionLabel>
        <h2 id="journey-title" className="display" data-reveal="words">
          <Words text="THE JOURNEY." />
        </h2>

        <ol className="timeline">
          <div className="timeline__rail" aria-hidden="true">
            <div ref={line} className="timeline__line" />
          </div>
          {MILESTONES.map((m) => (
            <li key={m.title} className="milestone">
              <span className="milestone__marker display-outline" aria-hidden="true">
                <span data-count={m.count || undefined}>{m.marker}</span>
              </span>
              <span className="milestone__node" aria-hidden="true" />
              <div className="milestone__card">
                <p className="milestone__when mono">{m.when}</p>
                <h3 className="milestone__title">{m.title}</h3>
                <p className="milestone__body">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
