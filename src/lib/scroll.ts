import { clamp, smooth } from './math'

export const SECTION_IDS = ['hero', 'about', 'expertise', 'work', 'journey', 'philosophy', 'contact'] as const
export const N = SECTION_IDS.length

/** Single source of truth for scroll-derived values consumed by the 3D scene. */
export const scroll = {
  y: 0,
  /** Continuous section index (0..N-1) used to drive the camera between stages. */
  t: 0,
  /** Per-section progress while it travels through the viewport (0 entering → 1 leaving). */
  prog: new Array<number>(N).fill(0),
  /** Per-section progress while its top is pinned to the top of the viewport (sticky sections). */
  stick: new Array<number>(N).fill(0),
  projectF: 0,
  active: 0,
}

interface Box {
  top: number
  h: number
}
let boxes: Box[] = []
let projects: Box[] = []

export function measure() {
  boxes = SECTION_IDS.map((id) => {
    const el = document.getElementById(id)
    if (!el) return { top: 0, h: 1 }
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, h: r.height }
  })
  projects = Array.from(document.querySelectorAll<HTMLElement>('[data-project]')).map((el) => {
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, h: r.height }
  })
  update(window.scrollY)
}

export function update(y: number) {
  if (!boxes.length) return
  const vh = window.innerHeight
  const mid = y + vh * 0.5
  const W = vh * 0.9
  scroll.y = y

  let t = 0
  for (let b = 1; b < N; b++) t += smooth((mid - (boxes[b].top - W / 2)) / W)
  scroll.t = t

  let active = 0
  for (let i = 0; i < N; i++) {
    const { top, h } = boxes[i]
    scroll.prog[i] = clamp((y + vh - top) / (h + vh))
    scroll.stick[i] = clamp((y - top) / Math.max(1, h - vh))
    if (mid >= top) active = i
  }
  scroll.active = active

  if (projects.length) {
    let f = 0
    for (let i = 0; i < projects.length; i++) {
      const c = projects[i].top + projects[i].h / 2
      if (mid >= c) f = i + clamp((mid - c) / Math.max(1, (projects[i + 1]?.top ?? c) + (projects[i + 1]?.h ?? 0) / 2 - c))
    }
    scroll.projectF = f
  }
}

/** Smoothed value for the camera, written by the rig and read by stages. */
export const view = { t: 0 }
