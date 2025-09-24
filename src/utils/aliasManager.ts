// 코드별 별명(닉네임) 관리 시스템
export interface CodeAlias {
  code: string;
  alias: string;
  createdAt: number;
  updatedAt: number;
}

export class AliasManager {
  private static readonly STORAGE_KEY = 'codeAliases';

  // 모든 별명 가져오기
  static getAllAliases(): { [code: string]: CodeAlias } {
    const aliases = localStorage.getItem(this.STORAGE_KEY);
    return aliases ? JSON.parse(aliases) : {};
  }

  // 특정 코드의 별명 가져오기
  static getAlias(code: string): string {
    const aliases = this.getAllAliases();
    return aliases[code]?.alias || '';
  }

  // 별명 저장/업데이트
  static saveAlias(code: string, alias: string): void {
    const aliases = this.getAllAliases();
    const now = new Date().getTime();
    
    if (aliases[code]) {
      // 기존 별명 업데이트
      aliases[code] = {
        ...aliases[code],
        alias,
        updatedAt: now
      };
    } else {
      // 새 별명 생성
      aliases[code] = {
        code,
        alias,
        createdAt: now,
        updatedAt: now
      };
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(aliases));
    console.log(`🏷️ 별명 저장됨: ${code} → "${alias}"`);
  }

  // 별명 삭제
  static deleteAlias(code: string): void {
    const aliases = this.getAllAliases();
    delete aliases[code];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(aliases));
    console.log(`🗑️ 별명 삭제됨: ${code}`);
  }

  // 별명이 있는 코드들만 필터링
  static getCodesWithAliases(): string[] {
    const aliases = this.getAllAliases();
    return Object.keys(aliases).filter(code => aliases[code].alias.trim() !== '');
  }

  // 코드 표시명 가져오기 (별명이 있으면 별명, 없으면 원래 설명)
  static getDisplayName(code: string, originalDescription: string): string {
    const alias = this.getAlias(code);
    return alias || originalDescription;
  }
}