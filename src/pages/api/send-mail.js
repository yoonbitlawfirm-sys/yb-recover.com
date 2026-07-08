export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').replace(/[^0-9]/g, '');
    const amount = String(body.amount || '').replace(/[^0-9]/g, '');
    const caseName = String(body.caseName || '금융사기').trim();
    const message = String(body.message || '').trim();

    if (!name || !phone) {
      return new Response(JSON.stringify({ success: false, error: '이름과 연락처가 필요합니다.' }), { status: 400 });
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const to = import.meta.env.CONSULT_TO_EMAIL || 'contact@yoonbitlawfirm.com';
    const from = import.meta.env.CONSULT_FROM_EMAIL || 'Yoonbit Landing <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      console.log('[consult]', { name, phone, amount, caseName, message });
      return new Response(JSON.stringify({ success: true, dev: true }), { headers: { 'content-type': 'application/json' } });
    }

    const html = `
      <h2>윤빛 상담 접수</h2>
      <p><b>사건:</b> ${caseName}</p>
      <p><b>이름:</b> ${name}</p>
      <p><b>연락처:</b> ${phone}</p>
      <p><b>피해금액:</b> ${amount || '-'}</p>
      <p><b>내용:</b><br/>${message || '-'}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject: `[윤빛 상담접수] ${caseName} / ${name}`, html })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { 'content-type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
