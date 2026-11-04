import SectionLabel from '../ui/SectionLabel'
import Words from '../ui/Words'
import Button from '../ui/Button'
import ContactForm from './ContactForm'
import { site } from '../../data/site'
import { useUI } from '../../lib/store'

export default function Contact() {
  const failed = useUI((s) => s.webglFailed)
  const noLink = 'Not configured yet — set it in .env (see .env.example)'
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__copy">
          <SectionLabel num="06">CONTACT</SectionLabel>
          <h2 id="contact-title" className="display display--md" data-reveal="words">
            <Words text="LET'S BUILD SOMETHING EXTRAORDINARY." />
          </h2>
          <p className="lede" data-reveal="fade">
            Have an interesting project, an ambitious idea or an opportunity to collaborate?
          </p>
          <div className="contact__buttons" data-reveal="fade">
            <Button href={site.email ? `mailto:${site.email}` : undefined} disabled={!site.email} title={site.email ? undefined : noLink}>
              EMAIL ME
            </Button>
            <Button href={site.linkedin || undefined} external variant="ghost" disabled={!site.linkedin} title={site.linkedin ? undefined : noLink}>
              LINKEDIN
            </Button>
            <Button href={site.github || undefined} external variant="ghost" disabled={!site.github} title={site.github ? undefined : noLink}>
              GITHUB
            </Button>
          </div>
          <div data-reveal="fade">
            <ContactForm />
          </div>
        </div>
        <div className="contact__portrait" aria-hidden={!failed}>
          {failed && <img src="/images/rikey-cutout.webp" alt="Rikey Kurniawan" loading="lazy" width={800} height={800} />}
        </div>
      </div>
    </section>
  )
}
