import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { damp, clamp } from '../../lib/math'
import { pointer } from '../../lib/pointer'
import { intro, ui } from '../../lib/store'
import { viewSize } from './rig'

/**
 * "Particle self": a faceless humanoid bust built procedurally from 3D primitives
 * (head, neck, torso, arms) and rendered as a volumetric point cloud.
 * It is generated entirely from maths — no photo, image or likeness is used.
 */

const vert = /* glsl */ `
attribute vec3 aScatter; attribute vec3 aNormal; attribute float aSeed;
uniform float uTime; uniform float uReveal; uniform vec2 uSpot; uniform float uSpotR; uniform float uPx; uniform mat3 uRot;
varying float vA; varying float vHot; varying float vSeed;
void main(){
  float e = smoothstep(0.0, 1.0, clamp(uReveal * 1.45 - aSeed * 0.45, 0.0, 1.0));
  vec3 q = uRot * position;
  vec3 n = normalize(uRot * aNormal);
  vec3 p = mix(aScatter, q, e);
  // idle breathing / shimmer
  p += n * sin(uTime * 1.1 + aSeed * 50.0) * 0.004;
  p.y += sin(uTime * 0.8) * 0.004;
  // pointer: particles are pushed away and lifted
  vec2 d = p.xy - uSpot;
  float f = smoothstep(uSpotR, 0.0, length(d)) * e;
  p.xy += normalize(d + 1e-5) * f * 0.07;
  p.z += f * 0.1;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.5);
  // fresnel rim + front/back shading give the volume its depth
  vec3 nv = normalize(mat3(modelViewMatrix) * n);
  vec3 vd = normalize(-mv.xyz);
  float facing = dot(nv, vd);
  float rim = pow(1.0 - abs(facing), 2.0);
  float front = smoothstep(-0.4, 0.6, facing);
  float fade = smoothstep(-0.53, -0.28, p.y);
  gl_PointSize = (1.1 + aSeed * 2.2 + rim * 1.4 + f * 2.0) * uPx * (9.0 / depth);
  vA = e * (0.3 + 0.7 * aSeed) * (0.4 + 0.6 * front) * (0.65 + 0.9 * rim) * fade;
  vHot = clamp(f * 1.4 + rim * 0.9, 0.0, 1.0);
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}`

const frag = /* glsl */ `
varying float vA; varying float vHot; varying float vSeed;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, r) * vA;
  vec3 deep = vec3(0.0, 0.55, 0.95);
  vec3 cyan = vec3(0.0, 0.83, 1.0);
  vec3 ice  = vec3(0.85, 0.97, 1.0);
  gl_FragColor = vec4(mix(mix(deep, cyan, vSeed), ice, vHot), a);
}`

type V3 = [number, number, number]
const rnd = () => Math.random()
const gauss = () => {
  let u = 0
  for (let i = 0; i < 4; i++) u += rnd()
  return (u - 2) * 1.7
}
const unit = (): V3 => {
  const x = gauss(), y = gauss(), z = gauss()
  const l = Math.hypot(x, y, z) || 1
  return [x / l, y / l, z / l]
}
const norm = (v: V3): V3 => {
  const l = Math.hypot(...v) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
/** mostly on the surface, a thin volumetric shell inside */
const shell = () => 1 - Math.pow(rnd(), 3) * 0.22

interface Part {
  weight: number
  sample: () => { p: V3; n: V3 }
}

const ellipsoid = (c: V3, r: V3) => () => {
  const v = unit()
  const s = shell()
  return {
    p: [c[0] + v[0] * r[0] * s, c[1] + v[1] * r[1] * s, c[2] + v[2] * r[2] * s] as V3,
    n: norm([v[0] / r[0], v[1] / r[1], v[2] / r[2]]),
  }
}

const capsule = (a: V3, b: V3, rad: number) => () => {
  const t = rnd()
  const v = unit()
  const s = shell() * rad
  return {
    p: [a[0] + (b[0] - a[0]) * t + v[0] * s, a[1] + (b[1] - a[1]) * t + v[1] * s, a[2] + (b[2] - a[2]) * t + v[2] * s] as V3,
    n: v,
  }
}

/** torso: elliptical cross-sections, broad shoulders tapering to a narrower waist and up into the neck */
const halfW = (y: number) => {
  if (y > 0.02) return 0.31 + (0.065 - 0.31) * clamp((y - 0.02) / 0.1)
  return 0.31 - 0.08 * clamp((0.02 - y) / 0.57)
}
const torso = () => {
  for (;;) {
    const y = -0.56 + rnd() * 0.68
    const w = halfW(y)
    if (rnd() > w / 0.31) continue
    const th = rnd() * Math.PI * 2
    const d = 0.5 * w + 0.025
    const s = shell()
    const c = Math.cos(th), sn = Math.sin(th)
    return { p: [w * c * s, y, d * sn * s] as V3, n: norm([c * d, 0.15, sn * w]) }
  }
}

const PARTS: Part[] = [
  { weight: 0.22, sample: ellipsoid([0, 0.29, 0.005], [0.118, 0.148, 0.128]) }, // head
  { weight: 0.04, sample: capsule([0, 0.1, 0], [0, 0.17, 0.01], 0.05) }, // neck
  { weight: 0.44, sample: torso },
  { weight: 0.15, sample: capsule([-0.3, 0.0, 0], [-0.375, -0.42, 0.04], 0.056) }, // arms
  { weight: 0.15, sample: capsule([0.3, 0.0, 0], [0.375, -0.42, 0.04], 0.056) },
]

function buildFigure(count: number) {
  const pos = new Float32Array(count * 3)
  const nor = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  const total = PARTS.reduce((a, p) => a + p.weight, 0)
  for (let i = 0; i < count; i++) {
    let r = rnd() * total
    let part = PARTS[0]
    for (const p of PARTS) {
      if ((r -= p.weight) <= 0) { part = p; break }
    }
    const { p, n } = part.sample()
    pos.set(p, i * 3)
    nor.set(n, i * 3)
    // scatter: a loose cloud the figure assembles from
    const a = rnd() * Math.PI * 2
    const rad = 0.6 + rnd() * 1.1
    scatter[i * 3] = Math.cos(a) * rad
    scatter[i * 3 + 1] = Math.sin(a) * rad * 0.9 - 0.1
    scatter[i * 3 + 2] = (rnd() - 0.3) * 1.6
    seed[i] = rnd()
  }
  return { pos, nor, scatter, seed }
}

interface Props {
  stage: number
  /** hero: pointer-reactive + intro driven; contact: assembles as the stage approaches */
  mode: 'hero' | 'contact'
}

const _e = new THREE.Euler()
const _m4 = new THREE.Matrix4()

export default function ParticleSelf({ stage, mode }: Props) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const { geo, uniforms } = useMemo(() => {
    const coarse = matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 820px)').matches
    const f = buildFigure(coarse ? 11000 : 26000)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(f.pos, 3))
    g.setAttribute('aNormal', new THREE.BufferAttribute(f.nor, 3))
    g.setAttribute('aScatter', new THREE.BufferAttribute(f.scatter, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(f.seed, 1))
    return {
      geo: g,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uSpot: { value: new THREE.Vector2(0, 0.1) },
        uSpotR: { value: 0 },
        uPx: { value: 1 },
        uRot: { value: new THREE.Matrix3() },
      },
    }
  }, [])

  const state = useRef({ mx: 0, my: 0, r: 0, sx: 0, sy: 0.1 })

  useFrame(({ clock, camera, gl }, dt) => {
    if (!group.current || !mat.current) return
    const aspect = size.width / size.height
    const { h: vh, w: vw } = viewSize(stage, aspect)
    const mobile = aspect < 0.85
    let ph: number, px: number, py: number
    if (mode === 'hero') {
      ph = mobile ? Math.min(vh * 0.68, vw * 1.8) : vh * 0.9
      px = mobile ? 0 : vw * 0.2
      py = mobile ? -vh * 0.5 + ph * 0.44 : -vh * 0.07
    } else {
      ph = mobile ? Math.min(vh * 0.5, vw * 1.2) : vh * 0.86
      px = mobile ? 0 : vw * 0.22
      py = mobile ? -vh * 0.5 + ph * 0.42 + vh * 0.04 : -vh * 0.04
    }
    group.current.position.set(px, py, 0)
    group.current.scale.setScalar(ph)

    const t = clock.elapsedTime
    const s = state.current
    s.mx = damp(s.mx, pointer.x, 3, dt)
    s.my = damp(s.my, pointer.y, 3, dt)

    // pointer (or auto-drift on touch devices) → figure-local coords
    let nx = pointer.x
    let ny = pointer.y
    if (!pointer.moved || matchMedia('(pointer: coarse)').matches) {
      nx = Math.sin(t * 0.55) * 0.35 + 0.2
      ny = Math.cos(t * 0.8) * 0.25 + 0.15
    }
    s.sx = damp(s.sx, (nx * (vw / 2) - px) / ph, 8, dt)
    s.sy = damp(s.sy, (ny * (vh / 2) - py) / ph, 8, dt)

    const near = Math.abs(camera.position.y - -stage * 24)
    const reveal = mode === 'hero' ? intro.reveal : clamp(1 - (near - 6) / 8)
    s.r = damp(s.r, mode === 'hero' && ui.get().introDone ? 0.17 : mode === 'hero' ? 0.0 : 0.15 * reveal, 4, dt)

    // slow turn + pointer-led rotation: the volume reads as genuinely 3D
    _e.set(-s.my * 0.12, Math.sin(t * 0.3) * 0.55 + s.mx * 0.6, 0)
    _m4.makeRotationFromEuler(_e)

    const u = mat.current.uniforms
    u.uRot.value.setFromMatrix4(_m4)
    u.uTime.value = t
    u.uReveal.value = reveal
    u.uSpot.value.set(s.sx, s.sy)
    u.uSpotR.value = s.r
    u.uPx.value = gl.getPixelRatio() * (gl.domElement.height / gl.getPixelRatio() / 800 + 0.5)
  })

  return (
    <group ref={group}>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
