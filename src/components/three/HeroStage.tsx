import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleSelf from './ParticleSelf'
import GridFloor from './GridFloor'
import { Fresnel } from './materials'
import { pointer } from '../../lib/pointer'
import { damp } from '../../lib/math'
import { intro } from '../../lib/store'
import { scroll } from '../../lib/scroll'
import { viewSize } from './rig'

export default function HeroStage({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null)
  const layer1 = useRef<THREE.Group>(null)
  const layer2 = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Group>(null)
  const { size } = useThree()

  useFrame(({ clock }, dt) => {
    const t = reduced ? 0 : clock.elapsedTime
    const aspect = size.width / size.height
    const { w, h } = viewSize(0, aspect)
    const mobile = aspect < 0.85
    if (halo.current) {
      halo.current.position.set(mobile ? 0 : w * 0.2, mobile ? -h * 0.2 : 0.2, -3.2)
      halo.current.scale.setScalar(mobile ? 0.55 : 1)
    }
    if (rings.current) {
      rings.current.rotation.z = t * 0.05 + scroll.prog[0] * 1.5
      rings.current.rotation.x = 0.32 + Math.sin(t * 0.2) * 0.04
      rings.current.scale.setScalar(0.6 + intro.reveal * 0.4)
    }
    if (layer1.current) {
      layer1.current.position.x = damp(layer1.current.position.x, pointer.x * -0.6, 2, dt)
      layer1.current.position.y = damp(layer1.current.position.y, pointer.y * -0.35, 2, dt)
      layer1.current.rotation.y = t * 0.15
    }
    if (layer2.current) {
      layer2.current.position.x = damp(layer2.current.position.x, pointer.x * 0.9, 2, dt)
      layer2.current.position.y = damp(layer2.current.position.y, pointer.y * 0.5, 2, dt)
      layer2.current.rotation.x = t * 0.2
    }
  })

  return (
    <>
      <ParticleSelf stage={0} mode="hero" />
      <group ref={halo}>
        <group ref={rings}>
          <mesh>
            <torusGeometry args={[3.5, 0.012, 8, 160]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.55} />
          </mesh>
          <mesh scale={0.82}>
            <torusGeometry args={[3.5, 0.006, 8, 160]} />
            <meshBasicMaterial color="#5ce1f5" transparent opacity={0.35} />
          </mesh>
          <mesh scale={1.18}>
            <torusGeometry args={[3.5, 0.004, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
          </mesh>
        </group>
      </group>
      {/* depth layers that move against the cursor */}
      <group ref={layer1} position={[0, 0, -3.5]}>
        <mesh position={[-5.5, 2.2, 0]}>
          <icosahedronGeometry args={[0.9, 1]} />
          <Fresnel intensity={1.8} />
        </mesh>
        <mesh position={[6.3, -1.8, -1.5]} scale={1.3}>
          <octahedronGeometry args={[0.8, 0]} />
          <Fresnel color="#5ce1f5" intensity={1.6} />
        </mesh>
      </group>
      <group ref={layer2} position={[0, 0, 1.2]}>
        <mesh position={[-3.6, -2.0, 0]}>
          <torusGeometry args={[0.35, 0.02, 8, 48]} />
          <meshBasicMaterial color="#5ce1f5" transparent opacity={0.7} />
        </mesh>
        <mesh position={[4.6, 2.6, 0]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.5} />
        </mesh>
      </group>
      <GridFloor y={-3.4} reduced={reduced} />
    </>
  )
}
