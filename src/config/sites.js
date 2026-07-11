const PHONE = '010-2175-4252';
const TEL = 'tel:01021754252';
const KAKAO = 'https://open.kakao.com/o/sEEHGIti';
const EMAIL = 'contact@yoonbitlawfirm.com';
const OPERATOR = '법무법인 윤빛';

const COMMON = {
  phone: PHONE,
  telLink: TEL,
  kakaoUrl: KAKAO,
  email: EMAIL,
  operatorName: OPERATOR,
  brandName: OPERATOR,
  favicon: '/images/favicon.png?v=20260711',
  ogImage: '/images/yoonbit-og.png?v=20260711',
  logo: '/images/yoonbit-logo-cutout.png',
  address: '서울특별시 강남구 영동대로 621, 621빌딩 11층',
  businessNumber: '754-87-03255',
  responsibleAttorney: '윤수빈 변호사',
  privacyOfficer: '윤수빈 변호사',
  isLegalBrand: true,
  legalLinks: {
    privacy: '/privacy',
    terms: '/terms',
    emailPolicy: '/email-policy',
    legalNotice: '/legal-notice'
  }
};

const PALETTES = {
  recover: {
    label: 'CRIMSON',
    bg: '#02050b',
    bgDeep: '#010308',
    bgMid: '#07101d',
    surface: '#0a101b',
    surfaceStrong: '#101827',
    accent: '#a91f2c',
    accentStrong: '#7d1420',
    accent2: '#d6b36b',
    accentSoft: 'rgba(169, 31, 44, 0.20)',
    accentGlow: 'rgba(169, 31, 44, 0.34)',
    secondarySoft: 'rgba(214, 179, 107, 0.16)',
    line: 'rgba(214, 179, 107, 0.22)',
    text: '#f7f8fb',
    muted: '#aeb5c2',
    onAccent: '#ffffff'
  },
  response: {
    label: 'ORANGE',
    bg: '#080401',
    bgDeep: '#030201',
    bgMid: '#1b0c04',
    surface: '#160b06',
    surfaceStrong: '#24120a',
    accent: '#d95f23',
    accentStrong: '#9f3e12',
    accent2: '#f2a15c',
    accentSoft: 'rgba(217, 95, 35, 0.20)',
    accentGlow: 'rgba(217, 95, 35, 0.34)',
    secondarySoft: 'rgba(242, 161, 92, 0.15)',
    line: 'rgba(242, 161, 92, 0.23)',
    text: '#fff8f2',
    muted: '#c4afa3',
    onAccent: '#ffffff'
  },
  alert: {
    label: 'GOLD',
    bg: '#070600',
    bgDeep: '#020200',
    bgMid: '#171300',
    surface: '#141105',
    surfaceStrong: '#211c08',
    accent: '#d6a500',
    accentStrong: '#9b7600',
    accent2: '#f2d36f',
    accentSoft: 'rgba(214, 165, 0, 0.20)',
    accentGlow: 'rgba(214, 165, 0, 0.34)',
    secondarySoft: 'rgba(242, 211, 111, 0.15)',
    line: 'rgba(242, 211, 111, 0.23)',
    text: '#fffdf1',
    muted: '#c5bea0',
    onAccent: '#171200'
  },
  check: {
    label: 'GREEN',
    bg: '#010704',
    bgDeep: '#010302',
    bgMid: '#062016',
    surface: '#071710',
    surfaceStrong: '#0c261b',
    accent: '#168b61',
    accentStrong: '#0c6242',
    accent2: '#7fd7b4',
    accentSoft: 'rgba(22, 139, 97, 0.20)',
    accentGlow: 'rgba(22, 139, 97, 0.34)',
    secondarySoft: 'rgba(127, 215, 180, 0.14)',
    line: 'rgba(127, 215, 180, 0.22)',
    text: '#f2fff9',
    muted: '#a8c2b7',
    onAccent: '#ffffff'
  },
  case: {
    label: 'CYAN',
    bg: '#010608',
    bgDeep: '#010304',
    bgMid: '#05202a',
    surface: '#071820',
    surfaceStrong: '#0b2732',
    accent: '#0a839c',
    accentStrong: '#075d70',
    accent2: '#6fd2e4',
    accentSoft: 'rgba(10, 131, 156, 0.20)',
    accentGlow: 'rgba(10, 131, 156, 0.34)',
    secondarySoft: 'rgba(111, 210, 228, 0.14)',
    line: 'rgba(111, 210, 228, 0.22)',
    text: '#f1fcff',
    muted: '#a4bec5',
    onAccent: '#ffffff'
  },
  safe: {
    label: 'BLUE',
    bg: '#02050c',
    bgDeep: '#010207',
    bgMid: '#071a3b',
    surface: '#09152c',
    surfaceStrong: '#0e2143',
    accent: '#2859c5',
    accentStrong: '#183a88',
    accent2: '#83a8f4',
    accentSoft: 'rgba(40, 89, 197, 0.20)',
    accentGlow: 'rgba(40, 89, 197, 0.34)',
    secondarySoft: 'rgba(131, 168, 244, 0.14)',
    line: 'rgba(131, 168, 244, 0.22)',
    text: '#f3f7ff',
    muted: '#a9b7d4',
    onAccent: '#ffffff'
  },
  help: {
    label: 'INDIGO',
    bg: '#04030b',
    bgDeep: '#020106',
    bgMid: '#15113a',
    surface: '#110e2b',
    surfaceStrong: '#1a1742',
    accent: '#5b4bc4',
    accentStrong: '#3e3290',
    accent2: '#aa9bea',
    accentSoft: 'rgba(91, 75, 196, 0.20)',
    accentGlow: 'rgba(91, 75, 196, 0.34)',
    secondarySoft: 'rgba(170, 155, 234, 0.14)',
    line: 'rgba(170, 155, 234, 0.22)',
    text: '#f7f5ff',
    muted: '#b7b0d1',
    onAccent: '#ffffff'
  },
  watch: {
    label: 'PURPLE',
    bg: '#07020a',
    bgDeep: '#030104',
    bgMid: '#261033',
    surface: '#190b22',
    surfaceStrong: '#2b1239',
    accent: '#8c3db2',
    accentStrong: '#62277f',
    accent2: '#d08ae6',
    accentSoft: 'rgba(140, 61, 178, 0.20)',
    accentGlow: 'rgba(140, 61, 178, 0.34)',
    secondarySoft: 'rgba(208, 138, 230, 0.14)',
    line: 'rgba(208, 138, 230, 0.22)',
    text: '#fff5ff',
    muted: '#c5aecb',
    onAccent: '#ffffff'
  }
};

function makeProfile({
  domain,
  siteKey,
  shortName,
  theme,
  title,
  description,
  keywords,
  subtitle,
  placeholder = '업체명 또는 피해 키워드를 입력하세요',
  guide = '입력한 키워드의 피해 대응 안내 페이지로 이동합니다.',
  content
}) {
  return {
    ...COMMON,
    siteKey,
    domains: [domain, `www.${domain}`],
    siteName: `${OPERATOR} | ${shortName}`,
    legalDisplayName: `${OPERATOR} | ${shortName}`,
    shortName,
    theme,
    title,
    description,
    keywords,
    colors: PALETTES[theme],
    launcher: {
      eyebrow: shortName,
      headline: OPERATOR,
      subtitle,
      placeholder,
      guide
    },
    content
  };
}

export const SITE_PROFILES = {
  'yb-recover.com': makeProfile({
    domain: 'yb-recover.com',
    siteKey: 'yb-recover',
    shortName: '금융사기 피해회복센터',
    theme: 'recover',
    title: '금융사기 피해회복 상담 | 법무법인 윤빛 금융사기 피해회복센터',
    description: '금융사기 피해 정황, 출금거부, 추가입금 요구, 연락두절 상황을 입금자료와 대화내역 기준으로 검토하고 피해회복 대응 방향을 안내합니다.',
    keywords: ['금융사기 피해회복', '금융사기 상담', '피해금 회수', '출금거부 대응'],
    subtitle: '입금내역과 대화자료가 남아 있다면 현재 피해 정황부터 확인해야 합니다.',
    content: {
      heroBadge: '금융사기 피해회복 전문 대응',
      heroLead: '피해금 회복은 기다림보다 남아 있는 자료와 자금 흐름을 빠르게 확인하는 데서 시작합니다.',
      sectionTitle: '피해회복 가능성을 높이는 핵심 기준',
      processTitle: '법률 검토와 회복 절차를 함께 설계합니다.'
    }
  }),
  'yb-response.com': makeProfile({
    domain: 'yb-response.com',
    siteKey: 'yb-response',
    shortName: '투자사기 집단대응센터',
    theme: 'response',
    title: '투자사기 집단대응 | 법무법인 윤빛 투자사기 집단대응센터',
    description: '투자사기 피해자가 동일하거나 유사한 피해 정황을 함께 확인하고 자료 취합, 집단대응, 회복 절차를 검토할 수 있도록 안내합니다.',
    keywords: ['투자사기 집단대응', '투자사기 피해자', '집단대응 절차', '투자사기 대응'],
    subtitle: '동일하거나 유사한 피해 정황이 있다면 자료를 함께 대조해 대응 가능성을 확인해야 합니다.',
    content: {
      heroBadge: '투자사기 피해자 집단대응',
      heroLead: '개별 피해로 보이더라도 동일한 모집 방식과 입금 흐름이 확인되면 대응 전략은 달라질 수 있습니다.',
      sectionTitle: '집단대응 검토를 위한 핵심 자료',
      processTitle: '피해 정황 취합부터 대응 방향 정리까지 단계적으로 확인합니다.'
    }
  }),
  'yb-alert.com': makeProfile({
    domain: 'yb-alert.com',
    siteKey: 'yb-alert',
    shortName: '금융사기 공동대응센터',
    theme: 'alert',
    title: '금융사기 공동대응 | 법무법인 윤빛 금융사기 공동대응센터',
    description: '금융사기 동일 피해 정황과 피해자 자료를 확인하고 공동대응 가능성, 증거 보존, 대응 절차를 안내합니다.',
    keywords: ['금융사기 공동대응', '금융사기 피해자', '동일 피해', '공동대응센터'],
    subtitle: '동일한 피해 정황이 있다면 자료를 나누어 보지 말고 하나의 사건 구조로 확인해야 합니다.',
    content: {
      heroBadge: '동일 피해 공동대응 안내',
      heroLead: '같은 업체·계좌·사이트·담당자와 연결된 피해는 자료 취합 여부가 대응 속도와 방향에 영향을 줍니다.',
      sectionTitle: '공동대응을 위해 먼저 맞춰볼 사실관계',
      processTitle: '개별 자료를 하나의 피해 구조로 정리합니다.'
    }
  }),
  'yb-check.com': makeProfile({
    domain: 'yb-check.com',
    siteKey: 'yb-check',
    shortName: '금융피해 회복지원센터',
    theme: 'check',
    title: '금융피해 정황 확인 | 법무법인 윤빛 금융피해 회복지원센터',
    description: '금융피해 여부가 불분명한 상황에서 피해 정황을 확인하고 증거자료 준비, 추가 피해 차단, 회복 절차를 안내합니다.',
    keywords: ['금융피해 회복지원', '금융피해 확인', '피해자료 준비', '회복 절차'],
    subtitle: '현재 상황을 점검하고 회복을 위해 필요한 자료부터 준비하십시오.',
    placeholder: '피해 상황 또는 업체명을 입력하세요',
    guide: '피해 정황과 회복 준비사항을 확인합니다.',
    content: {
      heroBadge: '금융피해 회복지원 안내',
      heroLead: '피해 여부를 단정하기 전 출금 조건, 추가 요구, 연락 방식과 입금 흐름을 차분히 점검해야 합니다.',
      sectionTitle: '회복 지원을 위해 확인할 사항',
      processTitle: '정황 확인, 자료 정리, 대응 검토 순서로 안내합니다.'
    }
  }),
  'yb-case.com': makeProfile({
    domain: 'yb-case.com',
    siteKey: 'yb-case',
    shortName: '금융피해 회복솔루션센터',
    theme: 'case',
    title: '금융피해 회복솔루션 | 법무법인 윤빛 금융피해 회복솔루션센터',
    description: '금융피해 상황을 유형별로 분석하고 증거자료, 자금 흐름, 대응 시점에 맞춘 회복 솔루션과 실행 순서를 안내합니다.',
    keywords: ['금융피해 회복솔루션', '피해회복 방법', '금융피해 해결', '상황별 대응'],
    subtitle: '사건마다 다른 자료와 자금 흐름에 맞춰 회복을 위한 실행 순서를 확인합니다.',
    placeholder: '피해 키워드 또는 업체명을 입력하세요',
    guide: '상황별 회복 솔루션 페이지로 이동합니다.',
    content: {
      heroBadge: '상황별 금융피해 회복솔루션',
      heroLead: '같은 피해 유형이라도 입금 시점, 상대방 특정 단서, 자금 이동 여부에 따라 필요한 조치가 달라집니다.',
      sectionTitle: '회복 솔루션을 결정하는 기준',
      processTitle: '사실관계에 맞는 실행 순서를 설계합니다.'
    }
  }),
  'yb-safe.com': makeProfile({
    domain: 'yb-safe.com',
    siteKey: 'yb-safe',
    shortName: '금융범죄 전문대응센터',
    theme: 'safe',
    title: '금융범죄 전문대응 | 법무법인 윤빛 금융범죄 전문대응센터',
    description: '금융범죄의 계좌 이용, 자금 분산, 사칭, 출금 통제 구조를 분석하고 증거 보존과 전문 대응 방향을 안내합니다.',
    keywords: ['금융범죄 전문대응', '금융범죄 피해', '자금추적', '금융범죄 대응센터'],
    subtitle: '계좌와 자금 이동 구조를 기준으로 전문 대응 방향을 확인합니다.',
    placeholder: '사건 키워드 또는 업체명을 입력하세요',
    guide: '금융범죄 구조와 대응 우선순위를 안내합니다.',
    content: {
      heroBadge: '금융범죄 구조 분석 및 전문대응',
      heroLead: '대포통장과 분산 송금이 개입된 사건은 표면적인 대화보다 계좌·자금 흐름을 중심으로 확인해야 합니다.',
      sectionTitle: '전문 대응을 위한 분석 기준',
      processTitle: '자금 흐름과 상대방 특정 가능성을 함께 검토합니다.'
    }
  }),
  'yb-help.com': makeProfile({
    domain: 'yb-help.com',
    siteKey: 'yb-help',
    shortName: 'YB 대응솔루션',
    theme: 'help',
    title: '금융피해 대응솔루션 | 법무법인 윤빛 YB 대응솔루션',
    description: '금융피해 상황을 빠르게 정리하고 자료 확보, 추가 피해 차단, 대응 절차를 실행 가능한 솔루션 형태로 안내합니다.',
    keywords: ['YB 대응솔루션', '금융피해 대응솔루션', '사기피해 대응', '피해 대응안'],
    subtitle: '복잡한 피해 상황을 지금 실행할 수 있는 대응 단계로 정리합니다.',
    placeholder: '피해 상황 또는 키워드를 입력하세요',
    guide: '상황에 맞는 대응 솔루션을 확인합니다.',
    content: {
      heroBadge: '금융피해 실행형 대응솔루션',
      heroLead: '막연한 설명보다 지금 보존할 자료, 중단할 행동, 검토할 절차를 구체적으로 정리하는 것이 중요합니다.',
      sectionTitle: '실행 가능한 대응안을 만드는 기준',
      processTitle: '현재 상황에서 우선할 조치를 순서대로 제시합니다.'
    }
  }),
  'yb-watch.co.kr': makeProfile({
    domain: 'yb-watch.co.kr',
    siteKey: 'yb-watch',
    shortName: 'YB 대응전략센터',
    theme: 'watch',
    title: '금융피해 대응전략 | 법무법인 윤빛 YB 대응전략센터',
    description: '금융피해 발생 과정과 위험 신호를 분석하고 증거 확보, 추가 피해 차단, 법적 대응의 우선순위를 전략적으로 안내합니다.',
    keywords: ['YB 대응전략센터', '금융피해 대응전략', '사기피해 분석', '대응 우선순위'],
    subtitle: '피해 흐름과 남아 있는 단서를 기준으로 대응 우선순위를 설계합니다.',
    placeholder: '분석할 피해 키워드를 입력하세요',
    guide: '피해 정황별 대응전략 페이지로 이동합니다.',
    content: {
      heroBadge: '금융피해 대응전략 분석',
      heroLead: '무엇부터 해야 하는지 결정하려면 피해 진행 단계, 자료 상태, 자금 이동 가능성을 함께 봐야 합니다.',
      sectionTitle: '대응전략 수립을 위한 판단 기준',
      processTitle: '긴급도와 회수 가능성을 기준으로 우선순위를 정합니다.'
    }
  })
};

export function getCurrentSite(host = '') {
  const clean = String(host || '')
    .toLowerCase()
    .split(':')[0]
    .replace(/^www\./, '');

  if (!clean || clean === 'localhost' || clean === '127.0.0.1') {
    return SITE_PROFILES['yb-recover.com'];
  }

  return Object.values(SITE_PROFILES).find((site) =>
    site.domains.some((domain) => domain.replace(/^www\./, '') === clean)
  ) || SITE_PROFILES['yb-recover.com'];
}
