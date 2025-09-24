import React, { useState, useEffect } from 'react';
import { CreditManager } from '../utils/creditManager';

interface AuthModalProps {
  isOpen: boolean;
  onAuth: (success: boolean) => void;
  onAdminPanelToggle?: (show: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onAuth, onAdminPanelToggle }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const MAX_ATTEMPTS = 3;
  const ADMIN_PANEL_CODE = 'SHOWADMIN'; // 관리자 패널 활성화 코드

  useEffect(() => {
    // 차단 상태 확인
    const blockUntil = localStorage.getItem('authBlockUntil');
    if (blockUntil && new Date().getTime() < parseInt(blockUntil)) {
      setIsBlocked(true);
      const timeLeft = Math.ceil((parseInt(blockUntil) - new Date().getTime()) / 1000 / 60);
      setError(`너무 많은 시도로 인해 ${timeLeft}분간 차단되었습니다.`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) return;

    // 관리자 패널 활성화 코드 확인
    if (inputCode === ADMIN_PANEL_CODE) {
      console.log('🔓 관리자 패널 활성화됨');
      if (onAdminPanelToggle) {
        onAdminPanelToggle(true);
      }
      setError('관리자 패널이 활성화되었습니다!');
      setInputCode('');
      return;
    }

    // 크레딧 시스템으로 인증
    const authCode = CreditManager.validateCode(inputCode);
    
    if (authCode) {
      try {
        // IP 바인딩이 포함된 새로운 세션 시작
        const result = await CreditManager.startSessionWithIP(authCode);
        
        if (result.success && result.session) {
          if (result.session.remainingCredits > 0) {
            localStorage.setItem('authToken', 'verified');
            localStorage.removeItem('authAttempts');
            localStorage.removeItem('authBlockUntil');
            setError('');
            console.log(`🎉 인증 성공! ${authCode.description} - ${result.session.remainingCredits}크레딧 사용 가능`);
            onAuth(true);
          } else {
            setError('이 코드의 크레딧이 모두 소진되었습니다.');
            setInputCode('');
          }
        } else {
          // IP 바인딩 오류 또는 기타 세션 시작 오류
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          localStorage.setItem('authAttempts', newAttempts.toString());

          if (newAttempts >= MAX_ATTEMPTS) {
            // 3번 실패 시 30분 차단
            const blockTime = new Date().getTime() + (30 * 60 * 1000);
            localStorage.setItem('authBlockUntil', blockTime.toString());
            setIsBlocked(true);
            setError('너무 많은 시도로 인해 30분간 차단되었습니다.');
          } else {
            setError(result.error || `세션 시작 오류 (${newAttempts}/${MAX_ATTEMPTS})`);
          }
          
          setInputCode('');
        }
      } catch (error) {
        // 네트워크 오류 등
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('authAttempts', newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
          const blockTime = new Date().getTime() + (30 * 60 * 1000);
          localStorage.setItem('authBlockUntil', blockTime.toString());
          setIsBlocked(true);
          setError('너무 많은 시도로 인해 30분간 차단되었습니다.');
        } else {
          setError(`네트워크 오류가 발생했습니다. (${newAttempts}/${MAX_ATTEMPTS})`);
        }
        
        setInputCode('');
      }
    } else {
      // 인증 실패
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('authAttempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        // 3번 실패 시 30분 차단
        const blockTime = new Date().getTime() + (30 * 60 * 1000);
        localStorage.setItem('authBlockUntil', blockTime.toString());
        setIsBlocked(true);
        setError('3번 실패하여 30분간 차단되었습니다.');
      } else {
        setError(`잘못된 인증 코드입니다. (${newAttempts}/${MAX_ATTEMPTS})`);
      }
      setInputCode('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-600">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold text-white mb-2">크레딧 인증</h2>
          <p className="text-gray-300">
            LoL 밴픽 분석기에 접근하려면<br />
            크레딧 코드를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              크레딧 코드 (6-8자리)
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent text-center text-lg 
                         font-mono tracking-widest"
              placeholder="크레딧 코드 입력"
              maxLength={10}
              disabled={isBlocked}
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && (
            <div className={`text-sm text-center p-3 rounded-lg border ${
              error.includes('활성화') 
                ? 'text-green-400 bg-green-900/20 border-green-700'
                : 'text-red-400 bg-red-900/20 border-red-700'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBlocked || inputCode.length < 5}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                       text-white font-bold py-3 px-4 rounded-lg transition-colors
                       disabled:cursor-not-allowed"
          >
            {isBlocked ? '차단됨' : '인증하기'}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
          <p>• 유효한 크레딧 코드를 입력해주세요</p>
          <p>• 구도분석 1회당 1크레딧이 소모됩니다</p>
          <p>• 크레딧이 0이 되면 접근이 차단됩니다</p>
          <p>• 3번 실패 시 30분간 차단됩니다</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;