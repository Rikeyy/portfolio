export default function SectionLabel({ num, children }: { num: string; children: string }) {
  return (
    <p className="section-label mono" data-reveal="fade">
      <span>{num}</span>
      <i aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
