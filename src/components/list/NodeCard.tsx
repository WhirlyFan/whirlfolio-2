import { ExternalLink } from 'lucide-react'
import type { CareerNode } from '@/content'
import { typeColor } from '@/content'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function dateRange(node: CareerNode) {
  if (node.start && node.end) return `${node.start} – ${node.end}`
  return node.start ?? node.end ?? ''
}

export function NodeCard({ node }: { node: CareerNode }) {
  const accent = node.color ?? typeColor[node.type]
  const range = dateRange(node)

  return (
    <Card className="relative gap-4 overflow-hidden py-5">
      {/* type accent bar */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold text-foreground">{node.title}</h3>
          {range && (
            <span className="text-xs whitespace-nowrap text-muted-foreground">{range}</span>
          )}
        </div>
        {(node.org || node.location) && (
          <p className="text-sm text-muted-foreground">
            {node.org}
            {node.org && node.location ? ' · ' : ''}
            {node.location}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {node.summary && <p className="text-sm text-foreground/80">{node.summary}</p>}

        {node.highlights.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-sm text-foreground/75">
            {node.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {node.tags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {node.tags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {node.links && node.links.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
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
      </CardContent>
    </Card>
  )
}
