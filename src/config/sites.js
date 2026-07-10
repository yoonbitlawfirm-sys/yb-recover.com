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
  favicon: '/images/favicon.png?v=20260710',
  ogImage: '/images/yoonbit-og.png?v=20260710',
  logo: '/images/yoonbit-logo-cutout.png',
  address: '서울특별시 강남구 영동대로 621, 621빌딩 11층',
  businessNumber: '754-87-03255',
  responsibleAttorney: '윤수빈 변호사'
};

export const SITE_PROFILES = {
  'yb-recover.com': {
    ...COMMON,
    siteKey: 'yb-recover',
    domains: ['yb-recover.com', 'www.yb-recover.com', 'localhost'],
    siteName: '법무법인 윤빛 | 금융사기 피해회복센터',
    brandName: '법무법인 윤빛',
    shortName: '금융사기 피해회복센터',
    theme: 'recover',
    isLegalBrand: true,
    title: '금융사기 피해회복 상담 | 법무법인 윤빛 금융사기 피해회복센터',
    description: '금융사기 피해 정황, 출금거부, 추가입금 요구, 연락두절 상황을 입금자료와 대화내역 기준으로 검토하고 피해회복 대응 방향을 안내합니다.',
    keywords: ['금융사기 피해회복', '금융사기 상담', '피해금 회수', '출금거부 대응'],
    colors: { bg: '#03050a', surface: '#0a0f1a', accent: '#9d202a', accent2: '#d6b36b', text: '#f5f7fb' },
    launcher: {
      eyebrow: '금융사기 피해회복센터',
      headline: '법무법인 윤빛',
      subtitle: '입금내역과 대화자료가 남아 있다면 현재 피해 정황부터 확인해야 합니다.',
      placeholder: '업체명 또는 피해 키워드를 입력하세요',
      guide: '입력한 키워드의 피해 대응 안내 페이지로 이동합니다.'
    },
    content: {
      heroBadge: '금융사기 피해회복 전문 대응',
      heroLead: '피해금 회복은 기다림보다 남아 있는 자료와 자금 흐름을 빠르게 확인하는 데서 시작합니다.',
      sectionTitle: '피해회복 가능성을 높이는 핵심 기준',
      processTitle: '법률 검토와 회복 절차를 함께 설계합니다.'
    }
  },
  'yb-response.com': {
    ...COMMON,
    siteKey: 'yb-response',
    domains: ['yb-response.com', 'www.yb-response.com'],
    siteName: '투자사기 집단대응센터',
    brandName: '투자사기 집단대응센터',
    shortName: '투자사기 집단대응센터',
    theme: 'response',
    title: '투자사기 집단대응센터 | 피해자 집단대응 및 대응 절차 안내',
    description: '투자사기 피해자가 동일하거나 유사한 피해 정황을 함께 확인하고 자료 취합, 집단대응, 회복 절차를 검토할 수 있도록 안내합니다.',
    keywords: ['투자사기 집단대응', '투자사기 피해자', '집단대응 절차', '투자사기 대응'],
    colors: { bg: '#06101f', surface: '#0d213d', accent: '#3468d4', accent2: '#9ab8ef', text: '#f4f7fc' },
    launcher: { eyebrow: 'INVESTMENT FRAUD RESPONSE', headline: '투자사기 집단대응센터', subtitle: '피해 정황과 자료를 함께 모아 대응 가능성을 확인합니다.', placeholder: '업체명 또는 피해 키워드를 입력하세요', guide: '동일·유사 피해 정황을 기준으로 대응 안내 페이지를 확인합니다.' },
    content: { heroBadge: '투자사기 피해자 집단대응', heroLead: '개별 피해로 보이더라도 동일한 모집 방식과 입금 흐름이 확인되면 대응 전략은 달라질 수 있습니다.', sectionTitle: '집단대응 검토를 위한 핵심 자료', processTitle: '피해 정황 취합부터 대응 방향 정리까지 단계적으로 확인합니다.' }
  },
  'yb-alert.com': {
    ...COMMON,
    siteKey: 'yb-alert', domains: ['yb-alert.com', 'www.yb-alert.com'],
    siteName: '금융사기 공동대응센터', brandName: '금융사기 공동대응센터', shortName: '금융사기 공동대응센터', theme: 'alert',
    title: '금융사기 공동대응센터 | 동일 피해 공동대응 정보',
    description: '금융사기 동일 피해 정황과 피해자 자료를 확인하고 공동대응 가능성, 증거 보존, 대응 절차를 안내합니다.',
    keywords: ['금융사기 공동대응', '금융사기 피해자', '동일 피해', '공동대응센터'],
    colors: { bg: '#140b0d', surface: '#281318', accent: '#b33a45', accent2: '#d6a56a', text: '#fbf7f4' },
    launcher: { eyebrow: 'FINANCIAL FRAUD CO-RESPONSE', headline: '금융사기 공동대응센터', subtitle: '동일한 피해 정황이 있다면 자료를 나누어 보지 말고 함께 확인해야 합니다.', placeholder: '업체명 또는 피해 키워드를 입력하세요', guide: '공동대응 가능성과 우선 확인 자료를 안내합니다.' },
    content: { heroBadge: '동일 피해 공동대응 안내', heroLead: '같은 업체·계좌·사이트·담당자와 연결된 피해는 자료 취합 여부가 대응 속도와 방향에 영향을 줍니다.', sectionTitle: '공동대응을 위해 먼저 맞춰볼 사실관계', processTitle: '개별 자료를 하나의 피해 구조로 정리합니다.' }
  },
  'yb-check.com': {
    ...COMMON,
    siteKey: 'yb-check', domains: ['yb-check.com', 'www.yb-check.com'],
    siteName: '금융피해 회복지원센터', brandName: '금융피해 회복지원센터', shortName: '금융피해 회복지원센터', theme: 'check',
    title: '금융피해 회복지원센터 | 피해 정황 확인과 회복 절차',
    description: '금융피해 여부가 불분명한 상황에서 피해 정황을 확인하고 증거자료 준비, 추가 피해 차단, 회복 절차를 안내합니다.',
    keywords: ['금융피해 회복지원', '금융피해 확인', '피해자료 준비', '회복 절차'],
    colors: { bg: '#071513', surface: '#102824', accent: '#2b8f7c', accent2: '#9bc8bc', text: '#f1f8f6' },
    launcher: { eyebrow: 'RECOVERY SUPPORT CHECK', headline: '금융피해 회복지원센터', subtitle: '현재 상황을 점검하고 회복을 위해 필요한 자료부터 준비하세요.', placeholder: '피해 상황 또는 업체명을 입력하세요', guide: '피해 정황과 회복 준비사항을 확인합니다.' },
    content: { heroBadge: '금융피해 회복지원 안내', heroLead: '피해 여부를 단정하기 전 출금 조건, 추가 요구, 연락 방식과 입금 흐름을 차분히 점검해야 합니다.', sectionTitle: '회복 지원을 위해 확인할 사항', processTitle: '정황 확인, 자료 정리, 대응 검토 순서로 안내합니다.' }
  },
  'yb-case.com': {
    ...COMMON,
    siteKey: 'yb-case', domains: ['yb-case.com', 'www.yb-case.com'],
    siteName: '금융피해 회복솔루션센터', brandName: '금융피해 회복솔루션센터', shortName: '금융피해 회복솔루션센터', theme: 'case',
    title: '금융피해 회복솔루션센터 | 상황별 피해회복 해결 방향',
    description: '금융피해 상황을 유형별로 분석하고 증거자료, 자금 흐름, 대응 시점에 맞춘 회복 솔루션과 실행 순서를 안내합니다.',
    keywords: ['금융피해 회복솔루션', '피해회복 방법', '금융피해 해결', '상황별 대응'],
    colors: { bg: '#15120c', surface: '#2a2418', accent: '#b88a3c', accent2: '#ddc38f', text: '#faf7ef' },
    launcher: { eyebrow: 'FINANCIAL RECOVERY SOLUTION', headline: '금융피해 회복솔루션센터', subtitle: '사건마다 다른 자료와 자금 흐름에 맞춰 해결 방향을 확인합니다.', placeholder: '피해 키워드 또는 업체명을 입력하세요', guide: '상황별 회복 솔루션 페이지로 이동합니다.' },
    content: { heroBadge: '상황별 금융피해 회복솔루션', heroLead: '같은 피해 유형이라도 입금 시점, 상대방 특정 단서, 자금 이동 여부에 따라 필요한 조치가 달라집니다.', sectionTitle: '회복 솔루션을 결정하는 기준', processTitle: '사실관계에 맞는 실행 순서를 설계합니다.' }
  },
  'yb-safe.com': {
    ...COMMON,
    siteKey: 'yb-safe', domains: ['yb-safe.com', 'www.yb-safe.com'],
    siteName: '금융범죄 전문대응센터', brandName: '금융범죄 전문대응센터', shortName: '금융범죄 전문대응센터', theme: 'safe',
    title: '금융범죄 전문대응센터 | 금융범죄 구조 분석과 전문 대응',
    description: '금융범죄의 계좌 이용, 자금 분산, 사칭, 출금 통제 구조를 분석하고 증거 보존과 전문 대응 방향을 안내합니다.',
    keywords: ['금융범죄 전문대응', '금융범죄 피해', '자금추적', '금융범죄 대응센터'],
    colors: { bg: '#071410', surface: '#112b22', accent: '#3b8f6c', accent2: '#a7cfbc', text: '#f2f8f5' },
    launcher: { eyebrow: 'FINANCIAL CRIME RESPONSE', headline: '금융범죄 전문대응센터', subtitle: '계좌와 자금 이동 구조를 기준으로 전문 대응 방향을 확인합니다.', placeholder: '사건 키워드 또는 업체명을 입력하세요', guide: '금융범죄 구조와 대응 우선순위를 안내합니다.' },
    content: { heroBadge: '금융범죄 구조 분석 및 전문대응', heroLead: '대포통장과 분산 송금이 개입된 사건은 표면적인 대화보다 계좌·자금 흐름을 중심으로 확인해야 합니다.', sectionTitle: '전문 대응을 위한 분석 기준', processTitle: '자금 흐름과 상대방 특정 가능성을 함께 검토합니다.' }
  },
  'yb-help.com': {
    ...COMMON,
    siteKey: 'yb-help', domains: ['yb-help.com', 'www.yb-help.com'],
    siteName: 'YB대응솔루션', brandName: 'YB대응솔루션', shortName: 'YB대응솔루션', theme: 'help',
    title: 'YB대응솔루션 | 금융피해 상황별 실행 대응안',
    description: '금융피해 상황을 빠르게 정리하고 자료 확보, 추가 피해 차단, 대응 절차를 실행 가능한 솔루션 형태로 안내합니다.',
    keywords: ['YB대응솔루션', '금융피해 대응솔루션', '사기피해 대응', '피해 대응안'],
    colors: { bg: '#100d18', surface: '#241c33', accent: '#7358a6', accent2: '#c3aedf', text: '#f7f3fb' },
    launcher: { eyebrow: 'YB RESPONSE SOLUTION', headline: 'YB대응솔루션', subtitle: '복잡한 피해 상황을 실행 가능한 대응 단계로 정리합니다.', placeholder: '피해 상황 또는 키워드를 입력하세요', guide: '상황에 맞는 대응 솔루션을 확인합니다.' },
    content: { heroBadge: '금융피해 실행형 대응솔루션', heroLead: '막연한 설명보다 지금 보존할 자료, 중단할 행동, 검토할 절차를 구체적으로 정리하는 것이 중요합니다.', sectionTitle: '실행 가능한 대응안을 만드는 기준', processTitle: '현재 상황에서 우선할 조치를 순서대로 제시합니다.' }
  },
  'yb-watch.co.kr': {
    ...COMMON,
    siteKey: 'yb-watch', domains: ['yb-watch.co.kr', 'www.yb-watch.co.kr'],
    siteName: 'YB대응전략센터', brandName: 'YB대응전략센터', shortName: 'YB대응전략센터', theme: 'watch',
    title: 'YB대응전략센터 | 금융피해 대응전략과 우선순위 분석',
    description: '금융피해 발생 과정과 위험 신호를 분석하고 증거 확보, 추가 피해 차단, 법적 대응의 우선순위를 전략적으로 안내합니다.',
    keywords: ['YB대응전략센터', '금융피해 대응전략', '사기피해 분석', '대응 우선순위'],
    colors: { bg: '#07131a', surface: '#102833', accent: '#3d829e', accent2: '#a6cfdf', text: '#f0f7fa' },
    launcher: { eyebrow: 'YB RESPONSE STRATEGY', headline: 'YB대응전략센터', subtitle: '피해 흐름과 남아 있는 단서를 기준으로 대응 우선순위를 설계합니다.', placeholder: '분석할 피해 키워드를 입력하세요', guide: '피해 정황별 대응전략 페이지로 이동합니다.' },
    content: { heroBadge: '금융피해 대응전략 분석', heroLead: '무엇부터 해야 하는지 결정하려면 피해 진행 단계, 자료 상태, 자금 이동 가능성을 함께 봐야 합니다.', sectionTitle: '대응전략 수립을 위한 판단 기준', processTitle: '긴급도와 회수 가능성을 기준으로 우선순위를 정합니다.' }
  }
};

export function getCurrentSite(host = '') {
  const clean = String(host || '').toLowerCase().split(':')[0].replace(/^www\./, '');
  return Object.values(SITE_PROFILES).find((site) =>
    site.domains.some((domain) => domain.replace(/^www\./, '') === clean)
  ) || SITE_PROFILES['yb-recover.com'];
}
