import { cleanText, todayKorea } from './utils.js';

export function buildCaseSeo(row, site, url) {
  const name = cleanText(row.caseName || row.mainKeyword || row.slug || '금융사기');
  const title = cleanText(row.seoTitle) || `${name} 피해 대응 | ${site.brandName}`;
  const description = cleanText(row.seoDescription) || `${name} 피해 정황, 출금거부, 추가입금 요구, 연락두절 상황을 ${site.brandName}이 검토합니다.`;
  const canonical = `${url.origin}/scam/${encodeURIComponent(cleanText(row.slug || name))}`;
  return { title, description, canonical, name };
}

export function legalServiceJsonLd(site, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.siteName,
    description: site.description,
    url: url.origin,
    telephone: site.phone,
    areaServed: 'KR',
    serviceType: '금융사기 피해 대응 법률상담',
    provider: {
      '@type': 'LegalService',
      name: site.brandName,
      url: url.origin
    }
  };
}

export function caseArticleJsonLd(row, site, url, canonical) {
  const title = cleanText(row.seoTitle) || `${row.caseName || row.mainKeyword} 피해 대응 | ${site.brandName}`;
  const description = cleanText(row.seoDescription) || cleanText(row.subHeadline) || site.description;
  const date = cleanText(row.updatedAt || row.publishedAt) || todayKorea();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: `${cleanText(row.publishedAt) || date}T09:00:00+09:00`,
    dateModified: `${date}T09:00:00+09:00`,
    author: { '@type': 'Organization', name: site.siteName, url: url.origin },
    publisher: { '@type': 'Organization', name: site.brandName },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: 'ko-KR',
    about: { '@type': 'Thing', name: cleanText(row.mainKeyword || row.caseName || row.slug) }
  };
}

export function faqJsonLd(row) {
  const faqs = [
    [row.faq1Q, row.faq1A],
    [row.faq2Q, row.faq2A],
    [row.faq3Q, row.faq3A]
  ].filter(([q, a]) => cleanText(q) && cleanText(a));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: cleanText(q),
      acceptedAnswer: { '@type': 'Answer', text: cleanText(a) }
    }))
  };
}

export function breadcrumbJsonLd(row, site, url, canonical) {
  const name = cleanText(row.caseName || row.mainKeyword || row.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: url.origin },
      { '@type': 'ListItem', position: 2, name: '금융사기 대응', item: `${url.origin}/scam` },
      { '@type': 'ListItem', position: 3, name: `${name} 피해 대응`, item: canonical }
    ]
  };
}
