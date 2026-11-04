import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Fresnel } from './materials'
import { scroll } from '../../lib/scroll'

export default function AboutStage({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const sats = useRef<THREE.Group>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const { size } = useThree()
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.05, 1)), [])

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const p = scroll.prog[1]
    const mobile = size.width / size.height < 0.85
    if (g.current) {
      g.current.rotation.y = t * 0.12 + p * Math.PI * 2
      g.current.rotation.x = p * 1.1 + Math.sin(t * 0.3) * 0.1
      g.current.scale.setScalar((mobile ? 0.7 : 1) * (1 + Math.sin(p * Math.PI) * 0.28))
      g.current.position.x = mobile ? 0 : 0.2
    }
    if (sats.current) sats.current.rotation.y = t * 0.4 + p * 3
    if (ringA.current) ringA.current.rotation.x = t * 0.2 + p * 2
    if (ringB.current) ringB.current.rotation.y = -t * 0.25 - p * 2
  })

  return (
    <group ref={g}>
      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <Fresnel intensity={2.2} power={2.2} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#5ce1f5" transparent opacity={0.55} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#04121a" emissive="#00d4ff" emissiveIntensity={0.9} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh ref={ringA} rotation={[1.1, 0, 0]}>
        <torusGeometry args={[2.9, 0.012, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ringB} rotation={[0.4, 0.6, 0]}>
        <torusGeometry args={[3.3, 0.01, 8, 160]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      <group ref={sats}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 2.9, Math.sin(i) * 0.6, Math.sin((i / 3) * Math.PI * 2) * 2.9]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#5ce1f5" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
