import type { CareerNode } from './types'

export const projects: CareerNode[] = [
  {
    id: 'music',
    type: 'project',
    title: 'Music',
    org: '',
    summary: 'A collaborative music player desktop app — listen alone, or start a "jam" and play in sync with friends.',
    highlights: [
      'Built a macOS desktop app (Tauri v2) with a React SPA frontend and a local Rust (axum) engine that resolves and streams audio entirely on-device',
      'Implemented real-time "jam" sessions so friends listen in perfect sync, backed by Django Channels over WebSockets',
      'Designed a thin cloud backend (Django, PostgreSQL) for metadata, playlists, and social/sync — keeping all streaming local',
    ],
    tags: ['React', 'TypeScript', 'Tauri', 'Rust', 'Django', 'PostgreSQL', 'WebSockets'],
    links: [{ label: 'GitHub', url: 'https://github.com/WhirlyFan/music' }],
  },
  {
    id: 'lister',
    type: 'project',
    title: 'Lister',
    org: '',
    summary: 'Full-stack MyAnimeList clone with live chat, followers, anime lists, and reviews.',
    highlights: [
      'Full-stack MyAnimeList clone with live chat, followers, anime lists, and reviews using React/Redux, Flask, and SQLAlchemy',
      'Implemented real-time communication via WebSockets and integrated a third-party API for detailed anime data',
    ],
    tags: ['React', 'Redux', 'Flask', 'SQLAlchemy', 'WebSockets'],
    links: [{ label: 'GitHub', url: 'https://github.com/WhirlyFan/Lister' }],
  },
  {
    id: 'breezy',
    type: 'project',
    title: 'Breezy',
    org: '',
    start: 'Apr 2025',
    summary: 'An Android app in Kotlin modeled after Instagram.',
    highlights: [
      'Built an Android application in Kotlin modeled after Instagram, supporting CRUD operations on posts, comments, likes, and messages',
      'Backend utilizes Supabase for authentication, real-time messaging, and PostgreSQL triggers and functions',
    ],
    tags: ['Kotlin', 'Android', 'Supabase', 'PostgreSQL'],
  },
]
