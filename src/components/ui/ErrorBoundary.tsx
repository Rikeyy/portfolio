import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ui } from '../../lib/store'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D scene failed:', error, info.componentStack)
    ui.set({ webglFailed: true, ready: true })
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
