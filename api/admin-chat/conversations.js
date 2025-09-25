const { getChatStorage, isAdminIP } = require('./shared');

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
      if (!isAdminIP(req)) {
        return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
      }

      const { conversations } = getChatStorage();

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