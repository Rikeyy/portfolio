import { ArrowDown } from 'lucide-react'
import { site } from '../../data/site'
import Button from '../ui/Button'
import { scrollToId } from '../../lib/smooth'
import { useUI } from '../../lib/store'

const LINKS = [
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Email', href: site.email ? `mailto:${site.email}` : '' },
].filter((l) => l.href)

export default function Hero() {
  const failed = useUI((s) => s.webglFailed)
  return (
    <section id="hero" className="hero" aria-label="Introduction">
      {/* the interactive 3D portrait lives in the fixed canvas; this image is the accessible + no-WebGL fallback */}
      <img
        className={failed ? 'hero__fallback' : 'sr-only'}
        src="/images/rikey-cutout.webp"
        alt="Portrait of Rikey Kurniawan smiling, wearing an olive green shirt over a black tee"
        width={800}
        height={800}
        
      />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="wrap hero__inner">
        <div className="hero__top mono" data-intro>
          <span className="status">
            <i aria-hidden="true" /> AVAILABLE FOR COLLABORATION
          </span>
          <span className="hero__coords">{site.coords}</span>
        </div>

        <div className="hero__copy">
          <p className="eyebrow mono" data-intro>
            FULL STACK DEVELOPER / MALAYSIA
          </p>
          <h1 className="hero__title">
            <span className="sr-only">{site.name} — </span>
            <span className="line" aria-hidden="true"><span data-line>BUILDING DIGITAL</span></span>
            <span className="line" aria-hidden="true"><span data-line>EXPERIENCES</span></span>
            <span className="line" aria-hidden="true"><span data-line className="accent">THAT MATTER.</span></span>
          </h1>
          <p className="hero__desc" data-intro>
            I build scalable digital products, intelligent platforms and meaningful user experiences through engineering, creativity and technology.
          </p>
          <div className="hero__cta" data-intro>
            <Button href="#work" onClick={() => scrollToId('work')}>
              EXPLORE MY WORK
            </Button>
            <Button href="#contact" variant="ghost" onClick={() => scrollToId('contact')}>
              LET'S CONNECT
            </Button>
          </div>
        </div>

        <p className="hero__name" aria-hidden="true" data-intro>
          RIKEY KURNIAWAN
        </p>

        <div className="hero__bottom mono" data-intro>
          <ul className="hero__social" aria-label="Social links">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="scroll-cue" href="#about" onClick={(e) => (e.preventDefault(), scrollToId('about'))}>
            <span>SCROLL</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
