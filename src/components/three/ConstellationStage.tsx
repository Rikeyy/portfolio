import { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { SKILL_GROUPS } from '../../data/skills'
import { scroll, view } from '../../lib/scroll'
import { ui } from '../../lib/store'
import { damp } from '../../lib/math'

interface NodeData {
  id: string
  label: string
  cat: string
  color: string
  pos: THREE.Vector3
}

function build() {
  const nodes: NodeData[] = []
  const hubs: { id: string; pos: THREE.Vector3; color: string }[] = []
  const lines: number[] = []
  const R = 3.7
  SKILL_GROUPS.forEach((g, gi) => {
    const a = (gi / SKILL_GROUPS.length) * Math.PI * 2 + Math.PI / 4
    const hub = new THREE.Vector3(Math.cos(a) * R, Math.sin(gi * 1.7) * 1.6, Math.sin(a) * R)
    hubs.push({ id: g.id, pos: hub, color: g.color })
    const n = g.skills.length
    g.skills.forEach((s, i) => {
      // fibonacci sphere around the hub
      const y = 1 - (i / Math.max(1, n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.399963
      const p = new THREE.Vector3(Math.cos(th) * r, y * 0.9, Math.sin(th) * r).multiplyScalar(1.55).add(hub)
      nodes.push({ id: `${g.id}-${s}`, label: s, cat: g.id, color: g.color, pos: p })
      lines.push(hub.x, hub.y, hub.z, p.x, p.y, p.z)
    })
  })
  for (let i = 0; i < hubs.length; i++) {
    const a = hubs[i].pos
    const b = hubs[(i + 1) % hubs.length].pos
    lines.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  // a few cross-links between neighbouring categories
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].cat !== nodes[j].cat && nodes[i].pos.distanceTo(nodes[j].pos) < 2.1) {
        lines.push(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z, nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z)
      }
    }
  }
  return { nodes, hubs, lines: new Float32Array(lines) }
}

function SkillNode({ n, near, portal }: { n: NodeData; near: boolean; portal: React.MutableRefObject<HTMLElement> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const label = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const k = useRef(0)
  useFrame((_, dt) => {
    const cat = ui.get().category
    const target = hover ? 1.8 : cat === null ? 1 : cat === n.cat ? 1.5 : 0.45
    k.current = damp(k.current || 1, target, 8, dt)
    if (mesh.current) mesh.current.scale.setScalar(k.current)
    if (label.current) label.current.style.opacity = String(hover ? 1 : cat === null ? 0.78 : cat === n.cat ? 1 : 0.18)
  })
  return (
    <group position={n.pos}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (near) setHover(true)
        }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color={n.color} />
      </mesh>
      {near && (
        <Html portal={portal} center zIndexRange={[5, 0]} position={[0, 0.3, 0]} style={{ pointerEvents: 'none' }}>
          <div ref={label} className="node-label" data-hover={hover}>
            {n.label}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ConstellationStage({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const hubRefs = useRef<(THREE.Mesh | null)[]>([])
  const { size } = useThree()
  const data = useMemo(build, [])
  const portal = useMemo(() => ({ current: document.querySelector<HTMLElement>('.scene')! }), [])
  const [near, setNear] = useState(false)
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.lines, 3))
    return g
  }, [data])

  useFrame(({ clock }, dt) => {
    const t = reduced ? 0 : clock.elapsedTime
    const n = Math.abs(view.t - 2) < 0.7
    if (n !== near) setNear(n)
    const mobile = size.width / size.height < 0.85
    if (root.current) {
      root.current.rotation.y = t * 0.08 + scroll.prog[2] * 3.2
      root.current.rotation.x = Math.sin(t * 0.2) * 0.08 + (scroll.prog[2] - 0.5) * 0.4
      root.current.scale.setScalar(mobile ? 0.55 : 1)
      root.current.position.y = mobile ? -1.5 : 0
    }
    const cat = ui.get().category
    hubRefs.current.forEach((m, i) => {
      if (!m) return
      const active = cat === SKILL_GROUPS[i].id
      m.scale.setScalar(damp(m.scale.x || 1, active ? 1.5 : 1, 6, dt))
      m.rotation.y += dt * 0.6
      m.rotation.x += dt * 0.3
    })
  })

  return (
    <group ref={root}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.28} />
      </lineSegments>
      {data.hubs.map((h, i) => (
        <mesh key={h.id} position={h.pos} ref={(m) => (hubRefs.current[i] = m)}>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color="#04121a" emissive={h.color} emissiveIntensity={0.9} metalness={0.7} roughness={0.3} flatShading />
        </mesh>
      ))}
      {data.nodes.map((n) => (
        <SkillNode key={n.id} n={n} near={near} portal={portal} />
      ))}
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
