export const prerender = false;

export function GET({ url }) {
  const body = `User-agent: *
Allow: /
Disallow: /api/

User-agent: Yeti
Allow: /
Disallow: /api/

User-agent: NaverBot
Allow: /
Disallow: /api/

Sitemap: ${url.origin}/sitemap.xml
Host: ${url.host}
`;
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600'
    }
  });
}
