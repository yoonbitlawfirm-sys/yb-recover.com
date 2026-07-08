export const prerender = false;

export function GET({ url }) {
  const body = `User-agent: *
Allow: /

User-agent: Yeti
Allow: /

User-agent: NaverBot
Allow: /

Sitemap: ${url.origin}/sitemap.xml
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
