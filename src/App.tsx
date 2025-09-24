import { useEffect, useState } from 'react';
import { useAppStore } from './stores/appStore';
import Header from './components/Header';
import TeamSelection from './components/TeamSelection';
import BanPickInterface from './components/BanPickInterface';
import AnalysisPanel from './components/AnalysisPanel';
import FearlessSetSelector from './components/FearlessSetSelector';
import AuthModal from './components/AuthModal';
import CreditDisplay from './components/CreditDisplay';
import AdminPanel from './components/AdminPanel';
import SidebarAdminPanel from './components/SidebarAdminPanel';
import { CreditManager } from './utils/creditManager';

function App() {
  const { currentPhase, startAutoUpdate } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSidebarAdminPanel, setShowSidebarAdminPanel] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    // 영구 관리자 권한이 있는 경우 자동 인증
    const permanentAdmin = localStorage.getItem('permanentAdminAccess') === 'true';
    const authToken = localStorage.getItem('authToken');
    
    if (permanentAdmin && authToken === 'verified') {
      console.log('🔑 영구 관리자 권한으로 자동 로그인');
      setIsAuthenticated(true);
      setShowAuthModal(false);
      return;
    }
    
    // 일반 사용자의 경우 기존 세션 확인
    const existingSession = CreditManager.getSession();
    if (existingSession && existingSession.remainingCredits > 0 && authToken === 'verified') {
      console.log('🔄 기존 세션 복원');
      setIsAuthenticated(true);
      setShowAuthModal(false);
      return;
    }
    
    // 유효한 세션이 없으면 로그인 요구
    CreditManager.clearSession();
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setShowAuthModal(true);
    console.log('🔐 새로운 로그인이 필요합니다');
  }, []);

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
    </div>
  );
}

export default App;