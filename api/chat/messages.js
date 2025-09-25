// 간단한 메모리 저장소 (실제 운영에서는 데이터베이스 사용 권장)
let messages = [];
let connectedUsers = new Set();
const MAX_MESSAGES = 100; // 최대 메시지 수

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // 클라이언트 IP를 활성 사용자로 추가 (간단한 구현)
      const clientIP = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress || 
                       '익명';
      
      connectedUsers.add(clientIP);
      
      // 5분 후 사용자를 자동으로 제거 (간단한 TTL)
      setTimeout(() => {
        connectedUsers.delete(clientIP);
      }, 5 * 60 * 1000);

      res.status(200).json({
        success: true,
        messages: messages.slice(-50), // 최근 50개 메시지만 반환
        connectedUsers: connectedUsers.size,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 메시지 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '메시지 조회 실패',
        messages: [],
        connectedUsers: 0
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}