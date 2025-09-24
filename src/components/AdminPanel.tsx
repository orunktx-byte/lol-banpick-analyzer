import React, { useState, useEffect } from 'react';
import { CreditManager, AUTH_CODES } from '../utils/creditManager';
import { MemoManager } from '../utils/memoManager';
import { CodeGenerator } from '../utils/codeGenerator';
import { AdminPermission } from '../utils/adminPermission';

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

type TabType = 'status' | 'memo' | 'generator';

const AdminPanel: React.FC<AdminPanelProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [creditStatus, setCreditStatus] = useState<any[]>([]);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');
  const [newCredits, setNewCredits] = useState<number>(10);
  const [customCode, setCustomCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadCreditStatus();
    }
  }, [isVisible]);

  const loadCreditStatus = () => {
    const status = AUTH_CODES.map(authCode => {
      const sessionData = localStorage.getItem(`session_${authCode.code}`);
      const usedCredits = sessionData ? JSON.parse(sessionData).usedCredits || 0 : 0;
      const memo = MemoManager.getMemo(authCode.code);
      
      return {
        code: authCode.code,
        description: authCode.description,
        totalCredits: authCode.totalCredits,
        usedCredits,
        remainingCredits: authCode.totalCredits - usedCredits,
        usagePercentage: ((usedCredits / authCode.totalCredits) * 100).toFixed(1),
        memo: memo || ''
      };
    });
    setCreditStatus(status);
  };

  const handleEditMemo = (code: string) => {
    const memo = MemoManager.getMemo(code);
    setMemoText(memo || '');
    setEditingMemo(code);
  };

  const handleSaveMemo = (code: string) => {
    MemoManager.saveMemo(code, memoText);
    setEditingMemo(null);
    setMemoText('');
    loadCreditStatus();
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const result = CodeGenerator.generateQuickCode(newCredits);
      setGeneratedCode(result);
      loadCreditStatus();
    } catch (error) {
      alert('코드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetCode = (code: string) => {
    if (!AdminPermission.requireAdmin('코드 초기화')) return;
    
    if (confirm(`${code} 코드의 사용량을 초기화하시겠습니까?`)) {
      localStorage.removeItem(`session_${code}`);
      loadCreditStatus();
    }
  };

  const handleResetAllCodes = () => {
    if (!AdminPermission.requireAdmin('전체 코드 초기화')) return;
    
    if (confirm('⚠️ 모든 코드의 사용량을 초기화하시겠습니까?\n(영구 관리자 권한은 유지됩니다)')) {
      // session_ 으로 시작하는 모든 키를 찾아서 삭제
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('session_')) {
          keysToRemove.push(key);
        }
      }
      
      // 찾은 키들 삭제 (영구 관리자 권한은 보호)
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      alert(`✅ ${keysToRemove.length}개 코드의 사용량이 초기화되었습니다!`);
      loadCreditStatus();
    }
  };

  const handleRevokePermanentAdmin = () => {
    if (confirm('🚨 영구 관리자 권한을 해제하시겠습니까?\n이후 다시 SHOWADMIN을 입력해야 합니다.')) {
      localStorage.removeItem('permanentAdminAccess');
      alert('✅ 영구 관리자 권한이 해제되었습니다.');
      // 페이지 새로고침으로 상태 업데이트
      window.location.reload();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-full overflow-hidden border border-gray-700">
        {/* 디버그 정보 */}
        <div className="bg-yellow-900/20 p-2 text-xs text-yellow-300 border-b border-yellow-800 flex justify-between items-center">
          <div>
            현재 세션: {JSON.stringify(CreditManager.getSession())} | 
            관리자 권한: {AdminPermission.isAdmin() ? '✅' : '❌'} |
            영구 관리자: {localStorage.getItem('permanentAdminAccess') === 'true' ? '✅' : '❌'}
          </div>
          {localStorage.getItem('permanentAdminAccess') === 'true' && (
            <button
              onClick={handleRevokePermanentAdmin}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            >
              영구 권한 해제
            </button>
          )}
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-purple-900 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">🛡️ 관리자 패널</h2>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
              ADMIN ONLY
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 px-6 border-b border-gray-700">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'status'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📊 크레딧 현황
            </button>
            <button
              onClick={() => setActiveTab('memo')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'memo'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📝 메모 관리
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'generator'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              🎲 코드 생성
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* 크레딧 현황 탭 */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">📊 전체 코드 현황</h3>
              
              {/* 전체 초기화 버튼 */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleResetAllCodes}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-medium"
                >
                  🗑️ 모든 코드 초기화
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">코드</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">설명</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">크레딧</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {creditStatus.map((code) => (
                        <tr key={code.code} className="hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <span className="font-mono font-bold text-white">{code.code}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{code.description}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400 font-bold">{code.remainingCredits}</span>
                              <span className="text-gray-500">/</span>
                              <span className="text-gray-400">{code.totalCredits}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleResetCode(code.code)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              초기화
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 메모 관리 탭 */}
          {activeTab === 'memo' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">📝 코드별 메모 관리</h3>
              
              {editingMemo && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {editingMemo} 코드 메모 편집
                  </h4>
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    placeholder="이 코드에 대한 메모를 입력하세요..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    rows={3}
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleSaveMemo(editingMemo)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingMemo(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {creditStatus.map((code) => (
                  <div key={code.code} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-mono font-bold text-white">{code.code}</h4>
                        <p className="text-sm text-gray-400">{code.description}</p>
                        <p className="text-sm text-gray-300 mt-1">
                          {code.memo || '메모 없음'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditMemo(code.code)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        편집
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 코드 생성 탭 */}
          {activeTab === 'generator' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">🎲 랜덤 코드 생성기</h3>
              
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4">새 코드 생성</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      크레딧 수
                    </label>
                    <input
                      type="number"
                      value={newCredits}
                      onChange={(e) => setNewCredits(parseInt(e.target.value))}
                      min="1"
                      max="999"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      커스텀 코드 (선택사항)
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="비워두면 랜덤 생성"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  
                  <button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded"
                  >
                    {isGenerating ? '생성 중...' : '코드 생성'}
                  </button>
                </div>

                {generatedCode && (
                  <div className="mt-4 p-4 bg-green-900/30 rounded border border-green-700">
                    <h5 className="text-green-300 font-semibold mb-2">생성된 코드:</h5>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-700 px-3 py-2 rounded font-mono text-white">
                        {generatedCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedCode)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;