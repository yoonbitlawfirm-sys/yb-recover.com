import { FALLBACK_CASES } from '../data/fallbackCases.js';
import { normalizeSlug, getStatus, cleanText } from './utils.js';

let cache = { at: 0, rows: null, source: 'none', error: '' };
const CACHE_MS = 1000 * 30;

function sanitizeUrl(value = '') {
  return String(value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

export function getSheetUrl() {
  return sanitizeUrl(
    process.env.SHEET_JSON_URL ||
    import.meta.env.SHEET_JSON_URL ||
    ''
  );
}

function parseGoogleViz(text) {
  const match = String(text || '').match(/setResponse\((.*)\);?\s*$/s);
  if (!match) return null;

  const json = JSON.parse(match[1]);
  const cols = (json?.table?.cols || []).map((column) => column.label || column.id);

  return (json?.table?.rows || []).map((row) => {
    const result = {};
    (row.c || []).forEach((cell, index) => {
      result[cols[index]] = cell?.v ?? '';
    });
    return result;
  });
}

function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;

  if (payload?.values && Array.isArray(payload.values)) {
    const [headers = [], ...rows] = payload.values;
    return rows.map((values) =>
      Object.fromEntries(
        headers.map((header, index) => [header, values[index] ?? ''])
      )
    );
  }

  return [];
}

export function normalizeDomain(value = '') {
  const clean = cleanText(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');

  const key = clean
    .replace(/\.co\.kr$/, '')
    .replace(/\.(com|net|org|kr)$/, '');

  return key;
}

export function matchesSite(row = {}, site = {}) {
  const target = normalizeDomain(row.domain || row.siteKey || row.site || '');

  if (!target || target === 'all' || target === '*') return true;

  const acceptedValues = [site.siteKey, ...(site.domains || [])]
    .map(normalizeDomain)
    .filter(Boolean);

  return acceptedValues.includes(target);
}

function cleanRows(rows = []) {
  return rows
    .filter((row) => {
      const id = cleanText(row?.id);
      const domain = cleanText(row?.domain);
      const slug = cleanText(row?.slug);
      const caseName = cleanText(row?.caseName);
      const mainKeyword = cleanText(row?.mainKeyword);
      return Boolean(id || domain || slug || caseName || mainKeyword);
    })
    .map((row) => ({
      ...row,
      domain: cleanText(row.domain),
      status: cleanText(row.status || 'draft').toLowerCase(),
      slug: normalizeSlug(row.slug || row.caseName || row.mainKeyword)
    }))
    .filter((row) => row.slug);
}

async function fetchSheetRows(sheetUrl) {
  const separator = sheetUrl.includes('?') ? '&' : '?';
  const url = `${sheetUrl}${separator}_=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
    headers: {
      accept: 'application/json,text/plain,*/*',
      'user-agent': 'YB-CMS/2.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Google Sheet 요청 실패: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const trimmedText = text.trim();

  if (!trimmedText) throw new Error('Google Sheet 응답이 비어 있습니다.');

  if (/^<!doctype html/i.test(trimmedText) || /^<html/i.test(trimmedText)) {
    throw new Error('Google Apps Script가 JSON 대신 HTML을 반환했습니다. 웹앱 접근 권한을 확인하세요.');
  }

  let rows = [];
  try {
    rows = normalizeRows(JSON.parse(trimmedText));
  } catch {
    rows = parseGoogleViz(trimmedText) || [];
  }

  return cleanRows(rows);
}

export async function getSheetCases({ force = false } = {}) {
  const now = Date.now();

  if (!force && cache.rows && now - cache.at < CACHE_MS) {
    return cache.rows;
  }

  const sheetUrl = getSheetUrl();

  if (!sheetUrl) {
    cache = {
      at: now,
      rows: cleanRows(FALLBACK_CASES),
      source: 'fallback',
      error: 'SHEET_JSON_URL 환경변수가 없습니다.'
    };
    console.error('[sheet]', cache.error);
    return cache.rows;
  }

  try {
    const rows = await fetchSheetRows(sheetUrl);
    cache = { at: now, rows, source: 'sheet', error: '' };
    console.log('[sheet] 불러온 문서 수:', rows.length);
    return rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    cache = {
      at: now,
      rows: cleanRows(FALLBACK_CASES),
      source: 'fallback',
      error: message
    };
    console.error('[sheet] Google Sheet 불러오기 실패:', error);
    return cache.rows;
  }
}

export async function getCaseBySlug(slug, site = {}) {
  const rows = await getSheetCases();
  const normalizedSlug = normalizeSlug(slug).toLowerCase();

  return rows.find((row) =>
    normalizeSlug(row.slug).toLowerCase() === normalizedSlug &&
    matchesSite(row, site)
  ) || null;
}

export async function getPublishedCases(site = {}) {
  const rows = await getSheetCases();
  return rows.filter((row) => getStatus(row) === 'published' && matchesSite(row, site));
}

export async function getSheetDiagnostics(slug = '', site = {}) {
  const rows = await getSheetCases({ force: true });
  const normalizedSlug = normalizeSlug(slug).toLowerCase();
  const row = rows.find((item) =>
    normalizeSlug(item.slug).toLowerCase() === normalizedSlug &&
    matchesSite(item, site)
  ) || null;

  return {
    envConfigured: Boolean(getSheetUrl()),
    source: cache.source,
    error: cache.error,
    rowCount: rows.length,
    siteKey: site?.siteKey || '',
    slug: normalizedSlug,
    matched: Boolean(row),
    matchedDomain: row?.domain || '',
    matchedStatus: row?.status || ''
  };
}
