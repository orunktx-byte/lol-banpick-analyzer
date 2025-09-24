import React, { useState, useEffect } from 'react';
import { CreditManager } from '../utils/creditManager';

const CreditDisplay: React.FC = () => {
  const [creditStats, setCreditStats] = useState(CreditManager.getCreditStats());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 크레딧 상태 업데이트 함수
    const updateCredits = () => {
      setCreditStats(CreditManager.getCreditStats());
    };

    // 초기 로드
    updateCredits();

    // 정기적으로 크레딧 상태 확인 (5초마다)
    const interval = setInterval(updateCredits, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!creditStats) return null;

  const getStatusColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💳</span>
            <span className="text-white font-semibold">크레딧</span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            {showDetails ? '🔽' : '🔼'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">남은 크레딧:</span>
            <span className={`font-bold text-lg ${getStatusColor(creditStats.remaining, creditStats.total)}`}>
              {creditStats.remaining}
            </span>
          </div>

          {/* 진행률 바 */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(creditStats.remaining, creditStats.total)}`}
              style={{ width: `${(creditStats.remaining / creditStats.total) * 100}%` }}
            ></div>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-600 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">전체:</span>
                <span className="text-gray-300">{creditStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">사용:</span>
                <span className="text-gray-300">{creditStats.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">사용률:</span>
                <span className="text-gray-300">{creditStats.percentage}%</span>
              </div>
            </div>
          )}

          {creditStats.remaining <= 5 && creditStats.remaining > 0 && (
            <div className="mt-2 text-xs text-yellow-400 text-center bg-yellow-900/20 p-2 rounded border border-yellow-700">
              ⚠️ 크레딧이 부족합니다!
            </div>
          )}

          {creditStats.remaining === 0 && (
            <div className="mt-2 text-xs text-red-400 text-center bg-red-900/20 p-2 rounded border border-red-700">
              🚫 크레딧이 모두 소진되었습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditDisplay;