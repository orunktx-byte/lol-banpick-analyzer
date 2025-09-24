// API 연결 테스트 스크립트
const apiKey = 'RGAPI-078f0599-b255-4393-a54e-599c3d4a28e1';

console.log('🔍 Riot API 연결 테스트 시작...');

// 1. 기본 API 상태 확인
fetch(`https://kr.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`)
  .then(res => {
    console.log('📡 응답 상태:', res.status);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  })
  .then(data => {
    console.log('✅ Riot API 연결 성공!');
    console.log('서버 이름:', data.name);
    console.log('서버 상태:', data.maintenances.length > 0 ? '점검중' : '정상');
    return testEsportsAPI();
  })
  .catch(err => {
    console.error('❌ Riot API 연결 실패:', err.message);
    
    if (err.message.includes('403')) {
      console.error('🚫 API 키 권한 오류 - Production API 키가 필요할 수 있습니다.');
    } else if (err.message.includes('401')) {
      console.error('🔑 API 키 인증 실패 - 키가 만료되었거나 잘못되었습니다.');
    } else if (err.message.includes('429')) {
      console.error('⏰ 요청 제한 초과 - 잠시 후 다시 시도하세요.');
    }
    
    return testFallback();
  });

// 2. Esports API 테스트
function testEsportsAPI() {
  console.log('🎮 Esports API 테스트 중...');
  
  return fetch('https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=ko-KR', {
    headers: { 'x-api-key': apiKey }
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Esports API HTTP ${res.status}`);
    }
  })
  .then(data => {
    console.log('✅ Esports API 연결 성공!');
    console.log('경기 일정 수:', data.data?.schedule?.events?.length || 0);
    console.log('🎯 모든 API 연결 완료!');
  })
  .catch(err => {
    console.warn('⚠️ Esports API 연결 실패, 기본 API는 작동:', err.message);
  });
}

// 3. 폴백 테스트
function testFallback() {
  console.log('🔄 폴백 모드 테스트...');
  console.log('💡 해결 방법:');
  console.log('1. https://developer.riotgames.com 에서 새 API 키 발급');
  console.log('2. Personal API Key는 24시간마다 갱신 필요');
  console.log('3. Production API Key 신청 고려');
}

console.log('📋 이 스크립트를 브라우저 콘솔(F12)에서 실행하세요!');