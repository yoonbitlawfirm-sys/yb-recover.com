# 법무법인 윤빛 8개 도메인 통합 사이트

하나의 Astro/Vercel 프로젝트에서 요청 호스트를 판별해 8개 사이트를 제공합니다. 모든 사이트는 `yb-recover.com`의 화면 구조를 공통 원본으로 사용하며, 도메인별로 색상·문구·SEO 정보만 분리됩니다.

## 구현 사항

- 메인 발사대(`/`): 공통 리커버리 레이아웃, 도메인별 컬러, 하단 고정 플로팅 없음
- 상세 페이지(`/scam/[slug]`): 공통 리커버리 레이아웃, 전화 상담·카카오 상담·상담 신청 3버튼 고정 플로팅
- 검색 이동: 절대 도메인을 사용하지 않고 현재 접속 도메인의 `/scam/키워드`로 이동
- 도메인별 사이트명: `법무법인 윤빛 | 사이트별 서비스명`
- 공통 사업자 정보와 광고책임변호사 정보 표시
- 개인정보처리방침·이용약관·이메일무단수집거부·면책·광고 고지 페이지
- 상담 신청 개인정보 수집·이용 고지 및 필수 동의
- 도메인별 title, description, canonical, Open Graph, Twitter Card, JSON-LD, robots, sitemap
- Google Sheet/Apps Script 기반 키워드 CMS

## 도메인과 테마

| 도메인 | 표시 명칭 | 테마 |
|---|---|---|
| yb-recover.com | 금융사기 피해회복센터 | 진홍/골드 |
| yb-response.com | 투자사기 집단대응센터 | 오렌지 |
| yb-alert.com | 금융사기 공동대응센터 | 골드/옐로 |
| yb-check.com | 금융피해 회복지원센터 | 그린 |
| yb-case.com | 금융피해 회복솔루션센터 | 시안 |
| yb-safe.com | 금융범죄 전문대응센터 | 블루 |
| yb-help.com | YB 대응솔루션 | 인디고 |
| yb-watch.co.kr | YB 대응전략센터 | 퍼플 |

사이트명과 컬러는 `src/config/sites.js`에서 관리합니다. 화면 구조는 `src/components/MainHome.astro`와 `src/components/CasePage.astro` 한 벌만 사용합니다.

## 환경변수

`.env.example`을 참고하십시오.

- `SHEET_JSON_URL`: Google Apps Script 웹앱 `/exec` URL
- `RESEND_API_KEY`: 상담 신청 메일 전송용 Resend API 키
- `CONSULT_TO_EMAIL`: 상담 접수 수신 주소
- `CONSULT_FROM_EMAIL`: Resend에서 인증된 발신 주소

## 설치 및 빌드

```bash
npm ci
npm run build
```

개발 서버:

```bash
npm run dev -- --host 0.0.0.0
```

## Apps Script

`google-apps-script/Code.gs`를 Google Sheet의 Apps Script에 전체 덮어쓴 뒤 새 버전으로 웹앱을 재배포해야 합니다. 기본 프로필은 `yb-recover`이며, 요청의 `domain` 값에 따라 8개 프로필을 구분합니다.

## 사업자 정보

- 운영 주체: 법무법인 윤빛
- 광고책임변호사: 윤수빈 변호사
- 사업자등록번호: 754-87-03255
- 주소: 서울특별시 강남구 영동대로 621, 621빌딩 11층
- 대표전화: 010-2175-4252
- 이메일: contact@yoonbitlawfirm.com

개인정보처리방침의 수탁자, 국외 이전, 보유기간 문구는 현재 코드의 Vercel/Resend 구조를 기준으로 작성돼 있습니다. 실제 운영 계정의 계약·보관 정책이 다르면 배포 전에 실제 처리 내용에 맞게 수정해야 합니다.

## 최종 검증

- 릴리스 버전: `2026-07-11 FINAL V4 COMPLETE`
- `npm ci` 및 `npm run build` 통과
- 8개 도메인·메인·상세·SEO·플로팅·사업자 정보 자동검증 176개 항목 통과
- `path-to-regexp` 보안 권고 반영을 위해 `package.json`의 `overrides`에서 6.3.0으로 고정
