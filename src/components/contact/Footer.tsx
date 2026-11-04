import { site } from '../../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner mono">
        <span>{site.name}.</span>
        <span>{site.title}.</span>
        <span>{site.location}.</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
