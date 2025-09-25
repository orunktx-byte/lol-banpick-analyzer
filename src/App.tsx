import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import Header from './components/Header';
import TeamSelection from './components/TeamSelection';
import BanPickInterface from './components/BanPickInterface';
import AnalysisPanel from './components/AnalysisPanel';
import FearlessSetSelector from './components/FearlessSetSelector';
import PublicChatComponent from './components/PublicChatComponent';
function App() {
  const { currentPhase, startAutoUpdate } = useAppStore();

  useEffect(() => {
    // 앱 시작 시 자동 업데이트 시작 (인증 불필요)
    startAutoUpdate();
    console.log('🎮 롤 밴픽 분석기 시작 - 누구나 이용 가능!');
  }, [startAutoUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lol-blue via-slate-900 to-gray-900">
      <Header />
      
      {/* 상단 텔레그램 문의 배너 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-semibold text-lg">
            텔레그램 <span className="text-yellow-300">@sora71</span>
          </p>
        </div>
      </div>
      
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
              텔레그램 <span className="text-yellow-300">@sora71</span>
            </p>
          </div>
        </div>
      </footer>

      {/* 공개 채팅 컴포넌트 */}
      <PublicChatComponent />
    </div>
  );
}

export default App;