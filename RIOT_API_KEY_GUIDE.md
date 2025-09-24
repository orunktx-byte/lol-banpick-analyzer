# 🔑 Riot API 키 설정 가이드

## 1️⃣ API 키 발급 받기

### Personal API Key (24시간 유효)
```bash
1. https://developer.riotgames.com 접속
2. Riot 계정으로 로그인
3. "Get your Development API Key" 클릭
4. "REGENERATE API KEY" 버튼 클릭
5. API 키 복사 (RGAPI-로 시작)
```

### Production API Key (승인 필요)
```bash
1. "Register Product" 클릭
2. 프로젝트 정보 입력
3. API 사용 계획 설명
4. Riot 검토 후 승인 (수일~수주)
```

## 2️⃣ 프로젝트에 API 키 설정

### .env 파일 수정
```env
# 발급받은 API 키로 교체
VITE_RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 서버 재시작
```bash
# 터미널에서 실행
npm run dev
```

## 3️⃣ 연결 테스트

### 브라우저 콘솔에서 테스트
```javascript
// F12 > Console 탭에서 실행
const apiKey = 'RGAPI-your-actual-key-here';

// 1. Riot API 연결 테스트
fetch(`https://kr.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => console.log('✅ Riot API 연결 성공:', data))
  .catch(err => console.error('❌ Riot API 연결 실패:', err));

// 2. Esports API 테스트 (다른 엔드포인트)
fetch('https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=ko-KR', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log('✅ Esports API 연결 성공:', data))
.catch(err => console.error('❌ Esports API 연결 실패:', err));
```

## 4️⃣ 문제 해결

### "401 Unauthorized" 오류
```bash
❌ API 키가 잘못되었거나 만료됨
✅ 새로운 API 키 재발급
```

### "403 Forbidden" 오류  
```bash
❌ API 키 권한 없음
✅ Production API 키 신청 필요
```

### "429 Rate Limited" 오류
```bash
❌ 요청 제한 초과 (분당 100회)
✅ 잠시 대기 후 재시도
```

### CORS 오류
```bash
❌ 브라우저 보안 정책
✅ 백엔드 프록시 서버 필요
```

## 5️⃣ API 키 보안

### 환경변수 사용
```env
# ✅ 올바른 방법
VITE_RIOT_API_KEY=your_key_here

# ❌ 잘못된 방법 - 코드에 직접 입력
const apiKey = "RGAPI-xxxxx";
```

### .gitignore 설정
```gitignore
# API 키 파일 제외
.env
.env.local
.env.production
```

## 6️⃣ 프로덕션 배포 시

### 백엔드 프록시 필요
```javascript
// 프론트엔드에서 직접 호출 시 CORS 오류
// 백엔드 서버를 통해 API 호출 권장
```

### 서버리스 함수 사용
```javascript
// Vercel Functions, Netlify Functions 등
// API 키를 서버 환경에서 안전하게 관리
```

## 🚨 중요 주의사항

1. **API 키 공개 금지**: GitHub, 블로그 등에 업로드 금지
2. **24시간 만료**: Personal API Key는 매일 갱신 필요
3. **레이트 리미트**: 분당 100회 제한 준수
4. **CORS 정책**: 브라우저에서 직접 호출 시 제한

## 📞 추가 도움

- **Riot Developer Docs**: https://developer.riotgames.com/docs
- **API 상태 확인**: https://developer.riotgames.com/api-status
- **커뮤니티**: https://riot-api-libraries.readthedocs.io