// 랜덤 코드 생성 시스템
import type { AuthCode } from './creditManager';
import { AUTH_CODES } from './creditManager';

export interface RandomCodeOptions {
  credits: number;
  prefix?: string;
  length?: number;
  includeNumbers?: boolean;
  includeLetters?: boolean;
}

export class CodeGenerator {
  private static readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly NUMBERS = '0123456789';
  
  // 랜덤 코드 생성
  static generateRandomCode(options: RandomCodeOptions): string {
    const {
      prefix = '',
      length = 6,
      includeNumbers = true,
      includeLetters = true
    } = options;

    let charset = '';
    if (includeLetters) charset += this.CHARS;
    if (includeNumbers) charset += this.NUMBERS;
    
    if (charset === '') {
      charset = this.CHARS + this.NUMBERS; // 기본값
    }

    let randomPart = '';
    const randomLength = Math.max(1, length - prefix.length);
    
    for (let i = 0; i < randomLength; i++) {
      randomPart += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const newCode = (prefix + randomPart).toUpperCase();
    
    // 중복 체크
    if (this.isCodeExists(newCode)) {
      // 중복이면 재귀적으로 다시 생성
      return this.generateRandomCode(options);
    }
    
    return newCode;
  }

  // 코드 중복 체크
  static isCodeExists(code: string): boolean {
    return AUTH_CODES.some(authCode => 
      authCode.code.toUpperCase() === code.toUpperCase()
    );
  }

  // 새로운 코드를 AUTH_CODES에 추가
  static addNewCode(code: string, credits: number, description?: string): AuthCode {
    const newAuthCode: AuthCode = {
      code: code.toUpperCase(),
      totalCredits: credits,
      description: description || `생성된 코드 (${credits}크레딧)`
    };

    // AUTH_CODES 배열에 추가 (런타임에만 적용)
    AUTH_CODES.push(newAuthCode);
    
    // localStorage에도 저장하여 새로고침 시에도 유지
    const customCodes = this.getCustomCodes();
    customCodes.push(newAuthCode);
    localStorage.setItem('customAuthCodes', JSON.stringify(customCodes));
    
    console.log(`✨ 새 코드 생성됨: ${code} (${credits}크레딧)`);
    return newAuthCode;
  }

  // 커스텀 코드 목록 가져오기
  static getCustomCodes(): AuthCode[] {
    const codes = localStorage.getItem('customAuthCodes');
    return codes ? JSON.parse(codes) : [];
  }

  // 커스텀 코드를 AUTH_CODES에 로드
  static loadCustomCodes(): void {
    const customCodes = this.getCustomCodes();
    customCodes.forEach(code => {
      if (!this.isCodeExists(code.code)) {
        AUTH_CODES.push(code);
      }
    });
    
    if (customCodes.length > 0) {
      console.log(`📥 ${customCodes.length}개의 커스텀 코드가 로드되었습니다.`);
    }
  }

  // 코드 삭제 (커스텀 코드만)
  static deleteCustomCode(code: string): boolean {
    const customCodes = this.getCustomCodes();
    const filteredCodes = customCodes.filter(c => c.code !== code.toUpperCase());
    
    if (filteredCodes.length < customCodes.length) {
      localStorage.setItem('customAuthCodes', JSON.stringify(filteredCodes));
      
      // AUTH_CODES에서도 제거
      const index = AUTH_CODES.findIndex(c => c.code === code.toUpperCase());
      if (index !== -1) {
        AUTH_CODES.splice(index, 1);
      }
      
      console.log(`🗑️ 커스텀 코드 삭제됨: ${code}`);
      return true;
    }
    
    return false;
  }

  // 빠른 생성 프리셋
  static generateQuickCode(credits: number): string {
    const prefixes = ['VIP', 'GOLD', 'SILVER', 'TRIAL', 'SPEC', 'USER'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    return this.generateRandomCode({
      credits,
      prefix: randomPrefix,
      length: 8,
      includeNumbers: true,
      includeLetters: true
    });
  }
}

// 앱 시작 시 커스텀 코드 로드
CodeGenerator.loadCustomCodes();