import { useState } from 'react'
import type { Photo } from '@/content'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

/** Responsive photo grid with a click-to-enlarge lightbox. */
export function PhotoGallery({ photos, className }: { photos: Photo[]; className?: string }) {
  const [open, setOpen] = useState(false)
  // Kept separate from `open` so the image stays rendered while the dialog
  // animates closed (clearing it on close would make the image vanish early).
  const [selected, setSelected] = useState<Photo | null>(null)

  const openPhoto = (p: Photo) => {
    setSelected(p)
    setOpen(true)
  }

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
        {photos.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => openPhoto(p)}
            className="group relative overflow-hidden rounded-lg border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {(p.subject || p.location) && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {p.subject}
                {p.subject && p.location ? ' · ' : ''}
                {p.location}
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-3 p-3 sm:p-4">
          {selected && (
            <>
              <img
                src={selected.src}
                alt={selected.alt}
                className="max-h-[75vh] w-full rounded-md object-contain"
              />
              <DialogTitle className="px-1 text-base">
                {selected.subject ?? 'Photo'}
              </DialogTitle>
              <DialogDescription className="px-1">
                {selected.location ?? selected.alt}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
