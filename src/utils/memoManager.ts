// 코드별 메모 관리 시스템
export interface CodeMemo {
  code: string;
  memo: string;
  createdAt: number;
  updatedAt: number;
}

export class MemoManager {
  private static readonly STORAGE_KEY = 'codeMemos';

  // 모든 메모 가져오기
  static getAllMemos(): { [code: string]: CodeMemo } {
    const memos = localStorage.getItem(this.STORAGE_KEY);
    return memos ? JSON.parse(memos) : {};
  }

  // 특정 코드의 메모 가져오기
  static getMemo(code: string): string {
    const memos = this.getAllMemos();
    return memos[code]?.memo || '';
  }

  // 메모 저장/업데이트
  static saveMemo(code: string, memo: string): void {
    const memos = this.getAllMemos();
    const now = new Date().getTime();
    
    if (memos[code]) {
      // 기존 메모 업데이트
      memos[code] = {
        ...memos[code],
        memo,
        updatedAt: now
      };
    } else {
      // 새 메모 생성
      memos[code] = {
        code,
        memo,
        createdAt: now,
        updatedAt: now
      };
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memos));
    console.log(`📝 메모 저장됨: ${code} → "${memo}"`);
  }

  // 메모 삭제
  static deleteMemo(code: string): void {
    const memos = this.getAllMemos();
    delete memos[code];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memos));
    console.log(`🗑️ 메모 삭제됨: ${code}`);
  }

  // 메모가 있는 코드들만 필터링
  static getCodesWithMemos(): string[] {
    const memos = this.getAllMemos();
    return Object.keys(memos).filter(code => memos[code].memo.trim() !== '');
  }
}