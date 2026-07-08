export function cleanText(value = '') {
  return String(value ?? '').trim();
}

export function normalizeSlug(value = '') {
  try {
    return decodeURIComponent(String(value || ''))
      .trim()
      .replace(/\s+/g, '')
      .replace(/^\/+|\/+$/g, '');
  } catch (_) {
    return String(value || '').trim().replace(/\s+/g, '').replace(/^\/+|\/+$/g, '');
  }
}

export function encodePathSegment(value = '') {
  return normalizeSlug(value)
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

export function isPublished(row = {}) {
  return cleanText(row.status || 'published').toLowerCase() === 'published';
}

export function getStatus(row = {}) {
  return cleanText(row.status || 'published').toLowerCase();
}

export function splitList(...items) {
  return items.map(cleanText).filter(Boolean);
}

export function todayKorea() {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date()).replace(/\.\s?/g, '-').replace(/-$/, '');
}
