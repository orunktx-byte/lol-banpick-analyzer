const { getSimpleChatStorage } = require('../shared');

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

      const { messages } = getSimpleChatStorage();
      
      // 특정 사용자와 관련된 메시지만 필터링 (사용자의 메시지 + 관리자의 모든 메시지)
      const userMessages = messages.filter(msg => {
        // 사용자 자신의 메시지이거나 관리자의 메시지
        return msg.userId === userId || msg.isAdmin;
      });

      console.log(`💬 사용자 ${userId} 메시지 조회: 전체 ${messages.length}개 중 ${userMessages.length}개 해당`);

      res.status(200).json({
        success: true,
        messages: userMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
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