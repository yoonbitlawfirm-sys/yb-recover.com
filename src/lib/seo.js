import { cleanText, todayKorea } from './utils.js';

const absoluteUrl = (origin, path = '/') => {
  try {
    return new URL(path, origin).toString();
  } catch {
    return String(path || '/');
  }
};

const normalizeDate = (value) => cleanText(value) || todayKorea();

const getSiteName = (site = {}) =>
  cleanText(site.siteName) ||
  cleanText(site.brandName) ||
  '법무법인 윤빛 금융사기 피해회복센터';

const getBrandName = (site = {}) =>
  cleanText(site.brandName) ||
  '법무법인 윤빛';

const getSiteTitle = (site = {}) =>
  cleanText(site.title) ||
  `${getBrandName(site)} | 금융사기 피해회복센터`;

const getSiteDescription = (site = {}) =>
  cleanText(site.description) ||
  '금융사기, 투자사기, 출금거부, 추가입금 요구 피해 정황을 확인하고 대응 방향을 검토합니다.';

const getPhone = (site = {}) =>
  cleanText(site.phone) ||
  '010-2175-4252';

const getAddress = (site = {}) =>
  cleanText(site.address) ||
  '서울특별시 강남구 영동대로 621, 621빌딩 11층';

const getBusinessNumber = (site = {}) =>
  cleanText(site.businessNumber) ||
  '754-87-03255';

const getEmail = (site = {}) =>
  cleanText(site.email) ||
  'contact@yoonbitlawfirm.com';

const getResponsibleAttorney = (site = {}) =>
  cleanText(site.responsibleAttorney) ||
  '윤수빈 변호사';

const uniqueKeywords = (values = []) =>
  [...new Set(values.map((value) => cleanText(value)).filter(Boolean))];

export function buildCaseSeo(row = {}, site = {}, url) {
  const name =
    cleanText(row.caseName) ||
    cleanText(row.mainKeyword) ||
    cleanText(row.slug) ||
    '금융사기';

  const caseType =
    cleanText(row.caseType) ||
    '금융사기';

  const slug =
    cleanText(row.slug) ||
    name;

  const rawSeoTitle = site.isLegalBrand ? cleanText(row.seoTitle) : '';
  const siteName = getSiteName(site);
  const titleBase = rawSeoTitle
    ? rawSeoTitle.replace(/\s*[|｜ㅣ]\s*법무법인\s*윤빛.*$/i, '').trim()
    : `${name} 피해 대응 및 회복 절차`;
  const title = rawSeoTitle.includes(siteName)
    ? rawSeoTitle
    : `${titleBase || `${name} 피해 대응 및 회복 절차`} | ${siteName}`;

  const description =
    cleanText(row.seoDescription) ||
    `${name} 관련 피해 정황과 입금·대화 자료를 기준으로 증거 보존, 추가 피해 차단, 대응 및 회복 절차를 안내합니다.`;

  const canonical = absoluteUrl(
    url.origin,
    `/scam/${encodeURIComponent(slug)}`
  );

  const publishedAt = normalizeDate(
    row.publishedAt || row.updatedAt
  );

  const updatedAt = normalizeDate(
    row.updatedAt || row.publishedAt
  );

  const keywords = uniqueKeywords([
    name,
    `${name} 사기`,
    `${name} 사칭`,
    `${name} 사칭 사기`,
    `${name} 출금거부`,
    `${name} 피해`,
    `${name} 피해 대응`,
    `${name} 피해금 회수`,
    caseType,
    '금융사기',
    '투자사기',
    '출금거부',
    '추가입금 요구',
    '연락두절',
    '피해금 회수',
    ...(site.keywords || []),
  ]);

  return {
    title,
    description,
    canonical,
    name,
    caseType,
    slug,
    publishedAt,
    updatedAt,
    keywords,
  };
}

export function buildHomeSeo(site = {}, url) {
  const canonical = absoluteUrl(url.origin, '/');

  const title = getSiteTitle(site);
  const description = getSiteDescription(site);

  const keywords = uniqueKeywords([
    '금융사기 피해 대응',
    '투자사기 피해',
    '출금거부',
    '추가입금 요구',
    '연락두절',
    '피해금 회수',
    '금융사기 법률상담',
    getSiteName(site),
    getBrandName(site),
  ]);

  return {
    title,
    description,
    canonical,
    keywords,
  };
}

export function homeJsonLdGraph(site = {}, url) {
  const origin = url.origin;
  const canonical = absoluteUrl(origin, '/');

  const siteName = getSiteName(site);
  const brandName = getBrandName(site);
  const title = getSiteTitle(site);
  const description = getSiteDescription(site);
  const phone = getPhone(site);

  const logo = absoluteUrl(
    origin,
    '/images/yoonbit-logo-cutout.png'
  );

  const image = absoluteUrl(
    origin,
    '/images/yoonbit-og.png'
  );

  const orgId = `${canonical}#organization`;
  const websiteId = `${canonical}#website`;
  const pageId = `${canonical}#webpage`;
  const imageId = `${canonical}#primaryimage`;
  const legalId = `${canonical}#legalservice`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: brandName,
        legalName: site.isLegalBrand ? brandName : undefined,
        url: canonical,
        logo: {
          '@type': 'ImageObject',
          url: logo,
          contentUrl: logo,
        },
        image: {
          '@id': imageId,
        },
        telephone: phone,
        email: getEmail(site),
        taxID: getBusinessNumber(site),
        employee: {
          '@type': 'Person',
          name: getResponsibleAttorney(site),
          jobTitle: '광고책임변호사',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: getAddress(site),
          addressLocality: '강남구',
          addressRegion: '서울특별시',
          addressCountry: 'KR',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteName,
        url: canonical,
        description,
        inLanguage: 'ko-KR',
        publisher: {
          '@id': orgId,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${origin}/scam/{search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ImageObject',
        '@id': imageId,
        url: image,
        contentUrl: image,
        width: 1200,
        height: 630,
        caption: siteName,
        inLanguage: 'ko-KR',
        representativeOfPage: true,
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonical,
        name: title,
        description,
        inLanguage: 'ko-KR',
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': legalId,
        },
        primaryImageOfPage: {
          '@id': imageId,
        },
      },
      {
        '@type': site.isLegalBrand ? 'LegalService' : 'Organization',
        '@id': legalId,
        name: siteName,
        legalName: site.isLegalBrand ? brandName : undefined,
        description,
        url: canonical,
        image: {
          '@id': imageId,
        },
        telephone: phone,
        email: getEmail(site),
        taxID: getBusinessNumber(site),
        employee: {
          '@type': 'Person',
          name: getResponsibleAttorney(site),
          jobTitle: '광고책임변호사',
        },
        areaServed: {
          '@type': 'Country',
          name: '대한민국',
        },
        serviceType: site.isLegalBrand ? [
          '금융사기 피해 대응 법률상담',
          '투자사기 피해 대응',
          '형사 고소 검토',
          '민사 손해배상 검토',
          '피해금 회수 가능성 검토',
        ] : (site.keywords || []),
        provider: {
          '@id': orgId,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: getAddress(site),
          addressLocality: '강남구',
          addressRegion: '서울특별시',
          addressCountry: 'KR',
        },
      },
    ],
  };
}

export function caseJsonLdGraph(
  row = {},
  site = {},
  url,
  seo
) {
  const origin = url.origin;
  const canonical = seo.canonical;

  const siteName = getSiteName(site);
  const brandName = getBrandName(site);
  const phone = getPhone(site);

  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const legalId = `${origin}/#legalservice`;

  const pageId = `${canonical}#webpage`;
  const articleId = `${canonical}#article`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const imageId = `${canonical}#primaryimage`;

  const image = absoluteUrl(
    origin,
    '/images/yoonbit-og.png'
  );

  const logo = absoluteUrl(
    origin,
    '/images/yoonbit-logo-cutout.png'
  );


  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: brandName,
      legalName: brandName,
      url: origin,
      telephone: phone,
      email: getEmail(site),
      taxID: getBusinessNumber(site),
      employee: {
        '@type': 'Person',
        name: getResponsibleAttorney(site),
        jobTitle: '광고책임변호사',
      },
      logo: {
        '@type': 'ImageObject',
        url: logo,
        contentUrl: logo,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: getAddress(site),
        addressLocality: '강남구',
        addressRegion: '서울특별시',
        addressCountry: 'KR',
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteName,
      url: origin,
      inLanguage: 'ko-KR',
      publisher: {
        '@id': orgId,
      },
    },
    {
      '@type': 'ImageObject',
      '@id': imageId,
      url: image,
      contentUrl: image,
      width: 1200,
      height: 630,
      caption: seo.title,
      inLanguage: 'ko-KR',
      representativeOfPage: true,
    },
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: canonical,
      name: seo.title,
      description: seo.description,
      inLanguage: 'ko-KR',
      datePublished: seo.publishedAt,
      dateModified: seo.updatedAt,
      isPartOf: {
        '@id': websiteId,
      },
      about: {
        '@id': legalId,
      },
      primaryImageOfPage: {
        '@id': imageId,
      },
      breadcrumb: {
        '@id': breadcrumbId,
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: [
          'h1',
          '#case-summary',
          '#warning-signals',
          '#evidence-checklist',
          '#faq-list',
        ],
      },
    },
    {
      '@type': 'Article',
      '@id': articleId,
      headline: seo.title,
      description: seo.description,
      url: canonical,
      inLanguage: 'ko-KR',
      datePublished: seo.publishedAt,
      dateModified: seo.updatedAt,
      author: {
        '@id': orgId,
      },
      publisher: {
        '@id': orgId,
      },
      mainEntityOfPage: {
        '@id': pageId,
      },
      image: {
        '@id': imageId,
      },
      articleSection: seo.caseType,
      keywords: seo.keywords.join(', '),
      about: seo.keywords,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: absoluteUrl(origin, '/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '금융사기 피해 대응',
          item: absoluteUrl(origin, '/scam'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${seo.name} 피해 대응`,
          item: canonical,
        },
      ],
    },
    {
      '@type': 'LegalService',
      '@id': legalId,
      name: siteName,
      legalName: brandName,
      url: origin,
      description: getSiteDescription(site),
      telephone: phone,
      email: getEmail(site),
      taxID: getBusinessNumber(site),
      employee: {
        '@type': 'Person',
        name: getResponsibleAttorney(site),
        jobTitle: '광고책임변호사',
      },
      areaServed: {
        '@type': 'Country',
        name: '대한민국',
      },
      serviceType:
        `${seo.name} 사칭 사기 피해 대응 및 회수 가능성 검토`,
      provider: {
        '@id': orgId,
      },
      knowsAbout: seo.keywords,
      address: {
        '@type': 'PostalAddress',
        streetAddress: getAddress(site),
        addressLocality: '강남구',
        addressRegion: '서울특별시',
        addressCountry: 'KR',
      },
    },
  ];


  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}