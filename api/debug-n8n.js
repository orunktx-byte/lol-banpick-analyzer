// Vercel API Route for debugging n8n connection
// 파일: /api/debug-n8n.js

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('🔍 n8n 연결 디버그 테스트 시작');
      
      // 환경 정보
      const debugInfo = {
        timestamp: new Date().toISOString(),
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'unknown'
      };
      
      console.log('🌍 환경 정보:', debugInfo);
      
      // n8n 연결 테스트
      const n8nWebhookUrl = 'https://orunktx.app.n8n.cloud/webhook/analysis';
      
      console.log('🔗 n8n 연결 테스트 시작:', n8nWebhookUrl);
      
      // 단순 GET 요청으로 연결 테스트
      const testResponse = await fetch(n8nWebhookUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Vercel-Debug/1.0'
        }
      });
      
      console.log('📡 n8n 테스트 응답:', testResponse.status, testResponse.statusText);
      
      const testResult = {
        success: true,
        n8nTest: {
          url: n8nWebhookUrl,
          status: testResponse.status,
          statusText: testResponse.statusText,
          headers: Object.fromEntries(testResponse.headers.entries())
        },
        environment: debugInfo
      };
      
      return res.status(200).json(testResult);
      
    } catch (error) {
      console.error('❌ n8n 연결 테스트 실패:', error);
      
      return res.status(500).json({
        success: false,
        error: {
          message: error.message,
          name: error.name,
          code: error.code
        },
        environment: {
          timestamp: new Date().toISOString(),
          vercelRegion: process.env.VERCEL_REGION || 'unknown',
          nodeVersion: process.version
        }
      });
    }
  }
  
  if (req.method === 'POST') {
    try {
      console.log('🧪 POST 요청 테스트 시작');
      
      const testData = req.body || {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'vercel-debug'
      };
      
      console.log('📤 테스트 데이터:', testData);
      
      // n8n webhook에 POST 요청
      const n8nWebhookUrl = 'https://orunktx.app.n8n.cloud/webhook/analysis';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
      
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Debug/1.0'
        },
        body: JSON.stringify(testData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 n8n POST 응답:', n8nResponse.status, n8nResponse.statusText);
      
      const responseText = await n8nResponse.text();
      console.log('📡 n8n 응답 내용:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawResponse: responseText };
      }
      
      return res.status(200).json({
        success: true,
        postTest: {
          status: n8nResponse.status,
          statusText: n8nResponse.statusText,
          headers: Object.fromEntries(n8nResponse.headers.entries()),
          response: responseData
        },
        requestData: testData
      });
      
    } catch (error) {
      console.error('❌ POST 테스트 실패:', error);
      
      return res.status(500).json({
        success: false,
        error: {
          message: error.message,
          name: error.name,
          code: error.code
        }
      });
    }
  }
  
  return res.status(405).json({
    success: false,
    message: 'Method not allowed. Use GET for connection test or POST for webhook test.'
  });
}