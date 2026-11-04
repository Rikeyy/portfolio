import type { MockupKind } from '../../data/projects'

const bars = [40, 62, 48, 80, 58, 90, 70]

function Chart() {
  return (
    <div className="mk-chart" aria-hidden="true">
      {bars.map((b, i) => (
        <i key={i} style={{ height: `${b}%` }} />
      ))}
    </div>
  )
}
const Rows = ({ n = 4 }: { n?: number }) => (
  <div className="mk-rows" aria-hidden="true">
    {Array.from({ length: n }, (_, i) => (
      <div key={i}>
        <i />
        <b style={{ width: `${70 - i * 9}%` }} />
        <u />
      </div>
    ))}
  </div>
)

function Body({ kind }: { kind: MockupKind }) {
  switch (kind) {
    case 'ecosystem':
      return (
        <div className="mk-body mk-split">
          <aside><i /><i /><i /><i /></aside>
          <div>
            <div className="mk-cards"><i /><i /><i /></div>
            <Chart />
            <Rows />
          </div>
        </div>
      )
    case 'nursing':
      return (
        <div className="mk-body mk-split">
          <aside className="wide"><Rows n={6} /></aside>
          <div>
            <div className="mk-avatar" />
            <div className="mk-lines"><b /><b /><b /></div>
            <div className="mk-timeline"><i /><i /><i /><i /></div>
          </div>
        </div>
      )
    case 'triage':
      return (
        <div className="mk-body">
          <div className="mk-steps"><i className="on" /><i className="on" /><i /><i /></div>
          <div className="mk-form"><b /><b /><b className="half" /><b className="half" /></div>
          <div className="mk-chips"><u className="r" /><u className="a" /><u className="g" /></div>
        </div>
      )
    case 'mobile':
      return (
        <div className="mk-body mk-phone">
          <div className="mk-device">
            <i className="mk-notch" />
            <div className="mk-wallet" />
            <div className="mk-quick"><i /><i /><i /><i /></div>
            <Rows n={3} />
          </div>
        </div>
      )
    case 'portal':
      return (
        <div className="mk-body mk-split">
          <div>
            <div className="mk-steps"><i className="on" /><i /><i /></div>
            <div className="mk-form"><b /><b /><b className="half" /></div>
          </div>
          <aside className="wide"><Rows n={5} /></aside>
        </div>
      )
  }
}

export default function Mockup({ kind }: { kind: MockupKind }) {
  return (
    <figure className="mockup" aria-label="Illustrative interface mockup">
      <div className="mockup__bar" aria-hidden="true">
        <i /><i /><i />
      </div>
      <Body kind={kind} />
      <figcaption className="mono">ILLUSTRATIVE MOCKUP — NOT A SCREENSHOT</figcaption>
    </figure>
  )
}
