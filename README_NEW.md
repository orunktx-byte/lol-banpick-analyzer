# 🏆 토미의 기록실 - League of Legends 구도 분석기

React + Vite + SWC로 구축된 전문적인 롤 e스포츠 밴픽 및 구도 분석 애플리케이션입니다.

## ✨ 주요 기능

### 🎯 팀 선택 시스템
- **다중 리그 지원**: LCK, LPL, LEC 모든 팀 포함
- **실시간 선수 정보**: 각 팀의 최신 로스터 반영
- **포지션별 자동 매칭**: TOP, JUNGLE, MID, ADC, SUPPORT

### 🎮 Fearless 밴픽 시스템
- **BO5 대회 규칙 준수**: 정확한 밴픽 순서
- **Fearless 룰 적용**: 한 번 픽한 챔피언은 시리즈에서 재사용 불가
- **실시간 밴픽 진행**: 블루팀부터 시작하는 정확한 순서

### 🔍 챔피언 검색
- **자동완성 기능**: 빠른 챔피언 검색
- **태그 기반 필터링**: 역할별 챔피언 분류
- **시각적 인터페이스**: 직관적인 챔피언 선택

### 🤖 AI 구도 분석
- **OpenAI GPT 연동**: 최신 AI 기술 활용
- **n8n 데이터 연동**: 외부 데이터 소스 통합
- **전문적 분석**: 팀 구성, 시너지, 승률 예측

### 📊 실시간 정보
- **라이브 패치 버전**: 현재 게임 패치 정보
- **대회 패치 버전**: 토너먼트 사용 패치 정보
- **자동 업데이트**: 10분마다 패치 정보 갱신

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

### 환경 변수 설정

`.env` 파일에 다음 변수들을 설정하세요:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url_here
VITE_ENV=development
```

## 🛠 기술 스택

- **React 18** + **TypeScript**: 타입 안전성과 최신 기능
- **Vite + SWC**: 빠른 빌드 및 개발 경험
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Zustand**: 가벼운 상태 관리
- **Axios**: HTTP 클라이언트
- **OpenAI API**: AI 기반 구도 분석

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
├── stores/             # Zustand 스토어
├── data/               # 정적 데이터 (팀, 선수, 챔피언)
├── api/                # API 서비스
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🎨 디자인 특징

- **League of Legends 테마**: 게임 분위기 반영
- **다크 모드**: 전문적인 e스포츠 도구
- **반응형 디자인**: 모든 디바이스 지원
- **블루/레드 팀 색상**: 시각적 구분

## 🔧 사용 방법

1. **팀 선택**: 블루팀과 레드팀의 리그 및 팀 선택
2. **밴픽 진행**: Fearless 룰에 따른 밴픽 진행
3. **구도 분석**: AI 기반 팀 구성 분석 및 승률 예측
4. **결과 확인**: 상세한 분석 결과 및 추천사항 확인

---

**토미의 기록실**로 League of Legends e스포츠의 새로운 분석 경험을 시작하세요! 🎮⚡