import { useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV, site } from '../../data/site'
import { SECTION_IDS } from '../../lib/scroll'
import { lockScroll, scrollToId } from '../../lib/smooth'
import { ui, useUI } from '../../lib/store'

export function Monogram({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="none">
      <rect x="0.75" y="0.75" width="30.5" height="30.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M8 24V8h7.5a4.5 4.5 0 0 1 .6 8.96L22 24" stroke="#e50914" strokeWidth="2.2" />
      <path d="M17.5 8h6l-6.5 8 6.5 8" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  )
}

export default function Navigation() {
  const active = useUI((s) => s.active)
  const menu = useUI((s) => s.menu)
  const caseOpen = useUI((s) => s.caseStudy !== null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    lockScroll(menu)
    if (!menu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        ui.set({ menu: false })
        toggle.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    ui.set({ menu: false })
    // let the overlay release scroll lock before animating
    setTimeout(() => {
      scrollToId(id)
      history.replaceState(null, '', `#${id}`)
    }, menu ? 60 : 0)
  }

  const current = SECTION_IDS[active]
  return (
    <>
      <header className="nav" data-hidden={caseOpen}>
        <a href="#hero" className="nav__logo" onClick={go('hero')} aria-label={`${site.name} — back to top`}>
          <Monogram />
          <span className="mono nav__logo-text">RK</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={current === n.id ? 'is-active' : ''} aria-current={current === n.id ? 'true' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <button
          ref={toggle}
          className="nav__toggle"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => ui.set({ menu: !menu })}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <div id="mobile-menu" className="menu" data-open={menu} aria-hidden={!menu} inert={!menu ? '' : undefined}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} style={{ transitionDelay: menu ? `${0.12 + i * 0.06}s` : '0s' }}>
              <span className="mono">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <p className="mono menu__foot">
          {site.title} / {site.location}
        </p>
      </div>
    </>
  )
}
