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

      const conversation = conversations.get(userId);
      if (!conversation) {
        return res.status(200).json({
          success: true,
          messages: [],
          timestamp: new Date().toISOString()
        });
      }

      // 사용자 활동 시간 업데이트
      conversation.lastActivity = new Date().toISOString();

      res.status(200).json({
        success: true,
        messages: conversation.messages || [],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 내 메시지 조회 오류:', error);
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