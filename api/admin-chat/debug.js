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
      
      // 디버깅 정보
      const debugInfo = {
        totalConversations: conversations.size,
        conversationIds: Array.from(conversations.keys()),
        conversationDetails: Array.from(conversations.entries()).map(([userId, data]) => ({
          userId,
          username: data.username,
          messageCount: data.messages ? data.messages.length : 0,
          lastActivity: data.lastActivity,
          lastMessages: data.messages ? data.messages.slice(-3).map(msg => ({
            content: msg.content.substring(0, 50),
            isAdmin: msg.isAdmin,
            timestamp: msg.timestamp
          })) : []
        })),
        timestamp: new Date().toISOString()
      };

      console.log('🔍 디버그 정보:', JSON.stringify(debugInfo, null, 2));

      res.status(200).json({
        success: true,
        debug: debugInfo
      });

    } catch (error) {
      console.error('❌ 디버그 API 오류:', error);
      res.status(500).json({
        success: false,
        error: '디버그 정보 조회 실패'
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}