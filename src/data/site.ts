const env = import.meta.env

export const site = {
  name: 'Rikey Kurniawan',
  title: 'Full Stack Developer',
  location: 'Malaysia',
  coords: '3.1390° N / 101.6869° E',
  /** Set in .env — never hard-coded so nothing is invented. */
  email: (env.VITE_CONTACT_EMAIL as string | undefined) ?? '',
  linkedin: (env.VITE_LINKEDIN_URL as string | undefined) ?? '',
  github: (env.VITE_GITHUB_URL as string | undefined) ?? '',
  formEndpoint: (env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '',
}

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const
