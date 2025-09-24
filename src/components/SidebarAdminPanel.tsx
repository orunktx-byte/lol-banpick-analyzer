import React, { useState, useEffect } from 'react';
import { CreditManager, AUTH_CODES } from '../utils/creditManager';
import { MemoManager } from '../utils/memoManager';
import { CodeGenerator } from '../utils/codeGenerator';
import { AliasManager } from '../utils/aliasManager';
import { AdminPermission } from '../utils/adminPermission';

interface SidebarAdminPanelProps {
  isVisible: boolean;
  onClose?: () => void;
}

const SidebarAdminPanel: React.FC<SidebarAdminPanelProps> = ({ isVisible, onClose }) => {
  const [creditStatus, setCreditStatus] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [editingAlias, setEditingAlias] = useState<string | null>(null);
  const [aliasText, setAliasText] = useState('');

  useEffect(() => {
    if (isVisible) {
      updateCreditStatus();
      const interval = setInterval(() => {
        updateCreditStatus();
        // 관리자 권한이 없으면 패널 자동 닫기
        if (!AdminPermission.isAdmin() && onClose) {
          console.log('🚫 관리자 권한 상실 - 사이드바 패널 자동 닫기');
          onClose();
        }
      }, 3000); // 3초마다 업데이트
      return () => clearInterval(interval);
    }
  }, [isVisible, onClose]);

  const updateCreditStatus = () => {
    // 기본 코드 + 커스텀 코드 모두 포함
    const allAuthCodes = [...AUTH_CODES, ...CodeGenerator.getCustomCodes()];
    
    const allCodes = allAuthCodes.map((authCode: any) => {
      let usedCredits = 0;
      let remainingCredits = authCode.totalCredits;
      let lastUsed = null;
      let boundIP = null;
      let isActive = false;

      try {
        // 현재 세션 확인
        const session = CreditManager.getSession();
        if (session && session.code === authCode.code) {
          usedCredits = session.usedCredits;
          remainingCredits = session.remainingCredits;
          lastUsed = new Date(session.authTime);
          boundIP = session.boundIP;
          isActive = true;
        }

        // IP 바인딩 정보 확인
        const ipBindings = JSON.parse(localStorage.getItem('ipBindings') || '{}');
        if (ipBindings[authCode.code] && !boundIP) {
          boundIP = ipBindings[authCode.code];
        }

      } catch (error) {
        console.error('크레딧 상태 확인 중 오류:', error);
      }

      return {
        ...authCode,
        usedCredits,
        remainingCredits,
        lastUsed,
        boundIP,
        isActive,
        usageRate: ((usedCredits / authCode.totalCredits) * 100).toFixed(1),
        memo: MemoManager.getMemo(authCode.code), // 메모 추가
        alias: AliasManager.getAlias(authCode.code), // 별명 추가
        displayName: AliasManager.getDisplayName(authCode.code, authCode.description) // 표시명
      };
    });

    setCreditStatus(allCodes);
    setCurrentSession(CreditManager.getSession());
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'admin': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'vip': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'pro': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'standard': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'new': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'trial': return 'text-gray-400 bg-gray-900/20 border-gray-700';
      default: return 'text-white bg-gray-800 border-gray-600';
    }
  };

  const handleEditAlias = (code: string) => {
    setEditingAlias(code);
    setAliasText(AliasManager.getAlias(code));
  };

  const handleSaveAlias = (code: string) => {
    AliasManager.saveAlias(code, aliasText);
    setEditingAlias(null);
    setAliasText('');
    updateCreditStatus();
  };

  const handleCancelEdit = () => {
    setEditingAlias(null);
    setAliasText('');
  };

  if (!isVisible) return null;

  // ADMIN999 권한이 없으면 경고 메시지 표시
  if (!AdminPermission.isAdmin()) {
    return (
      <div className="fixed right-4 top-4 w-80 bg-red-900/95 backdrop-blur border border-red-700 rounded-lg shadow-2xl z-40 p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🚫</div>
          <h3 className="text-lg font-bold text-white mb-2">접근 권한 없음</h3>
          <p className="text-red-300 text-sm mb-4">
            이 기능은 ADMIN999 권한이 필요합니다.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg shadow-2xl z-40 overflow-hidden">
      <div className="bg-gradient-to-r from-red-900 to-purple-900 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-white flex items-center">
              🔐 Admin Panel
              <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">LIVE</span>
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-xl"
              title="닫기"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-full">
        {/* 현재 활성 세션 */}
        {currentSession && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="text-sm text-blue-300 font-semibold mb-2">🟢 현재 활성 세션</div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-blue-200">{currentSession.code}</span>
              <span className="text-green-400 font-bold">{currentSession.remainingCredits}cr</span>
            </div>
          </div>
        )}

        {/* 전체 코드 현황 */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400 font-semibold mb-3">📊 전체 코드 현황</div>
          
          {creditStatus.map((code) => (
            <div key={code.code} className={`p-3 rounded-lg border ${getTierColor(code.tier)} ${code.isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-mono text-sm font-bold">{code.code}</span>
                  {code.isActive && <span className="ml-2 text-xs bg-green-600 px-1 py-0.5 rounded">ACTIVE</span>}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{code.remainingCredits}</div>
                  <div className="text-xs opacity-75">/ {code.totalCredits}</div>
                </div>
              </div>

              {/* 사용률 바 */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>사용률</span>
                  <span>{code.usageRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      parseFloat(code.usageRate) > 80 ? 'bg-red-500' :
                      parseFloat(code.usageRate) > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${code.usageRate}%` }}
                  ></div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="text-xs space-y-1 opacity-75">
                {/* 별명 편집 기능 */}
                {editingAlias === code.code ? (
                  <div className="bg-gray-800 p-2 rounded border border-gray-600">
                    <input
                      type="text"
                      value={aliasText}
                      onChange={(e) => setAliasText(e.target.value)}
                      placeholder="코드 별명 입력..."
                      className="w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                      autoFocus
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => handleSaveAlias(code.code)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>{code.displayName}</div>
                    <button
                      onClick={() => handleEditAlias(code.code)}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                      title="별명 편집"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                
                {code.alias && editingAlias !== code.code && (
                  <div className="text-yellow-300 bg-yellow-900/20 p-1 rounded text-xs">
                    🏷️ {code.alias}
                  </div>
                )}
                
                {code.memo && (
                  <div className="text-blue-300 bg-blue-900/20 p-1 rounded text-xs">
                    📝 {code.memo.length > 30 ? code.memo.substring(0, 30) + '...' : code.memo}
                  </div>
                )}
                {code.boundIP && (
                  <div className="font-mono">IP: {code.boundIP.substring(0, 12)}...</div>
                )}
                {code.lastUsed && (
                  <div>마지막: {code.lastUsed.toLocaleTimeString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 통계 요약 */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-900/20 p-2 rounded border border-green-700">
              <div className="text-green-300">총 크레딧</div>
              <div className="text-lg font-bold text-white">
                {creditStatus.reduce((sum, code) => sum + code.totalCredits, 0)}
              </div>
            </div>
            <div className="bg-yellow-900/20 p-2 rounded border border-yellow-700">
              <div className="text-yellow-300">남은 크레딧</div>
              <div className="text-lg font-bold text-white">
                {creditStatus.reduce((sum, code) => sum + code.remainingCredits, 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <div>⚡ 3초마다 자동 업데이트</div>
          <div className="mt-1">🔒 관리자 전용</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdminPanel;