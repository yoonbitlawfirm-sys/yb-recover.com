import { FALLBACK_CASES } from '../data/fallbackCases.js';
import { normalizeSlug, getStatus, cleanText } from './utils.js';

let cache = {
  at: 0,
  rows: null
};

const CACHE_MS = 1000 * 30;

function getSheetUrl() {
  return (
    process.env.SHEET_JSON_URL ||
    import.meta.env.SHEET_JSON_URL ||
    ''
  ).trim();
}

function parseGoogleViz(text) {
  const match = text.match(/setResponse\((.*)\);?\s*$/s);

  if (!match) {
    return null;
  }

  const json = JSON.parse(match[1]);
  const cols = json.table.cols.map((column) => column.label || column.id);

  return json.table.rows.map((row) => {
    const result = {};

    row.c.forEach((cell, index) => {
      result[cols[index]] = cell?.v ?? '';
    });

    return result;
  });
}

function normalizeRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  if (payload?.values && Array.isArray(payload.values)) {
    const [headers, ...rows] = payload.values;

    return rows.map((values) =>
      Object.fromEntries(
        headers.map((header, index) => [
          header,
          values[index] ?? ''
        ])
      )
    );
  }

  return [];
}

function normalizeDomain(value = '') {
  return cleanText(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function matchesSite(row = {}, site = {}) {
  const target = normalizeDomain(
    row.domain ||
    row.siteKey ||
    row.site ||
    ''
  );

  if (!target || target === 'all' || target === '*') {
    return true;
  }

  const acceptedValues = [
    site.siteKey,
    ...(site.domains || [])
  ]
    .map(normalizeDomain)
    .filter(Boolean);

  return acceptedValues.includes(target);
}

export async function getSheetCases() {
  const now = Date.now();

  if (cache.rows && now - cache.at < CACHE_MS) {
    return cache.rows;
  }

  const sheetUrl = getSheetUrl();

  if (!sheetUrl) {
    console.error('[sheet] SHEET_JSON_URL 환경변수가 없습니다.');

    return FALLBACK_CASES;
  }

  try {
    const response = await fetch(sheetUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        accept: 'application/json,text/plain,*/*',
        'user-agent': 'YB-CMS/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(
        `Google Sheet 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    const trimmedText = text.trim();

    if (
      trimmedText.startsWith('<!DOCTYPE html') ||
      trimmedText.startsWith('<html')
    ) {
      throw new Error(
        'Google Apps Script가 JSON 대신 HTML을 반환했습니다.'
      );
    }

    let rows = [];

    try {
      rows = normalizeRows(JSON.parse(trimmedText));
    } catch {
      rows = parseGoogleViz(trimmedText) || [];
    }

    const cleanedRows = rows
      .filter((row) => {
        const id = cleanText(row.id);
        const domain = cleanText(row.domain);
        const slug = cleanText(row.slug);
        const caseName = cleanText(row.caseName);
        const mainKeyword = cleanText(row.mainKeyword);

        return Boolean(
          id ||
          domain ||
          slug ||
          caseName ||
          mainKeyword
        );
      })
      .map((row) => ({
        ...row,
        domain: cleanText(row.domain),
        status: cleanText(row.status || 'draft').toLowerCase(),
        slug: normalizeSlug(
          row.slug ||
          row.caseName ||
          row.mainKeyword
        )
      }))
      .filter((row) => row.slug);

    console.log('[sheet] 불러온 문서 수:', cleanedRows.length);

    cache = {
      at: now,
      rows: cleanedRows
    };

    return cleanedRows;
  } catch (error) {
    console.error('[sheet] Google Sheet 불러오기 실패:', error);

    return FALLBACK_CASES;
  }
}

export async function getCaseBySlug(slug, site = {}) {
  const rows = await getSheetCases();
  const normalizedSlug = normalizeSlug(slug);

  return (
    rows.find((row) => {
      return (
        normalizeSlug(row.slug) === normalizedSlug &&
        matchesSite(row, site)
      );
    }) || null
  );
}

export async function getPublishedCases(site = {}) {
  const rows = await getSheetCases();

  return rows.filter((row) => {
    return (
      getStatus(row) === 'published' &&
      matchesSite(row, site)
    );
  });
}