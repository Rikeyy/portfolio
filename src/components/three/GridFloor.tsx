import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `
const frag = /* glsl */ `
varying vec2 vUv; uniform float uTime; uniform float uOpacity;
void main(){
  vec2 p = (vUv - 0.5) * 40.0;
  p.y += uTime * 0.6;
  vec2 g = abs(fract(p) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, min(g.x, g.y));
  float major = 1.0 - smoothstep(0.0, 0.05, min(abs(fract(p/5.0)-0.5).x, abs(fract(p/5.0)-0.5).y)*5.0/1.0);
  float d = length(vUv - 0.5) * 2.0;
  float fade = smoothstep(1.0, 0.15, d);
  float a = (line*0.35 + major*0.35) * fade * uOpacity;
  gl_FragColor = vec4(vec3(0.0, 0.83, 1.0), a);
}`

export default function GridFloor({ y = -3, opacity = 1, reduced }: { y?: number; opacity?: number; reduced: boolean }) {
  const m = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => {
    if (m.current) {
      m.current.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime
      m.current.uniforms.uOpacity.value = opacity
    }
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, -4]}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial ref={m} vertexShader={vert} fragmentShader={frag} transparent depthWrite={false} uniforms={{ uTime: { value: 0 }, uOpacity: { value: opacity } }} />
    </mesh>
  )
}
