import { lazy, Suspense, useEffect, useRef } from 'react'
import Navigation from './components/navigation/Navigation'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Expertise from './components/expertise/Expertise'
import Projects from './components/projects/Projects'
import CaseStudy from './components/projects/CaseStudy'
import Journey from './components/journey/Journey'
import Philosophy from './components/philosophy/Philosophy'
import Contact from './components/contact/Contact'
import Footer from './components/contact/Footer'
import Loader from './components/ui/Loader'
import Grain from './components/ui/Grain'
import Cursor from './components/ui/Cursor'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { useReveals } from './hooks/useReveals'
import { getQuality } from './lib/device'
import { installPointer } from './lib/pointer'
import { measure, scroll, update } from './lib/scroll'
import { syncFromLocation } from './lib/route'
import { initSmoothScroll, scrollToId, ScrollTrigger, gsap } from './lib/smooth'
import { intro, ui, useUI } from './lib/store'

const SceneCanvas = lazy(() => import('./components/three/SceneCanvas'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const main = useRef<HTMLElement>(null)
  const failed = useUI((s) => s.webglFailed)
  useReveals(main)

  useEffect(() => {
    installPointer()
    const q = getQuality()
    const stop = initSmoothScroll(q.reduced)
    if (!hasWebGL()) {
      ui.set({ webglFailed: true, ready: true })
    }
    if (q.reduced) {
      intro.light = 1
      intro.reveal = 1
    }

    const onScroll = () => {
      update(window.scrollY)
      ui.set({ active: scroll.active, step: Math.max(0, Math.min(2, Math.floor(scroll.stick[5] * 3 - 1e-6))) })
    }
    const remeasure = () => {
      measure()
      ScrollTrigger.refresh()
    }
    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    const ro = new ResizeObserver(() => measure())
    if (main.current) ro.observe(main.current)
    document.fonts?.ready.then(remeasure)
    window.addEventListener('load', remeasure)

    const onPop = () => syncFromLocation()
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    syncFromLocation()
    // deep link to a section
    const id = location.hash.slice(1)
    if (id && !id.startsWith('/')) setTimeout(() => scrollToId(id, true), 500)

    // staggered hero typography once the intro reaches the text beat
    const mo = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('intro-text')) return
      mo.disconnect()
      gsap.fromTo('.hero [data-line]', { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 })
      gsap.to('.hero [data-intro]', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.35 })
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    if (q.reduced) document.documentElement.classList.add('intro-text', 'intro-done')

    return () => {
      stop()
      mo.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('load', remeasure)
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Loader />
      <Grain />
      <Cursor />
      <Navigation />
      <div className={`scene${failed ? ' scene--static' : ''}`} aria-hidden="true">
        {!failed && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <SceneCanvas />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <main ref={main} id="main">
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Journey />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
      <CaseStudy />
    </>
  )
}
