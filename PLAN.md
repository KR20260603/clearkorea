# 클리어코리아 (ClearKorea) 기획서

> 6·3 지방선거 투표용지 부족 사태를 계기로, 오프라인에 못 나오는 사람들이
> 온라인에서 목소리를 내고 집회를 지원하고 인증으로 연대하는 시민 플랫폼.
>
> 범위: 아래 전부가 v1 단일 범위다. 첫 구현부터 완성한다.
> 원칙: lean하게. 오버엔지니어링 없이 현재 기술로 DAU 10만을 담는다.

---

## 1. 개요 & 포지셔닝

한쪽 진영 사이트가 아니라, 폭넓게 공유되는 요구를 담는 공론장으로 잡는다.

- 전면 메시지: **진상규명 / 재발방지 / 선거 투명성 / 재선거 요구**
- "조직적 부정선거"를 확정 사실처럼 단정하는 카피는 쓰지 않는다. 넓게 잡아야 더 많은 사람을 담고 검색 노출·언론 인용에서도 유리하다.

**안전 가드레일**

- 특정 개인의 신상정보 게시·추적 금지
- 불법 행위(개표소 물리 봉쇄, 사적 제재 등) 조장·모의 금지
- 합법적 의사표현, 집회 정보 공유, 인증 연대만 지원
- 신고 버튼 + 관리자 모더레이션 기본 탑재

**운영 투명성**

- ClearKorea의 컨셉은 투명성이다. GitHub 레포 `KR20260603/clearkorea`는 공개(public) 상태를 유지한다.
- ClearKorea는 오픈소스 플랫폼으로 운영한다. 누구나 GitHub issue/PR로 기획, 문서, 코드, 데이터 품질 개선에 기여할 수 있게 한다.
- 라이선스는 **AGPL-3.0-only**로 둔다. 웹 서비스로 변형 운영되는 경우에도 수정 소스 공개를 요구해 투명성 컨셉과 맞춘다.
- 사이트 푸터에는 GitHub 링크를 노출한다. 라벨은 `GitHub` 또는 `Contribute on GitHub`, 대상은 `https://github.com/KR20260603/clearkorea`.
- 공개 레포에는 소스·기획·비밀이 아닌 운영 원칙만 둔다. 실제 시크릿, 어드민 부트스트랩 식별자, API key, DB password, 배포 토큰은 env/Vercel/Supabase/Cloudflare/PostHog 설정에만 둔다.

---

## 2. 브랜드 / 도메인 / 디자인

- 한글 브랜드 **클리어코리아**, 영문 워드마크 **ClearKorea**
- 도메인 **`clearkorea.com`** (단일 도메인, (선택) `clearkorea.kr` 방어 확보)
- 로고: **태극 문양** 마크 (`pwa-icon.svg`, 2-1 참고)
- 컬러(태극기 기반 다크 테마):

| 토큰 | 용도 | 값 |
|------|------|----|
| `bg` | 배경 | `#0A0A0A` |
| `fg` | 텍스트 | `#FFFFFF` |
| `red` | 강조/액션 | `#CD2E3A` |
| `blue` | 보조 강조 | `#0047A0` |
| `muted` | 보조 텍스트/보더 | `#A1A1AA` |

검정 배경 + 하양 위주, 빨강/파랑은 액션·링크·뱃지 포인트로만 절제해서 쓴다.

### 2-1. 에셋 / 브랜드 이미지 (`/public`)

image-prompts.md로 생성한 이미지를 적재적소에 연결한다.

**방향**: 앱/문서/오픈소스 표면의 기본 브랜드 그래픽은 SVG-first로 간다. `readme-banner.svg`처럼 검정 배경, red/blue taegeuk light ribbon, 얇은 입자감, 명확한 타이포를 벡터로 구현하는 쪽이 더 가볍고 트렌디하다. 래스터 이미지는 PWA 아이콘, OG, SNS 공유, 마케팅 크롭처럼 플랫폼이 래스터를 요구하거나 썸네일 품질이 중요한 곳에 쓴다.

| 파일 | 비율 | 쓰임 |
|------|------|------|
| `pwa-icon.svg` | 1:1 | 로고 마크 canonical vector source. SVG-first 브랜드 기준 |
| `pwa-icon.png` | 1:1 | `pwa-icon.svg` 기반 투명 PNG. PWA 아이콘(192/512) · apple-touch-icon 소스 |
| `pwa-icon.jpg` | 1:1 | `pwa-icon.svg` 기반 검정 배경 JPG. 배경이 필요한 플랫폼용 |
| `hero.png` | 16:9 | 랜딩 히어로 (데스크톱) |
| `hero-mobile.png` | 9:16 | 랜딩 히어로 (모바일) |
| `splash.png` | 9:16 | 앱 스플래시/로딩 · 온보딩 첫 화면 |
| `og.png` | 1.91:1 | 기본 OG/공유 이미지 (openGraph + twitter card) |
| `readme-banner.svg` | 10:3 | GitHub README 상단 배너. 오픈소스/투명성 컨셉 표시 |
| `square.png` | 1:1 | 정사각 론칭 키비주얼 (공지 · 정사각 OG 겸용) |
| `ig-feed.png` | 1:1 | 인스타그램 피드 홍보 |
| `ig-story.png` | 9:16 | 인스타그램 스토리 홍보 |
| `x-header.png` | 3:1 | X 프로필 헤더 배너 |
| `tile.png` | 1:1 | 섹션 배경 텍스처 (은은한 레이어) |

- 로고 마크는 `pwa-icon.svg`(태극)로 확정. PNG/JPG 파생본은 SVG에서 생성한다.
- PWA manifest: name "ClearKorea", theme/background `#0A0A0A`, 아이콘 `pwa-icon.png`, 스플래시 `splash.png`.
- 앱 안의 주요 히어로/헤더는 가능한 SVG/HTML/CSS 조합으로 구현한다. 랜딩 문구는 HTML로 렌더링해 반응형·SEO·다국어 대응을 유지한다.
- 홍보용(og·square·ig-feed·ig-story·x-header)은 공유 메타·SNS에, `tile`은 콘텐츠 뒤 배경 레이어로.

---

## 3. 아키텍처 & 기술 스택

올인원 Next.js 하나. 앱/어드민 라우트는 클라이언트 전용으로 둬 가볍게 유지한다.

- **앞단**: **Cloudflare** (DNS + CDN + WAF + DDoS). 전 트래픽이 Cloudflare를 거쳐 Vercel/Supabase로 간다.
- **프론트**: Next.js 16.2 (App Router) + React 19, TypeScript, Tailwind, **pnpm**
  - 라우트 그룹: `(marketing)` 공개(`/`, SSR/SSG, SEO) · `(app)` 인증 영역(`/app/*`, 클라이언트 전용) · `(admin)` 어드민(`/admin`, 클라이언트 전용, noindex)
  - 진입: 랜딩의 **Enter** → 회원가입/로그인 → `/app`
- **백엔드**: Supabase (Postgres + Auth + Storage + Realtime)
- **배포**: 프론트 Vercel, 백엔드/DB Supabase

세션은 단일 도메인 쿠키로 처리한다.

### 3-0. 외부 서비스 연동 원칙

- Do not integrate Supabase, Vercel, Cloudflare, or PostHog blindly.
- 실제 프로젝트 생성, 결제/요금제 변경, DNS 전환, WAF/봇 차단 적용, OAuth provider secret 등록, PostHog 프로젝트 생성처럼 운영 상태를 바꾸는 critical integration은 작업자가 멈추고 user approval을 받아야 한다.
- 구현에 critical하지 않은 연동은 먼저 provider interface, environment variable contract, mock/fake adapter, setup checklist로 추상화한다. 마지막 배포 준비 단계에서 final setup guide로 실제 연결을 돕는다.
- 문서·코드에는 변수명과 절차만 남기고, project ID를 제외한 secret value, token, password, OAuth client secret, 실제 admin identifier는 커밋하지 않는다.

### 3-1. 개발/운영 보조 도구 (전부 무료 티어로 시작, baseline)

- **shadcn/ui**: Tailwind 컴포넌트, UI 속도 ↑, 락인 없음
- **Zod + react-hook-form**: 폼/입력 검증 타입 안전
- **Supabase 타입 자동생성**(`supabase gen types typescript`)
- **TanStack Query**: 앱 데이터 패칭/캐싱(카운터 폴링·피드)
- **PostHog (단일 관측 도구)**: 제품 분석 + 세션 리플레이 + 피처플래그 + A/B + 서베이 + **에러트래킹** + 웹애널리틱스를 한 SDK에. 무료 1M 이벤트 + 10만 에러/월
  - 피처플래그로 점진 출시 + 공격/장애 시 kill-switch + 모더레이션 임계값 원격 조정
  - 민감 유저라 세션 리플레이는 입력값·목소리 본문 마스킹(PII 금지), EU 호스팅/셀프호스트 고려
  - Sentry 안 씀: PostHog 에러트래킹으로 대체(트라이얼 만료 없음). 스파이크 시 에러 인입 샘플링/한도 설정(공격 트래픽은 Cloudflare가 앞단에서 흡수)
- **Cloudflare Turnstile**: 무료 캡차(작성·제보 도배/봇 차단)
- **업타임 모니터**(UptimeRobot/Better Stack 무료): 다운 즉시 알림
- 선택: **Vercel Web Analytics**(PostHog 웹애널리틱스와 중복), **Resend**(관리자 승인 알림 메일)
- 범위 밖: Sentry, Auth0, Redis, 무거운 APM(Datadog/New Relic), 별도 GraphQL

### 3-2. AI / 에이전트 활용 (AI-native 운영)

겉으로 드러나지 않아도 백엔드·운영에 에이전트를 적극 활용한다.

- **실시간 모더레이션 (AI 콘텐츠 필터는 여기만)**: OpenAI GPT-5.4 Nano로 **핫 글 최초 진입 시 1회만** 검사(전수 X → 비용 최소) → 약한 위반만 soft-hide·관리자 인기글 검토 탭. 상세 7-7
- **영향 투표소 갱신 에이전트**: 일 1회 최신 뉴스에서 신규 확인 투표소 추출 → `affected_stations` 갱신안 생성(관리자 확인 후 반영)
- **집회 정보 에이전트**: 뉴스/SNS에서 전국 신규 집회 장소·시간 수집 → 등록안 초안(서울 외 API 공백 보완)
- **외신 필터 고도화**: 키워드 통과분을 AI 관련성 분류로 한 번 더 거르고 제목 요약·번역 생성
- **큐 트리아지 에이전트**: 제보·관리자신청의 SNS 링크 진위·주제 적합성 검증, 중복 제거, 승인/반려 추천(사람이 최종 결정)
- **운영 이상 탐지**: 봇 웨이브·비정상 트래픽 감지 → 레이트리밋 자동 강화 / Cloudflare Under Attack 트리거
- 안전: 신뢰성 있는 위협·자해·불법 모의 징후는 사람에게 에스컬레이션

---

## 4. 확장성 & 인프라 (DAU 10만, lean)

### 4-1. 부하 전략 (읽기 캐시 우선)

- **읽기 위주 콘텐츠는 엣지 캐시.** 카운터 스냅샷·뉴스·집회정보·인증 피드는 ISR / `Cache-Control`(짧은 TTL)로 서빙, 클라는 캐시값을 5~10초 폴링. 조회당 DB를 안 치므로 뷰어 수와 무관.
- **공개 카운터는 websocket이 아니라 캐시 폴링.** Realtime 동시연결은 요금제당 500 포함이라 피크에 per-client 연결은 부적합. Realtime은 꼭 필요한 좁은 곳에만.
- **커넥션 풀링**: 서버리스 ↔ Postgres는 Supabase **Supavisor 트랜잭션 풀링**.
- **읽기 분산**: 트래픽 늘면 **읽기 복제본** 추가, 컴퓨트 사이즈도 한 단계 상향.
- **미디어**: 인증/배달 이미지는 Supabase Storage(CDN) + 업로드 시 리사이즈/webp. egress 커지면 Cloudflare R2로 이전.
- **쓰기 핫 경로**: 집계 테이블 + 인덱스 최적화, 카운터는 증분 갱신.
- 별도 인메모리 캐시(Redis 등)는 baseline 제외. 엣지 캐시 + Postgres 풀링으로 10만 DAU 충분하고, 병목이 측정으로 확인되면 그때 도입한다.

### 4-2. 보안 / 남용 대비

특정 세력의 공격이 예상되므로 **Cloudflare를 day-1부터 필수 적용**한다(핵심 기능 무료).

- **무제한 DDoS 완화** (Vercel 요금 폭탄도 방지)
- **WAF**(인젝션/XSS/악성봇 룰) + **봇 차단**(쓰기 경로 스팸 방어)
- **CDN 캐시**(Vercel 대역폭 절감 + 해외 유저 속도), **엣지 레이트리밋**, **R2**(egress 무료 스토리지)
- 쓰기 경로에 앱 레벨 레이트리밋 + 의심 시 Turnstile 캡차. Development/test guest bypass도 같은 non-production flag 뒤에서만 허용한다.
- 스팸/도배 모더레이션 + 신고 큐

### 4-3. 요금제 (기준 시점에 따라 변동)

- **Vercel Pro** $20/seat/월 + 사용량(1TB 대역폭 포함, 초과 GB당 $0.15). 캐시 잘 하면 10만 DAU도 수백 달러대.
- **Supabase Pro** $25/월 + 사용량(~100K MAU, DB 8GB, 스토리지 100GB, Realtime 동시연결 500). 컴퓨트 1단계 상향 + 트래픽 늘면 읽기복제본 1대.
- **Cloudflare** 무료 핵심 기능으로 시작, 룰/트래픽 늘면 Pro.
- 비용 안전장치: Vercel Spend Management + Supabase spend cap.
- 초기 합계: 캐시 최적화 가정 시 대략 **$70~400/월**.

### 4-4. 업그레이드 시점

- **Supabase Free → Pro($25)**: Free는 미사용 1주 시 일시정지 + 한도(50K MAU / DB 500MB / egress 5GB / Realtime 200)에서 멈춤. **공개 론칭 시점에 Pro 전환.** 트리거: MAU ~40K · DB ~400MB · 월 egress ~4GB · Realtime 연결 ~150 근접, 또는 일일 백업 필요 시.
- **Pro 안에서 스케일**: CPU/커넥션 지속 높음 → 컴퓨트 ↑. 읽기 부하 ↑ → 읽기 복제본. egress 폭증 → R2.
- **Supabase Team($599)**: 컴플라이언스(SOC2/ISO)·SSO·우선지원 필요할 때만.
- **Vercel Pro 유지**: 대역폭 1TB 선 주시(초과 시 Cloudflare 캐시로 오프로드). 동시실행 ~30k 근접하거나 고급 WAF/SLA 필요 시에만 Enterprise.

---

## 5. 역할 / 권한 모델

| 역할 | 로그인 | 권한 |
|------|--------|------|
| 개발/테스트 우회 | 명시적 non-production flag | 다중 계정 QA용 임시 참여. launch mode에서는 불가능 |
| 일반 유저 | 카카오/네이버 OAuth | 목소리 작성/댓글, 제보, 관리자 신청 |
| 어드민 | 카카오/네이버 OAuth + 승인 | 제보 승인/반려, 집회·스트림·뉴스 관리, 모더레이션 |
| 최고 어드민 | 카카오/네이버 OAuth + 지정/승인 | 어드민 신청 승인/해제, 전체 권한 |

- production participation requires Kakao or Naver OAuth. 공개 출시 환경에서는 Google OAuth, public guest login, guest posting, guest reporting을 노출하지 않는다.
- Development/test guest bypass is non-production only. 여러 계정 QA 편의를 위해 explicit non-production configuration 뒤에서만 허용하고, launch mode에서는 UI/API/DB policy 모두 거부해야 한다.
- Admin bootstrap uses provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval. 실제 식별자 값은 env-only이며 문서·소스·커밋에 쓰지 않는다.
- 역할은 매 로그인마다 재평가한다. env bootstrap identifier에서 빠진 계정은 다음 로그인 때 `user`로 자동 강등된다.
- 어드민 신청은 카카오/네이버 OAuth 유저만 가능하며, 최고 어드민이 트롤·부적격자를 해제(강등) 가능하다.
- 모든 승인/해제는 `audit_logs`에 기록

---

## 6. 정보구조 (앱 하단 독바 5개)

독바는 `/app`에만 존재. 정중앙이 핵심 진입점. UI 라벨은 영어 단독.

| # | 영어 라벨 | 한글 | 역할 |
|---|-----------|------|------|
| 1 | Home | 홈 | 실시간 대시보드 |
| 2 | Rallies | 집회 | 집회 정보 + 지도 + 지원 가이드 |
| 3 (중앙) | Square | 광장 | 온라인 시위장 (목소리) |
| 4 | Live | 라이브 | 유튜브 스트리밍 |
| 5 | News | 소식 | All / Verified / Public / World press + 제보 |

우상단: 닉네임 + Log in / Log out (상태 토글)

---

## 7. 페이지별 기능

### 7-1. Home
- 상단 고정 카운터 2종: 참여한 사람 수 / 목소리 수
- 진행 중 집회 인원 티커
- 주요 목소리 · 인증 하이라이트 · 해외언론 하이라이트 카드

### 7-2. Rallies
- 진행 중/예정 집회 리스트(장소·시간·현황) + 지도
- 지원 가이드(배달 보내는 법, 응원 방법 등)
- 어드민이 등록·업데이트
- **초기 지원 지역**: 서울 송파(올림픽공원·잠실)·강남·광화문·시청 우선, 그 외 영향 지역(인천 연수·부산·대구·울산·경남)은 집회 발생 시 추가. 물리 시위는 서울 송파에 집중.
- **실시간 혼잡도(서울 한정)**: 서울 핫스팟(올림픽공원·잠실 관광특구·광화문·서울광장 등)은 서울시 실시간 도시데이터 API(공식, 5분 갱신, 12h 추이 + AI 예측)로 지역 혼잡도를 끌어와 현장 분위기 지표로 표시
  - 통신사 신호 기반이라 실제 인원과 다를 수 있음 → "지역 실시간 혼잡도"로 표기, 집회 인원으로 단정 금지
  - 연동: API가 http·1회 1장소·키 필요 → 백엔드 프록시 + 1~5분 캐시, 집회 장소를 서울 장소 코드에 매핑
  - 서울 외 지역은 동급 API가 없어 어드민 등록 + 크라우드소싱

### 7-3. Square (중앙·핵심)
- 상단 고정 집계 바(참여한 사람 수 / 목소리 수)
- **Speak up** 입력창 → 목소리 작성(텍스트, 선택적 해시태그)
- 각 글 액션: 공감 / 비추 / 댓글 / **공유** / 신고. 자정작용으로 숨김된 글은 피드에서 제외(7-7)
- 공개 론칭에서는 카카오/네이버 OAuth 사용자만 작성 가능. 개발/테스트 게스트 우회는 명시적 비운영 설정에서만 자동 발급 닉네임으로 작성 가능
- (옵션) 해시태그 필터, 유저 차단/뮤트

**피드 정렬 (탭)**
- 기본 **최신순**. 그 외 **7d / 1d / 12h / 1h** = 해당 기간으로 먼저 필터한 뒤 **핫한 순**으로 정렬
- 핫 점수 = 가중 합(단순 추천순 아님): `w_share·공유 + w_comment·댓글 + w_net·(추천−비추) + w_view·조회`
  - 기본 가중치 예시: 공유 5 · 댓글 3 · (추천−비추) 1 · 조회 0.1 — PostHog 피처플래그로 원격 튜닝
  - (추천−비추) 등은 7-7 브리게이딩 방지(신뢰도 가중·상한) 적용된 값 사용
- 집계 필요: `view_count`(근사, 배치 증분) / `share_count`(공유 버튼: 링크복사·X·스레드·인스타·카카오)

**피드 디자인 (인스타그램·스레드 스타일)**
- 단일 컬럼 카드: 상단 아바타+닉네임+시간 → 본문 → 하단 액션바(공감/비추/댓글/공유 + 카운트)
- 넉넉한 여백, 둥근 모서리, 미니멀 구분선, 다크 테마. 탭하면 댓글 펼침

**집계 정의**
- 참여한 사람 수 = 목소리를 1회 이상 남긴 고유 사용자 수(중복 제거). 공개 론칭은 Kakao/Naver OAuth 계정 기준으로 집계하고, development/test guest fixture는 비운영 QA에서만 쿠키/디바이스 기준 근사치로 다룬다.
- 목소리 수 = 작성된 목소리(게시·댓글) 총합.
- 둘 다 증분 갱신 + 캐시 스냅샷으로 노출.

### 7-4. Live
- 실시간 중계 유튜브 스트림 embed 그리드
- 채널/스트림은 어드민이 등록·검증, 종료분은 다시보기 보관

### 7-5. News (탭 + 제보)
- **All**: 인증 + 일반 타임라인
- **Verified**: 공인/준공인(준공인은 연예인·유튜버·메가 인플루언서 등 포함). 인증 배지 + 본인 SNS embed(X·인스타·유튜브) + 입장문
- **Public**: 일반 시민 응원·배달 인증 피드(사진 + 한 줄)
- **World press**: 외신 언급 사례(썸네일+제목+출처, 클릭 시 원문)
- 우상단 **Report a post** 버튼

### 7-6. Affected polls (영향 투표소) — 별도 페이지
- 투표용지 부족이 확인된 투표소/지역 보드. 독바 외 별도 라우트(`/app/stations`), Home·Rallies에서 진입.
- 뉴스 기반 **검증 리스트**(`affected_stations`)로 운영하며 마지막 업데이트 일자를 표시한다. v1은 시드 데이터로 시작하고 일 1회 에이전틱 Cron 갱신 구조에 맞춘다.
- 표현: 줄 리스트 X. **투표함 SVG 모형**으로 잔량을 낮게 그려 '부족'을 시각화. 모바일 **3열 그리드**(넓어지면 4~6열), 박스 아래 지역명, 심각도 표시등(빨강=중단 / 주황=부족 / 노랑=경미). **가나다순** 정렬.
- 상단 요약: 확인 50곳 · 중단 22곳 · 6개 시·도(서울 33·인천 6·부산 3·대구 4·울산 2·경남 2). "명단 계속 추가" 고지 + "행정 부실 정리이지 부정선거 단정 아님" 문구.
- 데이터: `affected_stations`(name, area, severity[red/orange/yellow], status, note?, updated_at). v1 시드와 DB 테이블이 같은 형태를 쓴다.
- 구현 시안: `prototypes/affected-stations/AffectedStations.jsx` (투표함 SVG + 3열 그리드 + 가나다 + 심각도 필터)

### 7-7. 모더레이션 / 자정작용 (실시간, 에이전트)

운영비를 아끼려 AI는 모든 글에 돌리지 않는다. **핫 글 진입 시 1회만** 검사하고, 신고·비추 자동 가림은 브리게이딩 방지를 위해 사실상 끄거나 아주 높은 임계값만 둔다.

- **AI 검사 = 핫 글 최초 진입 시 1회만**: 어떤 기간 탭이든(7d/1d/12h/1h) 핫 글에 **처음 들어갈 때** 딱 한 번 OpenAI GPT-5.4 Nano로 검사(`ai_checked` 플래그로 1회 보장). 통과하면 그대로 노출, 약한 필터에 걸리면 **soft-hide** 후 관리자 **인기글 검토 탭**으로. 전수 검사 안 함 → 비용 최소.
- **가벼운 정책**: 웬만한 글 허용, 진짜 위험한 것만(장애인 등 혐오·차별 슬러, 인신공격, 신상유출, 폭력/불법 선동). 애매하면 허용, 최종 판단은 사람. 정책 프롬프트 캐싱으로 비용↓.
- **신고·비추 자동 가림은 최소화 + 최고 어드민 on/off 토글**: 특정 세력이 맞는 말에도 비추·신고를 몰아줄 수 있으므로 기본은 **자동 가림 끄기, 또는 아주 높은 임계값**(예: 신고/비추 1000회+). 유저가 많아 수백은 금방 넘으니 보수적으로. **이 기능의 on/off와 임계값은 관리자 페이지에서 최고 어드민만 조정**, 일반 어드민은 불가.
- **관리자 검토 큐 = 2탭 분리** (10장): **인기글 검토**(AI가 약하게 걸러낸 핫 글, 소수) / **신고·비추 누적**(임계값 넘은 글, 다수일 수 있어 분리). 각 탭에서 **복원** 또는 **영구 가림**.
- **유저 신뢰도(trust)**: 정상 활동 상승 / 위반 확정 시 하락. 낮으면 노출 전 검토·작성 레이트리밋 강화.
- **속도 제한**: 유저·디바이스·IP(Cloudflare)별 작성 빈도 제한, 급증 시 스로틀.
- **이의제기**: 가려진 작성자는 검토 요청 가능.
- 처리 단계: 표시 → (핫 진입) AI 1회 검사 → 약한 위반 시 soft-hide → 인기글 검토 탭 → 관리자 복원/영구 가림.

---

## 8. 해외언론 피드 (RSS)

외신 언급을 전 세계 범위로 모은다. 설정은 `config/feeds.json`.

- **수집**: (A) **Google News RSS 쿼리**(언어/지역별)가 주력 백본. 개별 RSS 없는 매체까지 다 걸린다. (B) 신뢰 외신 직접 RSS는 best-effort(브라우저 수준 UA + 캐싱). Reuters·Bloomberg·WSJ 등 공개 RSS가 막힌 곳은 (A)로 커버.
- **키워드 필터**: `(한국 식별어) AND (선거/투표 식별어)` 다국어 AND 조건(en/ja/es/fr/de/ar + boost: Jamsil, 投票用紙, NEC 등). 통과 항목만 저장.
- **흐름**: Cron 수집 → 필터 통과분만 → URL dedupe → 제목/링크/썸네일(og:image)/출처/게시일/언어 저장(`news_items`) → 어드민이 부적절 항목 숨김(`is_hidden`).
- **표시**: 썸네일+제목+출처+게시일, 클릭 시 원문 새 탭. 본문 미수집(저작권 안전).
- **점검**: `scripts/check-feeds.mjs`로 피드 생사 점검, 주 1회 GitHub Action. `checked:true`인데 죽으면 exit 1.
- `config/feeds.json`: 직접 RSS + Google News 쿼리(언어/지역) + RSS 없는 매체 목록. 지역: 미국·캐나다·영국·유럽·일본·중동·아시아·호주.

---

## 9. 제보 시스템 (Report a post)

인증 게시물 기준이 없으니, 사용자가 제보하고 어드민이 승인한다.

- 버튼 → 모달, 입력 2개만: **공인/준공인명**, **URL(SNS 링크)**
- 제출 시 검증: URL 형식 + **허용 SNS 도메인 화이트리스트**(x.com, instagram.com, youtube.com, youtu.be, facebook.com, tiktok.com, threads.net 등) + (선택) HEAD 도달 확인
- 제출 후 `pending` → 어드민 승인 큐 → 승인 시 Verified 노출 / 반려
- 공개 론칭에서는 카카오/네이버 OAuth 사용자만 제보 가능(승인은 어드민). Development/test fixture report는 명시적 비운영 설정에서만 허용한다.

---

## 10. 관리자 신청 / 권한 관리 (Apply as admin)

- 버튼 위치: 우상단 프로필 메뉴 + 푸터. OAuth 유저만 노출/신청
- 폼: 이름 / 지역 / 연락처 / 자기소개 / 지원 이유
- `pending` → 최고 어드민 승인/반려, 강등(해제) 가능, 이력 로그
- 관리자 페이지엔 **모더레이션 검토 큐(2탭: 인기글 검토 / 신고·비추 누적)**도 포함: 각 글을 **복원** 또는 **영구 가림**, 제보·관리자신청 큐 처리
- **최고 어드민 전용**: 신고·비추 **자동 가림 on/off 토글** + 임계값 설정 (일반 어드민에겐 비노출)

---

## 11. 로그인 / 인증(Auth)

- 출시 환경: 카카오 / 네이버 OAuth만 허용한다. Google OAuth는 production auth scope에서 제외한다.
  - 카카오는 Supabase Auth built-in OAuth provider로 계획한다.
  - 네이버는 현재 계획상 custom OAuth/OIDC provider 또는 bridge로 추상화한다. 실제 구현 직전 공식 Supabase docs를 다시 확인하고, critical provider configuration은 user approval 뒤 진행한다.
  - Google News RSS is unrelated to Google OAuth. 외신/뉴스 피드 ingestion에서 Google News RSS를 쓰는 것은 로그인 정책과 별개로 유지한다.
- 개발/테스트: development/test guest bypass는 explicit non-production flag 뒤에서만 허용한다. launch mode에서는 렌더링, API, RLS 모두에서 거부한다.
- 단일 도메인 쿠키 세션. 우상단: 비로그인 Log in / 로그인 시 닉네임 + Log out

**닉네임 (자동 생성, 변경 불가)**
- 가입 시(카카오/네이버 OAuth 및 development/test guest fixture) 자동 랜덤 생성: **한국어 6글자 + 숫자 4자리**
- 한국어 6글자 = 안전한 일반 명사 2개를 음절 합 6으로 조합(1+5 / 2+4 / 3+3 / 4+2 / 5+1). 비속어·차별·정치·스팸 없는 큐레이션 워드리스트(음절 길이별 버킷)에서만 추출
- 숫자 4자리로 충돌 회피, `users.nickname` unique + 충돌 시 재생성
- 예: 무지개민들레4821, 바다해바라기1305
- **변경 불가**(스팸 단어 악용 방지)
- 글쓴이는 항상 `user_id` 참조로만 저장하고 닉네임 문자열을 글에 복사하지 않는다.

---

## 12. 카피 / 다국어 (글로벌 지향)

- **UI 조작 요소 = 영어 단독**(버튼·독바·탭·메뉴·뱃지·로고). 쉬운 단어 위주(Enter, Speak up, Report, Verify). 라벨은 6장 참고.
- **상세 설명 = 영어 먼저 → 한국어 병기**(모달·온보딩·가이드·빈 상태·공지·약관)
  - 예) EN: "Report a public figure's post. Paste the original SNS link." / KO: "공인이나 준공인의 게시물을 제보하세요. 원본 SNS 링크를 붙여넣으면 됩니다."
- 유저 콘텐츠는 작성 언어 그대로(강제 번역 없음)
- 구현: UI 라벨은 영어 상수, 설명문은 `copy.ts`에 `{ en, ko }` 쌍으로. 풀 i18n 불필요.

---

## 13. UI / 반응형

- 단일 레이아웃(모바일 세로 기준), 모든 해상도 완전 반응형
- PC는 가로가 넓은 만큼 하단 독바 버튼이 가로로 퍼지게(`max-w` 해제 + flex), 콘텐츠도 확장
- breakpoint 잘게 안 나누고 자연스러운 적응형
- 랜딩/앱 공통 푸터에는 GitHub 링크를 둔다. 투명성 컨셉과 오픈소스 기여 경로가 보이도록 하되, 앱 하단 독바의 핵심 5개 라벨은 그대로 유지한다.

---

## 14. SEO (랜딩 전용)

- 검색 노출은 랜딩(`/` 공개 라우트)만. 앱/어드민은 `noindex`
- Metadata API(title/description/OG, 기본 OG 이미지 `/og.png`) + 동적 `sitemap.ts`/`robots.ts`(공개 라우트만) + `opengraph-image`
- JSON-LD: Organization. `hreflang` en/ko(영어 우선 + 한국어 대체)
- 키워드: 재선거, 선거 투명성, 6·3 지방선거 진상규명 / South Korea election, recount 등

---

## 15. 데이터 모델 (초안)

- `users` (id, nickname[unique·변경불가], is_guest[dev/test only], oauth_provider[kakao/naver], oauth_subject, role[guest/user/admin/super], verified_badge, trust_score, created_at)
- `voices` (id, user_id, content, hashtags, visibility[visible/hidden/removed], ai_checked, created_at, like_count, dislike_count, comment_count, view_count, share_count)
- `comments` (id, voice_id, user_id, content, visibility, created_at)
- `rallies` (id, title, location, lat, lng, seoul_place_code, start_at, status, updated_by)  *seoul_place_code 있으면 실시간 혼잡도 연동, 혼잡도 값 자체는 캐시*
- `streams` (id, title, youtube_id, status, is_verified)
- `posts` (id, type[verified/public], user_id, media_url, content, created_at)
- `embeds` (id, platform, url, verified_user_id)
- `tips` (id, submitter_user_id, figure_name, url, platform_detected, status, reviewed_by, created_at)
- `admin_applications` (id, user_id, name, region, contact, intro, reason, status, reviewed_by, created_at)
- `news_items` (id, source, title, thumbnail_url, url, published_at, lang, is_hidden)
- `audit_logs` (id, actor_id, action, target, created_at)
- `reactions` (id, target_type[voice/comment], target_id, user_id, kind[like/dislike], created_at)
- `reports` (id, target_type, target_id, reporter_id, reason, created_at)
- `moderation_actions` (id, target_type, target_id, action[hide/restore/remove], by[ai/admin/auto], reason, created_at)
- `counters` (참여자 수/목소리 수 집계 캐시 또는 뷰)
- `affected_stations` (id, name, area, severity[red/orange/yellow], status, note, updated_at)  *영향 투표소 보드, 초기엔 하드코딩*
- `settings` (key, value, updated_by)  *최고 어드민 전용 앱 설정: 자동가림 on/off·임계값 등*

**닉네임 동기화 원칙**: `voices`·`comments`·`posts`는 글쓴이를 `user_id`로만 참조하고 닉네임 문자열을 행에 복사하지 않는다(비정규화 금지). 표시 이름은 조인으로 렌더한다.

---

## 16. 구현 순서

전부 v1 범위. 대략 위에서 아래로.

- [ ] `clearkorea.com` 구매 + Cloudflare DNS/프록시 적용(무료, WAF/DDoS/봇 on). DNS 전환·WAF 적용은 critical integration이므로 user approval 뒤 진행
- [ ] Next.js 16.2 셋업(pnpm, 라우트 그룹 marketing/app/admin) + Tailwind + shadcn/ui + 디자인 토큰
- [ ] `/public` 브랜드 에셋 연결: PWA manifest(아이콘 pwa-icon · 스플래시 splash · theme `#0A0A0A`) + favicon/apple-touch + OG(og.png) + README 배너(readme-banner.svg) + 랜딩 히어로(hero / hero-mobile)
- [ ] 사이트 공통 푸터에 GitHub 링크(`https://github.com/KR20260603/clearkorea`) 추가 + 오픈소스 기여 경로 노출
- [ ] 라이선스 표기: 푸터/문서/패키지 메타데이터에 `AGPL-3.0-only` 반영
- [ ] Supabase 스키마 + RLS + Supavisor 풀링 + 타입 생성. 실제 hosted project 연결은 critical integration이면 user approval 뒤 진행하고, 그 전에는 local/abstract adapter로 진행
- [ ] 역할 부트스트랩: env-only provider-qualified Kakao/Naver identity identifiers 또는 explicit super-admin approval → 로그인 시 자동 승격/강등
- [ ] 닉네임 자동생성(한국어 6글자 + 숫자 4자리, 음절별 워드리스트, 충돌 재생성, 변경불가) + user_id 참조 동기화
- [ ] 카카오/네이버 OAuth launch gate + development/test guest bypass(non-production only)
- [ ] Square: 목소리 작성/댓글 + 집계 2종(증분 + 캐시 스냅샷)
- [ ] 피드 정렬: 최신순 + 7d/1d/12h/1h 핫 점수(가중합: 공유·댓글·추천−비추·조회) + 조회/공유 집계 + 인스타·스레드 스타일 카드
- [ ] Home 대시보드 / Rallies(+지도) / Live(유튜브 embed)
- [ ] News 탭(All/Verified/Public/World press) + 인증 배지
- [ ] Affected polls 페이지(`/app/stations`): 투표함 SVG 3열 그리드 + 시드 데이터 + 가나다 + Cron 갱신 구조
- [ ] Report a post 모달 + SNS 화이트리스트 검증 + 어드민 큐
- [ ] Apply as admin 폼 + 최고 어드민 승인/해제 + 감사 로그
- [ ] `config/feeds.json` 연동 RSS 수집 Cron + 키워드 필터 + 썸네일 파싱 + `scripts/check-feeds.mjs` 주간 액션
- [ ] 서울 실시간 도시데이터 API 연동(집회 혼잡도, 서버 프록시 + 캐시, 서울 장소 코드 매핑, "지역 혼잡도" 라벨)
- [ ] copy.ts 병기 카피 + 영어 UI 라벨 상수 + Zod/react-hook-form + TanStack Query
- [ ] 엣지 캐시(ISR/Cache-Control) + 카운터 폴링 + 모더레이션/신고
- [ ] 모더레이션: 핫 글 최초 진입 시 OpenAI Nano 1회 검사(ai_checked) + 신고·비추 자동가림(최고 어드민 on/off 토글·임계값, 기본 끄기/~1000) + 관리자 2탭(인기글 검토 / 신고·비추 누적, 복원·영구가림)
- [ ] AI 에이전트(Cron/백엔드): 투표소 갱신 · 집회 수집 · 외신 필터 고도화 · 큐 트리아지 · 이상 탐지
- [ ] PostHog(분석·리플레이·플래그·에러트래킹, 리플레이 마스킹) + Turnstile + 업타임 모니터
- [ ] 랜딩 SEO(hreflang) + Spend cap 설정
