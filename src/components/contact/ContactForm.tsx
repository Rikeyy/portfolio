import { useState, type FormEvent } from 'react'
import { site } from '../../data/site'
import Button from '../ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured' | 'mailto'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.company) return // honeypot

    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
        form.reset()
      } catch {
        setStatus('error')
      }
    } else if (site.email) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`
      setStatus('mailto')
    } else {
      // Nothing is configured: be honest instead of pretending the message was sent.
      setStatus('unconfigured')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false} aria-describedby="form-status">
      <div className="field">
        <label htmlFor="cf-name" className="mono">NAME</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="cf-email" className="mono">EMAIL</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field field--full">
        <label htmlFor="cf-subject" className="mono">SUBJECT</label>
        <input id="cf-subject" name="subject" type="text" required minLength={3} />
      </div>
      <div className="field field--full">
        <label htmlFor="cf-message" className="mono">MESSAGE</label>
        <textarea id="cf-message" name="message" rows={5} required minLength={10} />
      </div>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form__actions">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}
        </Button>
        <p id="form-status" className={`form__status mono is-${status}`} role="status" aria-live="polite">
          {status === 'sent' && 'Message sent. Thank you — I will be in touch.'}
          {status === 'error' && 'Something went wrong sending your message. Please try again or use email.'}
          {status === 'mailto' && 'Opening your email app with the message pre-filled.'}
          {status === 'unconfigured' && 'This form is not connected to a mail service yet, so nothing was sent. Please use the email, LinkedIn or GitHub buttons.'}
        </p>
      </div>
    </form>
  )
}
