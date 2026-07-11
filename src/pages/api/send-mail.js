export const prerender = false;

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const digits = (value, max = 15) => String(value || '').replace(/[^0-9]/g, '').slice(0, max);
const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ success: false, error: '올바른 요청 형식이 아닙니다.' }, 415);
    }

    const body = await request.json();

    // 봇 차단용 숨김 필드입니다. 사용자가 입력할 수 없는 값이 들어오면 조용히 종료합니다.
    if (clean(body.website, 100)) {
      return json({ success: true });
    }

    const name = clean(body.name, 30);
    const phone = digits(body.phone, 11);
    const amount = digits(body.amount, 15);
    const caseName = clean(body.caseName || '금융사기', 120);
    const message = clean(body.message, 2000);
    const siteName = clean(body.siteName || '법무법인 윤빛', 120);
    const sourcePath = clean(body.sourcePath || '/', 300);
    const privacyConsent = body.privacyConsent === true || body.privacyConsent === 'true';

    if (!name || phone.length < 9) {
      return json({ success: false, error: '이름과 올바른 연락처를 입력해 주세요.' }, 400);
    }

    if (!privacyConsent) {
      return json({ success: false, error: '개인정보 수집·이용 동의가 필요합니다.' }, 400);
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const to = import.meta.env.CONSULT_TO_EMAIL || 'yoonbitlawfirm@gmail.com';
    const from = import.meta.env.CONSULT_FROM_EMAIL || 'YOONBIT <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      if (import.meta.env.DEV) {
        console.info('[consult:dev]', { caseName, siteName, sourcePath });
        return json({ success: true, dev: true });
      }

      return json({
        success: false,
        error: '상담 접수 설정을 확인 중입니다. 전화상담으로 문의해 주세요.'
      }, 503);
    }

    const html = `
      <div style="font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7;color:#16181d;">
        <h2 style="margin:0 0 20px;">법무법인 윤빛 상담 접수</h2>
        <table style="border-collapse:collapse;width:100%;max-width:720px;">
          <tbody>
            <tr><th style="width:140px;padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">사이트</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(siteName)}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">접수 페이지</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(sourcePath)}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">사건</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(caseName)}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">이름</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">연락처</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(phone)}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">피해금액</th><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(amount || '-')}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">상담 내용</th><td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap;">${escapeHtml(message || '-')}</td></tr>
            <tr><th style="padding:10px;border:1px solid #ddd;text-align:left;background:#f6f6f6;">개인정보 동의</th><td style="padding:10px;border:1px solid #ddd;">동의</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject: `[윤빛 상담접수] ${caseName} / ${name}`,
        html
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[consult:send-failed]', response.status, detail.slice(0, 300));
      throw new Error('상담 접수 메일 전송에 실패했습니다.');
    }

    return json({ success: true });
  } catch (error) {
    console.error('[consult:error]', error instanceof Error ? error.message : String(error));
    return json({
      success: false,
      error: '접수 중 오류가 발생했습니다. 전화상담으로 문의해 주세요.'
    }, 500);
  }
}
