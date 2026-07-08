import { getPublishedCases } from '../lib/sheet.js';
import { encodePathSegment } from '../lib/utils.js';

export const prerender = false;

export async function GET({ url }) {
  const cases = await getPublishedCases();
  const items = [url.origin, ...cases.map((row) => `${url.origin}/scam/${encodePathSegment(row.slug)}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map((loc) => `  <url><loc>${loc}</loc><changefreq>daily</changefreq><priority>${loc === url.origin ? '1.0' : '0.86'}</priority></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
