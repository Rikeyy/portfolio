import { useUI } from '../../lib/store'
import SectionLabel from '../ui/SectionLabel'

const STEPS = [
  { n: '01', word: 'THINK', line: 'Understand the problem before designing the solution.' },
  { n: '02', word: 'ENGINEER', line: 'Build scalable, reliable and maintainable systems.' },
  { n: '03', word: 'CREATE', line: 'Turn complex technology into meaningful experiences.' },
]

export default function Philosophy() {
  const step = useUI((s) => s.step)

  return (
    <section id="philosophy" className="philosophy" aria-labelledby="phil-title">
      <h2 id="phil-title" className="sr-only">
        Think. Engineer. Create.
      </h2>
      <div className="philosophy__sticky">
        <div className="wrap philosophy__inner">
          <SectionLabel num="05">ENGINEERING PHILOSOPHY</SectionLabel>
          <div className="philosophy__stage">
            {STEPS.map((s, i) => (
              <div key={s.word} className="principle" data-active={step === i} data-i={i}>
                <span className="principle__n mono">{s.n}</span>
                <p className="principle__word" aria-label={s.word}>
                  {s.word.split('').map((c, k) => (
                    <span key={k} aria-hidden="true" style={{ ['--k' as string]: k }}>
                      {c}
                    </span>
                  ))}
                </p>
                <p className="principle__line">{s.line}</p>
              </div>
            ))}
          </div>
          <ol className="philosophy__rail mono" aria-label="Principles">
            {STEPS.map((s, i) => (
              <li key={s.n} data-active={step === i}>
                <i />
                {s.n}
              </li>
            ))}
          </ol>
          <p className="philosophy__title mono">THINK. ENGINEER. CREATE.</p>
        </div>
      </div>
    </section>
  )
}
