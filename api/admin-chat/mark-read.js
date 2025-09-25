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

  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

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
      if (conversation && conversation.messages) {
        // 관리자가 아닌 메시지들을 읽음 처리
        conversation.messages.forEach(msg => {
          if (!msg.isAdmin) {
            msg.isRead = true;
          }
        });
      }

      console.log(`📖 ${userId}의 메시지 읽음 처리 완료`);

      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 읽음 처리 오류:', error);
      res.status(500).json({
        success: false,
        error: '읽음 처리 실패'
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}