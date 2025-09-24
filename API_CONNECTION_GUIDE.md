# 🔗 API 연결 가이드

## 📋 필수 API 키 발급

### 1. **Riot Games API 키**
```bash
# 1. https://developer.riotgames.com 접속
# 2. Riot 계정으로 로그인
# 3. "Personal API Key" 발급 (24시간 유효)
# 4. Production API Key 신청 (승인 필요)
```

### 2. **환경변수 설정**
```bash
# .env 파일에서 수정
VITE_RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## ⚡ API 연결 테스트

### **Leaguepedia 연결 테스트**
```javascript
// 브라우저 콘솔에서 테스트
fetch('https://lol.fandom.com/api.php?action=parse&page=Patch_14.17&format=json&origin=*')
  .then(res => res.json())
  .then(data => console.log('Leaguepedia 연결 성공:', data));
```

### **Riot Esports API 테스트**
```javascript
// API 키 필요
const apiKey = 'your_api_key_here';
fetch('https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=ko-KR', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log('Esports API 연결 성공:', data));
```

## 🚀 실제 적용 방법

### **Step 1: API 키 설정**
```env
# .env 파일
VITE_RIOT_API_KEY=실제_발급받은_키
```

### **Step 2: 서버 재시작**
```bash
npm run dev
```

### **Step 3: 콘솔 확인**
- ✅ "Leaguepedia 패치 정보 수집 완료"
- ✅ "Riot Esports API 경기 데이터 수집 완료" 
- ❌ "모의 데이터를 사용합니다" (API 키 없음)

## 📊 실제 데이터 vs 모의 데이터

### **모의 데이터 (현재)**
- 랜덤 킬수/승률 생성
- 기본 챔피언 정보만 사용
- 패치 정보 하드코딩

### **실제 API 연결 시**
- Leaguepedia에서 실시간 패치 분석
- Riot API에서 실제 경기 통계
- 선수별 상세 성향 분석
- 팀별 최신 전략 정보

## 🔧 고급 설정

### **API 레이트 리미트 설정**
```env
VITE_API_RATE_LIMIT=100  # 분당 요청 제한
VITE_API_TIMEOUT=5000    # 타임아웃 (ms)
```

### **CORS 우회 (개발용)**
```bash
# Chrome 확장프로그램 설치 또는
# 프록시 서버 사용
```

### **프로덕션 배포 시**
```bash
# 백엔드 프록시 서버 구성 필요
# API 키 보안 관리
# 레이트 리미트 대응
```

## ⚠️ 주의사항

1. **API 키 보안**: GitHub에 업로드 금지
2. **레이트 리미트**: Riot API는 분당 제한 있음
3. **CORS 정책**: 브라우저에서 직접 호출 시 제한
4. **개발 vs 프로덕션**: 키 타입이 다름

## 🆘 문제 해결

### **"API 키가 설정되지 않았습니다"**
- .env 파일 확인
- 서버 재시작
- 키 형식 확인

### **"CORS 오류"**
- 브라우저 확장프로그램 사용
- 백엔드 프록시 구성
- Vite 프록시 설정

### **"레이트 리미트 초과"**
- API 호출 간격 조정
- 캐싱 구현
- Production API 키 사용