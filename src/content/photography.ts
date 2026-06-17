export interface Photo {
  /** Path under /public, e.g. "/photos/great-blue-heron.jpg". */
  src: string
  /** Accessible description. */
  alt: string
  /** Optional species or subject. */
  subject?: string
  /** Optional location. */
  location?: string
}

export interface Photography {
  intro: string
  photos: Photo[]
}

/**
 * Wildlife photography hobby. Drop images in public/photos/ and add an entry
 * per photo below — the gallery renders them automatically. Until then the
 * section shows an intro with a "coming soon" placeholder.
 */
export const photography: Photography = {
  // TODO(michael): edit this blurb to your voice.
  intro:
    'When I step away from the keyboard, I’m usually out with a camera. Wildlife photography is my way of slowing down — tracking birds and animals in their natural habitat and waiting for the right moment.',
  photos: [
    {
      src: '/photos/california-ground-squirrel.jpg',
      alt: 'A California ground squirrel sitting upright among grass and yellow wildflowers',
      subject: 'California Ground Squirrel',
    },
    {
      src: '/photos/gull-in-flight.jpg',
      alt: 'A gull gliding low over a field with hills in the background',
      subject: 'Gull in Flight',
    },
    {
      src: '/photos/mourning-dove.jpg',
      alt: 'A mourning dove foraging on the forest floor in soft light',
      subject: 'Mourning Dove',
    },
  ],
}
