import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'ghost'
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  title?: string
}

export default function Button({ children, href, onClick, variant = 'solid', external, disabled, type = 'button', title }: Props) {
  const cls = `btn btn--${variant}${disabled ? ' is-disabled' : ''}`
  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </>
  )
  if (href && !disabled) {
    return (
      <a className={cls} href={href} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled} title={title}>
      {inner}
    </button>
  )
}
