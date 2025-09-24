// IP 주소 추적 및 관리 시스템
export class IPManager {
  private static readonly IP_API_URL = 'https://api.ipify.org?format=json';
  private static readonly BACKUP_IP_API = 'https://httpbin.org/ip';

  // 현재 사용자의 IP 주소 가져오기
  static async getCurrentIP(): Promise<string | null> {
    try {
      // 첫 번째 API 시도
      const response = await fetch(this.IP_API_URL);
      if (response.ok) {
        const data = await response.json();
        return data.ip;
      }
    } catch (error) {
      console.warn('Primary IP API failed, trying backup...', error);
    }

    try {
      // 백업 API 시도
      const response = await fetch(this.BACKUP_IP_API);
      if (response.ok) {
        const data = await response.json();
        return data.origin;
      }
    } catch (error) {
      console.error('All IP APIs failed:', error);
    }

    return null;
  }

  // 로컬 스토리지에서 IP-코드 바인딩 정보 가져오기
  static getIPBindings(): { [code: string]: string } {
    const bindings = localStorage.getItem('ipBindings');
    return bindings ? JSON.parse(bindings) : {};
  }

  // IP-코드 바인딩 저장
  static saveIPBinding(code: string, ip: string): void {
    const bindings = this.getIPBindings();
    bindings[code] = ip;
    localStorage.setItem('ipBindings', JSON.stringify(bindings));
    console.log(`🔒 IP 바인딩 저장됨: ${code} → ${ip}`);
  }

  // 코드가 이미 다른 IP에 바인딩되어 있는지 확인
  static isCodeBoundToOtherIP(code: string, currentIP: string): boolean {
    const bindings = this.getIPBindings();
    const boundIP = bindings[code];
    
    if (!boundIP) {
      // 바인딩된 IP가 없으면 사용 가능
      return false;
    }

    // 바인딩된 IP와 현재 IP가 다르면 차단
    return boundIP !== currentIP;
  }

  // 현재 IP로 사용 중인 코드들 가져오기
  static getCodesForIP(ip: string): string[] {
    const bindings = this.getIPBindings();
    return Object.keys(bindings).filter(code => bindings[code] === ip);
  }

  // IP 바인딩 해제 (관리자용)
  static unbindCode(code: string): void {
    const bindings = this.getIPBindings();
    delete bindings[code];
    localStorage.setItem('ipBindings', JSON.stringify(bindings));
    console.log(`🔓 IP 바인딩 해제됨: ${code}`);
  }

  // 모든 바인딩 초기화 (관리자용)
  static clearAllBindings(): void {
    localStorage.removeItem('ipBindings');
    console.log('🗑️ 모든 IP 바인딩 초기화됨');
  }

  // IP 바인딩 통계
  static getBindingStats(): {
    totalBindings: number;
    currentIPCodes: string[];
    allBindings: { [code: string]: string };
  } {
    const bindings = this.getIPBindings();
    return {
      totalBindings: Object.keys(bindings).length,
      currentIPCodes: [], // 현재 IP는 비동기로 가져와야 함
      allBindings: bindings
    };
  }
}