import { FALLBACK_CASES } from '../data/fallbackCases.js';
import { normalizeSlug, getStatus, cleanText } from './utils.js';

const LIST_PAGE_SIZE = 500;
const LIST_CACHE_MS = 30 * 1000;
const listCaches = new Map();

const getCacheKey = (site = {}) => cleanText(site.siteKey || site.domains?.[0] || 'default').toLowerCase() || 'default';

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

export function normalizeDomain(value = '') {
  const clean = cleanText(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');

  return clean
    .replace(/\.co\.kr$/, '')
    .replace(/\.(com|net|org|kr)$/, '');
}

export function matchesSite(row = {}, site = {}) {
  const target = normalizeDomain(row.domain || row.siteKey || row.site || '');
  if (!target || target === 'all' || target === '*') return true;

  const accepted = [site.siteKey, ...(site.domains || [])]
    .map(normalizeDomain)
    .filter(Boolean);

  return accepted.includes(target);
}

function cleanRows(rows = []) {
  return rows
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      ...row,
      domain: cleanText(row.domain),
      status: cleanText(row.status || 'draft').toLowerCase(),
      slug: normalizeSlug(row.slug || row.caseName || row.mainKeyword)
    }))
    .filter((row) => row.slug);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
    headers: {
      accept: 'application/json,text/plain,*/*',
      'user-agent': 'YB-CMS/3.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Google Sheet 요청 실패: ${response.status} ${response.statusText}`);
  }

  const text = (await response.text()).trim();
  if (!text) throw new Error('Google Sheet 응답이 비어 있습니다.');
  if (/^<!doctype html/i.test(text) || /^<html/i.test(text)) {
    throw new Error('Google Apps Script가 JSON 대신 HTML을 반환했습니다. 웹앱 접근 권한을 확인하세요.');
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('Google Apps Script JSON 응답을 해석하지 못했습니다.');
  }

  if (payload?.ok === false) {
    throw new Error(payload.error || 'Google Apps Script가 오류를 반환했습니다.');
  }

  return payload;
}

function buildApiUrl({ domain = '', slug = '', mode = '', offset = 0, limit = LIST_PAGE_SIZE } = {}) {
  const base = getSheetUrl();
  if (!base) return '';

  const url = new URL(base);
  if (domain) url.searchParams.set('domain', normalizeDomain(domain));
  if (slug) url.searchParams.set('slug', normalizeSlug(slug));
  if (mode) url.searchParams.set('mode', mode);
  if (mode === 'list') {
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', String(limit));
  }
  url.searchParams.set('_', String(Date.now()));
  return url.toString();
}

async function fetchCaseBySlug(slug, site = {}) {
  const apiUrl = buildApiUrl({
    domain: site.siteKey || '',
    slug
  });

  if (!apiUrl) throw new Error('SHEET_JSON_URL 환경변수가 없습니다.');

  const payload = await fetchJson(apiUrl);
  const rows = cleanRows(Array.isArray(payload?.data) ? payload.data : []);
  return rows[0] || null;
}

async function fetchAllCases(site = {}) {
  const all = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const apiUrl = buildApiUrl({
      domain: site.siteKey || '',
      mode: 'list',
      offset,
      limit: LIST_PAGE_SIZE
    });

    if (!apiUrl) throw new Error('SHEET_JSON_URL 환경변수가 없습니다.');

    const payload = await fetchJson(apiUrl);
    const rows = cleanRows(Array.isArray(payload?.data) ? payload.data : []);
    all.push(...rows);

    hasMore = Boolean(payload?.hasMore);
    offset += rows.length;

    if (!rows.length || offset > 50000) break;
  }

  return all;
}

export async function getSheetCases({ force = false, site = {} } = {}) {
  const now = Date.now();
  const cacheKey = getCacheKey(site);
  const cached = listCaches.get(cacheKey);

  if (!force && cached?.rows && now - cached.at < LIST_CACHE_MS) return cached.rows;

  if (!getSheetUrl()) {
    const rows = cleanRows(FALLBACK_CASES).filter((row) => matchesSite(row, site));
    listCaches.set(cacheKey, {
      at: now,
      rows,
      source: 'fallback',
      error: 'SHEET_JSON_URL 환경변수가 없습니다.'
    });
    return rows;
  }

  try {
    const rows = await fetchAllCases(site);
    listCaches.set(cacheKey, { at: now, rows, source: 'sheet', error: '' });
    return rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const rows = cleanRows(FALLBACK_CASES).filter((row) => matchesSite(row, site));
    listCaches.set(cacheKey, { at: now, rows, source: 'fallback', error: message });
    console.error(`[sheet:${cacheKey}] 목록 조회 실패:`, error);
    return rows;
  }
}

export async function getCaseBySlug(slug, site = {}) {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) return null;

  try {
    return await fetchCaseBySlug(normalizedSlug, site);
  } catch (error) {
    console.error('[sheet] 개별 문서 조회 실패:', error);
    const fallback = cleanRows(FALLBACK_CASES);
    return fallback.find((row) =>
      normalizeSlug(row.slug).toLowerCase() === normalizedSlug.toLowerCase() &&
      matchesSite(row, site)
    ) || null;
  }
}

export async function getPublishedCases(site = {}) {
  const rows = await getSheetCases({ site });
  return rows.filter((row) => getStatus(row) === 'published' && matchesSite(row, site));
}

export async function getSheetDiagnostics(slug = '', site = {}) {
  const normalizedSlug = normalizeSlug(slug);
  const envConfigured = Boolean(getSheetUrl());

  if (!envConfigured) {
    return {
      envConfigured: false,
      source: 'fallback',
      error: 'SHEET_JSON_URL 환경변수가 없습니다.',
      rowCount: 0,
      siteKey: site?.siteKey || '',
      slug: normalizedSlug,
      matched: false,
      matchedDomain: '',
      matchedStatus: ''
    };
  }

  try {
    const row = normalizedSlug ? await fetchCaseBySlug(normalizedSlug, site) : null;
    return {
      envConfigured: true,
      source: 'sheet',
      error: '',
      rowCount: row ? 1 : 0,
      siteKey: site?.siteKey || '',
      slug: normalizedSlug,
      matched: Boolean(row),
      matchedDomain: row?.domain || '',
      matchedStatus: row?.status || ''
    };
  } catch (error) {
    return {
      envConfigured: true,
      source: 'fallback',
      error: error instanceof Error ? error.message : String(error),
      rowCount: 0,
      siteKey: site?.siteKey || '',
      slug: normalizedSlug,
      matched: false,
      matchedDomain: '',
      matchedStatus: ''
    };
  }
}
