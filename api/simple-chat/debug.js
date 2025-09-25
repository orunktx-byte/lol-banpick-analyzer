const { getSimpleChatStorage, isAdminIP } = require('./shared');

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
      const { messages } = getSimpleChatStorage();
      
      // 디버깅 정보
      const debugInfo = {
        totalMessages: messages.length,
        lastMessages: messages.slice(-5).map(msg => ({
          id: msg.id,
          userId: msg.userId,
          username: msg.username,
          content: msg.content.substring(0, 30) + '...',
          isAdmin: msg.isAdmin,
          timestamp: msg.timestamp
        })),
        userIds: [...new Set(messages.map(msg => msg.userId))],
        adminMessages: messages.filter(msg => msg.isAdmin).length,
        userMessages: messages.filter(msg => !msg.isAdmin).length,
        timestamp: new Date().toISOString()
      };

      console.log('🔍 디버그 정보 (Simple Chat):', JSON.stringify(debugInfo, null, 2));

      res.status(200).json({
        success: true,
        debug: debugInfo,
        allMessages: messages
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