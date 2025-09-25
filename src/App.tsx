import { useEffect, useState } from 'react';
import { useAppStore } from './stores/appStore';
import Header from './components/Header';
import TeamSelection from './components/TeamSelection';
import BanPickInterface from './components/BanPickInterface';
import AnalysisPanel from './components/AnalysisPanel';
import FearlessSetSelector from './components/FearlessSetSelector';
import AdminPanel from './components/AdminPanel';
import SidebarAdminPanel from './components/SidebarAdminPanel';

function App() {
  const { currentPhase, startAutoUpdate } = useAppStore();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSidebarAdminPanel, setShowSidebarAdminPanel] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 앱 시작 시 자동 업데이트 시작 (인증 불필요)
    startAutoUpdate();
    console.log('🎮 롤 밴픽 분석기 시작 - 누구나 이용 가능!');
    
    // 관리자 IP 확인
    checkAdminStatus();
  }, [startAutoUpdate]);

  const checkAdminStatus = async () => {
    try {
      // 서버 API를 통해 IP 확인
      const response = await fetch('/api/check-admin');
      const data = await response.json();
      setIsAdmin(data.isAdmin);
      
      if (data.isAdmin) {
        setShowSidebarAdminPanel(true);
        console.log('👑 관리자 권한 감지 - 사이드바 패널 자동 표시');
      }
    } catch (error) {
      // API 오류 시 일반 사용자로 처리
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 관리자 패널이 이미 열려있으면 무시
      if (showAdminPanel) return;

      const secretSequence = ['KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'];
      
      if (e.ctrlKey && e.shiftKey) {
        setKeySequence(prev => {
          const newSequence = [...prev, e.code];
          
          // 최근 5개 키만 유지
          if (newSequence.length > 5) {
            newSequence.shift();
          }
          
          // 비밀 키 조합이 맞으면 관리자 패널 열기
          if (newSequence.length === 5 && 
              newSequence.every((key, index) => key === secretSequence[index])) {
            setShowAdminPanel(true);
            console.log('🔑 관리자 패널 활성화됨');
            return [];
          }
          
          return newSequence;
        });
      } else {
        // Ctrl+Shift가 아니면 시퀀스 초기화
        setKeySequence([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAdminPanel, keySequence]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lol-blue via-slate-900 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentPhase === 'SETUP' && <TeamSelection />}
        {currentPhase === 'BANPICK' && (
          <>
            <FearlessSetSelector />
            <BanPickInterface />
          </>
        )}
        {currentPhase === 'ANALYSIS' && <AnalysisPanel />}
      </main>
      
      <footer className="text-center py-8 text-gray-400 border-t border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <p>&copy; 2025 토미의 기록실 - 롤 구도 분석기 (공개 버전)</p>
          
          {/* 텔레그램 문의 배너 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg shadow-lg">
            <p className="text-white font-semibold text-lg">
              📞 문의사항이 있으시면 텔레그램 <span className="text-yellow-300">@sora71</span> 문의주세요
            </p>
          </div>
        </div>
      </footer>

      {/* 관리자 패널 (비밀키 조합으로만 접근) */}
      <AdminPanel 
        isVisible={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
      
      {/* 사이드바 관리자 패널 (관리자 IP만) */}
      {isAdmin && (
        <SidebarAdminPanel 
          isVisible={showSidebarAdminPanel}
          onClose={() => setShowSidebarAdminPanel(false)}
        />
      )}
    </div>
  );
}

export default App;