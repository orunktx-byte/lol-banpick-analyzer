// 간단한 분석 결과 저장 및 전달을 위한 API 서버
// 파일: src/api/analysisServer.ts

let latestAnalysisResult: any = null;

// n8n에서 분석 결과를 받는 엔드포인트
export const handleAnalysisResult = (req: any, res: any) => {
  try {
    const analysisData = req.body;
    
    // 최신 분석 결과 저장
    latestAnalysisResult = {
      ...analysisData,
      receivedAt: new Date().toISOString()
    };
    
    console.log('✅ 분석 결과 수신:', {
      matchInfo: analysisData.matchInfo,
      timestamp: analysisData.analysis?.timestamp,
      winPrediction: analysisData.analysis?.winPrediction
    });
    
    res.status(200).json({
      success: true,
      message: '분석 결과가 성공적으로 저장되었습니다.',
      data: latestAnalysisResult
    });
    
    // 실시간으로 React 앱에 전달 (WebSocket 또는 Server-Sent Events 사용 가능)
    // 여기서는 간단히 저장만 함
    
  } catch (error) {
    console.error('❌ 분석 결과 처리 오류:', error);
    res.status(500).json({
      success: false,
      message: '분석 결과 처리 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// React 앱에서 최신 분석 결과를 가져오는 엔드포인트
export const getLatestAnalysis = () => {
  return latestAnalysisResult;
};

// 분석 상태 확인 엔드포인트
export const getAnalysisStatus = () => {
  return {
    hasResult: latestAnalysisResult !== null,
    lastUpdated: latestAnalysisResult?.receivedAt || null,
    resultCount: latestAnalysisResult ? 1 : 0
  };
};

// 결과 초기화
export const clearAnalysisResult = () => {
  latestAnalysisResult = null;
  return { success: true, message: '분석 결과가 초기화되었습니다.' };
};