import { FALLBACK_CASES } from '../data/fallbackCases.js';
import { normalizeSlug, getStatus } from './utils.js';

const SHEET_URL = import.meta.env.SHEET_JSON_URL;
let cache = { at: 0, rows: null };
const CACHE_MS = 1000 * 60 * 3;

function parseGoogleViz(text) {
  const match = text.match(/setResponse\((.*)\);?\s*$/s);
  if (!match) return null;
  const json = JSON.parse(match[1]);
  const cols = json.table.cols.map((c) => c.label || c.id);
  return json.table.rows.map((r) => {
    const row = {};
    r.c.forEach((cell, i) => {
      row[cols[i]] = cell?.v ?? '';
    });
    return row;
  });
}

function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (payload?.values && Array.isArray(payload.values)) {
    const [headers, ...rows] = payload.values;
    return rows.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])));
  }
  return [];
}

export async function getSheetCases() {
  const now = Date.now();
  if (cache.rows && now - cache.at < CACHE_MS) return cache.rows;

  if (!SHEET_URL) {
    cache = { at: now, rows: FALLBACK_CASES };
    return FALLBACK_CASES;
  }

  try {
    const res = await fetch(SHEET_URL, { headers: { accept: 'application/json,text/plain,*/*' } });
    if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`);
    const text = await res.text();
    let rows;
    try {
      rows = normalizeRows(JSON.parse(text));
    } catch (_) {
      rows = parseGoogleViz(text) || [];
    }
    const cleaned = rows
      .map((row) => ({ ...row, slug: normalizeSlug(row.slug || row.caseName || row.mainKeyword) }))
      .filter((row) => row.slug);
    cache = { at: now, rows: cleaned.length ? cleaned : FALLBACK_CASES };
    return cache.rows;
  } catch (error) {
    console.error('[sheet] fallback used:', error.message);
    cache = { at: now, rows: FALLBACK_CASES };
    return FALLBACK_CASES;
  }
}

export async function getCaseBySlug(slug) {
  const rows = await getSheetCases();
  const normalized = normalizeSlug(slug);
  return rows.find((row) => normalizeSlug(row.slug) === normalized) || null;
}

export async function getPublishedCases() {
  const rows = await getSheetCases();
  return rows.filter((row) => getStatus(row) === 'published');
}
