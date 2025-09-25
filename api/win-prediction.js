// Vercel API Route for ML win prediction
// 파일: /api/win-prediction.js

export default async function handler(req, res) {
  // 완전한 CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS preflight 요청 처리 - win-prediction');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const predictionData = req.body;
      
      console.log('🏆 ML 승률 예측 요청 시작');
      console.log('📊 예측 데이터:', {
        model: predictionData.model,
        predictionType: predictionData.predictionType,
        dataSize: JSON.stringify(predictionData.data).length + ' bytes'
      });
      
      // n8n 웹훅 URL로 직접 요청
      const n8nWebhookUrl = 'https://orunktx.app.n8n.cloud/webhook/win-prediction';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
      
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LOL-BanPick-Analyzer/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify(predictionData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📡 n8n 승률 예측 응답: ${n8nResponse.status} ${n8nResponse.statusText}`);
      
      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('❌ n8n 승률 예측 오류:', errorText);
        throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText} - ${errorText}`);
      }

      const contentType = n8nResponse.headers.get('content-type') || '';
      let result;
      
      if (contentType.includes('application/json')) {
        result = await n8nResponse.json();
      } else {
        const textResult = await n8nResponse.text();
        result = { message: textResult, rawResponse: true };
      }

      console.log('✅ n8n 승률 예측 성공');
      return res.status(200).json(result);
      
    } catch (error) {
      console.error('❌ 승률 예측 요청 실패:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = error.message;
      let errorDetails = {
        type: error.name,
        code: error.code || 'UNKNOWN'
      };
      
      if (error.name === 'AbortError') {
        errorMessage = 'n8n 승률 예측 응답 시간이 초과되었습니다 (30초).';
        errorDetails.code = 'TIMEOUT';
      }
      
      return res.status(500).json({
        success: false,
        message: '승률 예측 요청에 실패했습니다.',
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // GET 요청 처리 (상태 확인용)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'ML 승률 예측 API가 준비되었습니다.',
      endpoint: '/api/win-prediction',
      n8nWebhook: 'https://orunktx.app.n8n.cloud/webhook/win-prediction',
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({
    success: false,
    message: 'Method not allowed. Use POST for prediction.'
  });
}