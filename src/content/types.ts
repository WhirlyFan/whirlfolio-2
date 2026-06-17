/**
 * Content types for Whirlfolio.
 *
 * Everything the site displays is plain data described here and filled in under
 * src/content/*. The galaxy scene and the 2D list view both read from this — so
 * adding a job/project/etc. is just adding one entry to an array, and a new star
 * appears automatically. No scene code needs to change.
 */

export type NodeType = 'experience' | 'education' | 'project' | 'research'

export interface NodeLink {
  label: string
  url: string
}

/**
 * A single career node = one star in the galaxy / one card in the list.
 */
export interface CareerNode {
  /** Stable unique id (used as React key and for selection state). */
  id: string
  type: NodeType
  /** Role, degree, or project name. */
  title: string
  /** Company, school, or "" for personal projects. */
  org: string
  location?: string
  /** Human-readable start, e.g. "Jan 2026". */
  start?: string
  /** Human-readable end, e.g. "Present". */
  end?: string
  /** One-line summary shown under the heading. */
  summary?: string
  /** Bullet points (the résumé highlights). */
  highlights: string[]
  /** Tech / tools used, rendered as badges. */
  tags?: string[]
  /** External links (repo, live site, paper, etc.). */
  links?: NodeLink[]
  /**
   * Optional visual overrides for the star. If omitted, the scene derives a
   * sensible color/size from `type` and recency.
   */
  color?: string
  size?: number
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface Profile {
  name: string
  /** Short headline, e.g. "Full Stack Software Engineer". */
  title: string
  /** One-line tagline shown near the core / hero. */
  tagline?: string
  email: string
  phone?: string
  linkedin?: string
  github?: string
  instagram?: string
  wellfound?: string
  /** Current about-me summary (plain prose). */
  about?: string
  /** A preserved time-capsule line + the year it was written (shown as a quote). */
  aboutQuote?: string
  aboutQuoteYear?: number
  /** Path under /public for the profile photo (square works best). */
  photo: string
  /** Path under /public for the downloadable resume PDF. */
  resumeUrl: string
  /** Filename used when the visitor downloads the resume. */
  resumeFilename: string
  /** Personal "fun facts" revealed by the shooting star. */
  funFacts: string[]
  skills: SkillGroup[]
}
