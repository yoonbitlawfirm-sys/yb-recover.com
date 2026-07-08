# yb-recover launcher v3

## 구조

- `/` : 발사대 메인. 법무법인 윤빛 브랜드 본진, 검색창, 8개 도메인 차별화, 업무영역, 프로세스, 상담폼.
- `/scam/[slug]` : 발사포. 구글시트 또는 fallback 데이터 기반 키워드별 상세 페이지.
- `src/config/sites.js` : 8개 도메인별 색감, SEO, 전화, 카카오 프로필.
- `src/data/fallbackCases.js` : 구글시트 연결 전 테스트 데이터.
- `src/lib/sheet.js` : 구글시트 연동 자리.

## 실행

```bash
npm install
npm run dev
```

확인 주소:

```txt
http://localhost:4321/
http://localhost:4321/scam/코인사기
http://localhost:4321/scam/출금거부
```

## 페이지 상태값

구글시트 또는 fallback 데이터에서 `status`로 제어합니다.

- `published` : 정상 노출
- `draft` : 404 + noindex
- `disabled` : 404 + noindex
- `deleted` : 410 Gone + noindex
- `noindex` : 페이지 출력 + 검색 제외
- `redirect` : `redirectTo` 주소로 이동

## 이미지

실제 강남 야경 이미지는 아래 경로로 넣으면 자동 반영됩니다.

```txt
public/images/gangnam-night.jpg
```

없어도 CSS 모션 배경으로 기본 화면은 뜹니다.
