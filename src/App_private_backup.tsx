import { useEffect, useState } from 'react';
import { useAppStore } from './stores/appStore';
import Header from './components/Header';
import TeamSelection from './components/TeamSelection';
import BanPickInterface from './components/BanPickInterface';
import AnalysisPanel from './components/AnalysisPanel';
import FearlessSetSelector from './components/FearlessSetSelector';
import AdminPanel from './components/AdminPanel';
import SidebarAdminPanel from './components/SidebarAdminPanel';
import ChatComponent from './components/ChatComponent';

function App() {
  const { currentPhase, startAutoUpdate } = useAppStore();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSidebarAdminPanel, setShowSidebarAdminPanel] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  // 관리자 IP 확인 (실제 IP는 환경에 맞게 설정)
  const ADMIN_IPS = ['자신의IP주소']; // 실제 관리자 IP로 변경 필요
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 앱 시작 시 자동 업데이트 시작 (인증 불필요)
    startAutoUpdate();
    console.log('🎮 롤 밴픽 분석기 시작 - 누구나 이용 가능!');
    
    // 관리자 IP 확인 (실제 구현에서는 서버에서 확인)
    checkAdminStatus();
  }, [startAutoUpdate]);

  const checkAdminStatus = async () => {
    try {
      // 실제 구현에서는 서버 API를 통해 IP 확인
      const response = await fetch('/api/check-admin');
      const data = await response.json();
      setIsAdmin(data.isAdmin);
      
      if (data.isAdmin) {
        setShowSidebarAdminPanel(true);
        console.log('👑 관리자 권한 감지 - 사이드바 패널 자동 표시');
      }
    } catch (error) {
      // 로컬에서는 임시로 모든 사용자를 일반 사용자로 처리
      setIsAdmin(false);
    }
  };

  // 비밀 키 조합 감지 (Ctrl + Shift + A + D + M + I + N)
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

  useEffect(() => {
    if (isAuthenticated) {
      // 인증 완료 후 앱 시작 시 자동 업데이트 시작
      startAutoUpdate();
      
      // ADMIN999 또는 영구 관리자 권한이 있으면 사이드바 패널 자동 표시
      const session = CreditManager.getSession();
      const permanentAdmin = localStorage.getItem('permanentAdminAccess') === 'true';
      
      if (session?.code === 'ADMIN999' || permanentAdmin) {
        setShowSidebarAdminPanel(true);
        console.log('👑 관리자 권한 감지 - 사이드바 패널 자동 표시');
      }
      
      // 크레딧 상태를 주기적으로 확인하여 자동 로그아웃
      const creditCheckInterval = setInterval(() => {
        const session = CreditManager.getSession();
        if (!session || session.remainingCredits <= 0) {
          console.log('💳 크레딧 소진으로 자동 로그아웃');
          CreditManager.clearSession();
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setShowAuthModal(true);
          clearInterval(creditCheckInterval);
        }
      }, 3000); // 3초마다 체크
      
      return () => {
        clearInterval(creditCheckInterval);
      };
    }
  }, [isAuthenticated, startAutoUpdate]);

  const handleAuth = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
    }
  };

  const handleAdminPanelToggle = (show: boolean) => {
    setShowSidebarAdminPanel(show);
    console.log('🎛️ 사이드바 관리자 패널 토글:', show);
  };

  // 인증되지 않은 상태라면 인증 모달만 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lol-blue via-slate-900 to-gray-900">
        <AuthModal 
          isOpen={showAuthModal} 
          onAuth={handleAuth}
          onAdminPanelToggle={handleAdminPanelToggle}
        />
        {/* 관리자 패널은 로그인 안 한 상태에서도 사용 가능 */}
        <AdminPanel 
          isVisible={showAdminPanel} 
          onClose={() => setShowAdminPanel(false)} 
        />
        {/* 사이드바 관리자 패널 */}
        <SidebarAdminPanel 
          isVisible={showSidebarAdminPanel}
          onClose={() => setShowSidebarAdminPanel(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lol-blue via-slate-900 to-gray-900">
      <Header />
      <CreditDisplay />
      
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
        <p>&copy; 2025 토미의 기록실 - 롤 구도 분석기</p>
      </footer>

      {/* 관리자 패널 */}
      <AdminPanel 
        isVisible={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
      
      {/* 사이드바 관리자 패널 */}
      <SidebarAdminPanel 
        isVisible={showSidebarAdminPanel}
        onClose={() => setShowSidebarAdminPanel(false)}
      />
      
      {/* 실시간 채팅 */}
      <ChatComponent />
    </div>
  );
}

export default App;