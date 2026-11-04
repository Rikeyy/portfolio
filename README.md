# Rikey Kurniawan — Immersive 3D Portfolio

Vite + React + TypeScript · Three.js (React Three Fiber) · GSAP ScrollTrigger · Lenis

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview
```

## Configure (copy `.env.example` → `.env`)
| Variable | Purpose |
| --- | --- |
| `VITE_CONTACT_ENDPOINT` | POST endpoint for the contact form (JSON: name, email, subject, message). Formspree/Basin/own API. |
| `VITE_CONTACT_EMAIL` | Enables "EMAIL ME" and the mailto fallback when no endpoint is set. |
| `VITE_LINKEDIN_URL`, `VITE_GITHUB_URL` | Social buttons. Unset buttons render disabled. |

With nothing configured the form says plainly that nothing was sent.

## Where things live
- `src/data/` — projects/case studies, skills, site config (edit copy here)
- `src/components/three/` — the single fixed WebGL scene; one `Stage` per section, driven by `src/lib/scroll.ts`
- `src/components/*` — DOM sections; `src/lib/smooth.ts` syncs Lenis ↔ GSAP
- `public/images/` — `rikey-profile.jpg` (original), `rikey-cutout.webp` (background removed), `rikey-depth.webp` (depth map for displacement)
