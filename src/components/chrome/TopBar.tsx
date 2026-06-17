import { Download, LayoutList, Moon, Orbit, Sun } from 'lucide-react'
import { profile } from '@/content'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'

/**
 * Persistent chrome over everything. Recruiter-first: name + title always
 * visible, résumé download one click away, and a toggle between the galaxy and
 * the plain list view.
 */
export function TopBar() {
  const viewMode = useStore((s) => s.viewMode)
  const toggleViewMode = useStore((s) => s.toggleViewMode)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
          {profile.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{profile.title}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          aria-label={viewMode === 'list' ? 'Switch to galaxy view' : 'Switch to list view'}
        >
          {viewMode === 'list' ? (
            <>
              <Orbit className="size-4" />
              <span className="hidden sm:inline">Galaxy</span>
            </>
          ) : (
            <>
              <LayoutList className="size-4" />
              <span className="hidden sm:inline">List</span>
            </>
          )}
        </Button>

        <Button size="sm" asChild>
          <a href={profile.resumeUrl} download={profile.resumeFilename}>
            <Download className="size-4" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
