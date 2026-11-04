import SectionLabel from '../ui/SectionLabel'
import Words from '../ui/Words'
import { SKILL_GROUPS } from '../../data/skills'
import { ui, useUI } from '../../lib/store'

export default function Expertise() {
  const cat = useUI((s) => s.category)
  return (
    <section id="expertise" className="section expertise" aria-labelledby="exp-title">
      <div className="wrap expertise__grid">
        <div className="expertise__intro">
          <SectionLabel num="02">EXPERTISE</SectionLabel>
          <h2 id="exp-title" className="display" data-reveal="words">
            <Words text="MY TECHNICAL UNIVERSE." />
          </h2>
          <p className="lede" data-reveal="fade">
            Four disciplines, one connected system. Hover or tap a discipline to light up its constellation.
          </p>
        </div>

        <div className="expertise__space" aria-hidden="true" />

        <div className="groups">
          {SKILL_GROUPS.map((g, i) => (
            <div
              key={g.id}
              className="group"
              data-active={cat === g.id}
              style={{ ['--c' as string]: g.color }}
              onMouseEnter={() => ui.set({ category: g.id })}
              onMouseLeave={() => ui.set({ category: null })}
              data-reveal="fade"
            >
              <button
                type="button"
                className="group__head"
                aria-pressed={cat === g.id}
                onFocus={() => ui.set({ category: g.id })}
                onBlur={() => ui.set({ category: null })}
                onClick={() => ui.set({ category: cat === g.id ? null : g.id })}
              >
                <span className="mono">0{i + 1}</span>
                <h3>{g.title}</h3>
              </button>
              <p className="group__tag">{g.tagline}</p>
              <ul>
                {g.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
