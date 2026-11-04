import { useEffect } from 'react'
import CameraRig from './CameraRig'
import Lights from './Lights'
import Particles from './Particles'
import Stage from './Stage'
import HeroStage from './HeroStage'
import AboutStage from './AboutStage'
import ConstellationStage from './ConstellationStage'
import ProjectsStage from './ProjectsStage'
import JourneyStage from './JourneyStage'
import PhilosophyStage from './PhilosophyStage'
import ContactStage from './ContactStage'
import { ui } from '../../lib/store'
import type { Quality } from '../../lib/device'

export default function World({ q }: { q: Quality }) {
  useEffect(() => {
    ui.set({ ready: true })
  }, [])
  return (
    <>
      <CameraRig reduced={q.reduced} fine={q.fine} />
      <Lights />
      <Particles count={q.particles} reduced={q.reduced} />
      <Stage index={0}>
        <HeroStage reduced={q.reduced} />
      </Stage>
      <Stage index={1}>
        <AboutStage reduced={q.reduced} />
      </Stage>
      <Stage index={2}>
        <ConstellationStage reduced={q.reduced} />
      </Stage>
      <Stage index={3}>
        <ProjectsStage reduced={q.reduced} />
      </Stage>
      <Stage index={4} range={1.6}>
        <JourneyStage reduced={q.reduced} />
      </Stage>
      <Stage index={5}>
        <PhilosophyStage reduced={q.reduced} />
      </Stage>
      <Stage index={6}>
        <ContactStage reduced={q.reduced} />
      </Stage>
    </>
  )
}
