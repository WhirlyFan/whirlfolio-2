import type { CareerNode } from './types'

export const education: CareerNode[] = [
  {
    id: 'ut-austin',
    type: 'education',
    title: 'M.S. in Computer Science',
    org: 'The University of Texas at Austin',
    start: 'Aug 2024',
    end: 'May 2026',
    summary: 'GPA: 4.0',
    highlights: [
      'Coursework: Natural Language Processing; Deep Learning; Android Programming; Reinforcement Learning',
    ],
    tags: ['NLP', 'Deep Learning', 'Reinforcement Learning', 'Android'],
  },
  {
    id: 'uc-irvine-econ',
    type: 'education',
    title: 'B.A. in Business Economics',
    org: 'University of California – Irvine',
    start: 'Sep 2018',
    end: 'Jun 2022',
    highlights: [],
  },
  {
    id: 'uc-irvine-intl',
    type: 'education',
    title: 'B.A. in International Studies',
    org: 'University of California – Irvine',
    start: 'Sep 2018',
    end: 'Jun 2022',
    highlights: [],
  },
]
