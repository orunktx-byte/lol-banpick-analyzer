import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';
import { getPlayersByTeam } from '../data/players';
import { getChampionById } from '../data/champions';
import ChampionSearch from './ChampionSearch';
import { getChampionImageWithFallback } from '../utils/imageUtils';

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
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>('https://orunktx.app.n8n.cloud/webhook-test/comprehensive-banpick-analysis');
  const [bettingWebhookUrl, setBettingWebhookUrl] = useState<string>('https://orunktx.app.n8n.cloud/webhook-test/betting-analysis');

  // 베팅 관련 상태 (기본값 설정)
  const [killHandicap, setKillHandicap] = useState<string>('+0'); // 예: "+3" 또는 "-2"
  const [totalKillsOverUnder, setTotalKillsOverUnder] = useState<string>('30.5'); // 예: "32.5"
  const [gameTimeOverUnder, setGameTimeOverUnder] = useState<string>('30'); // 예: "32"

  // 피어리스 모드인 경우 현재 세트의 게임 상태 사용
  const gameData = matchMode === 'FEARLESS' && fearlessMatch
    ? fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet)?.game
    : matchState?.games[matchState.currentGame - 1];

  if (!gameData && matchMode === 'CLASSIC' && !matchState) return null;
  if (!gameData && matchMode === 'FEARLESS') return null;

  // 팀 정보 가져오기
  const blueTeamId = gameData?.blueTeam.teamId;
  const redTeamId = gameData?.redTeam.teamId;
  const blueTeam = blueTeamId ? getTeamById(blueTeamId) : null;
  const redTeam = redTeamId ? getTeamById(redTeamId) : null;

  const bluePlayers = blueTeamId ? getPlayersByTeam(blueTeamId) : [];
  const redPlayers = redTeamId ? getPlayersByTeam(redTeamId) : [];

  // 임시 호환성을 위해 currentGame 별칭 생성
  const currentGame = gameData;

  // 안전 체크
  if (!currentGame) return null;

  // 새로운 n8n 워크플로우 베팅 분석 함수
  // 베팅 분석 전용 함수
  const handleBettingAnalysis = async () => {
    if (!currentGame.blueTeam.picks.length || !currentGame.redTeam.picks.length) {
      alert('밴픽이 완료되지 않았습니다. 양팀 모두 챔피언을 픽해야 합니다.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(''); // 이전 결과 초기화
    
    try {
      // 실제 밴픽 데이터 확인
      const blueBans = currentGame.blueTeam.bans.filter(ban => ban && ban.id);
      const redBans = currentGame.redTeam.bans.filter(ban => ban && ban.id);
      const bluePicks = currentGame.blueTeam.picks.filter(pick => pick && pick.id);
      const redPicks = currentGame.redTeam.picks.filter(pick => pick && pick.id);

      console.log('📊 실제 밴픽 데이터:', {
        blueBans: blueBans.length,
        redBans: redBans.length,
        bluePicks: bluePicks.length,
        redPicks: redPicks.length
      });
      // 베팅 분석용 데이터 준비
      const bettingAnalysisData = {
        team1: blueTeam?.name || 'Blue Team',
        team2: redTeam?.name || 'Red Team',
        killHandicap,
        totalKillsOverUnder,
        gameTimeOverUnder,
        banPickData: {
          gameInfo: {
            blueTeam: blueTeam?.name || 'Blue Team',
            redTeam: redTeam?.name || 'Red Team',
            phase: 'COMPLETED'
          },
          bans: {
            blue: currentGame.blueTeam.bans.map(ban => {
              const champion = getChampionById(ban.id);
              return champion?.name || ban.id;
            }).filter(Boolean),
            red: currentGame.redTeam.bans.map(ban => {
              const champion = getChampionById(ban.id);
              return champion?.name || ban.id;
            }).filter(Boolean)
          },
          picks: {
            blue: currentGame.blueTeam.picks.map(pick => {
              if (!pick?.id) return null;
              const champion = getChampionById(pick.id);
              return champion?.name || pick.id;
            }).filter(Boolean),
            red: currentGame.redTeam.picks.map(pick => {
              if (!pick?.id) return null;
              const champion = getChampionById(pick.id);
              return champion?.name || pick.id;
            }).filter(Boolean)
          },
          players: {
            blue: bluePlayers.map(p => ({ name: p.name, position: p.position })),
            red: redPlayers.map(p => ({ name: p.name, position: p.position }))
          }
        },
        fearlessSetData: matchMode === 'FEARLESS' && fearlessMatch ? {
          currentSet: fearlessMatch.currentSet,
          totalSets: 5,
          usedChampions: fearlessMatch.usedChampions
        } : null,
        timestamp: new Date().toISOString()
      };

      console.log('🎰 베팅 분석 워크플로우 호출:', bettingAnalysisData);
      console.log('📡 Betting Webhook URL:', bettingWebhookUrl);

      // 베팅 분석 워크플로우 호출
      const response = await fetch(bettingWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bettingAnalysisData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 베팅 분석 워크플로우 응답:', result);

      // 분석 결과 추출 및 포맷팅
      let formattedResult = '';
      
      if (result.success && result.analysis && result.analysis.fullText) {
        formattedResult = result.analysis.fullText;
      } else if (result.analysis && result.analysis.fullText) {
        formattedResult = result.analysis.fullText;
      } else if (typeof result === 'string') {
        formattedResult = result;
      } else {
        // 응답 전체를 보여줌 (디버깅용)
        formattedResult = `🎰 베팅 분석 완료!\n\n결과 구조:\n${JSON.stringify(result, null, 2)}`;
      }
      
      setAnalysisResult(formattedResult);
      setShowAnalysisModal(true);
      
    } catch (error) {
      console.error('❌ 베팅 분석 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      setAnalysisResult(`❌ 베팅 분석 실패\n\n오류: ${errorMessage}\n\n📋 체크리스트:\n1. n8n이 http://localhost:5678에서 실행 중인가요?\n2. 베팅 분석 워크플로우가 활성화되어 있나요?\n3. OpenAI API 키가 설정되어 있나요?\n4. Webhook URL이 올바른가요?\n\n현재 URL: ${bettingWebhookUrl}`);
      setShowAnalysisModal(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBanClick = (teamSide: 'BLUE' | 'RED', banIndex: number) => {
    setCurrentAction('BAN');
    setCurrentTeamSide(teamSide);
    setCurrentPosition(banIndex);
    setIsChampionSearchOpen(true);
  };

  const handlePickClick = (teamSide: 'BLUE' | 'RED', pickIndex: number) => {
    setCurrentAction('PICK');
    setCurrentTeamSide(teamSide);
    setCurrentPosition(pickIndex);
    setIsChampionSearchOpen(true);
  };

  const handleChampionSelect = (championId: string) => {
    if (currentAction && currentTeamSide && currentPosition !== null) {
      selectChampion(championId, currentAction, currentTeamSide, currentPosition);
    }
    setIsChampionSearchOpen(false);
    setCurrentAction(null);
    setCurrentTeamSide(null);
    setCurrentPosition(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysisResult);
    alert('분석 결과가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 매치 정보 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {matchMode === 'FEARLESS' && fearlessMatch 
            ? `게임 ${fearlessMatch.currentSet} - 피어리스 BO5`
            : `게임 ${matchState?.currentGame} - BO5`
          }
        </h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-team-blue font-bold">{blueTeam?.shortName}</span>
            <span className="text-2xl font-bold text-team-blue">
              {matchMode === 'FEARLESS' && fearlessMatch 
                ? fearlessMatch.score.teamA 
                : matchState?.score.blue
              }
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-400">VS</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-team-red">
              {matchMode === 'FEARLESS' && fearlessMatch 
                ? fearlessMatch.score.teamB 
                : matchState?.score.red
              }
            </span>
            <span className="text-team-red font-bold">{redTeam?.shortName}</span>
          </div>
        </div>
      </div>

      {/* 피어리스 모드 이전 세트 기록 */}
      {matchMode === 'FEARLESS' && fearlessMatch && fearlessMatch.currentSet > 1 && (
        <div className="card">
          <h3 className="text-xl font-bold text-lol-gold mb-4 text-center">
            📜 이전 세트 기록 (피어리스 BO5)
          </h3>
          <div className="grid gap-4">
            {fearlessMatch.sets
              .filter(set => set.setNumber < fearlessMatch.currentSet && set.isCompleted)
              .map((set) => {
                const blueTeamInfo = getTeamById(set.blueTeamId);
                const redTeamInfo = getTeamById(set.redTeamId);
                const isBlueWinner = set.winner === set.blueTeamId;
                
                return (
                  <div key={set.setNumber} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">
                        게임 {set.setNumber}
                      </h4>
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold ${isBlueWinner ? 'text-team-blue' : 'text-gray-400'}`}>
                          {blueTeamInfo?.shortName}
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className={`font-bold ${!isBlueWinner ? 'text-team-red' : 'text-gray-400'}`}>
                          {redTeamInfo?.shortName}
                        </span>
                        {set.winner && (
                          <span className="text-lol-gold font-bold">
                            {isBlueWinner ? '승' : '패'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* 블루팀 기록 */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-team-blue">
                          {blueTeamInfo?.shortName} 밴/픽
                        </h5>
                        
                        {/* 밴 초상화 */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400">밴:</div>
                          <div className="flex flex-wrap gap-1">
                            {set.game.blueTeam.bans.length > 0 ? (
                              set.game.blueTeam.bans.map((ban, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={getChampionImageWithFallback(ban).src}
                                    alt={getChampionById(ban.id)?.name || ban.id}
                                    className="w-8 h-8 rounded border border-gray-600 object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      const fallback = getChampionImageWithFallback(ban).fallback;
                                      if (target.src !== fallback) {
                                        target.src = fallback;
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-red-500 opacity-20 rounded"></div>
                                  <div className="absolute top-0 right-0 text-red-400 text-xs font-bold">✕</div>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">없음</span>
                            )}
                          </div>
                        </div>
                        
                        {/* 픽 초상화 */}
                        <div className="space-y-2">
                          <div className="text-xs text-blue-300">픽:</div>
                          <div className="flex flex-wrap gap-1">
                            {set.game.blueTeam.picks.filter(Boolean).length > 0 ? (
                              set.game.blueTeam.picks.filter(Boolean).map((pick, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={getChampionImageWithFallback(pick).src}
                                    alt={getChampionById(pick!.id)?.name || pick!.id}
                                    className="w-8 h-8 rounded border border-blue-400 object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      const fallback = getChampionImageWithFallback(pick).fallback;
                                      if (target.src !== fallback) {
                                        target.src = fallback;
                                      }
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* 레드팀 기록 */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-team-red">
                          {redTeamInfo?.shortName} 밴/픽
                        </h5>
                        
                        {/* 밴 초상화 */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400">밴:</div>
                          <div className="flex flex-wrap gap-1">
                            {set.game.redTeam.bans.length > 0 ? (
                              set.game.redTeam.bans.map((ban, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={getChampionImageWithFallback(ban).src}
                                    alt={getChampionById(ban.id)?.name || ban.id}
                                    className="w-8 h-8 rounded border border-gray-600 object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      const fallback = getChampionImageWithFallback(ban).fallback;
                                      if (target.src !== fallback) {
                                        target.src = fallback;
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-red-500 opacity-20 rounded"></div>
                                  <div className="absolute top-0 right-0 text-red-400 text-xs font-bold">✕</div>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">없음</span>
                            )}
                          </div>
                        </div>
                        
                        {/* 픽 초상화 */}
                        <div className="space-y-2">
                          <div className="text-xs text-red-300">픽:</div>
                          <div className="flex flex-wrap gap-1">
                            {set.game.redTeam.picks.filter(Boolean).length > 0 ? (
                              set.game.redTeam.picks.filter(Boolean).map((pick, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={getChampionImageWithFallback(pick).src}
                                    alt={getChampionById(pick!.id)?.name || pick!.id}
                                    className="w-8 h-8 rounded border border-red-400 object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      const fallback = getChampionImageWithFallback(pick).fallback;
                                      if (target.src !== fallback) {
                                        target.src = fallback;
                                      }
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 밴픽 인터페이스 */}
      <div className="grid grid-cols-3 gap-8">
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
                  {currentGame.blueTeam.bans[index] && (
                    <img
                      src={getChampionImageWithFallback(currentGame.blueTeam.bans[index]).src}
                      alt={currentGame.blueTeam.bans[index].name || getChampionById(currentGame.blueTeam.bans[index].id)?.name}
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
                    <span className="text-blue-400 text-lg">+</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 픽 슬롯들 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">픽</h4>
            <div className="space-y-2">
              {['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'].map((position, index) => (
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
                    {!currentGame.blueTeam.picks[index] && (
                      <span className="text-blue-400">+</span>
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
              � 기준 정보가 포함된 종합 구도 분석
            </div>
            
            {/* n8n 워크플로우 URL 설정 */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-300 text-left">
                n8n 워크플로우 URL
              </label>
              <input
                type="text"
                value={n8nWebhookUrl}
                onChange={(e) => setN8nWebhookUrl(e.target.value)}
                placeholder="http://localhost:5678/webhook/betting-analysis"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-lol-gold"
              />
              <div className="text-xs text-gray-500">
                기준 정보 워크플로우 웹훅 URL을 입력하세요
              </div>
            </div>
            
            {/* 유틸리티 버튼들 */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <button
                onClick={generateRandomSample}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-purple-500"
              >
                랜덤 샘플 생성
              </button>
              
              <button
                onClick={matchMode === 'FEARLESS' ? resetFearlessMatch : resetMatch}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-500"
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
                  예: 32.5 (양팀 합쳐서 32.5킬 기준)
                </div>
              </div>

              {/* 경기시간 위/아래 */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-300 text-left">
                  경기시간 위/아래
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={gameTimeOverUnder}
                    onChange={(e) => setGameTimeOverUnder(e.target.value)}
                    placeholder="32"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-lol-gold"
                  />
                  <span className="text-xs text-gray-400">분</span>
                </div>
                <div className="text-xs text-gray-500">
                  예: 32 (경기시간 32분 기준)
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
                    <span className="text-red-400 text-lg">+</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 픽 슬롯들 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">픽</h4>
            <div className="space-y-2">
              {['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'].map((position, index) => (
                <div key={position} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400 w-16">{position}</span>
                  <div className="text-xs text-gray-400 flex-1 text-right">{redPlayers[index]?.nickname}</div>
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
                    {!currentGame.redTeam.picks[index] && (
                      <span className="text-red-400">+</span>
                    )}
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
          actionType={currentAction || 'PICK'}
          teamSide={currentTeamSide || 'BLUE'}
        />
      )}

      {/* 최대화된 분석 결과 모달 */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-lol-gold">🎯 구도 분석 결과 (기준 정보 포함)</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="bg-lol-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  📋 복사
                </button>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-500 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
            
            {/* 모달 내용 */}
            <div className="flex-1 overflow-y-auto p-6">
              {analysisResult ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lol-gold mx-auto mb-4"></div>
                    <p className="text-gray-300">분석 결과를 불러오는 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanPickInterface;