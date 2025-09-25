// 글로벌 간단한 1:1 채팅 저장소
if (!global.simpleChatStorage) {
  global.simpleChatStorage = {
    messages: [], // 모든 메시지를 하나의 배열에 저장
    MAX_MESSAGES: 200
  };
}

const ADMIN_IP = '119.192.193.23';
const LOCAL_IPS = ['127.0.0.1', '::1'];

const isAdminIP = (req) => {
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   '익명';

  const actualIP = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  const isAdmin = [ADMIN_IP, ...LOCAL_IPS].includes(actualIP);
  
  console.log(`🌐 IP 체크: ${actualIP} - 관리자: ${isAdmin}`);
  
  return isAdmin;
};

const filterMessage = (content) => {
  const blockedWords = ['욕설1', '욕설2', '스팸'];
  let filtered = content;
  blockedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
};

module.exports = {
  getSimpleChatStorage: () => global.simpleChatStorage,
  isAdminIP,
  filterMessage,
  ADMIN_IP
};