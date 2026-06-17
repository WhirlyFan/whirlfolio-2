# Whirlfolio — Career Galaxy

An interactive 3D portfolio for **Michael Lee**. Visitors explore Michael's
career as a **spiral galaxy** — a procedurally-generated Milky Way whose swirling
arms are made of thousands of stars. The galactic core is Michael; select career
moments are **bright, named stars** woven into the arms. Clicking a star opens a
readable detail panel. Built recruiter-first and mobile-first: the "wow" lives on
top, but every fact is one tap away.

The swirl is the signature — it ties to Michael's **WhirlyFan / whirlyfan.com**
identity and deliberately steps away from the generic "solar system portfolio."

## Decisions locked in
- **Concept:** Career Galaxy — spiral Milky Way backdrop; career nodes are stars (not planets), emphasizing the swirl
- **Primary goal:** Land a job / impress recruiters → readability + résumé download are non-negotiable
- **Perf target:** Must work on mobile → hard optimization + graceful 2D fallback

## Guiding principle
**Wow on top, substance one tap away.** A recruiter on a phone in 10 seconds
must be able to: read who Michael is, see current role, and download the PDF —
without ever rotating a planet. The 3D is the hook, not the gate.

---

## Architecture

Content is fully separated from the experience. Editing the portfolio means
editing plain TS files in `src/content/` — the scene and list view generate
themselves. **Add a job = add one array entry → a new planet appears.**

```
src/
  content/
    types.ts        # shared types (Profile, CareerNode, ...)
    profile.ts      # name, title, contact, photo, résumé, fun facts
    experience.ts   # jobs
    education.ts    # degrees
    projects.ts     # projects
    research.ts     # research/publications
    skills.ts       # grouped skills
    index.ts        # aggregates + sorts into ordered "system" nodes
  store/
    useStore.ts     # zustand: selectedId, hoveredId, viewMode, quality, reducedMotion
                    #   (discrete app/UI state ONLY — see "State boundary" below)
  hooks/
    useDeviceCapability.ts   # screen/WebGL/memory/reduced-motion → quality tier
  components/
    chrome/
      TopBar.tsx      # name, title, contact, "Download Résumé", view toggle
      Onboarding.tsx  # first-load hint overlay
    list/
      ListView.tsx    # 2D accessible fallback (mobile + recruiter + SEO + no-JS)
    scene/
      Galaxy.tsx       # <Canvas> root, lazy-loaded
      GalaxyArms.tsx   # procedural spiral Points system (dust + stars), slow rotation
      Starfield.tsx    # deep-space background stars + faint nebula haze
      Core.tsx         # galactic core = Michael (profile photo + name/title, glowing bulge)
      CareerStar.tsx   # one clickable career node, placed on a spiral arm
      ShootingStar.tsx # fun facts (streaks across the galaxy)
      CameraRig.tsx    # smooth fly-to selected star + reset
    panel/
      DetailPanel.tsx # HTML overlay for the selected node (real DOM, a11y)
  App.tsx
  main.tsx
public/
  resume.pdf          # Michael's actual résumé (copied from ~/Downloads)
  michael.jpg         # profile photo (placeholder until provided)
```

### Data model (draft)
```ts
type NodeType = 'experience' | 'education' | 'project' | 'research'

interface CareerNode {
  id: string
  type: NodeType
  title: string          // role / degree / project name
  org: string            // company / school
  location?: string
  start?: string         // 'Jan 2026'
  end?: string           // 'Present'
  summary?: string
  highlights: string[]
  tags?: string[]        // tech used
  links?: { label: string; url: string }[]
  color?: string         // visual override
  size?: number          // relative planet size
}

interface Profile {
  name: string; title: string; tagline?: string
  email: string; phone?: string
  website?: string; linkedin?: string; github?: string
  photo: string; resumeUrl: string
  funFacts: string[]
  skills: { group: string; items: string[] }[]
}
```

### Résumé → galaxy mapping
- **🌟 Galactic core = Michael** — glowing central bulge with photo, name,
  "Full Stack SWE · M.S. CS @ UT Austin". Brightest point of the galaxy.
- **✨ Career stars**, placed along the spiral arms and color-coded by type.
  The journey reads inward: most recent nearest the luminous core, earlier
  steps trailing out along the arm. Each is a bright, labeled star that stands
  out from the dust particles.
  - `experience`: Usul (current, closest to core), Nouryon (intern), Apero Health (YC)
  - `education`: UT Austin (M.S. CS), UC Irvine (B.A.) — distinct hue
  - `research`: NLI Robustness paper — distinct hue / pulsing
- **💫 Companion stars = projects** — Lister, Breezy (small stars clustered near
  a parent, or their own minor arm)
- **🌠 Shooting star = fun facts** — streaks across the galaxy; click for the
  personal stuff (content TBD from Michael)
- **🌫️ Nebula = wildlife photography hobby** — a colorful nebula region (or
  small star cluster); click to open a gallery lightbox of Michael's photos.
  In the list view this is the "Wildlife Photography" gallery section.
- **🛰️ Skills** — shown in detail panels + the list view (keeps the scene uncluttered)

### The spiral (signature visual)
- Arms generated with a **logarithmic spiral**: each particle gets a radius, an
  angle offset by `radius * spin`, snapped toward the nearest of N arms, plus
  randomized scatter (power-curved so dust hugs the arm). Classic galaxy-generator
  technique, fully procedural.
- **Color gradient** core→rim (warm white/gold bulge → cool blue/violet arms) via
  per-particle vertex colors.
- Slow rotation (optional subtle differential rotation — inner spins faster) sells
  the "whirl." Paused under `prefers-reduced-motion`.
- Career stars are separate, larger additive sprites placed at computed arm
  positions so they're always distinguishable and hoverable.

---

## Tech
- **3D:** `three` + `@react-three/fiber` (v9, React 19 compatible) + `@react-three/drei`
- **UI / 2D layer:** **Tailwind CSS v4** + **shadcn/ui** for all HTML chrome —
  `Button` (résumé download / view toggle), `Card` (list items), `Sheet` (the
  detail panel sliding over the canvas), `Badge` (skills/tags), `Tooltip`,
  `Dialog` (onboarding). Gives polished, accessible components fast.
- `zustand` for app state
- `@react-three/postprocessing` for bloom — **desktop/high-tier only** (Phase 3)
- Content as plain TS; detail panels & list as real DOM for a11y/SEO

> Note: Tailwind v4 uses the `@tailwindcss/vite` plugin (CSS-first config, no
> `tailwind.config.js` needed). shadcn components are vendored into
> `src/components/ui/` and styled via Tailwind tokens — themeable to the space palette.

## State management (zustand) & the state boundary

zustand is the single source of truth for **discrete, cross-cutting app/UI
state** that lives on both sides of the Canvas boundary. Selectors mean each
component re-renders only when its slice changes (a Context would re-render all
subscribers) — this is both the organizational and the performance win.

```ts
interface AppState {
  selectedId: string | null   // open career star → scene + camera + panel + list
  hoveredId: string | null    // hover highlight + cursor
  viewMode: '3d' | 'list'     // galaxy vs recruiter list (top-bar toggle)
  quality: 'high' | 'low'     // capability tier → effects on/off across scene
  reducedMotion: boolean      // freeze shader uTime
  select: (id: string | null) => void
  setHovered: (id: string | null) => void
  setViewMode: (m: '3d' | 'list') => void
}
// usage: const selectedId = useStore(s => s.selectedId)  // narrow slice
```

**The boundary rule (critical for perf):**
- ✅ **zustand** = "what is the app *showing* right now" — discrete state that
  changes on user interaction (selected, hovered, view, quality).
- ✅ **refs in `useFrame`** = "what is *moving* right now" — per-frame animation
  (galaxy rotation, `uTime`, pulsing). NEVER in React/zustand state; 60×/sec
  state updates would trigger renders and tank performance. camera-controls owns
  the camera transform.
- ✅ **static imports** = résumé content (`src/content/`) — not state at all.
- ✅ **`useMemo` (local)** = per-particle buffers.

## Researched techniques (verified 2025–2026)

Findings from a deep-research pass; each below was confirmed 3-0 against
first-party docs (Three.js Journey, R3F/drei/react-postprocessing docs,
camera-controls & three-mesh-bvh repos). These are the patterns we implement.

### Galaxy generation & animation
- **One `THREE.Points` + `BufferGeometry`** for the whole galaxy — never many
  meshes. Per-particle positions in a `Float32Array(count*3)` (`i3 = i*3`),
  bound via `BufferAttribute`. Material: `AdditiveBlending`, `depthWrite:false`,
  `sizeAttenuation:true`. This is the Journey "galaxy generator" idiom and keeps
  us to a single draw call (R3F caps at ~1000; aim for a few hundred).
- **Animate on the GPU, not the CPU.** Mutating thousands of vertices per frame
  in JS does not scale (~10k particle bottleneck). Rotate/twinkle in a **custom
  vertex shader**: rotate by distance from center (inverse-proportional → core
  spins faster), which *is* the whirl.
- Author the shader with drei's **`shaderMaterial(uniforms, vert, frag)`** helper
  (uniforms become auto setter/getters). ⚠️ `ShaderMaterial` has **no `size` or
  `sizeAttenuation`** — reimplement `gl_PointSize` and scale by inverse depth
  (`gl_PointSize *= 1.0 / -mvPosition.z`).
- Build position/color buffers in **`useMemo`** (never per render); animate by
  setting one `uTime` uniform in `useFrame` (with `delta`).

### Clickable career nodes
- A **small set of separate meshes/sprites** (NOT part of the Points cloud), each
  with R3F pointer handlers (`onClick`, `onPointerOver/Out`).
- Objects are **transparent to pointer events by default** → call
  `e.stopPropagation()` so a node occludes background particles behind it.
- **Skip three-mesh-bvh / `<Bvh>`** for now — it accelerates *mesh* raycasting and
  is overkill for a handful of nodes; instead restrict raycast targets to the node
  set. (Revisit only if picking ever gets slow.)
- Labels: drei `<Billboard>` (always faces camera) or `<Html>` — to validate
  during build (occlusion/perf with many labels was not independently verified).

### Bloom / glow
- **`@react-three/postprocessing` `<EffectComposer><Bloom/>`**. Bloom is
  **selective by default**: push picked materials' color out of 0–1
  (`emissiveIntensity > 1`) **with `toneMapped={false}`**, and set
  `luminanceThreshold` near 1 so only intentionally over-bright things glow
  (core, career stars). Use `<SelectiveBloom>` (needs `selection` + `lights`) for
  an explicit subset.
- **Mobile/low tier: disable the composer**, fake glow with additive halo
  sprites (cheaper). (Halo-as-substitute not independently verified — validate visually.)

### Camera fly-to
- drei **`<CameraControls>`** (wraps yomotsu/camera-controls v3). Fly to a node:
  `controls.setLookAt(camX,camY,camZ, targetX,targetY,targetZ, true)` — the
  trailing `true` (`enableTransition`) animates per `smoothTime`. Also `dollyTo`,
  `rotateTo`. Reset = `setLookAt(...defaultPose, true)`. Replaces OrbitControls
  (don't run both).

### ⚠️ Key conflict to design around: frameloop
- `frameloop="demand"` (render only on change) **conflicts with a galaxy whose
  shader animates every frame.** A continuously-rotating galaxy needs the default
  **`frameloop="always"`**. Mitigate battery cost by pausing render when the tab
  is hidden and under `prefers-reduced-motion` (freeze `uTime`). Use `demand` +
  `invalidate()` only if we later decide the galaxy can come to rest.

### Stack version note
- **R3F v9 = the React 19 compatibility line** (what we're on). React 19.2 bumped
  the reconciler, so pin a recent **v9.x patch** and verify peerDeps at install.

### Anti-patterns to avoid (verified)
- ❌ `setState` inside `useFrame` → ✅ mutate object props directly, scaled by `delta`.
- ❌ Allocating `new Vector3()` per frame → ✅ reuse one declared outside the loop (`vec.set(...)`).
- ❌ Recreating geometries/materials per render → ✅ share or `useMemo`; remember
  `useMemo` does **not** auto-dispose — call `.dispose()` on cleanup/dep change.

## Performance & accessibility strategy
- **Capability detection** → quality tiers (`high` / `low` / `list-only`):
  small screen, no WebGL2, low deviceMemory, or `prefers-reduced-motion`
  drops effects or defaults straight to the list.
- **Low tier:** capped DPR, low-poly spheres, no bloom, no shadows, fewer stars,
  paused/slowed orbits.
- **Lazy-load** the 3D bundle (`React.lazy` + `Suspense`) so first paint + list
  view are instant; Canvas hydrates after.
- **List view is the accessibility & SEO backbone** — full semantic HTML of all
  content, keyboard navigable, works with JS disabled / for crawlers.
- Detail panels are HTML overlays (selectable text, screen-reader friendly),
  not 3D text.
- Mobile default = list view with a prominent **"Launch 3D ✨"** button.

---

## Build phases

### Phase 0 — Foundation & cleanup
- Rename package `ui` → `whirlfolio`; clean `index.html` (title, meta, lang).
- Remove Vite demo (App.css demo, hero/react/vite assets, counter).
- Add deps (three, fiber, drei, zustand).
- Build `content/` data layer + types, seeded with **real résumé data**.
- Copy `~/Downloads/Michael_Lee_Resume.pdf` → `public/resume.pdf`; add photo placeholder.
- zustand store + space theme tokens (dark, accent palette).

### Phase 1 — Recruiter-ready 2D core (deployable on its own)
- `TopBar`: name, title, contact links, **Download Résumé**, view toggle.
- `ListView`: every section (experience, education, projects, research, skills,
  fun facts), responsive + accessible.
- ✅ Milestone: a complete, shareable portfolio with zero 3D risk.

### Phase 2 — Galaxy core
- `<Canvas>` + Starfield + procedural spiral `GalaxyArms` + glowing `Core` (profile).
- Data-driven `CareerStar`s placed on the arms; slow galaxy rotation.
- OrbitControls (drag / scroll / pinch), tilted 3/4 view to show the spiral.
- Click star → `CameraRig` flies in → `DetailPanel` slides over. Home/reset.
- Capability detection + quality tiers + lazy-load; mobile fallback.
- ✅ Milestone: explorable galaxy, all content reachable in 3D.

### Phase 3 — Polish & delight
- Shooting star (fun facts), companion-star projects, bloom (desktop), star
  labels & hover, whirl/warp fly-to transition, onboarding hint, loading screen.
- SEO meta + OG image, favicon, deploy (Vercel/Netlify/Pages).

---

## Open questions for Michael
1. **Fun facts** — not on the résumé. What should the comet reveal? (3–6 facts)
2. **Profile photo** — drop a square image; until then a placeholder is used.
3. **Theme** — deep-space dark default. Any color/accent preference (e.g. blue,
   purple, the whirlyfan green)?
4. **Education & research as stars** — OK to render them as color-coded stars in
   the galaxy, or keep them list-only?
5. **Deploy target** — Vercel / Netlify / GitHub Pages / other?
6. **Naming** — site title "Whirlfolio"? Use whirlyfan.com domain?
