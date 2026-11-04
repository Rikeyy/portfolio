import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { KEYS, stageY, zScale } from './rig'
import { damp, lerp } from '../../lib/math'
import { pointer } from '../../lib/pointer'
import { scroll, view } from '../../lib/scroll'

const P = new THREE.Vector3()
const L = new THREE.Vector3()

export default function CameraRig({ reduced, fine }: { reduced: boolean; fine: boolean }) {
  const { size } = useThree()
  useFrame(({ camera }, dt) => {
    view.t = reduced ? scroll.t : damp(view.t, scroll.t, 5.5, Math.min(dt, 0.05))
    const t = Math.min(view.t, KEYS.length - 1 - 1e-4)
    const i = Math.floor(t)
    const f = t - i
    const a = KEYS[i]
    const b = KEYS[Math.min(i + 1, KEYS.length - 1)]
    const aspect = size.width / size.height
    const wide = aspect > 1.1 ? 1 : 0
    const zs = zScale(aspect)

    const sx = lerp(a.sx, b.sx, f) * wide
    const yy = lerp(stageY(i), stageY(i + 1), f)
    // keys are expressed relative to their own stage, so blend the offsets then add the interpolated stage centre
    const px = lerp(a.p[0], b.p[0], f)
    const py = lerp(a.p[1], b.p[1], f)
    const pz = lerp(a.p[2], b.p[2], f)
    const lx = lerp(a.l[0], b.l[0], f)
    const ly = lerp(a.l[1], b.l[1], f)
    const lz = lerp(a.l[2], b.l[2], f)

    L.set(lx - sx, yy + ly, lz)
    P.set(px - sx, yy + py, lz + (pz - lz) * zs)

    // journey: fly down the tunnel
    const jt = view.t - 4
    if (jt > -1 && jt < 1) {
      const w = Math.max(0, 1 - Math.abs(jt))
      const d = scroll.prog[4] * 30 * w
      P.z -= d
      L.z -= d
    }
    // projects: gentle orbit/dolly per project
    const pj = 1 - Math.min(1, Math.abs(view.t - 3))
    if (pj > 0) {
      const ang = (scroll.projectF - 2) * 0.28
      P.x += Math.sin(ang) * 2.4 * pj
      P.z += (Math.cos(ang) - 1) * 1.5 * pj - Math.sin(scroll.projectF * Math.PI) * 0.35 * pj
    }
    // philosophy: slow orbit
    const ph = 1 - Math.min(1, Math.abs(view.t - 5))
    if (ph > 0) {
      const ang = (scroll.stick[5] - 0.5) * 0.9
      P.x += Math.sin(ang) * 3 * ph
    }

    const k = fine && !reduced ? 1 : 0
    P.x += pointer.x * 0.35 * k
    P.y += pointer.y * 0.2 * k
    camera.position.copy(P)
    camera.lookAt(L)
  })
  return null
}
