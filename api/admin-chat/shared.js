// 글로벌 메모리 저장소 - 모든 API에서 공유
if (!global.chatStorage) {
  global.chatStorage = {
    conversations: new Map(), // userId -> { username, messages: [], lastActivity }
    MAX_MESSAGES_PER_USER: 100
  };
}

const BLOCKED_WORDS = ['욕설1', '욕설2', '스팸'];

const filterMessage = (content) => {
  let filtered = content;
  BLOCKED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
};

const isAdminIP = (req) => {
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   '익명';

  const ADMIN_IPS = ['119.192.193.23', '127.0.0.1', '::1'];
  const actualIP = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  console.log(`🌐 IP 체크: ${actualIP} - Admin IPs: ${ADMIN_IPS.join(', ')}`);
  
  return ADMIN_IPS.includes(actualIP);
};

module.exports = {
  getChatStorage: () => global.chatStorage,
  filterMessage,
  isAdminIP
};