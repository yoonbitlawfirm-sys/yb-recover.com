import { getCurrentSite } from '../../config/sites.js';
import { getSheetDiagnostics } from '../../lib/sheet.js';

export const prerender = false;

export async function GET({ url, request }) {
  const host = request.headers.get('host') || url.host;
  const site = getCurrentSite(host);
  const slug = url.searchParams.get('slug') || 'test-page';
  const diagnostics = await getSheetDiagnostics(slug, site);

  return new Response(JSON.stringify({
    ok: diagnostics.envConfigured && diagnostics.source === 'sheet',
    build: '20260711-final-v4-complete',
    host,
    ...diagnostics
  }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      'x-yb-build': '20260711-final-v4-complete'
    }
  });
}
