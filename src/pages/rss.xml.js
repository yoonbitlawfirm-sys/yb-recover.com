import { getPublishedCases } from '../lib/sheet.js';
import { cleanText, encodePathSegment, todayKorea } from '../lib/utils.js';
import { getCurrentSite } from '../config/sites.js';

export const prerender = false;

const escapeXml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export async function GET({ url }) {
  const site = getCurrentSite(url.host);
  const rows = await getPublishedCases(site);
  const items = rows.map((row) => {
    const name = cleanText(row.caseName || row.mainKeyword || row.slug || '금융사기');
    const link = `${url.origin}/scam/${encodePathSegment(row.slug)}`;
    const description = cleanText(row.seoDescription || row.subHeadline || `${name} 피해 정황과 대응 방향을 안내합니다.`);
    const date = new Date(`${cleanText(row.updatedAt || row.publishedAt) || todayKorea()}T09:00:00+09:00`).toUTCString();
    return `<item>
      <title>${escapeXml(cleanText(row.seoTitle) || `${name} 피해 대응 | ${site.brandName}`)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${date}</pubDate>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.siteName)}</title>
    <link>${escapeXml(url.origin)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600'
    }
  });
}
