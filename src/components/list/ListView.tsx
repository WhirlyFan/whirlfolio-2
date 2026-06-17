import type { ComponentType } from 'react'
import { Download, Mail, Phone, Sparkles } from 'lucide-react'
import { profile, sections } from '@/content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProfilePhoto } from '@/components/common/ProfilePhoto'
import { NodeCard } from './NodeCard'
import { PhotographySection } from './PhotographySection'

/**
 * The recruiter-ready, fully accessible 2D portfolio. Real semantic HTML — this
 * is also the SEO backbone and the fallback for mobile / reduced-motion / no-WebGL.
 */
export function ListView() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-24 pb-24 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <ProfilePhoto
          src={profile.photo}
          name={profile.name}
          className="size-28 shrink-0 text-2xl sm:size-32"
        />
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="mt-1 text-muted-foreground">{profile.tagline}</p>
            )}
          </div>

          <ContactRow />

          <div className="flex justify-center sm:justify-start">
            <Button asChild>
              <a href={profile.resumeUrl} download={profile.resumeFilename}>
                <Download className="size-4" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-12" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-4 text-lg font-semibold text-foreground">
          Technologies
        </h2>
        <div className="flex flex-col gap-3">
          {profile.skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
              <span className="shrink-0 pt-0.5 text-sm font-medium text-muted-foreground sm:w-44">
                {g.group}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <Badge key={s} variant="outline" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career sections */}
      {sections.map(
        (section) =>
          section.nodes.length > 0 && (
            <section key={section.type} className="mt-12" aria-labelledby={`${section.type}-heading`}>
              <h2
                id={`${section.type}-heading`}
                className="mb-4 text-lg font-semibold text-foreground"
              >
                {section.label}
              </h2>
              <div className="flex flex-col gap-4">
                {section.nodes.map((node) => (
                  <NodeCard key={node.id} node={node} />
                ))}
              </div>
            </section>
          ),
      )}

      {/* Wildlife photography */}
      <PhotographySection />

      {/* Fun facts */}
      {profile.funFacts.length > 0 && (
        <section className="mt-12" aria-labelledby="fun-heading">
          <h2 id="fun-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" />
            Fun Facts
          </h2>
          <ul className="flex flex-col gap-2">
            {profile.funFacts.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

type IconType = ComponentType<{ className?: string }>

function ContactRow() {
  const items = [
    profile.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: profile.phone, href: `tel:${profile.phone}` },
    profile.linkedin && { icon: LinkedinIcon, label: 'LinkedIn', href: profile.linkedin },
    profile.github && { icon: GithubIcon, label: 'GitHub', href: profile.github },
  ].filter(Boolean) as { icon: IconType; label: string; href: string }[]

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:justify-start">
      {items.map(({ icon: Icon, label, href }) => (
        <a
          key={href}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon className="size-4" />
          {label}
        </a>
      ))}
    </div>
  )
}

/* Brand icons (lucide v1 dropped these for trademark reasons). */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.65.24 2.87.12 3.17.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.69.83.57A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
