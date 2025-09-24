# 🎮 Tomiya - LoL 밴픽 분석 시스템

리그 오브 레전드 프로 경기의 밴픽 단계를 시뮬레이션하고 AI를 활용해 전략을 분석하는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🏆 밴픽 시뮬레이션
- **클래식 BO5**: 전통적인 5게임 매치 시뮬레이션
- **피어리스 드래프트**: 이전 게임에서 사용한 챔피언 재사용 금지 모드
- **실시간 밴픽 인터페이스**: 드래그 앤 드롭으로 직관적인 밴픽 진행
- **170+ 챔피언 데이터**: 최신 챔피언 정보와 이미지

### 🤖 AI 분석 시스템
- **빠른 AI 분석**: OpenAI GPT-4를 활용한 즉석 밴픽 분석
- **n8n 워크플로우 분석**: 복잡한 분석 파이프라인을 통한 심층 분석
- **전략적 인사이트**: 밴 전략, 팀 구성, 승률 예측 등 종합 분석
- **맞춤형 프롬프트**: 메타 분석, 심리전 분석, 코치 관점 분석 등

### 🏟️ 프로팀 데이터
- **2025년 최신 로스터**: LCK, LPL 주요 팀들의 최신 선수 정보
- **실제 팀 매치업**: Gen.G, T1, HLE 등 실제 프로팀으로 시뮬레이션
- **선수별 포지션 정보**: 각 선수의 역할과 특성 반영

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- n8n (워크플로우 분석용, 선택사항)
- OpenAI API 키 (AI 분석용, 선택사항)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/tomiya.git
cd tomiya

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 API 키들을 설정하세요

# 개발 서버 시작
npm run dev
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
# OpenAI API 키 (빠른 AI 분석용)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# n8n 웹훅 URL (워크플로우 분석용)
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/banpick-analysis

# 추가 설정
VITE_LOL_PATCH_VERSION=14.19.1
VITE_DEBUG_MODE=false
```

## 🔧 n8n 워크플로우 설정

### 1. n8n 설치 및 실행

```bash
# Docker로 n8n 실행 (추천)
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

# 또는 npm으로 설치
npm install n8n -g
n8n start
```

### 2. 워크플로우 임포트

1. `http://localhost:5678`에서 n8n 웹 인터페이스 접속
2. **Import from File**을 클릭
3. `n8n-workflows/lol-banpick-analysis.json` 파일 업로드
4. OpenAI API 키를 Credentials에 설정
5. 워크플로우 활성화

### 3. 워크플로우 테스트

```bash
# 테스트 스크립트 실행
cd n8n-workflows
node test-n8n-workflow.js
```

## 📊 사용 방법

### 기본 밴픽 시뮬레이션

1. **팀 선택**: 드롭다운에서 원하는 프로팀 선택
2. **모드 선택**: 클래식 또는 피어리스 드래프트 모드
3. **밴픽 진행**: 각 단계별로 챔피언 선택/밴
4. **분석 실행**: 밴픽 완료 후 AI 분석 버튼 클릭

### AI 분석 활용

#### 빠른 AI 분석
- OpenAI API를 직접 호출하여 즉석 분석
- 밴 전략, 팀 구성, 승률 예측 제공
- 약 10-30초 내 결과 확인

#### n8n 워크플로우 분석  
- 복잡한 분석 파이프라인을 통한 심층 분석
- 구조화된 데이터와 상세한 인사이트
- Slack 알림 등 추가 기능 연동 가능

## 🎯 AI 분석 프롬프트 가이드

### 메인 분석 프롬프트
```
1. 🎯 밴 전략 심층 분석
2. ⚔️ 팀 구성 전술 분석  
3. 🥊 라인별 매치업 상세 분석
4. 📊 게임 시나리오 예측
5. 🎲 승률 예측 및 분석
6. 💡 최적화 제안
```

### 특화 분석 옵션
- **메타 분석**: 현재 패치 메타 부합도 평가
- **심리전 분석**: 팀간 심리전과 블러핑 전략
- **코치 관점**: 프로팀 코치 시각에서의 밴픽 평가

## 🛠️ 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성과 개발 경험 향상
- **Vite**: 빠른 개발 서버와 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Zustand**: 상태 관리

### Backend & API
- **Riot Games API**: 챔피언 데이터 및 이미지
- **OpenAI API**: GPT-4 기반 AI 분석
- **n8n**: 워크플로우 자동화 및 복잡한 분석 파이프라인

### Development Tools  
- **ESLint**: 코드 품질 관리
- **PostCSS**: CSS 후처리
- **Git**: 버전 관리

## 📁 프로젝트 구조

```
tomiya/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── BanPickInterface.tsx
│   │   ├── ChampionSearch.tsx
│   │   └── ...
│   ├── data/               # 정적 데이터
│   │   ├── champions.ts    # 170+ 챔피언 데이터
│   │   ├── teams.ts        # 프로팀 정보
│   │   └── players.ts      # 선수 로스터
│   ├── api/                # API 서비스
│   │   ├── analysisService.ts
│   │   └── rosterService.ts
│   ├── stores/             # 상태 관리
│   │   └── appStore.ts
│   └── types/              # TypeScript 타입 정의
│       └── index.ts
├── n8n-workflows/          # n8n 워크플로우
│   ├── lol-banpick-analysis.json
│   ├── ai-prompts.md
│   ├── setup-guide.md
│   └── test-n8n-workflow.js
├── public/                 # 정적 파일
└── docs/                   # 문서
```

## 🔮 향후 계획

### v2.0 기능
- [ ] 실시간 경기 분석 연동
- [ ] 더 많은 리그 지원 (LEC, LCS 등)
- [ ] 과거 경기 데이터 학습 기능
- [ ] 분석 결과 시각화 대시보드

### v3.0 기능  
- [ ] 멀티플레이어 밴픽 시뮬레이션
- [ ] 커스텀 토너먼트 모드
- [ ] API 서버 구축
- [ ] 모바일 앱 버전

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **프로젝트 링크**: [https://github.com/your-username/tomiya](https://github.com/your-username/tomiya)
- **이슈 제보**: [GitHub Issues](https://github.com/your-username/tomiya/issues)

---

**⚡ Tomiya**로 리그 오브 레전드 밴픽 전략을 마스터하세요! 🎮
  # League of Legends Ban Pick Analysis Tool

🎮 **실시간 LOL 밴픽 분석 도구**

## 🌟 주요 기능
- 실시간 밴픽 시뮬레이션
- AI 기반 팀 구성 분석
- 프로 경기 메타 데이터 반영
- 2025 시즌 최신 정보 업데이트

## 🚀 사용 방법
1. 블루팀/레드팀 선택
2. 밴픽 진행
3. 구도 분석 시작 버튼 클릭
4. AI 분석 결과 확인

## 🔧 기술 스택
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (상태 관리)
- n8n Workflow (AI 분석)

## 📱 라이브 데모
GitHub Pages에서 자동 배포됩니다.

## 📄 라이선스
MIT License
])
```
