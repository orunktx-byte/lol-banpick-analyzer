// 관리자 권한 체크 시스템
import { CreditManager } from './creditManager';

export class AdminPermission {
  // 현재 세션이 ADMIN999 코드인지 확인
  static isAdmin(): boolean {
    const session = CreditManager.getSession();
    return session?.code === 'ADMIN999';
  }

  // 관리자가 아닌 경우 경고 메시지 표시
  static requireAdmin(action: string = '이 기능'): boolean {
    if (!this.isAdmin()) {
      alert(`⚠️ ${action}은(는) ADMIN999 권한이 필요합니다.`);
      console.warn(`🚫 관리자 권한 필요: ${action}`);
      return false;
    }
    return true;
  }

  // 관리자 전용 기능을 조건부로 실행
  static executeIfAdmin<T>(callback: () => T, fallback?: () => T): T | undefined {
    if (this.isAdmin()) {
      return callback();
    } else {
      console.warn('🚫 관리자 권한이 필요한 기능입니다.');
      return fallback ? fallback() : undefined;
    }
  }

  // 관리자 여부에 따른 UI 표시 여부 결정
  static shouldShowAdminFeature(): boolean {
    return this.isAdmin();
  }

  // 관리자 로그인 상태를 실시간 감지
  static onAdminStatusChange(callback: (isAdmin: boolean) => void): () => void {
    const checkInterval = setInterval(() => {
      callback(this.isAdmin());
    }, 1000); // 1초마다 체크

    // cleanup 함수 반환
    return () => clearInterval(checkInterval);
  }
}