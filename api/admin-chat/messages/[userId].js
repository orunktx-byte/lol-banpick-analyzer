// 메모리 기반 저장소
let conversations = new Map(); // userId -> { username, messages: [], lastActivity }

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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ success: false, error: 'userId가 필요합니다.' });
      }

      // 관리자 IP 확인
      const clientIP = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress || 
                       '익명';

      const ADMIN_IPS = ['119.192.193.23', '127.0.0.1', '::1'];
      const actualIP = Array.isArray(clientIP) ? clientIP[0] : clientIP;
      
      if (!ADMIN_IPS.includes(actualIP)) {
        return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
      }

      const conversation = conversations.get(userId);
      if (!conversation) {
        return res.status(200).json({
          success: true,
          messages: [],
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        messages: conversation.messages || [],
        username: conversation.username || '익명',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 사용자 메시지 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '메시지 조회 실패',
        messages: []
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}