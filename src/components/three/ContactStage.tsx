import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Portrait from './Portrait'
import GridFloor from './GridFloor'
import { viewSize } from './rig'

const glowFrag = /* glsl */ `
varying vec2 vUv; uniform float uTime;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float g = pow(max(0.0, 1.0 - d), 2.2);
  float pulse = 0.85 + 0.15 * sin(uTime * 0.9);
  gl_FragColor = vec4(vec3(0.9, 0.03, 0.07) * g * pulse, g * 0.9);
}`

export default function ContactStage({ reduced }: { reduced: boolean }) {
  const portal = useRef<THREE.Group>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const shards = useRef<THREE.InstancedMesh>(null)
  const glow = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () => Array.from({ length: 36 }, () => ({ a: Math.random() * 6.28, r: 3 + Math.random() * 3.5, y: (Math.random() - 0.5) * 5, s: 0.05 + Math.random() * 0.12, v: 0.1 + Math.random() * 0.3 })),
    [],
  )

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const aspect = size.width / size.height
    const { w, h } = viewSize(6, aspect)
    const mobile = aspect < 0.85
    if (portal.current) {
      portal.current.position.set(mobile ? 0 : w * 0.22, mobile ? h * 0.05 : 0, -1.2)
      portal.current.scale.setScalar(mobile ? 0.55 : 1)
    }
    rings.current.forEach((m, i) => {
      if (!m) return
      m.rotation.z = t * (0.1 + i * 0.04) * (i % 2 ? -1 : 1)
      m.rotation.x = Math.sin(t * 0.3 + i) * 0.12
      m.rotation.y = Math.cos(t * 0.25 + i) * 0.12
    })
    if (glow.current) glow.current.uniforms.uTime.value = t
    if (shards.current) {
      seeds.forEach((s, i) => {
        const a = s.a + t * s.v
        dummy.position.set(Math.cos(a) * s.r, s.y + Math.sin(t * 0.4 + i) * 0.3, Math.sin(a) * s.r - 1)
        dummy.rotation.set(t * 0.5 + i, t * 0.3, 0)
        dummy.scale.setScalar(s.s)
        dummy.updateMatrix()
        shards.current!.setMatrixAt(i, dummy.matrix)
      })
      shards.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <group ref={portal}>
        <mesh position={[0, 0, -0.6]}>
          <planeGeometry args={[9, 9]} />
          <shaderMaterial
            ref={glow}
            vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
            fragmentShader={glowFrag}
            uniforms={{ uTime: { value: 0 } }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {[3.4, 2.9, 2.4, 1.95].map((r, i) => (
          <mesh key={r} ref={(m) => (rings.current[i] = m)}>
            <torusGeometry args={[r, i === 0 ? 0.035 : 0.014, 12, 160]} />
            <meshBasicMaterial color={i % 2 ? '#ff3030' : '#e50914'} transparent opacity={0.9 - i * 0.15} />
          </mesh>
        ))}
        <mesh position={[0, 0, -0.5]}>
          <torusGeometry args={[4.2, 0.006, 8, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      </group>
      <Portrait stage={6} mode="contact" />
      <instancedMesh ref={shards} args={[undefined, undefined, seeds.length]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ff3030" wireframe transparent opacity={0.7} />
      </instancedMesh>
      <GridFloor y={-3.6} opacity={0.8} reduced={reduced} />
    </>
  )
}
