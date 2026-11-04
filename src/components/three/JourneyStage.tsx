import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scroll } from '../../lib/scroll'

const COUNT = 18
const GAP = 3.2

export default function JourneyStage({ reduced }: { reduced: boolean }) {
  const inst = useRef<THREE.InstancedMesh>(null)
  const core = useRef<THREE.Mesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const orbs = [0.18, 0.5, 0.85]

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    if (!inst.current) return
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(0, 0, -i * GAP)
      dummy.rotation.set(0, 0, t * 0.12 * (i % 2 ? 1 : -1) + i * 0.4 + scroll.prog[4] * 2)
      const s = 1 + Math.sin(t * 0.6 + i) * 0.04
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      inst.current.setMatrixAt(i, dummy.matrix)
    }
    inst.current.instanceMatrix.needsUpdate = true
    if (core.current) core.current.scale.y = 0.8 + Math.sin(t * 2) * 0.05
  })

  return (
    <group position={[0, 0, 0]}>
      <instancedMesh ref={inst} args={[undefined, undefined, COUNT]}>
        <torusGeometry args={[4.2, 0.018, 6, 6]} />
        <meshBasicMaterial color="#e50914" transparent opacity={0.8} />
      </instancedMesh>
      <mesh ref={core} position={[0, 0, -COUNT * GAP * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, COUNT * GAP, 6]} />
        <meshBasicMaterial color="#ff3030" transparent opacity={0.7} />
      </mesh>
      {orbs.map((p, i) => (
        <mesh key={i} position={[Math.sin(i * 2) * 1.2, Math.cos(i * 2) * 0.8, -p * COUNT * GAP * 0.9]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshBasicMaterial color="#ff3030" />
        </mesh>
      ))}
      {orbs.map((p, i) => (
        <mesh key={'h' + i} position={[Math.sin(i * 2) * 1.2, Math.cos(i * 2) * 0.8, -p * COUNT * GAP * 0.9]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshBasicMaterial color="#e50914" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}
