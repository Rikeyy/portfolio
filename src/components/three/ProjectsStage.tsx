import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { Fresnel } from './materials'
import { scroll } from '../../lib/scroll'
import { damp, clamp } from '../../lib/math'

const TINTS = ['#e50914', '#ff3a2a', '#c4001d', '#ff2d55', '#ff6b5e']

function useWeight(i: number) {
  const w = useRef(0)
  return (dt: number) => {
    w.current = damp(w.current, clamp(1 - Math.abs(scroll.projectF - i) * 1.35), 6, dt)
    return w.current
  }
}

function Network({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const weight = useWeight(0)
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 2)), [])
  useFrame(({ clock }, dt) => {
    const w = weight(dt)
    if (!g.current) return
    g.current.visible = w > 0.01
    g.current.scale.setScalar(w)
    g.current.rotation.y = (reduced ? 0 : clock.elapsedTime * 0.15) + scroll.projectF * 1.2
    g.current.rotation.x = 0.3
  })
  return (
    <group ref={g}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color={TINTS[0]} transparent opacity={0.6} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[2.1, 1]} />
        <Fresnel color={TINTS[0]} intensity={2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#ff5a5a" />
      </mesh>
    </group>
  )
}

function Blocks({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const inst = useRef<THREE.InstancedMesh>(null)
  const weight = useWeight(1)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const N = 5
  useFrame(({ clock }, dt) => {
    const w = weight(dt)
    if (!g.current || !inst.current) return
    g.current.visible = w > 0.01
    g.current.scale.setScalar(w)
    g.current.rotation.y = 0.6 + scroll.projectF * 0.8
    const t = reduced ? 0 : clock.elapsedTime
    let k = 0
    for (let x = 0; x < N; x++)
      for (let z = 0; z < N; z++) {
        const h = 0.4 + (Math.sin(x * 1.7 + z * 2.3 + t * 0.8) * 0.5 + 0.5) * 1.8
        dummy.position.set((x - (N - 1) / 2) * 0.82, h / 2 - 1.2, (z - (N - 1) / 2) * 0.82)
        dummy.scale.set(0.62, h, 0.62)
        dummy.updateMatrix()
        inst.current.setMatrixAt(k++, dummy.matrix)
      }
    inst.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group ref={g} rotation={[0.35, 0, 0]}>
      <instancedMesh ref={inst} args={[undefined, undefined, N * N]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a0305" emissive={TINTS[1]} emissiveIntensity={0.35} metalness={0.8} roughness={0.28} />
      </instancedMesh>
    </group>
  )
}

function Rings({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const r = useRef<(THREE.Mesh | null)[]>([])
  const weight = useWeight(2)
  useFrame(({ clock }, dt) => {
    const w = weight(dt)
    if (!g.current) return
    g.current.visible = w > 0.01
    g.current.scale.setScalar(w)
    const t = reduced ? 0 : clock.elapsedTime
    r.current.forEach((m, i) => {
      if (!m) return
      m.rotation.x = t * (0.3 + i * 0.15) + scroll.projectF * (1 + i)
      m.rotation.y = t * (0.2 - i * 0.07) + i
    })
  })
  return (
    <group ref={g}>
      {[2.3, 1.7, 1.1].map((rad, i) => (
        <mesh key={rad} ref={(m) => (r.current[i] = m)}>
          <torusGeometry args={[rad, 0.045 - i * 0.008, 16, 120]} />
          <meshStandardMaterial color="#1a0204" emissive={TINTS[2]} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color="#ff4d6a" />
      </mesh>
    </group>
  )
}

function Phone({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const orb = useRef<THREE.Group>(null)
  const weight = useWeight(3)
  useFrame(({ clock }, dt) => {
    const w = weight(dt)
    if (!g.current) return
    g.current.visible = w > 0.01
    g.current.scale.setScalar(w)
    const t = reduced ? 0 : clock.elapsedTime
    g.current.rotation.y = Math.sin(t * 0.4) * 0.5 + scroll.projectF * 0.9 - 2.2
    g.current.rotation.z = 0.12
    if (orb.current) orb.current.rotation.y = t * 0.8
  })
  return (
    <group ref={g}>
      <RoundedBox args={[1.5, 3, 0.18]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color="#120203" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[1.32, 2.82]} />
        <meshStandardMaterial color="#050505" emissive={TINTS[3]} emissiveIntensity={0.35} />
      </mesh>
      {[0.9, 0.35, -0.2].map((y, i) => (
        <mesh key={y} position={[0, y, 0.1]}>
          <planeGeometry args={[1.0, i === 0 ? 0.6 : 0.3]} />
          <meshBasicMaterial color={i === 0 ? '#ff2d55' : '#4a0a14'} />
        </mesh>
      ))}
      <group ref={orb}>
        <mesh position={[2.1, 0.6, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-2.1, -0.8, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={TINTS[3]} />
        </mesh>
      </group>
    </group>
  )
}

function Pillars({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const weight = useWeight(4)
  const items = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: (i - 4) * 0.62, h: 1.4 + Math.abs(Math.sin(i * 1.3)) * 1.7 })),
    [],
  )
  useFrame(({ clock }, dt) => {
    const w = weight(dt)
    if (!g.current) return
    g.current.visible = w > 0.01
    g.current.scale.setScalar(w)
    g.current.rotation.y = (reduced ? 0 : Math.sin(clock.elapsedTime * 0.3) * 0.25) + (scroll.projectF - 4) * 0.8
  })
  return (
    <group ref={g} rotation={[0.15, 0, 0]}>
      {items.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 1.4, 0]}>
          <boxGeometry args={[0.38, p.h, 0.38]} />
          <meshStandardMaterial color="#190305" emissive={TINTS[4]} emissiveIntensity={0.25} metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 1.95 - 0.1, 0]}>
        <boxGeometry args={[6.2, 0.14, 0.7]} />
        <meshStandardMaterial color="#220305" emissive={TINTS[4]} emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[6.4, 0.14, 1.0]} />
        <meshStandardMaterial color="#190305" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}

export default function ProjectsStage({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const { size } = useThree()
  useFrame(() => {
    const mobile = size.width / size.height < 0.85
    if (root.current) {
      root.current.position.set(mobile ? 0 : -0.6, mobile ? 1.8 : 0.3, 0)
      root.current.scale.setScalar(mobile ? 0.6 : 0.72)
    }
  })
  return (
    <group ref={root}>
      <Network reduced={reduced} />
      <Blocks reduced={reduced} />
      <Rings reduced={reduced} />
      <Phone reduced={reduced} />
      <Pillars reduced={reduced} />
    </group>
  )
}
