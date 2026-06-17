import { Camera, Download, ExternalLink, Sparkles } from 'lucide-react'
import type { CareerNode } from '@/content'
import { nodeById, photography, profile, typeColor, typeLabel } from '@/content'
import { FUNFACTS_ID, PHOTOS_ID, PROFILE_ID } from '@/scene/constants'
import { useStore } from '@/store/useStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ProfilePhoto } from '@/components/common/ProfilePhoto'
import { PhotoGallery } from '@/components/common/PhotoGallery'

function dateRange(node: CareerNode) {
  if (node.start && node.end) return `${node.start} – ${node.end}`
  return node.start ?? node.end ?? ''
}

/** Slide-over detail for the selected star. Real DOM (selectable, accessible). */
export function DetailPanel() {
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)

  const isProfile = selectedId === PROFILE_ID
  const isFunfacts = selectedId === FUNFACTS_ID
  const isPhotos = selectedId === PHOTOS_ID
  const special = isProfile || isFunfacts || isPhotos
  const node = special ? undefined : nodeById(selectedId)
  const open = special || !!node

  return (
    <Sheet open={open} onOpenChange={(o) => !o && select(null)}>
      <SheetContent side="right" className="gap-0">
        {isProfile ? (
          <ProfileDetail />
        ) : isFunfacts ? (
          <FunFactsDetail />
        ) : isPhotos ? (
          <PhotosDetail />
        ) : node ? (
          <NodeDetail node={node} />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function NodeDetail({ node }: { node: CareerNode }) {
  const accent = node.color ?? typeColor[node.type]
  const range = dateRange(node)

  return (
    <>
      <SheetHeader className="gap-2 pb-4">
        <Badge
          variant="outline"
          className="w-fit gap-1.5"
          style={{ borderColor: accent, color: accent }}
        >
          <span className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
          {typeLabel[node.type]}
        </Badge>
        <SheetTitle className="text-xl leading-tight">{node.title}</SheetTitle>
        <SheetDescription className="text-foreground/70">
          {node.org}
          {node.org && node.location ? ' · ' : ''}
          {node.location}
          {range && (node.org || node.location) ? ' · ' : ''}
          {range}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-6">
        {node.summary && <p className="text-sm text-foreground/85">{node.summary}</p>}

        {node.highlights.length > 0 && (
          <ul className="flex flex-col gap-2 text-sm text-foreground/80">
            {node.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {node.tags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {node.tags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {node.links && node.links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {node.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function ProfileDetail() {
  return (
    <>
      <SheetHeader className="items-center gap-3 pb-4 text-center">
        <ProfilePhoto src={profile.photo} name={profile.name} className="size-24 text-xl" />
        <SheetTitle className="text-xl">{profile.name}</SheetTitle>
        <SheetDescription>{profile.tagline}</SheetDescription>
        <Button asChild size="sm" className="mt-1">
          <a href={profile.resumeUrl} download={profile.resumeFilename}>
            <Download className="size-4" />
            Download Resume
          </a>
        </Button>
      </SheetHeader>

      <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-6">
        {profile.about && <p className="text-sm text-foreground/85">{profile.about}</p>}

        {profile.aboutQuote && (
          <blockquote className="border-l-2 border-primary/60 pl-3">
            <p className="text-sm text-foreground/85 italic">“{profile.aboutQuote}”</p>
            <footer className="mt-1.5 text-xs text-muted-foreground not-italic">
              — Michael{profile.aboutQuoteYear ? `, ${profile.aboutQuoteYear}` : ''}
            </footer>
          </blockquote>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Technologies</h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.flatMap((g) => g.items).map((s) => (
              <Badge key={s} variant="secondary" className="font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: click any glowing star to explore my journey — and catch the comet
          for fun facts.
        </p>
      </div>
    </>
  )
}

function FunFactsDetail() {
  return (
    <>
      <SheetHeader className="gap-2 pb-4">
        <Badge variant="outline" className="w-fit gap-1.5">
          <Sparkles className="size-3" />
          Fun Facts
        </Badge>
        <SheetTitle className="text-xl leading-tight">A little about me</SheetTitle>
        <SheetDescription>Beyond the résumé.</SheetDescription>
      </SheetHeader>

      <div className="overflow-y-auto px-6 pb-6">
        <ul className="flex flex-col gap-3 text-sm text-foreground/85">
          {profile.funFacts.map((f, i) => (
            <li key={i} className="flex gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function PhotosDetail() {
  const { intro, photos } = photography
  return (
    <>
      <SheetHeader className="gap-2 pb-4">
        <Badge variant="outline" className="w-fit gap-1.5">
          <Camera className="size-3" />
          Wildlife Photography
        </Badge>
        <SheetTitle className="text-xl leading-tight">Through the lens</SheetTitle>
        <SheetDescription className="text-foreground/70">{intro}</SheetDescription>
      </SheetHeader>

      <div className="overflow-y-auto px-6 pb-6">
        {photos.length > 0 ? (
          <PhotoGallery photos={photos} className="grid-cols-2" />
        ) : (
          <p className="text-sm text-muted-foreground">Photos coming soon.</p>
        )}
      </div>
    </>
  )
}
