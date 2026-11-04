import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Fresnel } from './materials'
import { scroll } from '../../lib/scroll'
import { smoothRange, clamp } from '../../lib/math'

const G = 4

export default function PhilosophyStage({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const a = useRef<THREE.Group>(null)
  const b = useRef<THREE.Group>(null)
  const c = useRef<THREE.Group>(null)
  const inst = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.9, 1)), [])
  const { size } = useThree()

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const q = scroll.stick[5]
    const mobile = size.width / size.height < 0.85
    // overlapping weights for the three forms
    const wa = 1 - smoothRange(0.26, 0.4, q)
    const wb = smoothRange(0.26, 0.4, q) * (1 - smoothRange(0.6, 0.74, q))
    const wc = smoothRange(0.6, 0.74, q)
    if (root.current) {
      root.current.rotation.y = q * Math.PI * 2 + t * 0.1
      root.current.position.set(mobile ? 0 : 0.4, mobile ? 1.6 : 0, 0)
      root.current.scale.setScalar(mobile ? 0.65 : 1)
    }
    if (a.current) {
      a.current.scale.setScalar(Math.max(0.0001, wa))
      a.current.rotation.x = t * 0.2
    }
    if (b.current) {
      b.current.scale.setScalar(Math.max(0.0001, wb))
      b.current.rotation.x = 0.5
    }
    if (c.current) {
      c.current.scale.setScalar(Math.max(0.0001, wc))
      c.current.rotation.x = t * 0.25 + q * 4
    }
    if (inst.current) {
      // ENGINEER: lattice assembles cell by cell
      const build = clamp((q - 0.28) / 0.2)
      let k = 0
      for (let x = 0; x < G; x++)
        for (let y = 0; y < G; y++)
          for (let z = 0; z < G; z++) {
            const idx = (x + y * G + z * G * G) / (G * G * G)
            const s = clamp((build * 1.6 - idx * 0.9) * 2) * 0.42
            dummy.position.set((x - (G - 1) / 2) * 0.78, (y - (G - 1) / 2) * 0.78, (z - (G - 1) / 2) * 0.78)
            dummy.scale.setScalar(Math.max(0.0001, s))
            dummy.updateMatrix()
            inst.current.setMatrixAt(k++, dummy.matrix)
          }
      inst.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={root}>
      <group ref={a}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </lineSegments>
        <mesh>
          <icosahedronGeometry args={[1.9, 1]} />
          <Fresnel intensity={1.4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshBasicMaterial color="#ff3030" />
        </mesh>
      </group>
      <group ref={b}>
        <instancedMesh ref={inst} args={[undefined, undefined, G * G * G]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a0305" emissive="#e50914" emissiveIntensity={0.3} metalness={0.85} roughness={0.25} />
        </instancedMesh>
      </group>
      <group ref={c}>
        <mesh>
          <torusKnotGeometry args={[1.25, 0.34, 220, 24, 2, 3]} />
          <meshStandardMaterial color="#220306" emissive="#ff2d2d" emissiveIntensity={0.55} metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh scale={1.04}>
          <torusKnotGeometry args={[1.25, 0.34, 140, 16, 2, 3]} />
          <Fresnel color="#ff5a5a" intensity={1.5} power={2.5} />
        </mesh>
      </group>
    </group>
  )
}
