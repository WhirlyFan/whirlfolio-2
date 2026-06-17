import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProfilePhotoProps {
  src: string
  name: string
  className?: string
}

/**
 * Profile photo with a graceful initials fallback, so the site looks complete
 * before a real photo is dropped at the configured path (public/michael.jpg).
 */
export function ProfilePhoto({ src, name, className }: ProfilePhotoProps) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-accent ring-1 ring-border',
        className,
      )}
    >
      {failed ? (
        <span className="font-semibold tracking-wide text-foreground/90">
          {initials}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
