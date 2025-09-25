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

  try {
    // 실제 클라이언트 IP 가져오기
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // 관리자 IP 목록
    const ADMIN_IPS = [
      '119.192.193.23', // 관리자 공인 IP
      '127.0.0.1',      // 로컬 테스트용
      '::1'             // IPv6 로컬
    ];

    const actualIP = Array.isArray(clientIP) ? clientIP[0] : clientIP;
    const isAdmin = ADMIN_IPS.includes(actualIP);

    console.log(`🌐 IP 체크: ${actualIP} - 관리자: ${isAdmin}`);

    res.status(200).json({
      success: true,
      isAdmin,
      clientIP: actualIP,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 관리자 IP 확인 오류:', error);
    res.status(500).json({
      success: false,
      error: 'IP 확인 실패',
      isAdmin: false
    });
  }
}