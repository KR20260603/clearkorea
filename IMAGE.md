# 클리어코리아 이미지 생성 메타 프롬프트

이미지 생성기(GPT 이미지 등)에 붙여넣어 쓰는 프롬프트 모음.
SVG로 충분한 단순 아이콘은 제외하고, 래스터가 필요한 것만 정리했다.

브랜드 기본 방향은 **SVG-first**다. 앱/README/오픈소스 표면은 `readme-banner.svg`처럼 벡터로 직접 그린 검정 배경, red/blue light ribbon, 태극 모티프, 선명한 타이포가 더 가볍고 깔끔하다. 이 문서는 PWA·OG·SNS·마케팅 썸네일처럼 래스터가 필요한 자산을 만들 때 사용한다.

## 공통 규칙

- **텍스트 직접 포함 OK**: 생성기 텍스트 렌더링이 정확해졌으므로 워드마크·슬로건을 프롬프트에 바로 넣는다. 아래 "브랜드 텍스트"의 철자를 그대로 쓴다.
- **안전 조건(모든 프롬프트 포함)**: no real or recognizable people, no politicians, no celebrities, anonymous silhouettes only, no violence, no weapons, no blood, no riot imagery. Peaceful, lawful, unifying.
- **단, 랜딩/앱 화면의 헤드라인은 실서비스에선 HTML 텍스트 권장**(반응형·SEO·다국어). 박은 버전은 광고/프리뷰/OG용.
- **해상도**: 2배로 뽑아 다운스케일. OG 정확히 1200x630, 앱 아이콘 1024 후 512/192 export.

## 브랜드 텍스트 (정확한 철자로 렌더링)

- 워드마크: `ClearKorea`
- 태그라인 EN: `Your voice, on the record.`
- 태그라인 KO: `목소리를 기록으로`
- 론칭 EN: `A square for transparency. Now open.`
- 론칭 KO: `투명한 선거, 지금 함께`
- CTA: `Enter`
- 폰트 느낌: clean modern geometric sans-serif, bold. 텍스트는 흰색, 액센트만 빨강/파랑.

## 스타일 프리픽스 (모든 프롬프트 앞에 붙이기)

```
Modern civic-tech brand visual. Dark cinematic theme, near-black background (#0A0A0A).
Palette strictly limited to white, Korean-flag red (#CD2E3A), and Korean-flag blue (#0047A0)
as accents only. Clean, premium, minimal, high contrast, hopeful yet resolute mood.
Subtle taegeuk (yin-yang swirl) motif inspiration. Any text must be rendered crisply and
correctly spelled, in a clean modern geometric sans-serif. No real or recognizable people,
no politicians, no celebrities; anonymous silhouettes only if any. Peaceful, lawful, unifying.
No violence, no weapons, no blood, no riot imagery.
```

---

## A. 브랜드 / 핵심 자산

### A1. 앱 아이콘 / PWA 아이콘 (1:1, 1024px) — 텍스트 없음
```
A single elegant emblem: an abstract taegeuk swirl made of two interlocking comma shapes,
one red, one blue, inside a thin white circular frame, centered on deep black.
Soft inner glow, glossy modern app-icon finish, generous safe margin so it stays legible at tiny sizes.
No text (mark only). Simple, scalable, iconic. Square 1:1.
```

Canonical vector source: `pwa-icon.svg`. Exports: `pwa-icon.png`(transparent), `pwa-icon.jpg`(dark background).

### A2. OG / 기본 공유 이미지 (1.91:1, 1200x630)
```
Hero share-card. Right side: an abstract taegeuk light swirl in red and blue over black with a
faint particle field like distant candlelight. Left side: the wordmark "ClearKorea" in bold white
geometric sans-serif, with the tagline "Your voice, on the record." in smaller light-gray beneath it.
Crisp text, premium, balanced. 1.91:1.
```

### A2-1. README 배너 (`readme-banner.svg`, 10:3)

GitHub README 상단 배너는 SVG로 관리한다. `og.png`, `hero.png`, `x-header.png`의 검정 배경, red/blue taegeuk light ribbon, 별빛/입자감, 굵은 흰 워드마크를 벡터로 압축한다. 텍스트는 오픈소스 감성을 드러내는 `Open-source civic transparency platform`, `AGPL-3.0`, `Public repo`, `Contributions open`을 사용한다. 이후 앱 헤더/섹션 비주얼도 이 SVG 문법을 우선 참고한다.

### A3. 기본 아바타 플레이스홀더 (1:1) — 텍스트 없음
```
Minimal neutral default avatar: a soft rounded head-and-shoulders silhouette in muted gray on a dark
circle, with a tiny red and blue accent dot. Friendly, non-gendered, no facial features. No text. 1:1.
```

### A4. 뉴스 카드 폴백 썸네일 (16:9) — 텍스트 없음
```
Generic 'world press' placeholder: abstract monochrome newsprint-and-globe texture on black, with one
thin red line and one thin blue line as the only accents. Understated, neutral. No text. 16:9.
```

---

## B. 랜딩 페이지 (헤드라인은 실서비스에선 HTML 권장)

### B1. 히어로 (16:9, 2400x1350)
```
Wide atmospheric hero: a vast field of glowing white light points spreading toward a low horizon over
near-black, with two sweeping ribbons of red and blue light forming a subtle taegeuk curve in the upper area.
Overlaid crisp text: a large bold white headline "Your voice, on the record." at center-left, the wordmark
"ClearKorea" small in the top-left corner, and a pill-shaped button reading "Enter" in white with a thin
red-and-blue border below the headline. Cinematic, ultra-clean. 16:9.
```

### B2. 히어로 모바일 세로 (9:16)
```
Vertical hero: glowing light points rising from the bottom into black, a soft red-and-blue taegeuk light
ribbon across the upper third. Crisp text: wordmark "ClearKorea" near the top, big bold white headline
"Your voice, on the record." in the middle, and a pill button "Enter" in the lower third. 9:16.
```

### B3. 섹션 배경 텍스처 (1:1, 타일링) — 텍스트 없음
```
Seamless very subtle dark texture: faint diagonal film grain on near-black with a barely visible
red-to-blue gradient sheen. Almost invisible, low contrast, for layering behind content. No text. Tileable. Square.
```

---

## C. 앱 화면

### C1. 빈 상태 일러스트 (Square, 1:1)
```
Calm empty-state on black: a single small glowing speech bubble merging with a soundwave, white with
red and blue accents, lots of quiet dark space, and a short caption below in light-gray sans-serif reading
"Be the first to speak up." Minimal line art. 1:1.
```

### C2. 스플래시 / 온보딩 (9:16)
```
Splash art: a centered abstract taegeuk light swirl gently glowing with soft floating particles on deep black.
Below it, the wordmark "ClearKorea" in bold white and the tagline "Your voice, on the record." in smaller gray.
Premium, restful. 9:16.
```

---

## D. SNS 홍보 (X / Threads / 인스타 / 에펨코리아)

### D1. X 헤더 배너 (3:1, 1500x500)
```
Panoramic banner: a red-and-blue taegeuk light ribbon sweeping across near-black over a faint sea of light
points. The left third stays dark/empty for a profile picture overlay. On the center-right, the wordmark
"ClearKorea" in bold white with the tagline "Your voice, on the record." beneath in gray. Crisp text. 3:1.
```

### D2. 론칭 발표 키비주얼 (16:9, 1600x900)
```
Bold launch key visual: a strong central abstract taegeuk swirl in red and blue emerging from black,
radiating thin light lines outward like a broadcast signal. Across the lower band, crisp text: the wordmark
"ClearKorea" in bold white, the line "A square for transparency. Now open." beneath it, and a small "Enter"
button accent with a red-and-blue border. Energetic but dignified. 16:9.
```

### D3. 인스타 정사각 (1:1, 1080)
```
Square key visual: the red-and-blue taegeuk swirl glowing at center on black with a subtle radiating burst.
Wordmark "ClearKorea" in bold white near the top, tagline "Your voice, on the record." near the bottom.
Punchy, clean, crisp text. 1:1.
```

### D4. 인스타 스토리 / 세로 (9:16, 1080x1920)
```
Vertical story key visual: taegeuk light swirl centered over black with rising light particles. Crisp text:
wordmark "ClearKorea" in the top third, a big bold white headline "Your voice, on the record." in the middle,
and a pill button "Enter" near the bottom third. 9:16.
```

### D5. 에펨코리아 / 커뮤니티 썸네일 (4:3) — 한국어 카피
```
High-impact community post key visual: a bold abstract taegeuk emblem glowing on black with dramatic red and
blue rim light and a strong central focal point that grabs attention as a feed thumbnail. Crisp Korean text
at the top: a bold white headline "목소리를 기록으로", with the wordmark "ClearKorea" smaller beneath it.
Modern, uncluttered, instantly readable. 4:3.
```

---

## 팁

- A1(앱 아이콘)과 B1(히어로)을 기준 이미지로 삼고, 나머지는 "in the same style as [이미지]"로 참조해 톤을 통일한다.
- 한글이 들어가는 D5는 철자가 깨지면 다시 생성하거나, 정 안 되면 그 자산만 디자인 툴에서 텍스트를 올린다.
