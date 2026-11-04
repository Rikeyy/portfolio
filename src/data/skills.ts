export interface SkillGroup {
  id: string
  title: string
  tagline: string
  color: string
  skills: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    tagline: 'Interfaces that feel fast and considered.',
    color: '#5ce1f5',
    skills: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML / CSS'],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    tagline: 'Services built to be reliable and maintainable.',
    color: '#00d4ff',
    skills: ['Java', 'Spring Boot', 'PHP', 'Laravel', 'Node.js', 'REST APIs'],
  },
  {
    id: 'infra',
    title: 'Database & Infrastructure',
    tagline: 'Solid foundations under every product.',
    color: '#7dd3fc',
    skills: ['MySQL', 'PostgreSQL', 'Linux', 'Nginx', 'Docker', 'Git', 'CI/CD'],
  },
  {
    id: 'creative',
    title: 'Creative Development',
    tagline: 'Motion and 3D as part of the product.',
    color: '#e4e4e7',
    skills: ['Three.js', 'React Three Fiber', 'GSAP', 'WebGL', 'Interactive UI', 'Motion Design'],
  },
]
