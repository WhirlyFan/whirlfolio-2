import type { Profile } from './types'

export const profile: Profile = {
  name: 'Michael Lee',
  title: 'Full Stack Software Engineer',
  tagline: 'Full Stack Software Engineer · M.S. Computer Science @ UT Austin',
  email: 'mhykoly@gmail.com',
  phone: '714-504-3953',
  linkedin: 'https://linkedin.com/in/mhykoly',
  github: 'https://github.com/WhirlyFan',
  // Drop a square image at public/michael.jpg to replace the placeholder.
  photo: '/michael.jpg',
  resumeUrl: '/Michael_Lee_Resume.pdf',
  resumeFilename: 'Michael_Lee_Resume.pdf',

  // TODO(michael): replace these with your real fun facts (revealed by the shooting star).
  funFacts: [
    'My handle "WhirlyFan" is where the name Whirlfolio comes from.',
    'I went from a Business Economics degree to building AI systems.',
    'I spend my free time hiking and exploring nature — it pairs perfectly with wildlife photography.',
  ],

  skills: [
    {
      group: 'Languages',
      items: ['Python', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SQL'],
    },
    {
      group: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Vite', 'Redux', 'Express', 'Apollo', 'GraphQL', 'Django', 'Flask', 'FastAPI'],
    },
    {
      group: 'Data & AI',
      items: ['PyTorch', 'FastMCP', 'SimPy', 'Streamlit', 'Claude Code'],
    },
    {
      group: 'Infrastructure & Tools',
      items: ['Git', 'PostgreSQL', 'Supabase', 'Docker', 'Redis', 'Hatchet', 'Porter', 'Kotlin'],
    },
  ],
}
