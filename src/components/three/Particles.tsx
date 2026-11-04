import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
attribute float aSeed;
uniform float uTime; uniform vec3 uCam; uniform float uPx;
varying float vA; varying float vSeed;
void main(){
  vec3 S = vec3(30.0, 38.0, 30.0);
  vec3 p = position;
  p.x += sin(uTime*0.12 + aSeed*30.0)*0.6;
  p.z += cos(uTime*0.10 + aSeed*20.0)*0.6;
  p.y += sin(uTime*0.08 + aSeed*40.0)*0.4;
  p = mod(p - uCam + S*0.5, S) - S*0.5 + uCam;
  vec4 mv = viewMatrix * modelMatrix * vec4(p,1.0);
  float d = -mv.z;
  gl_PointSize = (1.6 + aSeed*3.2) * uPx * (9.0 / max(d,0.5));
  vA = smoothstep(34.0, 6.0, d) * smoothstep(0.5, 2.5, d) * (0.25 + 0.75*aSeed);
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}`
const frag = /* glsl */ `
varying float vA; varying float vSeed;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, r) * vA;
  vec3 c = mix(vec3(0.9, 0.03, 0.07), vec3(1.0,0.85,0.82), step(0.82, vSeed));
  gl_FragColor = vec4(c, a);
}`

export default function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { geo, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38 - 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return {
      geo: g,
      uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uPx: { value: 1 } },
    }
  }, [count])

  useFrame(({ clock, camera, gl }) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    u.uTime.value = reduced ? 0 : clock.elapsedTime
    u.uCam.value.copy(camera.position)
    u.uPx.value = gl.getPixelRatio() * (gl.domElement.height / gl.getPixelRatio() / 800 + 0.5)
  })

  return (
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
  )
}
