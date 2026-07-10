# YB 8개 도메인 최종 적용 안내

## Vercel 환경변수
- `RESEND_API_KEY`
- `CONSULT_TO_EMAIL=contact@yoonbitlawfirm.com`
- `CONSULT_FROM_EMAIL=Yoonbit Landing <onboarding@resend.dev>`
- `SHEET_JSON_URL=구글 Apps Script 웹 앱 URL`

## 구글시트 CMS
1. 구글시트에서 `확장 프로그램 → Apps Script`를 엽니다.
2. `google-apps-script/Code.gs` 전체를 붙여넣습니다.
3. `setupWebContentSheet`를 한 번 실행합니다.
4. `배포 → 새 배포 → 웹 앱`, 실행 사용자는 본인, 액세스는 링크가 있는 모든 사용자로 설정합니다.
5. 생성 URL을 Vercel `SHEET_JSON_URL`에 등록하고 재배포합니다.

### 상태값
- `draft`: 비공개 404
- `published`: 발행 및 sitemap/RSS 포함
- `noindex`: 접속 가능, 검색 제외
- `disabled`: 비공개 404
- `deleted`: 삭제 410 및 sitemap/RSS 제외
- `redirect`: `redirectTo`로 302 이동

### 도메인값
`yb-recover`, `yb-response`, `yb-alert`, `yb-check`, `yb-case`, `yb-safe`, `yb-help`, `yb-watch`, `all`

## 공통 연결값
- 전화: 010-2175-4252
- 카카오: https://open.kakao.com/o/sEEHGIti
- 이메일: contact@yoonbitlawfirm.com
- OG: `/public/images/yoonbit-og.png`
- 파비콘: `/public/images/favicon.png`

## Smartlog
`yb-recover.com`의 `/`, `/scam`, `/scam/[slug]`에만 `UHPT-300506 / a300` 코드가 조건부 삽입됩니다.

## 소스 보기
`astro.config.mjs`에서 `compressHTML: false`, `inlineStylesheets: 'never'`, CSS/JS minify 해제를 적용했습니다. Ctrl+U에서 HTML은 줄바꿈되고 CSS는 별도 파일로 분리됩니다.
