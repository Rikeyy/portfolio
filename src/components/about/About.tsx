import { useEffect, useRef } from 'react'
import SectionLabel from '../ui/SectionLabel'
import Words from '../ui/Words'
import { gsap } from '../../lib/smooth'
import { getQuality } from '../../lib/device'

function PortraitCard() {
  const card = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const q = getQuality()
    const el = card.current
    if (!el || !q.fine || q.reduced) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 14)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
    }
    const leave = () => (rx(0), ry(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])
  return (
    <div className="portrait-card" ref={card} data-reveal="fade">
      <div className="portrait-card__float">
        <div className="portrait-card__frame">
          <img src="/images/rikey-cutout.webp" alt="Rikey Kurniawan, Full Stack Developer" loading="lazy" width={800} height={800} />
          <span className="portrait-card__tl mono">RK-01 / PORTRAIT</span>
          <span className="portrait-card__br mono">MY · FULL STACK</span>
          <i className="corner corner--tl" aria-hidden="true" />
          <i className="corner corner--br" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <PortraitCard />
        <div className="about__copy">
          <SectionLabel num="01">ABOUT</SectionLabel>
          <h2 id="about-title" className="display" data-reveal="words">
            <Words text="BEYOND THE CODE." />
          </h2>
          <p className="statement" data-reveal="fade">
            “I don't just write code. I engineer experiences, solve complex problems and build systems designed for real-world impact.”
          </p>
          <div className="about__bio">
            <p data-reveal="fade">
              I'm Rikey, a full stack developer based in Malaysia. I work on digital platforms across healthcare, enterprise systems and public-sector
              digital transformation, currently as Head of Engineering at Selangkah Ventures.
            </p>
            <p data-reveal="fade">
              I like owning the whole path — from database design and APIs to interface and motion — so product decisions stay coherent end to end.
            </p>
          </div>
          <dl className="about__facts">
            {[
              ['Philosophy', 'Understand the problem first. Choose the technology second.'],
              ['Approach', 'Ship in small, reliable steps. Keep architecture honest and maintainable.'],
              ['Curiosity', 'System architecture, scalability, and immersive, real-time interfaces.'],
            ].map(([t, d]) => (
              <div key={t} data-reveal="fade">
                <dt className="mono">{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
