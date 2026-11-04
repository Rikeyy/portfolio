export type MockupKind = 'ecosystem' | 'nursing' | 'triage' | 'mobile' | 'portal'

export interface Project {
  slug: string
  index: string
  title: string
  category: string
  description: string
  tech: string[]
  mockup: MockupKind
  overview: string
  problem: string
  solution: string
  architecture: { label: string; detail: string }[]
  contribution: string[]
}

/**
 * High-level, non-confidential summaries only. No client data, metrics or
 * screenshots are included. Edit freely — everything on the case-study
 * overlay is driven from this file.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'selangkah-digital-ecosystem',
    index: '01',
    title: 'Selangkah Digital Ecosystem',
    category: 'Healthcare / Digital Platform',
    description:
      'Engineering and maintaining large-scale digital healthcare platforms, connecting users, healthcare providers and enterprise operations.',
    tech: ['Java', 'PHP', 'Node.js', 'Vue.js', 'MySQL', 'REST APIs'],
    mockup: 'ecosystem',
    overview:
      'A connected set of digital healthcare platforms that brings users, healthcare providers and enterprise operations onto shared infrastructure.',
    problem:
      'Healthcare products serve several audiences at once. Each expects dependable, consistent behaviour while the platform keeps evolving underneath them.',
    solution:
      'Multiple back-end services exposed through REST APIs, consumed by web front-ends and backed by a relational data layer — designed so individual services can change without destabilising the whole ecosystem.',
    architecture: [
      { label: 'Clients', detail: 'Vue.js web front-ends' },
      { label: 'API layer', detail: 'REST APIs' },
      { label: 'Services', detail: 'Java · PHP · Node.js' },
      { label: 'Data', detail: 'MySQL' },
    ],
    contribution: [
      'Engineering and maintaining platform features across the stack',
      'Designing and consuming REST APIs between services and clients',
      'Working across Java, PHP and Node.js services as the product evolves',
    ],
  },
  {
    slug: 'selcare-nursing-system',
    index: '02',
    title: 'SelCare Nursing System',
    category: 'Healthcare / Enterprise System',
    description:
      'Building an enterprise nursing management platform designed to streamline clinical operations and healthcare workflows.',
    tech: ['Spring Boot', 'Java', 'React / Next.js', 'MySQL'],
    mockup: 'nursing',
    overview:
      'An enterprise nursing management platform focused on making day-to-day clinical operations and workflows more streamlined.',
    problem:
      'Clinical operations involve many handoffs and repeated manual steps. Staff need software that stays out of the way while keeping workflows consistent.',
    solution:
      'A Spring Boot back end modelling the operational workflows, paired with a modern React / Next.js interface and a MySQL data layer.',
    architecture: [
      { label: 'Interface', detail: 'React / Next.js' },
      { label: 'API layer', detail: 'Spring Boot REST' },
      { label: 'Domain', detail: 'Java services' },
      { label: 'Data', detail: 'MySQL' },
    ],
    contribution: [
      'Building enterprise back-end services with Java and Spring Boot',
      'Developing the front-end experience for clinical workflows',
      'Structuring data and APIs around real operational processes',
    ],
  },
  {
    slug: 'path-patient-assessment-triage-hub',
    index: '03',
    title: 'PATH — Patient Assessment & Triage Hub',
    category: 'Healthcare / Clinical Technology',
    description:
      'Designing a modern assessment and triage platform with structured registration, patient workflows and clinical management.',
    tech: ['Java', 'Spring Boot', 'Next.js', 'TypeScript'],
    mockup: 'triage',
    overview:
      'A patient assessment and triage hub built around structured registration, defined patient workflows and clinical management.',
    problem:
      'Triage depends on capturing the right information, in the right order, quickly. Unstructured intake slows everything that follows.',
    solution:
      'Structured registration and assessment flows in a typed Next.js front end, backed by Spring Boot services that own the patient workflow rules.',
    architecture: [
      { label: 'Interface', detail: 'Next.js · TypeScript' },
      { label: 'API layer', detail: 'Spring Boot REST' },
      { label: 'Workflow', detail: 'Assessment & triage rules' },
      { label: 'Data', detail: 'Patient records' },
    ],
    contribution: [
      'Designing the registration and assessment workflow structure',
      'Building typed front-end flows with Next.js and TypeScript',
      'Implementing back-end services with Java and Spring Boot',
    ],
  },
  {
    slug: 'selangkah-app-revamp',
    index: '04',
    title: 'Selangkah App Revamp',
    category: 'Mobile / Digital Product',
    description:
      'Enhancing a digital ecosystem through improved authentication, wallet functionality, profile management and application infrastructure.',
    tech: ['Flutter', 'PHP', 'Node.js', 'REST APIs'],
    mockup: 'mobile',
    overview:
      'A revamp of the Selangkah mobile experience covering authentication, wallet functionality, profile management and the infrastructure beneath the app.',
    problem:
      'A growing app needs its foundations — sign-in, wallet and profile — to be dependable, because every other feature leans on them.',
    solution:
      'A Flutter client talking to PHP and Node.js services over REST APIs, with the account, wallet and profile capabilities reworked as shared building blocks.',
    architecture: [
      { label: 'Mobile', detail: 'Flutter' },
      { label: 'API layer', detail: 'REST APIs' },
      { label: 'Services', detail: 'PHP · Node.js' },
      { label: 'Capabilities', detail: 'Auth · Wallet · Profile' },
    ],
    contribution: [
      'Improving authentication and account flows',
      'Working on wallet and profile management capabilities',
      'Strengthening the application infrastructure behind the app',
    ],
  },
  {
    slug: 'digital-government-platforms',
    index: '05',
    title: 'Digital Government Platforms',
    category: 'Public Sector / Digital Transformation',
    description:
      'Developing digital platforms that support public-sector programmes, citizen registration, administration and operational management.',
    tech: ['PHP', 'Laravel', 'Vue.js', 'MySQL'],
    mockup: 'portal',
    overview:
      'Digital platforms supporting public-sector programmes: citizen registration, administration and operational management.',
    problem:
      'Public programmes need to register and administer many people consistently, with processes that stay clear for both citizens and administrators.',
    solution:
      'Laravel back ends with Vue.js interfaces and a MySQL data layer, separating the citizen-facing flows from the administrative tooling.',
    architecture: [
      { label: 'Citizen & admin UI', detail: 'Vue.js' },
      { label: 'Application', detail: 'Laravel' },
      { label: 'Data', detail: 'MySQL' },
    ],
    contribution: [
      'Building registration and administration features with Laravel',
      'Developing Vue.js interfaces for citizens and administrators',
      'Supporting operational management workflows end to end',
    ],
  },
]
