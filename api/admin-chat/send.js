// 메모리 기반 저장소
let conversations = new Map(); // userId -> { username, messages: [], lastActivity }
const MAX_MESSAGES_PER_USER = 100;

// 욕설 필터
const BLOCKED_WORDS = ['욕설1', '욕설2', '스팸'];
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
      const { fromUserId, toUserId, username, content, isAdmin } = req.body;

      // 입력 검증
      if (!fromUserId || !toUserId || !content) {
        return res.status(400).json({
          success: false,
          error: '필수 정보가 누락되었습니다.'
        });
      }

      if (content.length > 500) {
        return res.status(400).json({
          success: false,
          error: '메시지가 너무 깁니다. (최대 500자)'
        });
      }

      // 관리자 권한 확인 (관리자 메시지인 경우)
      if (isAdmin) {
        const clientIP = req.headers['x-forwarded-for'] || 
                         req.headers['x-real-ip'] || 
                         req.connection.remoteAddress || 
                         '익명';

        const ADMIN_IPS = ['119.192.193.23', '127.0.0.1', '::1'];
        const actualIP = Array.isArray(clientIP) ? clientIP[0] : clientIP;
        
        if (!ADMIN_IPS.includes(actualIP)) {
          return res.status(403).json({ success: false, error: '관리자만 접근 가능합니다.' });
        }
      }

      // 스팸 방지 (같은 사용자가 1초 내 중복 메시지 방지)
      const now = new Date();
      const conversation = conversations.get(isAdmin ? toUserId : fromUserId);
      
      if (conversation && conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (lastMessage.fromUserId === fromUserId && 
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
        fromUserId,
        toUserId,
        userId: isAdmin ? toUserId : fromUserId, // 대화의 주체 (사용자)
        username: username || (isAdmin ? '관리자' : '익명'),
        content: filterMessage(content.trim()),
        timestamp: now.toISOString(),
        isAdmin: Boolean(isAdmin),
        isRead: false
      };

      // 대화 저장소에 추가
      const conversationUserId = isAdmin ? toUserId : fromUserId;
      
      if (!conversations.has(conversationUserId)) {
        conversations.set(conversationUserId, {
          username: username || '익명',
          messages: [],
          lastActivity: now.toISOString()
        });
      }

      const conv = conversations.get(conversationUserId);
      conv.messages.push(message);
      conv.lastActivity = now.toISOString();
      
      // 사용자 이름 업데이트 (최신 이름으로)
      if (username && !isAdmin) {
        conv.username = username;
      }

      // 메시지 수 제한
      if (conv.messages.length > MAX_MESSAGES_PER_USER) {
        conv.messages = conv.messages.slice(-MAX_MESSAGES_PER_USER);
      }

      console.log(`💬 ${isAdmin ? '관리자' : username} → ${isAdmin ? conv.username : '관리자'}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);

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