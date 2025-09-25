import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';

const Header = () => {
  const { livePatchVersion, tournamentPatchVersion, fetchPatchVersions, updateRoster } = useAppStore();
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [sessionId] = useState<string>(() => 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    // 컴포넌트 마운트 시 패치 버전 가져오기
    fetchPatchVersions();
    
    // 로스터 초기 업데이트
    updateRoster('LCK');
    
    // 10분마다 패치 버전 업데이트
    const interval = setInterval(() => {
      fetchPatchVersions();
      setLastUpdate(new Date().toLocaleTimeString());
    }, 10 * 60 * 1000);
    
    // 30분마다 로스터 업데이트
    const rosterInterval = setInterval(() => {
      updateRoster('LCK');
      updateRoster('LPL');
      updateRoster('LEC');
    }, 30 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(rosterInterval);
    };
  }, [fetchPatchVersions, updateRoster]);

  // 방문자 수 추적
  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitors/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, action: 'heartbeat' })
        });
        const data = await response.json();
        setVisitorCount(data.visitorCount);
      } catch (error) {
        console.error('방문자 수 업데이트 오류:', error);
      }
    };

    // 초기 등록
    updateVisitorCount();
    
    // 15초마다 하트비트
    const visitorInterval = setInterval(updateVisitorCount, 15000);
    
    // 페이지 종료 시 방문자 제거
    const handleBeforeUnload = () => {
      fetch('/api/visitors/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'leave' }),
        keepalive: true
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(visitorInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [sessionId]);

  return (
    <header className="bg-lol-light-blue border-b-2 border-lol-gold shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* 로고 및 타이틀 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-lol-gold rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">토</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white text-shadow">
                토미의 기록실
              </h1>
              <p className="text-lol-gold text-sm">League of Legends 구도 분석기</p>
            </div>
            
            {/* Header 내 텔레그램 문의 배너 */}
            <div className="ml-8 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-white font-semibold text-sm">
                텔레그램 <span className="text-yellow-300">@sora71</span>
              </p>
            </div>
          </div>

          {/* 패치 버전 정보 및 방문자 수 */}
          <div className="flex items-center space-x-6">
            {/* 실시간 방문자 수 */}
            <div className="text-right">
              <div className="text-sm text-gray-300">접속자</div>
              <div className="text-xl font-bold text-orange-400">👥 {visitorCount}</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-right">
              <div className="text-sm text-gray-300">라이브 패치</div>
              <div className="text-xl font-bold text-green-400">{livePatchVersion}</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-right">
              <div className="text-sm text-gray-300">대회 패치</div>
              <div className="text-xl font-bold text-blue-400">{tournamentPatchVersion}</div>
            </div>
            {lastUpdate && (
              <>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">마지막 업데이트</div>
                  <div className="text-sm text-gray-300">{lastUpdate}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;