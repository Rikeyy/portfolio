import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import World from './World'
import { getQuality } from '../../lib/device'
import { ui } from '../../lib/store'


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
        gl.setClearColor('#05070a')
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          ui.set({ webglFailed: true })
        })
      }}
    >
      <color attach="background" args={['#05070a']} />
      <fog attach="fog" args={['#071018', 9, 38]} />
      <Suspense fallback={null}>
        <World q={q} />
      </Suspense>
    </Canvas>
  )
}
