// 현재 접속 중인 방문자 수를 추적하는 API
let activeVisitors = new Map(); // sessionId -> { timestamp, lastSeen }
const VISITOR_TIMEOUT = 30000; // 30초 후 비활성화

// 비활성 방문자 정리
function cleanupInactiveVisitors() {
  const now = Date.now();
  for (const [sessionId, visitor] of activeVisitors.entries()) {
    if (now - visitor.lastSeen > VISITOR_TIMEOUT) {
      activeVisitors.delete(sessionId);
    }
  }
}

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 비활성 방문자 정리
  cleanupInactiveVisitors();

  if (req.method === 'POST') {
    const { sessionId, action } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    if (action === 'heartbeat') {
      // 방문자 하트비트 업데이트
      activeVisitors.set(sessionId, {
        timestamp: activeVisitors.get(sessionId)?.timestamp || Date.now(),
        lastSeen: Date.now()
      });
    } else if (action === 'leave') {
      // 방문자 제거
      activeVisitors.delete(sessionId);
    }
  }

  // 현재 활성 방문자 수 반환
  const visitorCount = activeVisitors.size;
  
  res.status(200).json({
    visitorCount,
    timestamp: Date.now()
  });
}