// Vercel API Route with fallback mock responses
// 파일: /api/mock-analysis.js

export default async function handler(req, res) {
  // 완전한 CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS preflight 요청 처리 - mock-analysis');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const analysisData = req.body;
      
      console.log('🎭 모의 분석 API 호출');
      console.log('📊 분석 요청 데이터:', {
        team1: analysisData.team1,
        team2: analysisData.team2,
        timestamp: new Date().toISOString()
      });

      // n8n 워크플로우를 먼저 시도
      try {
        const n8nWebhookUrl = 'https://orunktx.app.n8n.cloud/webhook/analysis';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LOL-BanPick-Analyzer/1.0'
          },
          body: JSON.stringify(analysisData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (n8nResponse.ok) {
          const result = await n8nResponse.json();
          console.log('✅ n8n 워크플로우 성공');
          return res.status(200).json(result);
        } else {
          throw new Error(`n8n failed: ${n8nResponse.status}`);
        }
        
      } catch (n8nError) {
        console.log('⚠️ n8n 워크플로우 실패, 모의 응답 사용:', n8nError.message);
        
        // n8n 실패 시 모의 응답 반환
        const mockResponse = {
          success: true,
          message: "모의 베팅 분석 결과입니다 (n8n 연결 실패 시 대체 응답)",
          data: {
            team1: analysisData.team1 || 'Blue Team',
            team2: analysisData.team2 || 'Red Team',
            analysis: `
## 🎯 구도 분석 결과 (모의 데이터)

### 📊 팀 분석
**${analysisData.team1 || 'Blue Team'} vs ${analysisData.team2 || 'Red Team'}**

### 🔍 밴픽 분석
- **초반 게임 주도권**: ${Math.random() > 0.5 ? analysisData.team1 || 'Blue Team' : analysisData.team2 || 'Red Team'}
- **후반 캐리 잠재력**: ${Math.random() > 0.5 ? analysisData.team1 || 'Blue Team' : analysisData.team2 || 'Red Team'}
- **팀파이트 강도**: ${Math.random() > 0.5 ? '높음' : '보통'}

### 💡 베팅 추천
- **킬수 핸디캡**: ${analysisData.killHandicap || '+0'} ${Math.random() > 0.5 ? '커버 예상' : '실패 예상'}
- **총 킬수**: ${analysisData.totalKillsOverUnder || '30.5'} ${Math.random() > 0.5 ? 'OVER' : 'UNDER'} 추천
- **경기시간**: ${analysisData.gameTimeOverUnder || '30'}분 ${Math.random() > 0.5 ? '초과' : '미만'} 예상

### ⚠️ 참고사항
이는 n8n 워크플로우 연결 실패 시 제공되는 모의 데이터입니다. 
실제 분석을 위해서는 n8n 서버 상태를 확인해주세요.

**n8n 상태**: 연결 실패 (${new Date().toISOString()})
**대체 모드**: 활성화
            `,
            confidence: Math.round(Math.random() * 10 + 85), // 85-95%
            timestamp: new Date().toISOString(),
            isMockData: true
          }
        };
        
        return res.status(200).json(mockResponse);
      }
      
    } catch (error) {
      console.error('❌ 모의 분석 API 오류:', error);
      
      return res.status(500).json({
        success: false,
        message: '베팅 분석 요청에 실패했습니다.',
        error: error.message,
        timestamp: new Date().toISOString(),
        isMockData: true
      });
    }
  }
  
  // GET 요청 처리 (상태 확인용)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: '모의 베팅 분석 API가 준비되었습니다.',
      endpoint: '/api/mock-analysis',
      features: [
        'n8n 워크플로우 우선 시도',
        'n8n 실패 시 모의 응답 제공',
        '완전한 CORS 지원'
      ],
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({
    success: false,
    message: 'Method not allowed. Use POST for analysis.'
  });
}