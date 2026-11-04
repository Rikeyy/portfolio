import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { view } from '../../lib/scroll'
import { stageY } from './rig'

/** Positions a scene at its own world-space slot and hides it when the camera is far away. */
export default function Stage({ index, children, range = 1.25 }: { index: number; children: ReactNode; range?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    if (g.current) g.current.visible = Math.abs(view.t - index) < range
  })
  return (
    <group ref={g} position={[0, stageY(index), 0]}>
      {children}
    </group>
  )
}
