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

  if (req.method === 'POST') {
    try {
      // 관리자 IP 확인
      if (!isAdminIP(req)) {
        return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
      }

      const { messages } = getSimpleChatStorage();

      // 모든 사용자 메시지를 읽음 처리
      let readCount = 0;
      messages.forEach(msg => {
        if (!msg.isAdmin && !msg.isRead) {
          msg.isRead = true;
          readCount++;
        }
      });

      console.log(`📖 ${readCount}개 메시지 읽음 처리 완료`);

      res.status(200).json({
        success: true,
        readCount,
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