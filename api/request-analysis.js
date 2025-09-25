// Vercel API Route for n8n workflow request
// 파일: /api/request-analysis.js

export default async function handler(req, res) {
  // 완전한 CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24시간

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS preflight 요청 처리');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const analysisData = req.body;
      
      console.log('🚀 Vercel에서 n8n 워크플로우 요청 시작');
      console.log('📊 분석 데이터:', {
        timestamp: new Date().toISOString(),
        team1: analysisData.team1 || 'Missing',
        team2: analysisData.team2 || 'Missing',
        patch: analysisData.patch || 'Missing',
        banPickData: analysisData.banPickData ? 'included' : 'missing',
        dataSize: JSON.stringify(analysisData).length + ' bytes'
      });
      
      // n8n 웹훅 URL로 직접 요청
      const n8nWebhookUrl = 'https://orunktx.app.n8n.cloud/webhook/analysis';
      
      // Vercel에서 timeout 지원을 위한 AbortController 사용
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
      
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LOL-BanPick-Analyzer/1.0',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(analysisData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log(`📡 n8n 응답 상태: ${n8nResponse.status} ${n8nResponse.statusText}`);
      console.log('📡 n8n 응답 헤더:', Object.fromEntries(n8nResponse.headers.entries()));

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('❌ n8n 오류 응답:', errorText);
        throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText} - ${errorText}`);
      }

      const contentType = n8nResponse.headers.get('content-type') || '';
      console.log(`📡 n8n 응답 Content-Type: ${contentType}`);

      let n8nResult;
      if (contentType.includes('application/json')) {
        n8nResult = await n8nResponse.json();
        console.log('✅ n8n JSON 워크플로우 응답 성공:', {
          type: typeof n8nResult,
          keys: typeof n8nResult === 'object' ? Object.keys(n8nResult) : 'N/A'
        });
      } else {
        const textResult = await n8nResponse.text();
        console.log('✅ n8n 텍스트 워크플로우 응답:', textResult);
        n8nResult = { message: textResult, rawResponse: true };
      }

      // 성공적인 n8n 응답을 클라이언트에 반환
      console.log('📤 클라이언트에 응답 전송 중...');
      return res.status(200).json(n8nResult);
      
    } catch (error) {
      console.error('❌ n8n 워크플로우 요청 실패:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      
      // 더 자세한 에러 정보 제공
      let errorMessage = error.message;
      let errorDetails = {
        type: error.name,
        code: error.code || 'UNKNOWN'
      };
      
      if (error.name === 'AbortError') {
        errorMessage = 'n8n 워크플로우 응답 시간이 초과되었습니다 (30초).';
        errorDetails.code = 'TIMEOUT';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'n8n 서버에 연결할 수 없습니다. DNS 해석 실패.';
        errorDetails.code = 'CONNECTION_FAILED';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'n8n 서버가 연결을 거부했습니다.';
        errorDetails.code = 'CONNECTION_REFUSED';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'n8n 서버와의 네트워크 연결에 실패했습니다.';
        errorDetails.code = 'NETWORK_ERROR';
      }
      
      return res.status(500).json({
        success: false,
        message: 'n8n 워크플로우 요청에 실패했습니다.',
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        debug: {
          originalError: error.message,
          errorType: error.name,
          n8nUrl: 'https://orunktx.app.n8n.cloud/webhook/analysis'
        }
      });
    }
  }
  
  // GET 요청 처리 (상태 확인용)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'n8n 워크플로우 요청 API가 준비되었습니다.',
      endpoint: '/api/request-analysis',
      n8nWebhook: 'https://orunktx.app.n8n.cloud/webhook/analysis',
      timestamp: new Date().toISOString()
    });
  }
  
  // 지원하지 않는 메서드
  return res.status(405).json({
    success: false,
    message: 'Method not allowed. Use POST to request analysis.'
  });
}