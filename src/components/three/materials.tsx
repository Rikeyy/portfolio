import { useMemo } from 'react'
import * as THREE from 'three'

const vert = /* glsl */ `
varying vec3 vN; varying vec3 vV;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`
const frag = /* glsl */ `
uniform vec3 uColor; uniform float uPower; uniform float uIntensity; uniform float uBase;
varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
  float a = clamp(f * uIntensity + uBase, 0.0, 1.0);
  gl_FragColor = vec4(uColor * a, a);
}`

interface FresnelProps {
  color?: string
  power?: number
  intensity?: number
  base?: number
}

/** Additive fresnel rim material — cheap red atmospheric glow for 3D forms. */
export function Fresnel({ color = '#00d4ff', power = 2.4, intensity = 1.6, base = 0.02 }: FresnelProps) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
      uBase: { value: base },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  uniforms.uColor.value.set(color)
  uniforms.uPower.value = power
  uniforms.uIntensity.value = intensity
  uniforms.uBase.value = base
  return (
    <shaderMaterial
      vertexShader={vert}
      fragmentShader={frag}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  )
}
