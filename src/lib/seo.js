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
  '010-8183-4252';

const getAddress = (site = {}) =>
  cleanText(site.address) ||
  '서울특별시 강남구 영동대로 621, 621빌딩 11층';

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

  const title =
    (site.isLegalBrand ? cleanText(row.seoTitle) : '') ||
    `${name} 피해 대응 및 회복 절차 | ${getSiteName(site)}`;

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
  seo,
  faqs = []
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
  const faqId = `${canonical}#faq`;
  const howToId = `${canonical}#howto`;

  const image = absoluteUrl(
    origin,
    '/images/yoonbit-og.png'
  );

  const logo = absoluteUrl(
    origin,
    '/images/yoonbit-logo-cutout.png'
  );

  const suppliedFaqs = Array.isArray(faqs)
    ? faqs
    : [];

  const fallbackFaqs = [
    [row.faq1Q, row.faq1A],
    [row.faq2Q, row.faq2A],
    [row.faq3Q, row.faq3A],
  ];

  const faqRows = (
    suppliedFaqs.length
      ? suppliedFaqs
      : fallbackFaqs
  )
    .map((item) => {
      if (Array.isArray(item)) {
        return [
          cleanText(item[0]),
          cleanText(item[1]),
        ];
      }

      return [
        cleanText(item?.question || item?.q),
        cleanText(item?.answer || item?.a),
      ];
    })
    .filter(([question, answer]) => question && answer);

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: brandName,
      legalName: brandName,
      url: origin,
      telephone: phone,
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
    {
      '@type': 'HowTo',
      '@id': howToId,
      name:
        `${seo.name} 피해 의심 시 증거 보존과 초기 대응 방법`,
      description:
        `${seo.name} 피해가 의심될 때 추가 입금을 중단하고 입금·대화·사이트 자료를 보존하는 순서입니다.`,
      totalTime: 'PT5M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: '추가 입금 중단',
          text:
            '세금, 보증금, 인증비, 수수료 등 어떤 명목이든 추가 송금을 우선 중단합니다.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: '입금 자료 보존',
          text:
            '이체확인증, 계좌번호, 예금주, 지갑주소와 송금 일시를 저장합니다.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: '대화와 사이트 자료 저장',
          text:
            '메신저 대화, 담당자 프로필, 사이트 주소, 출금 제한 화면을 캡처합니다.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: '법적 대응 가능성 검토',
          text:
            '남아 있는 자료를 기준으로 형사 고소, 지급정지, 가압류와 손해배상 가능성을 검토합니다.',
        },
      ],
    },
  ];

  // 실제 질문과 답변이 있을 때만 FAQPage를 추가합니다.
  if (faqRows.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
      mainEntity: faqRows.map(
        ([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })
      ),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}