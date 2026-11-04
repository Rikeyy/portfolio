import { ui } from './store'
import { PROJECTS } from '../data/projects'

const prefix = '#/work/'

/** Case studies use real history entries so the browser back/forward buttons work. */
export function openCase(slug: string) {
  if (ui.get().caseStudy === slug) return
  history.pushState({ case: slug }, '', `${prefix}${slug}`)
  ui.set({ caseStudy: slug })
}

export function closeCase() {
  if (history.state?.case) history.back()
  else {
    history.replaceState(null, '', '#work')
    ui.set({ caseStudy: null })
  }
}

export function syncFromLocation() {
  const h = location.hash
  if (h.startsWith(prefix)) {
    const slug = h.slice(prefix.length)
    ui.set({ caseStudy: PROJECTS.some((p) => p.slug === slug) ? slug : null })
  } else if (ui.get().caseStudy) {
    ui.set({ caseStudy: null })
  }
}
