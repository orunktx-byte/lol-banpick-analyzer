// 메시지 저장소 (메모리 기반 - 실제 운영에서는 데이터베이스 권장)
let messages = [];
const MAX_MESSAGES = 100;

// 욕설 필터 (기본적인 필터링)
const BLOCKED_WORDS = ['욕설1', '욕설2', '스팸']; // 실제 운영시 확장 필요

const filterMessage = (content) => {
  let filtered = content;
  BLOCKED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
};

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
      const { username, content, isAdmin } = req.body;

      // 입력 검증
      if (!username || !content) {
        return res.status(400).json({
          success: false,
          error: '사용자명과 메시지 내용이 필요합니다.'
        });
      }

      if (content.length > 500) {
        return res.status(400).json({
          success: false,
          error: '메시지가 너무 깁니다. (최대 500자)'
        });
      }

      if (username.length > 20) {
        return res.status(400).json({
          success: false,
          error: '사용자명이 너무 깁니다. (최대 20자)'
        });
      }

      // 클라이언트 IP 가져오기 (스팸 방지용)
      const clientIP = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress || 
                       '익명';

      // 간단한 스팸 방지 (같은 IP에서 1초 내 중복 메시지 방지)
      const now = new Date();
      const recentMessage = messages.find(msg => 
        msg.ip === clientIP && 
        (now.getTime() - new Date(msg.timestamp).getTime()) < 1000
      );

      if (recentMessage) {
        return res.status(429).json({
          success: false,
          error: '너무 빠르게 메시지를 보내고 있습니다. 잠시 후 다시 시도해주세요.'
        });
      }

      // 메시지 생성
      const message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: username.trim(),
        content: filterMessage(content.trim()),
        timestamp: now.toISOString(),
        isAdmin: Boolean(isAdmin),
        ip: clientIP // IP는 클라이언트에 전송하지 않음
      };

      // 메시지 저장
      messages.push(message);

      // 메시지 수 제한
      if (messages.length > MAX_MESSAGES) {
        messages = messages.slice(-MAX_MESSAGES);
      }

      console.log(`💬 새 메시지: ${username} - ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);

      // IP 정보 제외하고 응답
      const { ip, ...messageResponse } = message;
      
      res.status(200).json({
        success: true,
        message: messageResponse,
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