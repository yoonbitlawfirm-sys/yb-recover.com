/**
 * 네이버웹 통합 웹문서 CMS — 최종 간편형
 *
 * [운영 방식]
 * 1) 시트 탭 이름: 네이버웹
 * 2) 상단 메뉴 이름: 웹문서 관리
 * 3) 사용자가 직접 입력하는 값: A열 키워드만
 * 4) B~E열(상태/생성일/주소/수정일)은 자동 처리
 * 5) 한 키워드가 8개 웹배포 도메인에 동시에 반영
 * 6) 500개씩 발행하며 마지막 처리 위치를 기억
 * 7) 삭제/비공개/복구도 원본 한 행으로 8개 도메인에 동시 반영
 *
 * [Vercel]
 * Apps Script 웹앱 /exec URL을 Vercel 환경변수 SHEET_JSON_URL에 저장
 */

const SHEET_NAME = '네이버 웹';
const MENU_NAME = '웹문서 관리';

const BATCH_SIZE = 500;
const NEXT_ROW_PROPERTY = 'NAVER_WEB_NEXT_ROW_V3';

const SIMPLE_HEADERS = [
  '키워드',
  '상태',
  '생성일',
  '주소',
  '수정일'
];

const COL = {
  KEYWORD: 1,
  STATUS: 2,
  CREATED_AT: 3,
  SLUG: 4,
  UPDATED_AT: 5
};

const STATUS = {
  WAITING: '대기',
  PUBLISHED: '발행',
  DRAFT: '비공개',
  DELETED: '삭제'
};

const DOMAIN_PROFILES = {
  'yb-recover': {
    caseType: '피해회복',
    badge: '금융사기 피해회복 안내',
    seoSuffix: '출금거부·추가입금 피해회복 대응 절차',
    headline: keyword => `${keyword} 피해가 의심된다면 남아 있는 자료부터 회복 가능성을 확인해야 합니다`,
    subHeadline: '입금 내역, 대화 자료, 계좌 정보와 사이트 주소를 보존하고 자금 흐름과 대응 가능성을 신속히 점검해야 합니다.',
    notice: '추가 송금은 중단하고 입금내역·대화자료·계좌정보를 원본 상태로 보존하십시오.',
    risks: [
      '입금 계좌, 예금주, 송금 시점과 명목을 정리합니다.',
      '담당자 연락처, 대화방, 사이트 주소와 출금 제한 화면을 보존합니다.',
      '지급정지, 형사 고소, 가압류와 손해배상 가능성을 함께 검토합니다.'
    ],
    triggers: [
      '출금 지연 또는 추가 입금 요구가 시작된 경우',
      '담당자 연락이 끊기거나 사이트 접속이 제한된 경우',
      '계좌·예금주·대화자료 등 상대방 특정 단서가 남아 있는 경우'
    ],
    factTitle: keyword => `${keyword} 피해회복은 자금 흐름과 상대방 특정 단서를 확인하는 데서 시작합니다`,
    factBody: '피해금 회수 가능성은 입금 후 경과 시간, 자금 이동 여부, 상대방 특정 가능성과 보유 증거에 따라 달라집니다.',
    processTitle: '자료 보존부터 자금 흐름 및 법적 조치 검토까지 진행합니다'
  },

  'yb-response': {
    caseType: '긴급대응',
    badge: '긴급 대응 안내',
    seoSuffix: '피해 발생 직후 확인해야 할 대응 절차',
    headline: keyword => `${keyword} 피해가 의심된다면 지금 대응 순서를 확인해야 합니다`,
    subHeadline: '입금 내역, 대화 자료, 사이트 주소가 남아 있다면 현재 상황부터 신속히 점검해야 합니다.',
    notice: '추가입금 요구나 출금 지연이 이어지는 경우 대응이 늦어질수록 사실관계 확인이 어려워질 수 있습니다.',
    risks: [
      '출금 또는 환급을 이유로 추가 입금을 요구하는 경우',
      '담당자 연락이 지연되거나 계정 접근이 제한되는 경우',
      '세금·보증금·인증비 명목의 반복 결제를 요구하는 경우'
    ],
    triggers: [
      '이미 상대방에게 송금한 내역이 남아 있는 경우',
      '대화방이나 사이트가 갑자기 삭제된 경우',
      '제3자 명의 계좌로 추가 송금을 요구받은 경우'
    ],
    factTitle: keyword => `${keyword} 사건은 초기 자료 확보와 사실관계 정리가 우선입니다`,
    factBody: '입금 계좌, 대화 기록, 접속 주소, 상대방이 제시한 조건을 시간순으로 정리하면 이후 대응 방향을 검토하는 데 도움이 됩니다.',
    processTitle: '자료 확인부터 후속 대응 검토까지 단계별로 진행합니다'
  },

  'yb-alert': {
    caseType: '피해경보',
    badge: '피해 경보',
    seoSuffix: '추가입금·출금지연 위험 신호 확인',
    headline: keyword => `${keyword} 관련 요구가 반복된다면 위험 신호를 먼저 확인하십시오`,
    subHeadline: '정상적인 거래처럼 보여도 출금 조건이 계속 바뀌거나 비용 요구가 늘어난다면 주의가 필요합니다.',
    notice: '상대방의 설명만 믿고 추가 결제를 진행하기 전에 거래 구조와 자금 요구 이유를 다시 확인해야 합니다.',
    risks: [
      '수익금 출금을 위해 선입금을 요구하는 경우',
      '회사 또는 플랫폼 정보가 수시로 변경되는 경우',
      '피해 사실을 숨기도록 요구하거나 외부 상담을 막는 경우'
    ],
    triggers: [
      '처음 안내받지 않은 비용이 갑자기 발생한 경우',
      '원금 반환 날짜가 반복해서 연기되는 경우',
      '출금 신청 이후 추가 조건이 계속 붙는 경우'
    ],
    factTitle: keyword => `${keyword} 피해는 반복되는 추가 요구에서 드러나는 경우가 많습니다`,
    factBody: '처음 약속과 실제 요구가 달라졌는지, 출금 조건이 반복 변경됐는지, 상대방의 신원과 사업 정보가 확인되는지를 함께 살펴봐야 합니다.',
    processTitle: '위험 신호 확인 후 필요한 대응 범위를 정리합니다'
  },

  'yb-check': {
    caseType: '정황확인',
    badge: '피해 정황 확인',
    seoSuffix: '사기 의심 정황 및 확인 기준',
    headline: keyword => `${keyword} 상황이 맞는지 핵심 정황부터 확인해 보십시오`,
    subHeadline: '현재 상황이 단순 지연인지 사기 의심 단계인지 구분하려면 상대방의 요구 방식과 자금 흐름을 함께 봐야 합니다.',
    notice: '판단이 애매한 경우에도 증거가 사라지기 전에 자료를 먼저 보존하는 것이 중요합니다.',
    risks: [
      '계약 내용과 실제 진행 방식이 다른 경우',
      '사업자·담당자·계좌 명의가 서로 일치하지 않는 경우',
      '환급 또는 출금 조건이 사후에 추가되는 경우'
    ],
    triggers: [
      '상대방 신원이나 사업자 정보 확인이 어려운 경우',
      '수익 또는 환급을 과도하게 확신시키는 경우',
      '문제 제기 후 대화 내용 삭제나 차단이 발생한 경우'
    ],
    factTitle: keyword => `${keyword} 여부는 개별 정황을 종합해서 판단해야 합니다`,
    factBody: '한 가지 문구만으로 단정하기보다 계약 과정, 송금 경위, 상대방 신원, 출금 조건, 연락 상태를 종합적으로 확인해야 합니다.',
    processTitle: '피해 가능성 확인을 위한 핵심 자료를 검토합니다'
  },

  'yb-case': {
    caseType: '사례분석',
    badge: '유사 사례 분석',
    seoSuffix: '유사 피해 유형과 대응 사례',
    headline: keyword => `${keyword} 유사 사례에서 반복되는 공통 패턴을 확인하십시오`,
    subHeadline: '피해 사례는 표현과 플랫폼만 다를 뿐 추가 입금, 출금 지연, 연락 두절이라는 공통 흐름을 보이는 경우가 많습니다.',
    notice: '유사 사례와 비교하면 현재 상황에서 어떤 자료를 먼저 확보해야 하는지 판단하는 데 도움이 됩니다.',
    risks: [
      '초기 소액 출금 후 고액 입금을 유도하는 방식',
      '전문가 또는 유명 업체를 사칭해 신뢰를 얻는 방식',
      '손실 복구를 명목으로 추가 거래를 권유하는 방식'
    ],
    triggers: [
      '다른 피해자와 유사한 안내 문구를 받은 경우',
      '동일 플랫폼 관련 피해 제보가 확인되는 경우',
      '초기 약속과 다른 방식으로 자금이 이동한 경우'
    ],
    factTitle: keyword => `${keyword} 사건은 유사 수법과 비교하면 구조가 더 명확해질 수 있습니다`,
    factBody: '사용된 명칭보다 실제 자금 요구 방식, 출금 제한 사유, 상대방 연락 방식, 계좌 변경 여부를 중심으로 비교해야 합니다.',
    processTitle: '유사 사례와 현재 피해 정황을 비교해 대응 방향을 검토합니다'
  },

  'yb-safe': {
    caseType: '추가피해예방',
    badge: '추가 피해 예방',
    seoSuffix: '2차 피해와 추가입금 예방 안내',
    headline: keyword => `${keyword} 피해 이후 추가 송금과 2차 접근을 경계해야 합니다`,
    subHeadline: '피해 회복을 도와주겠다는 제3자의 접근이나 추가 비용 요구가 또 다른 피해로 이어질 수 있습니다.',
    notice: '수사기관·금융기관·법률전문가를 사칭한 회수 대행 연락에도 개인정보와 비용을 먼저 제공하지 마십시오.',
    risks: [
      '피해금 회수를 보장하며 선입금을 요구하는 경우',
      '원격제어 앱 설치나 인증번호 전달을 요구하는 경우',
      '다른 계좌로 자금을 이동해야 안전하다고 안내하는 경우'
    ],
    triggers: [
      '기존 피해 정보를 알고 접근하는 제3자가 있는 경우',
      '회수 성공을 확정적으로 장담하는 경우',
      '신분증·통장·인증수단 제출을 과도하게 요구하는 경우'
    ],
    factTitle: keyword => `${keyword} 이후에는 2차 피해 차단도 함께 진행해야 합니다`,
    factBody: '기존 계정과 금융수단의 보안 상태를 점검하고, 피해 정보를 이용한 추가 접근이나 회수 대행 사칭을 경계해야 합니다.',
    processTitle: '기존 피해 확인과 함께 추가 피해 방지 조치를 점검합니다'
  },

  'yb-help': {
    caseType: '상담지원',
    badge: '상담 지원 안내',
    seoSuffix: '자료 준비 및 상담 절차 안내',
    headline: keyword => `${keyword} 피해 상담 전 필요한 자료와 절차를 확인하십시오`,
    subHeadline: '상담 전 핵심 자료를 정리하면 피해 경위와 대응 가능성을 보다 빠르게 검토할 수 있습니다.',
    notice: '입금증, 계좌번호, 대화 내역, 사이트 주소, 상대방 연락처를 삭제하지 말고 원본 형태로 보관하십시오.',
    risks: [
      '자료가 여러 기기와 대화방에 흩어져 있는 경우',
      '상대방 계정이나 사이트가 곧 삭제될 가능성이 있는 경우',
      '피해 발생 시점과 송금 경위 정리가 어려운 경우'
    ],
    triggers: [
      '상담을 위해 어떤 자료가 필요한지 모르는 경우',
      '피해 경위를 시간순으로 정리하기 어려운 경우',
      '민사·형사 절차 중 무엇을 검토해야 할지 모르는 경우'
    ],
    factTitle: keyword => `${keyword} 상담은 사실관계와 자료 정리에서 시작합니다`,
    factBody: '피해 발생 시점, 최초 접촉 경로, 송금 내역, 상대방 요구, 현재 연락 상태를 순서대로 정리하면 상담 효율을 높일 수 있습니다.',
    processTitle: '접수 자료를 기준으로 필요한 절차를 순차적으로 안내합니다'
  },

  'yb-watch': {
    caseType: '수법감시',
    badge: '수법 감시 안내',
    seoSuffix: '사칭 수법·플랫폼 위험 정보',
    headline: keyword => `${keyword} 관련 사칭 수법과 반복되는 운영 패턴을 확인하십시오`,
    subHeadline: '사이트 이름이나 담당자 명칭이 달라도 계좌 변경, 출금 제한, 추가 결제 유도 방식은 유사하게 반복될 수 있습니다.',
    notice: '사이트 폐쇄나 명칭 변경 전 화면, 주소, 계좌 정보, 대화 자료를 가능한 한 빠르게 보존해야 합니다.',
    risks: [
      '도메인·브랜드명·고객센터가 자주 변경되는 경우',
      '공식 업체와 유사한 로고와 문구를 사용하는 경우',
      '여러 계좌를 순차적으로 안내하며 송금을 유도하는 경우'
    ],
    triggers: [
      '검색 결과와 실제 접속 주소가 다른 경우',
      '사업자 정보와 입금 계좌 명의가 다른 경우',
      '사이트 운영 정보나 약관 확인이 어려운 경우'
    ],
    factTitle: keyword => `${keyword} 관련 정보는 명칭보다 실제 운영 패턴을 확인해야 합니다`,
    factBody: '도메인 생성 시점, 사업자 정보, 입금 계좌, 상담 채널, 출금 조건을 함께 확인하면 사칭 또는 비정상 운영 가능성을 점검할 수 있습니다.',
    processTitle: '사이트·계좌·연락 수단을 기준으로 위험 정황을 확인합니다'
  }
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(MENU_NAME)
    .addItem('간편 시트 설정·기존자료 변환', 'setupSimpleSheet')
    .addSeparator()
    .addItem('다음 500개 발행', 'publishNextBatch')
    .addItem('현재 작업 위치 확인', 'showCurrentPosition')
    .addItem('다음 시작 행 직접 설정', 'setNextRowManually')
    .addItem('작업 위치 처음부터 초기화', 'resetProgress')
    .addSeparator()
    .addItem('선택 행 발행', 'publishSelectedRows')
    .addItem('선택 행 비공개', 'draftSelectedRows')
    .addItem('선택 행 삭제', 'deleteSelectedRows')
    .addItem('선택 행 복구', 'restoreSelectedRows')
    .addToUi();
}

/**
 * 기존 복잡한 35열 시트를 백업한 뒤
 * 키워드/상태/생성일/주소/수정일 5열 간편형으로 변환합니다.
 */
function setupSimpleSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, SIMPLE_HEADERS.length).setValues([SIMPLE_HEADERS]);
    formatSimpleSheet_(sheet);
    PropertiesService.getDocumentProperties().setProperty(NEXT_ROW_PROPERTY, '2');
    SpreadsheetApp.getUi().alert('네이버웹 간편 시트를 만들었습니다.');
    return;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map(value => String(value).trim());

  const alreadySimple =
    headers[0] === '키워드' &&
    headers[1] === '상태' &&
    headers[2] === '생성일' &&
    headers[3] === '주소' &&
    headers[4] === '수정일';

  if (alreadySimple) {
    formatSimpleSheet_(sheet);
    SpreadsheetApp.getUi().alert('이미 간편 시트 형식입니다.');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert(
    '간편 시트로 변환',
    '기존 시트를 자동 백업한 뒤 5열 간편형으로 변환합니다.\n\n계속하시겠습니까?',
    ui.ButtonSet.YES_NO
  );

  if (answer !== ui.Button.YES) return;

  const backupName = createBackupName_();
  const backup = sheet.copyTo(ss).setName(backupName);

  const oldValues = sheet.getDataRange().getDisplayValues();
  const oldHeaders = oldValues.shift().map(value => String(value).trim());

  const keywordIndex = findHeaderIndex_(oldHeaders, ['mainKeyword', '키워드']);
  const statusIndex = findHeaderIndex_(oldHeaders, ['status', '상태']);
  const createdIndex = findHeaderIndex_(oldHeaders, ['publishedAt', 'createdAt', '생성일']);
  const slugIndex = findHeaderIndex_(oldHeaders, ['slug', '주소']);
  const updatedIndex = findHeaderIndex_(oldHeaders, ['updatedAt', '수정일']);

  const migrated = oldValues
    .map((row, index) => {
      const keyword = keywordIndex >= 0 ? String(row[keywordIndex] || '').trim() : '';
      if (!keyword) return null;

      const oldStatus = statusIndex >= 0 ? String(row[statusIndex] || '').trim().toLowerCase() : '';
      const status = convertOldStatus_(oldStatus);

      return [
        keyword,
        status,
        createdIndex >= 0 ? row[createdIndex] || '' : '',
        slugIndex >= 0 ? row[slugIndex] || createSlug_(keyword, index + 2) : createSlug_(keyword, index + 2),
        updatedIndex >= 0 ? row[updatedIndex] || '' : ''
      ];
    })
    .filter(Boolean);

  sheet.clear();
  sheet.clearDataValidations();
  sheet.getRange(1, 1, 1, SIMPLE_HEADERS.length).setValues([SIMPLE_HEADERS]);

  if (migrated.length > 0) {
    sheet.getRange(2, 1, migrated.length, SIMPLE_HEADERS.length).setValues(migrated);
  }

  formatSimpleSheet_(sheet);
  PropertiesService.getDocumentProperties().setProperty(NEXT_ROW_PROPERTY, '2');
  SpreadsheetApp.flush();

  ui.alert(
    `간편 시트 변환 완료\n\n` +
    `기존 자료 백업 탭: ${backup.getName()}\n` +
    `변환된 키워드: ${migrated.length}개\n\n` +
    `앞으로 A열에 키워드만 입력하면 됩니다.`
  );
}

/**
 * Vercel 웹페이지에서 호출하는 JSON API
 *
 * 요청 예:
 * ?domain=yb-response&slug=투자사기
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const domain = normalizeDomainKey_(params.domain);
    const slug = normalizeSlug_(params.slug);
    const mode = String(params.mode || '').trim().toLowerCase();
    const offset = Math.max(Number(params.offset || 0) || 0, 0);
    const limit = Math.min(Math.max(Number(params.limit || 500) || 500, 1), 500);

    const sheet = getSheet_();

    // 개별 페이지 조회: slug가 있으면 정확히 1건만 반환
    if (slug) {
      const source = findSourceBySlug_(sheet, slug);

      if (!source) {
        return createJsonResponse_({
          ok: true,
          data: [],
          count: 0,
          total: 0,
          sheet: SHEET_NAME,
          generatedAt: new Date().toISOString()
        });
      }

      const targetDomain = DOMAIN_PROFILES[domain] ? domain : 'yb-recover';
      const page = buildPageData_(source, targetDomain);

      return createJsonResponse_({
        ok: true,
        data: [page],
        count: 1,
        total: 1,
        sheet: SHEET_NAME,
        generatedAt: new Date().toISOString()
      });
    }

    // 목록 조회: sitemap/RSS용. 500개씩 페이지네이션
    if (mode === 'list' || !slug) {
      const sources = getPublishedSources_(sheet);
      const targetDomain = DOMAIN_PROFILES[domain] ? domain : 'yb-recover';
      const sliced = sources.slice(offset, offset + limit);
      const data = sliced.map(source => buildPageData_(source, targetDomain));

      return createJsonResponse_({
        ok: true,
        data,
        count: data.length,
        total: sources.length,
        offset,
        limit,
        hasMore: offset + data.length < sources.length,
        sheet: SHEET_NAME,
        generatedAt: new Date().toISOString()
      });
    }

    return createJsonResponse_({
      ok: true,
      data: [],
      count: 0,
      total: 0,
      sheet: SHEET_NAME,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse_({
      ok: false,
      data: [],
      count: 0,
      total: 0,
      error: error instanceof Error ? error.message : String(error),
      sheet: SHEET_NAME,
      generatedAt: new Date().toISOString()
    });
  }
}

function getPublishedSources_(sheet) {
  ensureSimpleHeaders_(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet
    .getRange(2, 1, lastRow - 1, SIMPLE_HEADERS.length)
    .getDisplayValues();

  const result = [];

  values.forEach((row, index) => {
    const keyword = normalizeKeyword_(row[0]);
    const status = String(row[1] || '').trim();
    const slug = normalizeSlug_(row[3]);

    if (!keyword || !slug || status !== STATUS.PUBLISHED) return;

    result.push({
      rowNumber: index + 2,
      keyword,
      status,
      createdAt: String(row[2] || '').trim(),
      slug,
      updatedAt: String(row[4] || '').trim()
    });
  });

  return result;
}

/**
 * 마지막 처리 위치부터 최대 500개의 미처리 키워드를 발행합니다.
 * 빈 행은 발행 수에 포함하지 않고 계속 아래로 탐색합니다.
 */
function publishNextBatch() {
  const sheet = getSheet_();
  ensureSimpleHeaders_(sheet);

  const ui = SpreadsheetApp.getUi();
  const properties = PropertiesService.getDocumentProperties();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    ui.alert('발행할 키워드가 없습니다.');
    return;
  }

  let startRow = Number(properties.getProperty(NEXT_ROW_PROPERTY) || 2);
  if (!Number.isInteger(startRow) || startRow < 2) startRow = 2;

  if (startRow > lastRow) {
    ui.alert(
      `새로 발행할 키워드가 없습니다.\n\n` +
      `다음 시작 행: ${startRow}행\n` +
      `현재 마지막 행: ${lastRow}행`
    );
    return;
  }

  const values = sheet.getRange(startRow, 1, lastRow - startRow + 1, SIMPLE_HEADERS.length).getValues();
  const usedSlugs = getUsedSlugs_(sheet);

  const now = formatNow_();
  let publishedCount = 0;
  let scannedCount = 0;
  let lastScannedRow = startRow - 1;

  for (let i = 0; i < values.length; i++) {
    const absoluteRow = startRow + i;
    const row = values[i];
    const keyword = normalizeKeyword_(row[0]);

    scannedCount++;
    lastScannedRow = absoluteRow;

    if (!keyword) continue;

    const currentStatus = String(row[1] || '').trim();

    if (currentStatus === STATUS.PUBLISHED) continue;

    let slug = normalizeSlug_(row[3]);

    if (!slug) {
      slug = makeUniqueSlug_(keyword, absoluteRow, usedSlugs);
    } else if (usedSlugs.has(slug) && !isSameRowSlug_(sheet, absoluteRow, slug)) {
      slug = makeUniqueSlug_(keyword, absoluteRow, usedSlugs);
    }

    row[0] = keyword;
    row[1] = STATUS.PUBLISHED;
    row[2] = row[2] || now;
    row[3] = slug;
    row[4] = now;

    usedSlugs.add(slug);
    publishedCount++;

    if (publishedCount >= BATCH_SIZE) break;
  }

  if (scannedCount > 0) {
    sheet.getRange(startRow, 1, scannedCount, SIMPLE_HEADERS.length)
      .setValues(values.slice(0, scannedCount));
  }

  const nextRow = lastScannedRow + 1;
  properties.setProperty(NEXT_ROW_PROPERTY, String(nextRow));
  SpreadsheetApp.flush();

  ui.alert(
    `발행 완료\n\n` +
    `시작 행: ${startRow}행\n` +
    `마지막 확인 행: ${lastScannedRow}행\n` +
    `실제 발행: ${publishedCount}개\n` +
    `다음 시작 행: ${nextRow}행\n\n` +
    `발행된 각 키워드는 7개 도메인에 동시에 적용됩니다.`
  );
}

function publishSelectedRows() {
  updateSelectedRows_(STATUS.PUBLISHED);
}

function draftSelectedRows() {
  updateSelectedRows_(STATUS.DRAFT);
}

function deleteSelectedRows() {
  updateSelectedRows_(STATUS.DELETED);
}

function restoreSelectedRows() {
  updateSelectedRows_(STATUS.PUBLISHED);
}

function updateSelectedRows_(targetStatus) {
  const sheet = getSheet_();
  ensureSimpleHeaders_(sheet);

  const range = sheet.getActiveRange();
  if (!range) throw new Error('처리할 행을 선택하세요.');

  const startRow = Math.max(range.getRow(), 2);
  const endRow = range.getLastRow();

  if (startRow > endRow) {
    throw new Error('키워드가 있는 데이터 행을 선택하세요.');
  }

  const rowCount = endRow - startRow + 1;
  const values = sheet.getRange(startRow, 1, rowCount, SIMPLE_HEADERS.length).getValues();
  const usedSlugs = getUsedSlugs_(sheet);
  const now = formatNow_();

  let changed = 0;

  values.forEach((row, index) => {
    const absoluteRow = startRow + index;
    const keyword = normalizeKeyword_(row[0]);

    if (!keyword) return;

    let slug = normalizeSlug_(row[3]);
    if (!slug) slug = makeUniqueSlug_(keyword, absoluteRow, usedSlugs);

    row[0] = keyword;
    row[1] = targetStatus;
    row[2] = row[2] || now;
    row[3] = slug;
    row[4] = now;

    usedSlugs.add(slug);
    changed++;
  });

  sheet.getRange(startRow, 1, rowCount, SIMPLE_HEADERS.length).setValues(values);
  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    `${changed}개 행 처리 완료\n\n` +
    `상태: ${targetStatus}\n` +
    `7개 도메인에 동일하게 반영됩니다.`
  );
}

function showCurrentPosition() {
  const sheet = getSheet_();
  const nextRow = Number(
    PropertiesService.getDocumentProperties().getProperty(NEXT_ROW_PROPERTY) || 2
  );

  SpreadsheetApp.getUi().alert(
    `현재 작업 위치\n\n` +
    `다음 시작 행: ${nextRow}행\n` +
    `현재 마지막 행: ${sheet.getLastRow()}행`
  );
}

function setNextRowManually() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '다음 시작 행 설정',
    '예: 401행까지 처리했다면 402를 입력하세요.',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const rowNumber = Number(String(response.getResponseText()).trim());

  if (!Number.isInteger(rowNumber) || rowNumber < 2) {
    ui.alert('2 이상의 올바른 행 번호를 입력하세요.');
    return;
  }

  PropertiesService.getDocumentProperties()
    .setProperty(NEXT_ROW_PROPERTY, String(rowNumber));

  ui.alert(`다음 시작 행을 ${rowNumber}행으로 저장했습니다.`);
}

function resetProgress() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert(
    '작업 위치 초기화',
    '다음 시작 위치를 2행으로 초기화하시겠습니까?',
    ui.ButtonSet.YES_NO
  );

  if (answer !== ui.Button.YES) return;

  PropertiesService.getDocumentProperties()
    .setProperty(NEXT_ROW_PROPERTY, '2');

  ui.alert('다음 시작 위치가 2행으로 초기화되었습니다.');
}

/**
 * 키워드 원본을 각 도메인별 웹문서 데이터로 변환합니다.
 */
function buildPageData_(source, domain) {
  const profile = DOMAIN_PROFILES[domain];
  const keyword = source.keyword;
  const date = source.createdAt || formatDate_();

  const reviews = [
    `${keyword} 관련 입금 내역과 대화 자료를 정리한 뒤 사실관계를 검토한 사례입니다.`,
    `출금 지연과 추가 비용 요구가 이어져 ${keyword} 피해 가능성을 확인한 사례입니다.`,
    `사이트 정보와 계좌 흐름을 바탕으로 ${keyword} 관련 대응 방향을 검토한 사례입니다.`
  ];

  const faqs = createFaqs_(keyword, domain);

  return {
    id: `${source.rowNumber}-${domain}`,
    domain,
    slug: source.slug,
    caseName: `${keyword} 피해 대응 안내`,
    mainKeyword: keyword,
    caseType: profile.caseType,
    status: convertStatusForApi_(source.status),

    seoTitle: `${keyword} ${profile.seoSuffix} | 법무법인 윤빛`,
    seoDescription: `${keyword} 관련 피해가 의심되는 경우 확인해야 할 정황, 준비 자료, 대응 절차를 안내합니다. 출금 지연·추가입금·연락 두절이 있다면 사실관계를 먼저 점검하십시오.`,

    headline: profile.headline(keyword),
    subHeadline: profile.subHeadline,
    heroBadge: profile.badge,
    noticeText: profile.notice,

    risk1: profile.risks[0],
    risk2: profile.risks[1],
    risk3: profile.risks[2],

    trigger1: profile.triggers[0],
    trigger2: profile.triggers[1],
    trigger3: profile.triggers[2],

    factTitle: profile.factTitle(keyword),
    factBody: profile.factBody,
    processTitle: profile.processTitle,

    review1: reviews[0],
    review2: reviews[1],
    review3: reviews[2],

    faq1Q: faqs[0].q,
    faq1A: faqs[0].a,
    faq2Q: faqs[1].q,
    faq2A: faqs[1].a,
    faq3Q: faqs[2].q,
    faq3A: faqs[2].a,

    publishedAt: date,
    updatedAt: source.updatedAt || date,
    redirectTo: '',
    memo: '네이버웹 간편형 CMS 자동 생성'
  };
}

function createFaqs_(keyword, domain) {
  const common = [
    {
      q: `${keyword} 피해가 의심되면 무엇부터 해야 하나요?`,
      a: '추가 송금을 중단하고 입금 내역, 계좌번호, 대화 기록, 사이트 주소, 상대방 연락처를 원본 형태로 보관하는 것이 우선입니다.'
    },
    {
      q: '이미 시간이 지난 경우에도 상담이 가능한가요?',
      a: '시간이 지났더라도 남아 있는 자료와 자금 이동 경위를 기준으로 확인할 수 있습니다. 다만 자료 삭제나 계정 폐쇄 전에 가능한 한 빨리 정리하는 것이 좋습니다.'
    },
    {
      q: '상담 전에 어떤 자료를 준비해야 하나요?',
      a: '입금증, 거래 계좌, 메신저 대화, 문자, 이메일, 사이트 화면, 계약 또는 안내 문구, 상대방 연락처를 준비하면 사실관계 확인에 도움이 됩니다.'
    }
  ];

  if (domain === 'yb-safe') {
    common[1] = {
      q: '피해금을 돌려주겠다는 연락을 믿어도 되나요?',
      a: '회수를 보장하며 선입금, 인증번호, 원격제어 앱 설치를 요구한다면 2차 피해 가능성을 먼저 의심해야 합니다.'
    };
  }

  if (domain === 'yb-check') {
    common[1] = {
      q: '사기인지 확실하지 않아도 확인할 수 있나요?',
      a: '단순 지연과 사기 의심 상황은 요구 방식, 출금 조건, 상대방 신원, 자금 흐름을 종합해 검토해야 하므로 확정 전에도 정황 확인이 가능합니다.'
    };
  }

  return common;
}

/* =========================
   내부 유틸리티
========================= */

function getSheet_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(
      `${SHEET_NAME} 시트가 없습니다. 상단 ${MENU_NAME} → 간편 시트 설정·기존자료 변환을 먼저 실행하세요.`
    );
  }
  return sheet;
}

function ensureSimpleHeaders_(sheet) {
  const headers = sheet.getRange(1, 1, 1, SIMPLE_HEADERS.length)
    .getDisplayValues()[0]
    .map(value => String(value).trim());

  if (headers.join('|') !== SIMPLE_HEADERS.join('|')) {
    throw new Error(
      `시트 형식이 간편형이 아닙니다. 상단 ${MENU_NAME} → 간편 시트 설정·기존자료 변환을 먼저 실행하세요.`
    );
  }
}

function formatSimpleSheet_(sheet) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, SIMPLE_HEADERS.length)
    .setValues([SIMPLE_HEADERS])
    .setFontWeight('bold')
    .setBackground('#00d8e8')
    .setFontColor('#00131a');

  sheet.setColumnWidth(COL.KEYWORD, 260);
  sheet.setColumnWidth(COL.STATUS, 100);
  sheet.setColumnWidth(COL.CREATED_AT, 130);
  sheet.setColumnWidth(COL.SLUG, 260);
  sheet.setColumnWidth(COL.UPDATED_AT, 130);

  const rowCount = Math.max(sheet.getMaxRows() - 1, 1);

  sheet.getRange(2, COL.STATUS, rowCount, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(
          [STATUS.WAITING, STATUS.PUBLISHED, STATUS.DRAFT, STATUS.DELETED],
          true
        )
        .build()
    );

  sheet.getRange(2, COL.CREATED_AT, rowCount, 1).setNumberFormat('yyyy-mm-dd HH:mm:ss');
  sheet.getRange(2, COL.UPDATED_AT, rowCount, 1).setNumberFormat('yyyy-mm-dd HH:mm:ss');
}

function findSourceBySlug_(sheet, slug) {
  ensureSimpleHeaders_(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, SIMPLE_HEADERS.length)
    .getDisplayValues();

  for (let i = values.length - 1; i >= 0; i--) {
    const rowSlug = normalizeSlug_(values[i][3]);
    if (rowSlug !== slug) continue;

    return {
      rowNumber: i + 2,
      keyword: normalizeKeyword_(values[i][0]),
      status: String(values[i][1] || '').trim(),
      createdAt: String(values[i][2] || '').trim(),
      slug: rowSlug,
      updatedAt: String(values[i][4] || '').trim()
    };
  }

  return null;
}

function getUsedSlugs_(sheet) {
  const lastRow = sheet.getLastRow();
  const result = new Set();

  if (lastRow < 2) return result;

  const values = sheet.getRange(2, COL.SLUG, lastRow - 1, 1).getDisplayValues();

  values.forEach(row => {
    const slug = normalizeSlug_(row[0]);
    if (slug) result.add(slug);
  });

  return result;
}

function isSameRowSlug_(sheet, rowNumber, slug) {
  return normalizeSlug_(sheet.getRange(rowNumber, COL.SLUG).getDisplayValue()) === slug;
}

function makeUniqueSlug_(keyword, rowNumber, usedSlugs) {
  const base = createSlug_(keyword, rowNumber);
  let candidate = base;
  let sequence = 2;

  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${sequence}`;
    sequence++;
  }

  return candidate;
}

function createSlug_(keyword, rowNumber) {
  const normalized = normalizeKeyword_(keyword)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^0-9a-z가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || `case-${rowNumber}`;
}

function normalizeKeyword_(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSlug_(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '');
}

function normalizeDomainKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/\.co\.kr$/, '')
    .replace(/\.com$/, '')
    .replace(/\.net$/, '')
    .replace(/\.kr$/, '');
}

function convertStatusForApi_(status) {
  const value = String(status || '').trim();

  if (value === STATUS.PUBLISHED) return 'published';
  if (value === STATUS.DRAFT) return 'draft';
  if (value === STATUS.DELETED) return 'deleted';
  return 'draft';
}

function convertOldStatus_(status) {
  if (status === 'published' || status === STATUS.PUBLISHED) return STATUS.PUBLISHED;
  if (status === 'deleted' || status === 'disabled' || status === STATUS.DELETED) return STATUS.DELETED;
  if (status === 'draft' || status === 'noindex' || status === STATUS.DRAFT) return STATUS.DRAFT;
  return STATUS.WAITING;
}

function findHeaderIndex_(headers, candidates) {
  for (const candidate of candidates) {
    const index = headers.indexOf(candidate);
    if (index >= 0) return index;
  }
  return -1;
}

function createBackupName_() {
  const stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd_HHmmss');
  return `${SHEET_NAME}_백업_${stamp}`;
}

function formatNow_() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function formatDate_() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
}

function createJsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
