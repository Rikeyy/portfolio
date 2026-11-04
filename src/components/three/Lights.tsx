import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { intro } from '../../lib/store'
import { view } from '../../lib/scroll'

const INTENSITY = [1, 0.7, 0.6, 1, 0.9, 1, 1.2]

export default function Lights() {
  const key = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  useFrame(({ camera }) => {
    if (!key.current || !rim.current) return
    const i = Math.min(Math.floor(view.t), INTENSITY.length - 2)
    const f = view.t - i
    const k = INTENSITY[i] * (1 - f) + INTENSITY[i + 1] * f
    const base = view.t < 0.8 ? intro.light : 1
    key.current.intensity = 60 * k * base
    rim.current.intensity = 22 * k * base
    key.current.position.set(camera.position.x + 3, camera.position.y + 2, camera.position.z - 2)
    rim.current.position.set(camera.position.x - 4, camera.position.y - 1, camera.position.z + 1)
  })
  return (
    <>
      <ambientLight intensity={0.25} color="#b4e4ff" />
      <pointLight ref={key} color="#2f7bff" distance={40} decay={2} />
      <pointLight ref={rim} color="#5ce1f5" distance={30} decay={2} />
    </>
  )
}
