const { getSimpleChatStorage, isAdminIP, filterMessage } = require('./shared');

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
      const { userId, content, isAdmin, username } = req.body;

      // 입력 검증
      if (!userId || !content) {
        return res.status(400).json({
          success: false,
          error: '사용자 ID와 메시지 내용이 필요합니다.'
        });
      }

      if (content.length > 500) {
        return res.status(400).json({
          success: false,
          error: '메시지가 너무 깁니다. (최대 500자)'
        });
      }

      // 관리자 권한 확인
      if (isAdmin && !isAdminIP(req)) {
        return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
      }

      const { messages, MAX_MESSAGES } = getSimpleChatStorage();

      // 스팸 방지 (1초 내 중복 메시지 방지)
      const now = new Date();
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.userId === userId && 
            (now.getTime() - new Date(lastMessage.timestamp).getTime()) < 1000) {
          return res.status(429).json({
            success: false,
            error: '너무 빠르게 메시지를 보내고 있습니다.'
          });
        }
      }

      // 메시지 생성
      const message = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        username: username || (isAdmin ? '관리자' : '익명'),
        content: filterMessage(content.trim()),
        timestamp: now.toISOString(),
        isAdmin: Boolean(isAdmin),
        isRead: false
      };

      // 메시지 저장
      messages.push(message);

      // 메시지 수 제한
      if (messages.length > MAX_MESSAGES) {
        messages.splice(0, messages.length - MAX_MESSAGES);
      }

      console.log(`💬 새 메시지: ${isAdmin ? '👑 관리자' : username || userId} - ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);

      res.status(200).json({
        success: true,
        message: {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          isAdmin: message.isAdmin
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
      res.status(500).json({
        success: false,
        error: '메시지 전송 실패'
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}