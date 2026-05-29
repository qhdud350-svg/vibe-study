# AI 브랜드 전략 파트너

브랜딩 디자이너가 기획자 없이 브랜드 전략 문서를 빠르게 작성할 수 있도록 도와주는 AI 웹 앱입니다.

클라이언트 정보를 입력하면 AI가 브랜드 포지셔닝부터 슬로건, 케이스 스터디까지 자동으로 생성하고, PPT로 바로 다운로드할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 정보 입력 폼 | 브랜드명, 업종, 타겟, 경쟁사, 레퍼런스 이미지 등 입력 |
| AI 전략 생성 | Groq (llama-3.3-70b) 기반으로 7개 섹션 자동 생성 |
| 결과 탭 보기 | 브랜드 포지셔닝 / 페르소나 / 퍼스낼리티 / 스토리 / 슬로건 / 디자인 방향 / Case Study |
| PPT 다운로드 | .pptx 파일로 즉시 내보내기 |

---

## 결과 화면 구성

생성 결과는 PT 슬라이드 스타일로 표시됩니다.

- **Brand Positioning** — 핵심 차별점 · 경쟁사 비교
- **Target Persona** — 라이프스타일 · 니즈 · 페인포인트
- **Brand Personality** — 브랜드 키워드 · 톤앤매너 · DO / DON'T
- **Brand Story** — 브랜드 존재 이유 · 내러티브 · 핵심 메시지
- **Brand Slogan** — 슬로건 후보 5개 + 방향성 설명
- **Brand Color & Design** — 컬러 팔레트 · 폰트 · 이미지 스타일
- **Insights & Discovery** — 국내외 유사 브랜드 케이스 스터디

---

## 로컬 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/qhdud350-svg/vibe-study.git
cd vibe-study
```

### 2. API 키 설정

[Groq Console](https://console.groq.com)에서 API 키를 발급받은 후, 프로젝트 루트에 `.env` 파일을 만들어 주세요.

```
GROQ_API_KEY=여기에_키_입력
```

### 3. 서버 실행

```bash
node server.js
```

브라우저에서 `http://localhost:3000` 접속

---

## 기술 스택

- **Frontend** — HTML / CSS / Vanilla JS
- **AI** — Groq API (llama-3.3-70b-versatile)
- **PPT 생성** — PptxGenJS
- **배포** — Vercel

---

## 파일 구조

```
vibe-study/
├── index.html       # 메인 앱
├── app.js           # 렌더러 및 API 호출 로직
├── style.css        # 스타일
├── server.js        # 로컬 개발 서버
├── preview.html     # 샘플 데이터 데모
└── api/
    └── generate.js  # Groq API 핸들러 (Vercel 서버리스)
```
