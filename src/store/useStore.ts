import { create } from 'zustand'

/**
 * Global, discrete UI/app state shared across the Canvas boundary.
 *
 * BOUNDARY RULE: this holds "what the app is showing right now" — state that
 * changes on user interaction. Per-frame animation (galaxy rotation, uTime,
 * camera transform) lives in refs inside useFrame, NEVER here, because 60×/sec
 * state updates would trigger React renders and tank performance.
 *
 * Read narrow slices with selectors so components re-render only when their
 * slice changes: const selectedId = useStore((s) => s.selectedId)
 */

export type ViewMode = '3d' | 'list'
export type Quality = 'high' | 'low'
export type Theme = 'light' | 'dark'

const THEME_KEY = 'whirlfolio-theme'

/** Resolve the initial theme: stored preference → system preference → dark. */
function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Apply the theme to <html> (toggles the `.dark` class) and persist it. */
function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
  localStorage.setItem(THEME_KEY, theme)
}

interface AppState {
  selectedId: string | null
  hoveredId: string | null
  viewMode: ViewMode
  quality: Quality
  reducedMotion: boolean
  theme: Theme
  /** Bumped to request a camera reset to the overview pose. */
  cameraResetToken: number

  select: (id: string | null) => void
  resetCamera: () => void
  setHovered: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
  setQuality: (q: Quality) => void
  setReducedMotion: (v: boolean) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const useStore = create<AppState>((set) => ({
  selectedId: null,
  hoveredId: null,
  // Galaxy is the default experience; the capability hook downgrades weak
  // devices to 'list' on mount.
  viewMode: '3d',
  quality: 'high',
  reducedMotion: false,
  theme: initialTheme(),
  cameraResetToken: 0,

  select: (id) => set({ selectedId: id }),
  resetCamera: () => set((s) => ({ selectedId: null, cameraResetToken: s.cameraResetToken + 1 })),
  setHovered: (id) => set({ hoveredId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === '3d' ? 'list' : '3d' })),
  setQuality: (q) => set({ quality: q }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setTheme: (t) => {
    applyTheme(t)
    set({ theme: t })
  },
  toggleTheme: () =>
    set((s) => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    }),
}))

// Apply the resolved theme to <html> as soon as the store initializes.
applyTheme(useStore.getState().theme)
