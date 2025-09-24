// Vercel API Route for n8n webhook
// 파일: /api/analysis.js

let latestAnalysisResult = null;

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const analysisData = req.body;
      
      // 최신 분석 결과 저장
      latestAnalysisResult = {
        ...analysisData,
        receivedAt: new Date().toISOString()
      };
      
      console.log('✅ n8n 분석 결과 수신:', {
        matchInfo: analysisData.matchInfo,
        timestamp: analysisData.analysis?.timestamp,
        winPrediction: analysisData.analysis?.winPrediction
      });
      
      return res.status(200).json({
        success: true,
        message: '분석 결과가 성공적으로 저장되었습니다.',
        data: latestAnalysisResult
      });
      
    } catch (error) {
      console.error('❌ 분석 결과 처리 중 오류:', error);
      return res.status(500).json({
        success: false,
        message: '분석 결과 처리 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  }
  
  if (req.method === 'GET') {
    // 최신 분석 결과 조회
    return res.status(200).json({
      success: true,
      data: latestAnalysisResult || null,
      message: latestAnalysisResult ? '분석 결과를 조회했습니다.' : '저장된 분석 결과가 없습니다.'
    });
  }
  
  // 지원하지 않는 메서드
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}