import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import Header from './components/Header';
import TeamSelection from './components/TeamSelection';
import BanPickInterface from './components/BanPickInterface';
import AnalysisPanel from './components/AnalysisPanel';
import FearlessSetSelector from './components/FearlessSetSelector';

function App() {
  const { currentPhase, startAutoUpdate } = useAppStore();

  useEffect(() => {
    // 앱 시작 시 자동 업데이트 시작
    startAutoUpdate();
    
    return () => {
      // 컴포넌트 언마운트 시 자동 업데이트 중지
      // stopAutoUpdate();
    };
  }, [startAutoUpdate]);

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
        <p>&copy; 2025 토미의 기록실 - 롤 구도 분석기</p>
      </footer>
    </div>
  );
}

export default App;
