// 크레딧 시스템 관리
import { IPManager } from './ipManager';

export interface AuthCode {
  code: string;
  totalCredits: number;
  description: string;
  tier?: string; // 코드 등급 (optional)
}

export interface UserSession {
  code: string;
  remainingCredits: number;
  totalCredits: number;
  usedCredits: number;
  authTime: number;
  boundIP?: string; // IP 바인딩 정보 (선택적)
}

// 인증 코드와 크레딧 설정
export const AUTH_CODES: AuthCode[] = [
  { code: 'ADMIN999', totalCredits: 999, description: '관리자 코드 (무제한)', tier: 'admin' },
  { code: 'VIP100XY', totalCredits: 100, description: 'VIP 코드 (100크레딧)', tier: 'vip' },
  { code: 'GOLD50AB', totalCredits: 50, description: '골드 코드 (50크레딧)', tier: 'gold' },
  { code: 'POWER50K', totalCredits: 50, description: '파워 코드 (50크레딧)', tier: 'gold' },
  { code: 'ELITE50M', totalCredits: 50, description: '엘리트 코드 (50크레딧)', tier: 'gold' },
  { code: 'MEGA50XZ', totalCredits: 50, description: '메가 코드 (50크레딧)', tier: 'gold' },
  { code: 'SILVER25', totalCredits: 25, description: '실버 코드 (25크레딧)', tier: 'silver' },
  { code: 'TRIAL10Z', totalCredits: 10, description: '체험 코드 (10크레딧)', tier: 'trial' },
  { code: 'TEST5ABC', totalCredits: 5, description: '테스트 코드 (5크레딧)', tier: 'trial' },
];

export class CreditManager {
  // 인증 코드 검증
  static validateCode(inputCode: string): AuthCode | null {
    return AUTH_CODES.find(authCode => 
      authCode.code.toUpperCase() === inputCode.toUpperCase()
    ) || null;
  }

  // 세션 시작 (인증 성공 시) - IP 바인딩 포함
  static async startSessionWithIP(authCode: AuthCode): Promise<{ success: boolean; session?: UserSession; error?: string }> {
    try {
      // 현재 IP 주소 가져오기
      const currentIP = await IPManager.getCurrentIP();
      
      if (!currentIP) {
        return { 
          success: false, 
          error: 'IP 주소를 확인할 수 없습니다. 네트워크 연결을 확인해주세요.' 
        };
      }
      
      // IP 바인딩 확인
      const bindings = IPManager.getIPBindings();
      const boundIP = bindings[authCode.code];
      
      if (boundIP && boundIP !== currentIP) {
        return { 
          success: false, 
          error: '이 코드는 다른 IP 주소에서 이미 사용 중입니다.' 
        };
      }
      
      // 새로운 IP라면 바인딩 저장
      if (!boundIP) {
        IPManager.saveIPBinding(authCode.code, currentIP);
      }

      // 기존 세션이 있는지 확인
      const existingSession = this.getSession();
      
      if (existingSession && existingSession.code === authCode.code) {
        // 같은 코드로 재접속하면 기존 크레딧 유지하되 IP 업데이트
        const updatedSession = { ...existingSession, boundIP: currentIP };
        localStorage.setItem('userSession', JSON.stringify(updatedSession));
        console.log('🔄 기존 세션 복원:', existingSession.remainingCredits, '크레딧 남음');
        return { success: true, session: updatedSession };
      }

      // 새로운 세션 생성
      const session: UserSession = {
        code: authCode.code,
        remainingCredits: authCode.totalCredits,
        totalCredits: authCode.totalCredits,
        usedCredits: 0,
        authTime: new Date().getTime(),
        boundIP: currentIP
      };

      localStorage.setItem('userSession', JSON.stringify(session));
      console.log('✨ 새로운 세션 시작:', authCode.description, '/', authCode.totalCredits, '크레딧');
      
      return { success: true, session };
    } catch (error) {
      console.error('IP 확인 중 오류:', error);
      return { 
        success: false, 
        error: 'IP 주소 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      };
    }
  }

  // 세션 시작 (인증 성공 시) - 기존 호환성을 위해 유지
  static startSession(authCode: AuthCode): UserSession {
    // 기존 세션이 있는지 확인
    const existingSession = this.getSession();
    
    if (existingSession && existingSession.code === authCode.code) {
      // 같은 코드로 재접속하면 기존 크레딧 유지
      console.log('🔄 기존 세션 복원:', existingSession.remainingCredits, '크레딧 남음');
      return existingSession;
    }

    // 새로운 세션 생성
    const session: UserSession = {
      code: authCode.code,
      remainingCredits: authCode.totalCredits,
      totalCredits: authCode.totalCredits,
      usedCredits: 0,
      authTime: new Date().getTime()
      // boundIP는 선택적이므로 생략
    };

    localStorage.setItem('userSession', JSON.stringify(session));
    console.log('✨ 새로운 세션 시작:', authCode.description, '/', authCode.totalCredits, '크레딧');
    
    return session;
  }

  // 현재 세션 가져오기
  static getSession(): UserSession | null {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return null;

    try {
      const session: UserSession = JSON.parse(sessionData);
      
      // 24시간 경과 확인
      const timeElapsed = new Date().getTime() - session.authTime;
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (timeElapsed > dayInMs) {
        // 24시간 경과하면 세션 삭제
        this.clearSession();
        return null;
      }
      
      return session;
    } catch {
      return null;
    }
  }

  // 크레딧 사용
  static useCredit(): boolean {
    const session = this.getSession();
    if (!session || session.remainingCredits <= 0) {
      return false;
    }

    session.remainingCredits -= 1;
    session.usedCredits += 1;
    
    localStorage.setItem('userSession', JSON.stringify(session));
    
    console.log(`💳 크레딧 사용: ${session.remainingCredits}/${session.totalCredits} 남음`);
    
    return true;
  }

  // 크레딧 확인
  static hasCredits(): boolean {
    const session = this.getSession();
    return session ? session.remainingCredits > 0 : false;
  }

  // 세션 삭제
  static clearSession(): void {
    localStorage.removeItem('userSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTime');
    console.log('🗑️ 세션 삭제됨');
  }

  // 크레딧 통계
  static getCreditStats(): {
    remaining: number;
    used: number;
    total: number;
    percentage: number;
  } | null {
    const session = this.getSession();
    if (!session) return null;

    return {
      remaining: session.remainingCredits,
      used: session.usedCredits,
      total: session.totalCredits,
      percentage: Math.round((session.usedCredits / session.totalCredits) * 100)
    };
  }
}