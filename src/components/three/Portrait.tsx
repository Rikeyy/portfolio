import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { damp, clamp } from '../../lib/math'
import { pointer } from '../../lib/pointer'
import { intro, ui } from '../../lib/store'
import { viewSize } from './rig'

const vert = /* glsl */ `
varying vec2 vUv; uniform sampler2D uDepth; uniform float uDisp;
void main(){
  vUv = uv;
  float d = texture2D(uDepth, uv).r;
  vec3 p = position; p.z += (d - 0.3) * uDisp;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const frag = /* glsl */ `
uniform sampler2D uTex; uniform sampler2D uDepth;
uniform vec2 uMouse; uniform vec2 uSpot; uniform float uSpotR; uniform float uTime;
uniform float uReveal; uniform float uLight;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}

void main(){
  float depth = texture2D(uDepth, vUv).r;
  vec2 uv = vUv + uMouse * (depth - 0.35) * 0.03;
  vec4 t = texture2D(uTex, uv);
  float a = t.a;

  // rim light (from the right, softer from the left)
  vec2 px = vec2(1.0/800.0);
  float aR = texture2D(uTex, uv + vec2( 7.0*px.x, 0.0)).a;
  float aL = texture2D(uTex, uv + vec2(-7.0*px.x, 0.0)).a;
  float aU = texture2D(uTex, uv + vec2(0.0, 7.0*px.y)).a;
  float rim = a * ((1.0 - aR) * 1.0 + (1.0 - aL) * 0.45 + (1.0 - aU) * 0.6);

  // cinematic red grade — keeps true skin detail, shifts shadows to crimson
  float lum = dot(t.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 col = mix(vec3(lum), t.rgb, 0.72);
  col *= vec3(1.02, 0.92, 0.9);
  col += vec3(0.10, 0.0, 0.01) * (1.0 - lum);
  col += vec3(0.7, 0.03, 0.05) * 0.12 * smoothstep(0.35, 1.0, uv.x) * (0.3 + lum);
  col *= 0.78 + 0.5 * uLight;

  // cursor spotlight → thermal / contour layer
  float d = distance(vUv, uSpot);
  float s = smoothstep(uSpotR, uSpotR * 0.6, d);
  float l2 = clamp(lum * 1.5, 0.0, 1.0);
  vec3 th = mix(vec3(0.03, 0.0, 0.04), vec3(0.95, 0.04, 0.08), smoothstep(0.05, 0.6, l2));
  th = mix(th, vec3(1.0, 0.88, 0.82), smoothstep(0.62, 1.0, l2));
  th *= 0.82 + 0.18 * sin(vUv.y * 700.0 + uTime * 4.0);
  float contour = 1.0 - smoothstep(0.0, 0.09, abs(fract(depth * 16.0) - 0.5) * 2.0 - 0.82);
  th += vec3(1.0, 0.1, 0.12) * contour * 0.55;
  col = mix(col, th, s);
  float ring = (1.0 - smoothstep(0.0, 0.006, abs(d - uSpotR))) * 0.7 * step(0.001, uSpotR);
  col += vec3(1.0, 0.1, 0.1) * ring;

  // dissolve-in
  float n = noise(vUv * 7.0) * 0.65 + noise(vUv * 22.0) * 0.2 + (1.0 - vUv.y) * 0.25;
  float m = uReveal * 1.3 - n;
  float vis = smoothstep(0.0, 0.07, m);
  float edge = smoothstep(0.0, 0.015, m) * (1.0 - smoothstep(0.015, 0.14, m));
  col += vec3(1.0, 0.12, 0.1) * edge * 2.2;

  a *= vis * smoothstep(0.0, 0.17, vUv.y);
  col += vec3(1.0, 0.1, 0.08) * rim * (0.3 + 0.6 * uLight);
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`

const ghostFrag = /* glsl */ `
uniform sampler2D uTex; uniform float uReveal; uniform float uTime; varying vec2 vUv;
void main(){
  float a = texture2D(uTex, vUv, 5.0).a;
  float a2 = texture2D(uTex, vUv, 7.5).a;
  float v = (a * 0.05 + a2 * 0.3) * (0.8 + 0.2 * sin(uTime * 0.8));
  gl_FragColor = vec4(vec3(0.9, 0.03, 0.07) * v, v * 0.9 * uReveal * smoothstep(0.0, 0.2, vUv.y));
  #include <colorspace_fragment>
}`

interface Props {
  stage: number
  /** hero: pointer-reactive + intro driven; contact: reveals as the stage approaches */
  mode: 'hero' | 'contact'
}

export default function Portrait({ stage, mode }: Props) {
  const [tex, depth] = useTexture(['/images/rikey-cutout.webp', '/images/rikey-depth.webp'])
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const ghost = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    depth.colorSpace = THREE.NoColorSpace
  }, [tex, depth])

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uDepth: { value: depth },
      uMouse: { value: new THREE.Vector2() },
      uSpot: { value: new THREE.Vector2(0.5, 0.6) },
      uSpotR: { value: 0 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uLight: { value: 0 },
      uDisp: { value: 0.07 },
    }),
    [tex, depth],
  )
  const ghostU = useMemo(() => ({ uTex: { value: tex }, uReveal: { value: 0 }, uTime: { value: 0 } }), [tex])

  const state = useRef({ mx: 0, my: 0, r: 0, sx: 0.5, sy: 0.6 })

  useFrame(({ clock, camera }, dt) => {
    if (!group.current || !mat.current || !ghost.current || !mesh.current) return
    const aspect = size.width / size.height
    const { h: vh, w: vw } = viewSize(stage, aspect)
    const mobile = aspect < 0.85
    let ph: number, px: number, py: number
    if (mode === 'hero') {
      ph = mobile ? Math.min(vh * 0.68, vw * 1.8) : vh * 1.04
      px = mobile ? 0 : vw * 0.2
      py = mobile ? -vh * 0.5 + ph * 0.44 : -vh * 0.02
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
    const u = mat.current.uniforms
    u.uTime.value = t
    u.uMouse.value.set(s.mx, s.my)
    // pointer (or auto-drift on touch devices) → plane uv
    let nx = pointer.x
    let ny = pointer.y
    if (!pointer.moved || matchMedia('(pointer: coarse)').matches) {
      nx = Math.sin(t * 0.55) * 0.35 + 0.2
      ny = Math.cos(t * 0.8) * 0.25 + 0.15
    }
    const wx = nx * (vw / 2)
    const wy = ny * (vh / 2)
    const tx = (wx - px) / ph + 0.5
    const ty = (wy - py) / ph + 0.5
    s.sx = damp(s.sx, tx, 8, dt)
    s.sy = damp(s.sy, ty, 8, dt)
    u.uSpot.value.set(s.sx, s.sy)

    const near = Math.abs(camera.position.y - -stage * 24)
    let reveal: number, light: number
    if (mode === 'hero') {
      reveal = intro.reveal
      light = intro.light
    } else {
      reveal = clamp(1 - (near - 6) / 8)
      light = reveal
    }
    s.r = damp(s.r, mode === 'hero' && ui.get().introDone ? 0.17 : mode === 'hero' ? 0.0 : 0.15 * reveal, 4, dt)
    u.uSpotR.value = s.r
    u.uReveal.value = reveal
    u.uLight.value = light + Math.sin(t * 0.7) * 0.05
    ghost.current.uniforms.uReveal.value = reveal
    ghost.current.uniforms.uTime.value = t
    // subtle idle sway (depth-parallax tilt)
    mesh.current.rotation.y = s.mx * 0.08
    mesh.current.rotation.x = -s.my * 0.04
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0.02, -0.12]} scale={1.12}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={ghost}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={ghostFrag}
          uniforms={ghostU}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={mesh}>
        <planeGeometry args={[1, 1, 96, 96]} />
        <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
