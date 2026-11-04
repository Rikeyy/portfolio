import { useSyncExternalStore } from 'react'

export interface UIState {
  category: string | null
  project: number
  caseStudy: string | null
  step: number
  menu: boolean
  ready: boolean
  introDone: boolean
  webglFailed: boolean
  active: number
}

let state: UIState = {
  category: null,
  project: 0,
  caseStudy: null,
  step: 0,
  menu: false,
  ready: false,
  introDone: false,
  webglFailed: false,
  active: 0,
}
const subs = new Set<() => void>()

export const ui = {
  get: () => state,
  set(patch: Partial<UIState>) {
    let changed = false
    for (const k of Object.keys(patch) as (keyof UIState)[]) {
      if (state[k] !== patch[k]) changed = true
    }
    if (!changed) return
    state = { ...state, ...patch }
    subs.forEach((f) => f())
  },
  subscribe(f: () => void) {
    subs.add(f)
    return () => subs.delete(f)
  },
}

export function useUI<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(ui.subscribe, () => select(state))
}

/** Mutable values animated by the intro timeline and read in the render loop. */
export const intro = { light: 0, reveal: 0 }
