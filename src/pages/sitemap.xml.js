import { getPublishedCases } from '../lib/sheet.js';
import { encodePathSegment, cleanText, todayKorea } from '../lib/utils.js';
import { getCurrentSite } from '../config/sites.js';

export const prerender = false;

const xmlEscape = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const LEGAL_PATHS = [
  '/privacy',
  '/terms',
  '/email-policy',
  '/legal-notice'
];

export async function GET({ url }) {
  const site = getCurrentSite(url.host);
  const cases = await getPublishedCases(site);
  const today = todayKorea();
  const items = [
    { loc: url.origin, lastmod: today, changefreq: 'daily', priority: '1.0' },
    ...cases.map((row) => ({
      loc: `${url.origin}/scam/${encodePathSegment(row.slug)}`,
      lastmod: cleanText(row.updatedAt || row.publishedAt) || today,
      changefreq: 'weekly',
      priority: '0.86'
    })),
    ...LEGAL_PATHS.map((path) => ({
      loc: `${url.origin}${path}`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.25'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map((item) => `  <url>
    <loc>${xmlEscape(item.loc)}</loc>
    <lastmod>${xmlEscape(item.lastmod)}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600'
    }
  });
}
