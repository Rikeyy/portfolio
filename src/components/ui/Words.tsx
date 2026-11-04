import { Fragment } from 'react'

/** Splits text into masked words so GSAP can reveal them with a stagger. Screen readers get the full string. */
export default function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="word" aria-hidden="true">
            <span className="word__in">{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </span>
  )
}
