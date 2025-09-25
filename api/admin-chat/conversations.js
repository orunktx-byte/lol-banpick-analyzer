// 메모리 기반 저장소 (실제 운영에서는 데이터베이스 권장)
let conversations = new Map(); // userId -> { username, messages: [], lastActivity }
const MAX_MESSAGES_PER_USER = 100;

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

      // 대화 목록 생성
      const conversationList = Array.from(conversations.entries()).map(([userId, data]) => {
        const messages = data.messages || [];
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(msg => !msg.isRead && !msg.isAdmin).length;

        return {
          userId,
          username: data.username || '익명',
          lastMessage: lastMessage ? lastMessage.content.substring(0, 30) + '...' : '대화 없음',
          lastMessageTime: lastMessage ? lastMessage.timestamp : data.lastActivity || new Date(),
          unreadCount,
          isActive: data.lastActivity && (new Date() - new Date(data.lastActivity)) < 300000 // 5분
        };
      });

      // 최근 활동 순으로 정렬
      conversationList.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

      res.status(200).json({
        success: true,
        conversations: conversationList,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 대화 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '대화 목록 조회 실패',
        conversations: []
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}