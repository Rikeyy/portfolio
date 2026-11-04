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
    color: '#ff3030',
    skills: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML / CSS'],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    tagline: 'Services built to be reliable and maintainable.',
    color: '#e50914',
    skills: ['Java', 'Spring Boot', 'PHP', 'Laravel', 'Node.js', 'REST APIs'],
  },
  {
    id: 'infra',
    title: 'Database & Infrastructure',
    tagline: 'Solid foundations under every product.',
    color: '#ff7a6b',
    skills: ['MySQL', 'PostgreSQL', 'Linux', 'Nginx', 'Docker', 'Git', 'CI/CD'],
  },
  {
    id: 'creative',
    title: 'Creative Development',
    tagline: 'Motion and 3D as part of the product.',
    color: '#ffd6d0',
    skills: ['Three.js', 'React Three Fiber', 'GSAP', 'WebGL', 'Interactive UI', 'Motion Design'],
  },
]
