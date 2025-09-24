# 🎮 LoL 밴픽 종합 분석 시스템

## 📁 프로젝트 구조

```
tomiya/
├── 📂 n8n-workflows/                 # 워크플로우 및 배포 스크립트
│   ├── 🤖 comprehensive-banpick-analysis.json    # 메인 분석 워크플로우
│   ├── 🤖 betting-banpick-analysis.json          # 베팅 중심 분석 워크플로우 
│   ├── 🤖 fearless-draft-analysis.json           # 피어리스 드래프트 분석
│   ├── 📊 test-comprehensive-workflow.js         # 테스트 스크립트
│   ├── 🔍 check-status.js                        # 시스템 상태 체크
│   ├── 🚀 deploy.bat                             # Windows 자동 배포
│   ├── 🚀 deploy.sh                              # Linux/Mac 자동 배포
│   ├── 📖 deployment-guide.md                    # 상세 배포 가이드
│   └── 📖 comprehensive-analysis-guide.md        # 분석 시스템 가이드
├── 📂 src/components/
│   ├── 🎯 BanPickInterface.tsx                   # 메인 밴픽 인터페이스
│   ├── 🔍 ChampionSearch.tsx                     # 챔피언 검색
│   ├── ⚔️  FearlessSetSelector.tsx               # 피어리스 세트 선택기
│   └── ... (기타 컴포넌트)
├── 📂 src/data/
│   ├── 🏆 champions.ts                           # 챔피언 데이터
│   ├── 👥 teams.ts                               # 팀 정보
│   └── 🎮 players.ts                             # 선수 정보
└── 📦 package.json                               # 프로젝트 설정
```

## 🚀 빠른 시작 (Windows)

### 1. 자동 배포 실행
```powershell
# 프로젝트 폴더에서
.\n8n-workflows\deploy.bat
```

### 2. 수동 설정 (선택사항)
```powershell
# Docker로 n8n 실행
docker run -d --name lol-analysis-n8n -p 5678:5678 n8nio/n8n

# React 앱 실행
npm install
npm run dev
```

### 3. 시스템 상태 확인
```powershell
npm run check-system
```

## 🔧 주요 기능

### 🎯 밴픽 분석 시스템
- **종합 전략 분석**: 팀 로스터, 코칭 스타일, 메타 고려
- **베팅 중심 분석**: 승률 예측, 베팅 추천, 리스크 평가
- **피어리스 드래프트**: 이전 세트 기록 반영, 밴 풀 제한 고려

### 🤖 AI 분석 워크플로우
- **OpenAI GPT-4 연동**: 고도화된 전략 분석
- **실시간 웹훅**: n8n을 통한 자동화된 분석 파이프라인
- **컨텍스트 인지**: 팀별 특성, 선수 스타일, 메타 트렌드 반영

### 🎮 사용자 인터페이스
- **직관적 밴픽**: 드래그 앤 드롭 방식의 챔피언 선택
- **시각적 기록**: 챔피언 초상화로 히스토리 표시
- **실시간 분석**: 원클릭 분석 시작 및 결과 표시

## 📊 워크플로우 상세

### 🔗 comprehensive-banpick-analysis.json
**완전한 전략 분석 시스템**
- 팀 로스터 및 코치 분석
- 선수별 특기 챔피언 및 플레이 스타일
- 피어리스 룰 적용 시 이전 세트 영향 분석
- 메타 변화 및 패치 노트 반영
- 승부 예측 및 핵심 포인트 제시

### 🎰 betting-banpick-analysis.json  
**베팅 특화 분석**
- 승률 계산 및 확률 모델링
- 베팅 추천 및 리스크 레벨
- 가치 베팅 기회 식별
- 배당률 분석 및 기댓값 계산

### ⚔️ fearless-draft-analysis.json
**피어리스 드래프트 전용**
- 이전 세트 밴픽 히스토리 분석
- 남은 챔피언 풀 계산
- 우선순위 변화 예측
- 세트별 전략 진화 추적

## 🛠️ 설정 및 커스터마이징

### OpenAI API 설정
1. n8n 웹 인터페이스 접속 (http://localhost:5678)
2. Settings → Credentials → Add Credential
3. OpenAI 선택 후 API 키 입력
4. 워크플로우에서 해당 크리덴셜 선택

### 팀 데이터 업데이트
```typescript
// src/data/teams.ts 수정
export const teams: Team[] = [
  {
    id: 'YOUR_TEAM',
    name: '팀명',
    logo: '/logos/team.png',
    region: 'LCK',
    // 로스터 정보 추가
  }
];
```

### 워크플로우 URL 설정
```typescript
// BanPickInterface.tsx에서
const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(
  'http://localhost:5678/webhook/comprehensive-banpick-analysis'
);
```

## 🧪 테스트 및 검증

### 자동 테스트 실행
```powershell
# 전체 워크플로우 테스트
npm run test-workflow

# 특정 시나리오 테스트
node n8n-workflows/test-comprehensive-workflow.js single 0

# 시스템 상태 확인
npm run check-system
```

### 수동 테스트
1. **UI 테스트**: http://localhost:5173에서 밴픽 진행
2. **API 테스트**: Postman으로 웹훅 직접 호출
3. **워크플로우 테스트**: n8n에서 테스트 실행

## 📈 성능 최적화

### 응답 시간 개선
- **모델 변경**: GPT-4 → GPT-3.5-turbo (빠른 응답)
- **토큰 최적화**: 프롬프트 길이 조정
- **캐싱 구현**: 동일 밴픽 결과 저장

### 비용 관리
- **토큰 모니터링**: OpenAI 대시보드 확인
- **배치 처리**: 여러 분석 동시 요청
- **프롬프트 효율화**: 불필요한 내용 제거

## 🔄 업데이트 가이드

### 정기 업데이트 항목
1. **로스터 데이터**: 이적 시즌마다 선수 정보 갱신
2. **메타 정보**: 패치마다 강캐/너프 반영  
3. **팀 스타일**: 시즌별 전략 변화 추적
4. **워크플로우**: 새로운 분석 기법 추가

### 버전 관리
- **워크플로우 백업**: 변경 전 JSON 파일 백업
- **데이터 마이그레이션**: 구조 변경 시 스크립트 작성
- **테스트 검증**: 업데이트 후 전체 시나리오 테스트

## 🚨 문제 해결

### 일반적인 문제
1. **n8n 접속 불가**: Docker 컨테이너 상태 확인
2. **OpenAI API 오류**: 크레딧 및 키 유효성 확인
3. **워크플로우 실행 실패**: 활성화 상태 및 웹훅 URL 확인
4. **React 앱 오류**: 개발 서버 재시작

### 로그 확인
```powershell
# n8n 로그
docker logs lol-analysis-n8n

# React 앱 로그
# 터미널에서 실시간 확인

# 브라우저 콘솔
# F12 → Console 탭
```

## 📞 지원 및 문의

### 파일별 역할
- **deployment-guide.md**: 상세한 설치 및 설정 가이드
- **comprehensive-analysis-guide.md**: 분석 시스템 구조 및 사용법
- **test-comprehensive-workflow.js**: 자동화된 테스트 케이스
- **check-status.js**: 실시간 시스템 상태 모니터링

### 커스터마이징 지원
각 워크플로우 파일은 JSON 형태로 제공되어 n8n에서 직접 수정 가능합니다.
팀 데이터, 분석 프롬프트, API 엔드포인트 등을 필요에 따라 조정할 수 있습니다.

---

**🎉 성공적인 분석을 위해 준비가 완료되었습니다!**
**Happy Analyzing! 🎮✨**