import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';
import { getPlayersByTeam } from '../data/players';
import { getChampionById } from '../data/champions';
import ChampionSearch from './ChampionSearch';
import { getChampionImageWithFallback } from '../utils/imageUtils';

// 분석 히스토리 타입 정의
interface AnalysisHistory {
  id: string;
  timestamp: Date;
  type: 'betting' | 'banpick';
  teams: {
    blue: string;
    red: string;
  };
  settings?: {
    killHandicap?: string;
    totalKillsOverUnder?: string;
  };
  result: string;
}

const BanPickInterface = () => {
  const { 
    matchState, 
    fearlessMatch,
    matchMode,
    resetMatch, 
    resetFearlessMatch,
    selectChampion, 
    generateRandomSample 
  } = useAppStore();
  
  const [isChampionSearchOpen, setIsChampionSearchOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'BAN' | 'PICK' | null>(null);
  const [currentTeamSide, setCurrentTeamSide] = useState<'BLUE' | 'RED' | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // 기준 정보 상태 (기본값 설정)
  const [killHandicap, setKillHandicap] = useState<string>('8');
  const [totalKillsOverUnder, setTotalKillsOverUnder] = useState<string>('30');

  // 분석 히스토리 상태
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 타입 안전성을 위한 임시 처리
  const currentGame = matchMode === 'FEARLESS' 
    ? (fearlessMatch?.sets[fearlessMatch.currentSet]?.game as any)
    : (matchState?.currentGame as any);
    
  const blueTeam = getTeamById(currentGame?.blueTeam?.teamId || currentGame?.blueTeamId || '');
  const redTeam = getTeamById(currentGame?.redTeam?.teamId || currentGame?.redTeamId || '');
  
  const bluePlayers = blueTeam ? getPlayersByTeam(blueTeam.id) : [];
  const redPlayers = redTeam ? getPlayersByTeam(redTeam.id) : [];

  const handleBanClick = (teamSide: 'BLUE' | 'RED', position: number) => {
    setCurrentAction('BAN');
    setCurrentTeamSide(teamSide);
    setCurrentPosition(position);
    setIsChampionSearchOpen(true);
  };

  const handlePickClick = (teamSide: 'BLUE' | 'RED', position: number) => {
    setCurrentAction('PICK');
    setCurrentTeamSide(teamSide);
    setCurrentPosition(position);
    setIsChampionSearchOpen(true);
  };

  const handleChampionSelect = (championId: string) => {
    if (currentAction && currentTeamSide && currentPosition !== null) {
      selectChampion(
        championId,
        currentAction,
        currentTeamSide,
        currentPosition
      );
    }
    setIsChampionSearchOpen(false);
    setCurrentAction(null);
    setCurrentTeamSide(null);
    setCurrentPosition(null);
  };

  // 기준 정보 분석 함수
  const handleBettingAnalysis = async () => {
    if (!blueTeam || !redTeam) {
      alert('팀이 선택되지 않았습니다.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const payload = {
        blueTeam: {
          name: blueTeam.name,
          shortName: blueTeam.shortName,
          picks: currentGame?.blueTeam?.picks?.map((pick: any) => pick ? pick.name : null).filter(Boolean) || [],
          bans: currentGame?.blueTeam?.bans?.map((ban: any) => ban ? ban.name : null).filter(Boolean) || []
        },
        redTeam: {
          name: redTeam.name,
          shortName: redTeam.shortName,
          picks: currentGame?.redTeam?.picks?.map((pick: any) => pick ? pick.name : null).filter(Boolean) || [],
          bans: currentGame?.redTeam?.bans?.map((ban: any) => ban ? ban.name : null).filter(Boolean) || []
        },
        settings: {
          killHandicap: killHandicap,
          totalKillsOverUnder: totalKillsOverUnder
        },
        metadata: {
          timestamp: new Date().toISOString(),
          gameType: 'fearless_draft_bo5',
          requestType: 'betting_analysis'
        }
      };

      console.log('Sending betting analysis request:', payload);

      const response = await fetch('https://orunktx.app.n8n.cloud/webhook-test/betting-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      setAnalysisResult(result);
      setShowAnalysisModal(true);

      // 분석 히스토리에 저장
      const newHistoryItem: AnalysisHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'betting',
        teams: {
          blue: blueTeam.name,
          red: redTeam.name
        },
        settings: {
          killHandicap,
          totalKillsOverUnder
        },
        result
      };

      setAnalysisHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // 최대 10개까지만 저장

    } catch (error) {
      console.error('Betting analysis error:', error);
      alert(`분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (matchMode === 'FEARLESS') {
      resetFearlessMatch();
    } else {
      resetMatch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            밴픽 시뮬레이터
          </h1>
          <div className="text-lg text-gray-300">
            {matchMode === 'FEARLESS' ? 'Fearless Draft BO5' : 'Classic Draft'}
          </div>
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 블루팀 */}
          <div className="card team-card-blue">
            <h3 className="text-xl font-bold text-team-blue mb-4 text-center">
              {blueTeam?.name}
            </h3>
            
            {/* 밴 슬롯들 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">밴</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                    onClick={() => handleBanClick('BLUE', index)}
                  >
                    {currentGame?.blueTeam?.bans?.[index] && (
                      <img
                        src={getChampionImageWithFallback(currentGame?.blueTeam?.bans?.[index]).src}
                        alt={currentGame?.blueTeam?.bans?.[index]?.name || getChampionById(currentGame?.blueTeam?.bans?.[index]?.id)?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (currentGame.blueTeam.bans[index]) {
                            const fallback = getChampionImageWithFallback(currentGame.blueTeam.bans[index]).fallback;
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }
                        }}
                      />
                    )}
                    {!currentGame.blueTeam.bans[index] && (
                      <div className="text-xs text-gray-400 text-center">
                        밴 {index + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 픽 슬롯들 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">픽</h4>
              <div className="space-y-2">
                {['탑', '정글', '미드', '원딜', '서포터'].map((position, index) => (
                  <div key={position} className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                      onClick={() => handlePickClick('BLUE', index)}
                    >
                      {currentGame.blueTeam.picks[index] && (
                        <img
                          src={getChampionImageWithFallback(currentGame.blueTeam.picks[index]).src}
                          alt={currentGame.blueTeam.picks[index].name || getChampionById(currentGame.blueTeam.picks[index].id)?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (currentGame.blueTeam.picks[index]) {
                              const fallback = getChampionImageWithFallback(currentGame.blueTeam.picks[index]).fallback;
                              if (target.src !== fallback) {
                                target.src = fallback;
                              }
                            }
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-400 font-medium">{position}</div>
                      <div className="text-xs text-gray-400">{bluePlayers[index]?.nickname}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 중앙 컨트롤 */}
          <div className="card text-center">
            <h3 className="text-xl font-bold text-white mb-6">게임 컨트롤</h3>
            
            <div className="space-y-6">
              <div className="text-sm text-gray-300">
                현재 단계: <span className="text-lol-gold font-semibold">밴픽 진행 중</span>
              </div>
              
              {/* 메인 구도 분석 버튼 */}
              <button
                onClick={handleBettingAnalysis}
                disabled={isAnalyzing || currentGame.blueTeam.picks.length < 5 || currentGame.redTeam.picks.length < 5}
                className="w-full py-4 px-6 bg-gradient-to-r from-lol-gold to-yellow-500 text-black font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200 shadow-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>AI 분석 중...</span>
                  </div>
                ) : (
                  '🎯 구도 분석 시작'
                )}
              </button>
              
              <div className="text-xs text-gray-400 px-2">
                📊 기준 정보가 포함된 종합 구도 분석
              </div>

              {/* 분석 기록 버튼 */}
              <button
                onClick={() => setShowHistoryModal(true)}
                className="w-full bg-gray-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>분석 기록 보기 ({analysisHistory.length})</span>
              </button>
              
              {/* 유틸리티 버튼들 */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => generateRandomSample()}
                  className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  랜덤 샘플 생성
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  매치 초기화
                </button>
              </div>

              {/* 기준 정보 입력 섹션 */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h4 className="text-lg font-bold text-lol-gold text-center">기준 정보</h4>
                
                {/* 킬수 핸디캡 */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300 text-left">
                    킬수 핸디캡 ({blueTeam?.shortName || 'Blue'} 기준)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={killHandicap}
                      onChange={(e) => setKillHandicap(e.target.value)}
                      placeholder="+3 또는 -2"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-lol-gold"
                    />
                    <span className="text-xs text-gray-400">킬</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    예: +3 (블루팀이 3킬 많이), -2 (블루팀이 2킬 적게)
                  </div>
                </div>

                {/* 양팀 총 킬합 위/아래 */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300 text-left">
                    양팀 총 킬합 위/아래
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={totalKillsOverUnder}
                      onChange={(e) => setTotalKillsOverUnder(e.target.value)}
                      placeholder="32.5"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-lol-gold"
                    />
                    <span className="text-xs text-gray-400">킬</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    예: 32.5 (양팀 총합이 32.5킬 위/아래)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 레드팀 */}
          <div className="card team-card-red">
            <h3 className="text-xl font-bold text-team-red mb-4 text-center">
              {redTeam?.name}
            </h3>
            
            {/* 밴 슬롯들 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">밴</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 border-2 border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                    onClick={() => handleBanClick('RED', index)}
                  >
                    {currentGame.redTeam.bans[index] && (
                      <img
                        src={getChampionImageWithFallback(currentGame.redTeam.bans[index]).src}
                        alt={currentGame.redTeam.bans[index].name || getChampionById(currentGame.redTeam.bans[index].id)?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (currentGame.redTeam.bans[index]) {
                            const fallback = getChampionImageWithFallback(currentGame.redTeam.bans[index]).fallback;
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }
                        }}
                      />
                    )}
                    {!currentGame.redTeam.bans[index] && (
                      <div className="text-xs text-gray-400 text-center">
                        밴 {index + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 픽 슬롯들 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">픽</h4>
              <div className="space-y-2">
                {['탑', '정글', '미드', '원딜', '서포터'].map((position, index) => (
                  <div key={position} className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 bg-gray-800 border-2 border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                      onClick={() => handlePickClick('RED', index)}
                    >
                      {currentGame.redTeam.picks[index] && (
                        <img
                          src={getChampionImageWithFallback(currentGame.redTeam.picks[index]).src}
                          alt={currentGame.redTeam.picks[index].name || getChampionById(currentGame.redTeam.picks[index].id)?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (currentGame.redTeam.picks[index]) {
                              const fallback = getChampionImageWithFallback(currentGame.redTeam.picks[index]).fallback;
                              if (target.src !== fallback) {
                                target.src = fallback;
                              }
                            }
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-red-400 font-medium">{position}</div>
                      <div className="text-xs text-gray-400">{redPlayers[index]?.nickname}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 챔피언 검색 모달 */}
        {isChampionSearchOpen && (
          <ChampionSearch
            onChampionSelect={handleChampionSelect}
            onClose={() => setIsChampionSearchOpen(false)}
            actionType={currentAction}
            teamSide={currentTeamSide}
          />
        )}

        {/* 분석 결과 모달 */}
        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">🎯 구도 분석 결과</h3>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap">{analysisResult}</div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-6 py-2 bg-lol-gold text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 분석 히스토리 모달 */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">📋 분석 기록</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {analysisHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  아직 분석 기록이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisHistory.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400">{item.teams.blue}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-red-400">{item.teams.red}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.timestamp.toLocaleString()}
                        </div>
                      </div>
                      
                      {item.settings && (
                        <div className="text-xs text-gray-400 mb-2">
                          킬 핸디캡: {item.settings.killHandicap} | 총 킬합: {item.settings.totalKillsOverUnder}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-300 mb-3 max-h-32 overflow-y-auto">
                        {item.result.substring(0, 200)}...
                      </div>
                      
                      <button
                        onClick={() => {
                          setAnalysisResult(item.result);
                          setShowHistoryModal(false);
                          setShowAnalysisModal(true);
                        }}
                        className="text-xs bg-lol-gold text-black px-3 py-1 rounded hover:bg-yellow-400 transition-colors"
                      >
                        전체 보기
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BanPickInterface;