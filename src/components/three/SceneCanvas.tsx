import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import World from './World'
import { getQuality } from '../../lib/device'
import { ui } from '../../lib/store'

useTexture.preload(['/images/rikey-cutout.webp', '/images/rikey-depth.webp'])

export default function SceneCanvas() {
  const q = useMemo(getQuality, [])
  return (
    <Canvas
      dpr={q.dpr}
      camera={{ fov: 40, near: 0.1, far: 90, position: [0, 0, 7.5] }}
      gl={{ antialias: !q.mobile, powerPreference: 'high-performance', alpha: false }}
      eventSource={document.body}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.setClearColor('#050505')
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          ui.set({ webglFailed: true })
        })
      }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 40]} />
      <Suspense fallback={null}>
        <World q={q} />
      </Suspense>
    </Canvas>
  )
}
