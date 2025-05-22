// contentIndex.ts

// Export only types here - no runtime code with the same name
export ContentIndex = Map<string, ContentDetails>

// Export any runtime functions related to ContentIndex here

export function generateRSSFeed(
  cfg: GlobalConfiguration,
  idx: ContentIndex,
  limit?: number
): string {
  const base = cfg.baseUrl ?? ""

  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base, encodeURI(slug))}</link>
    <guid>https://${joinSegments(base, encodeURI(slug))}</guid>
    <description>${content.richContent ?? content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`

  const items = Array.from(idx)
    .sort(([_, f1], [__, f2]) => {
      if (f1.date && f2.date) {
        return f2.date.getTime() - f1.date.getTime()
      } else if (f1.date && !f2.date) {
        return -1
      } else if (!f1.date && f2.date) {
        return 1
      }
      return f1.title.localeCompare(f2.title)
    })
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .slice(0, limit ?? idx.size)
    .join("")

  const description = limit
    ? `Showing the last ${limit} notes on ${escapeHTML(cfg.pageTitle)}`
    : `Recent notes on ${escapeHTML(cfg.pageTitle)}`

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeHTML(cfg.pageTitle)}</title>
    <link>https://${base}</link>
    <description>${!!limit ? `Last ${limit} notes` : "Recent notes"} on ${escapeHTML(cfg.pageTitle)}</description>
    <generator>Quartz -- quartz.jzhao.xyz</generator>
    ${items}
  </channel>
</rss>`
}
