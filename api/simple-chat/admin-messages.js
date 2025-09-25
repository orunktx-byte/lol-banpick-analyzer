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
      // 관리자 IP 확인
      if (!isAdminIP(req)) {
        return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
      }

      const { messages } = getSimpleChatStorage();

      console.log(`👑 관리자 메시지 조회: 총 ${messages.length}개 메시지`);

      res.status(200).json({
        success: true,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 관리자 메시지 조회 오류:', error);
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