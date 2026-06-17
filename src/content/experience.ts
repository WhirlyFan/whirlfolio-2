import type { CareerNode } from './types'

/** Jobs, most recent first. Order here = order along the spiral arm (recent nearest the core). */
export const experience: CareerNode[] = [
  {
    id: 'usul',
    type: 'experience',
    title: 'Full Stack Software Engineer',
    org: 'Usul',
    location: 'San Francisco, CA',
    start: 'Jan 2026',
    end: 'Present',
    summary: 'Building AI-powered search and scalable backend architecture for government contract discovery.',
    highlights: [
      'Built AI-powered search using an MCP server to query contract data, alongside keyword search, enabling clients to discover matching government contracts by capabilities',
      'Led international feature rollout and onboarded clients globally across multiple regions',
      'Designed frontend overhaul, cutting load times by 50% via cache invalidation and real-time cross-client updates using server-sent events',
      'Designed backend architecture to scale from seed to enterprise — CI/CD workflows, migration management, ORMs, backend service layers, and AI orchestration',
      'Engineered LLM workflows to automatically process and surface relevant contract recommendations to customers',
      'Designed and implemented RBAC and RLS policies to secure the platform across services such as MCP and HTTP',
    ],
    tags: ['Python', 'FastAPI', 'FastMCP', 'TypeScript', 'React', 'LLM Orchestration', 'RBAC/RLS', 'CI/CD', 'PostgreSQL', 'SSE'],
  },
  {
    id: 'ut-ta',
    type: 'experience',
    title: 'Graduate Teaching Assistant',
    org: 'The University of Texas at Austin',
    location: 'Austin, TX · Part-time',
    start: 'Aug 2025',
    end: 'Present',
    summary: 'TA for graduate machine learning and AI courses.',
    highlights: [
      'Teaching assistant for "Deep Learning", "Case Studies in Machine Learning", and "Planning, Search, and Reasoning Under Uncertainty"',
    ],
    tags: ['Deep Learning', 'Machine Learning', 'Planning & Search', 'Teaching'],
  },
  {
    id: 'nouryon',
    type: 'experience',
    title: 'AI and Data Science Intern',
    org: 'Nouryon',
    location: 'Houston, TX',
    start: 'Jun 2025',
    end: 'Aug 2025',
    summary: 'Built a digital simulation of a multinational chemical manufacturing product line.',
    highlights: [
      'Designed a digital simulation for a multinational chemical manufacturing product line using years of historical data',
      'Identified process bottlenecks to recommend cost-saving improvements',
    ],
    tags: ['Python', 'SimPy', 'Data Science', 'Simulation'],
  },
  {
    id: 'apero-health',
    type: 'experience',
    title: 'Full Stack Software Engineer',
    org: 'Apero Health (YC Startup)',
    location: 'San Francisco, CA',
    start: 'May 2023',
    end: 'Jul 2023',
    summary: 'Built HIPAA-compliant tooling for healthcare clients at a YC-backed startup.',
    highlights: [
      'Designed a dynamic forms builder enabling healthcare clients to generate HIPAA-compliant forms',
      'Reduced legacy code duplication by 80% by overhauling the frontend to use a centralized component library',
    ],
    tags: ['React', 'TypeScript', 'Component Library', 'HIPAA'],
  },
]
