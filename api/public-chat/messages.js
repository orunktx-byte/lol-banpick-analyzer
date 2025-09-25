// 공개 채팅 메시지 저장소
let publicMessages = [];
const MAX_MESSAGES = 100; // 최대 100개 메시지 유지

// IP별 고정 닉네임 저장소
let ipNicknameMap = new Map(); // IP -> nickname

// 메시지 정리 (100개 초과시 오래된 메시지 삭제)
function cleanupMessages() {
  if (publicMessages.length > MAX_MESSAGES) {
    publicMessages = publicMessages.slice(-MAX_MESSAGES);
  }
}

// 클라이언트 IP 주소 가져오기
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.connection?.socket?.remoteAddress ||
         '127.0.0.1';
}

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { message, nickname } = req.body;
    const clientIP = getClientIP(req);
    
    if (!message || !nickname) {
      return res.status(400).json({ error: 'message and nickname are required' });
    }

    // 메시지 길이 제한
    if (message.length > 200) {
      return res.status(400).json({ error: 'Message too long (max 200 characters)' });
    }

    if (nickname.length > 20) {
      return res.status(400).json({ error: 'Nickname too long (max 20 characters)' });
    }

    // IP별 닉네임 고정 확인
    const existingNickname = ipNicknameMap.get(clientIP);
    let finalNickname = nickname.trim();
    
    if (existingNickname) {
      // 이미 등록된 IP인 경우 기존 닉네임 사용
      finalNickname = existingNickname;
    } else {
      // 새로운 IP인 경우 닉네임 등록
      ipNicknameMap.set(clientIP, finalNickname);
    }

    // 간단한 스팸 방지 (같은 메시지 연속 방지)
    const lastMessage = publicMessages[publicMessages.length - 1];
    if (lastMessage && lastMessage.message === message && lastMessage.nickname === finalNickname) {
      return res.status(429).json({ error: 'Duplicate message not allowed' });
    }

    // 새 메시지 추가
    const newMessage = {
      id: Date.now() + Math.random(),
      message: message.trim(),
      nickname: finalNickname,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    publicMessages.push(newMessage);
    cleanupMessages();

    return res.status(201).json({ 
      success: true, 
      message: newMessage,
      totalMessages: publicMessages.length,
      fixedNickname: finalNickname
    });
  }

  if (req.method === 'GET') {
    const clientIP = getClientIP(req);
    const fixedNickname = ipNicknameMap.get(clientIP);
    
    // 최근 메시지들 반환 (최신 50개)
    const recentMessages = publicMessages.slice(-50);
    
    return res.status(200).json({
      messages: recentMessages,
      totalMessages: publicMessages.length,
      timestamp: Date.now(),
      fixedNickname: fixedNickname || null
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}