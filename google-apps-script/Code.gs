/**
 * YB 8개 도메인 웹문서 CMS
 * 시트 이름: WEB_CONTENT
 * 웹 앱 배포 후 URL을 Vercel 환경변수 SHEET_JSON_URL에 입력합니다.
 */
const SHEET_NAME = 'WEB_CONTENT';
const HEADERS = [
  'id','domain','slug','caseName','mainKeyword','caseType','status',
  'seoTitle','seoDescription','headline','subHeadline','heroBadge','noticeText',
  'risk1','risk2','risk3','trigger1','trigger2','trigger3','factTitle','factBody',
  'processTitle','review1','review2','review3','faq1Q','faq1A','faq2Q','faq2A',
  'faq3Q','faq3A','publishedAt','updatedAt','redirectTo','memo'
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('웹문서 관리')
    .addItem('초기 시트 만들기', 'setupWebContentSheet')
    .addSeparator()
    .addItem('선택 행 발행', 'publishSelectedRows')
    .addItem('선택 행 비공개', 'draftSelectedRows')
    .addItem('선택 행 삭제(410)', 'deleteSelectedRows')
    .addItem('선택 행 복구', 'restoreSelectedRows')
    .addToUi();
}

function setupWebContentSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  const statusCol = HEADERS.indexOf('status') + 1;
  const domainCol = HEADERS.indexOf('domain') + 1;
  sheet.getRange(2, statusCol, Math.max(sheet.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['draft','published','noindex','disabled','deleted','redirect'], true).build());
  sheet.getRange(2, domainCol, Math.max(sheet.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList([
      'yb-recover','yb-response','yb-alert','yb-check','yb-case','yb-safe','yb-help','yb-watch','all'
    ], true).build());
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  const domain = String(params.domain || '').trim().toLowerCase();
  const slug = String(params.slug || '').trim().toLowerCase();

  let rows = getRows_();

  if (domain) {
    rows = rows.filter(row => {
      const value = String(row.domain || '').trim().toLowerCase();
      return value === domain || value === 'all';
    });
  }

  if (slug) {
    rows = rows.filter(row => String(row.slug || '').trim().toLowerCase() === slug);
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      data: rows,
      count: rows.length,
      generatedAt: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRows_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift().map(String);
  return values
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => Object.fromEntries(headers.map((key, index) => [key, row[index] || ''])));
}

function setSelectedStatus_(status) {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== SHEET_NAME) throw new Error(`${SHEET_NAME} 시트에서 실행하세요.`);
  const range = sheet.getActiveRange();
  const statusCol = HEADERS.indexOf('status') + 1;
  const updatedCol = HEADERS.indexOf('updatedAt') + 1;
  const publishedCol = HEADERS.indexOf('publishedAt') + 1;
  const now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  for (let row = range.getRow(); row < range.getRow() + range.getNumRows(); row++) {
    if (row === 1) continue;
    sheet.getRange(row, statusCol).setValue(status);
    sheet.getRange(row, updatedCol).setValue(now);
    if (status === 'published' && !sheet.getRange(row, publishedCol).getValue()) sheet.getRange(row, publishedCol).setValue(now);
  }
  SpreadsheetApp.flush();
}

function publishSelectedRows() { setSelectedStatus_('published'); }
function draftSelectedRows() { setSelectedStatus_('draft'); }
function deleteSelectedRows() { setSelectedStatus_('deleted'); }
function restoreSelectedRows() { setSelectedStatus_('published'); }
