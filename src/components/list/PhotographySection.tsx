import { Camera, ImageOff } from 'lucide-react'
import { photography } from '@/content'
import { PhotoGallery } from '@/components/common/PhotoGallery'

/**
 * Wildlife photography hobby section. Renders a responsive gallery from
 * photography.photos, or a tasteful "coming soon" placeholder while empty.
 */
export function PhotographySection() {
  const { intro, photos } = photography

  return (
    <section className="mt-12" aria-labelledby="photography-heading">
      <h2
        id="photography-heading"
        className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"
      >
        <Camera className="size-4 text-primary" />
        Wildlife Photography
      </h2>

      <p className="mb-4 max-w-prose text-sm text-foreground/80">{intro}</p>

      {photos.length > 0 ? (
        <PhotoGallery photos={photos} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground"
            >
              <ImageOff className="size-5" />
              <span className="text-xs">Photos coming soon</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
