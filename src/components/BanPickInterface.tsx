import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';
import { getPlayersByTeam } from '../data/players';
import { getChampionById } from '../data/champions';
import ChampionSearch from './ChampionSearch';
// import MarkdownRenderer from './MarkdownRenderer';
import { getChampionImageWithFallback } from '../utils/imageUtils';
import { MLPredictionService, type MLPredictionResult } from '../api/mlPredictionService';
import { CreditManager } from '../utils/creditManager';

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

  // ML 예측 결과 상태
  const [mlPrediction, setMlPrediction] = useState<MLPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // 보안 모드 - 민감한 정보 숨기기/보이기 (캡쳐 시 보안용)
  const [isSecureMode, setIsSecureMode] = useState(false);

  // 직접 취소 함수
  const cancelSelection = (action: 'BAN' | 'PICK', team: 'BLUE' | 'RED', position: number) => {
    if (matchMode === 'FEARLESS' && fearlessMatch) {
      const currentSet = fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet);
      if (!currentSet) return;
      
      const updatedGame = { ...currentSet.game };
      
      if (action === 'BAN') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.bans.splice(position, 1);
        } else {
          updatedGame.redTeam.bans.splice(position, 1);
        }
      } else if (action === 'PICK') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.picks[position] = null as any;
        } else {
          updatedGame.redTeam.picks[position] = null as any;
        }
      }
      
      const updatedSets = fearlessMatch.sets.map(set => {
        if (set.setNumber === fearlessMatch.currentSet) {
          return { ...set, game: updatedGame };
        }
        return set;
      });
      
      useAppStore.setState({
        fearlessMatch: {
          ...fearlessMatch,
          sets: updatedSets
        }
      });
    } else if (matchState) {
      const currentGame = matchState.games[matchState.currentGame - 1];
      if (!currentGame) return;
      
      const updatedMatch = { ...matchState };
      const updatedGame = { ...currentGame };
      
      if (action === 'BAN') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.bans.splice(position, 1);
        } else {
          updatedGame.redTeam.bans.splice(position, 1);
        }
      } else if (action === 'PICK') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.picks[position] = null as any;
        } else {
          updatedGame.redTeam.picks[position] = null as any;
        }
      }
      
      updatedMatch.games[matchState.currentGame - 1] = updatedGame;
      useAppStore.setState({ matchState: updatedMatch });
    }
  };

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

  // 자동 ML 예측 실행 (밴픽 완료 시)
  useEffect(() => {
    const runAutoPredicition = async () => {
      // 양팀 모두 5픽 완료된 경우에만 자동 예측
      if (currentGame.blueTeam.picks.length === 5 && 
          currentGame.redTeam.picks.length === 5 &&
          currentGame.blueTeam.picks.every(pick => pick?.id) &&
          currentGame.redTeam.picks.every(pick => pick?.id) &&
          !isPredicting && !mlPrediction) {
        
        console.log('🤖 자동 ML 예측 실행...');
        setIsPredicting(true);
        
        try {
          const banPickData = {
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
              }).filter((name): name is string => Boolean(name)),
              red: currentGame.redTeam.picks.map(pick => {
                if (!pick?.id) return null;
                const champion = getChampionById(pick.id);
                return champion?.name || pick.id;
              }).filter((name): name is string => Boolean(name))
            },
            players: {
              blue: bluePlayers.map(player => ({ name: player?.nickname || 'Unknown' })),
              red: redPlayers.map(player => ({ name: player?.nickname || 'Unknown' }))
            }
          };

          const mlPredictionResult = await MLPredictionService.getComprehensivePrediction(banPickData);
          setMlPrediction(mlPredictionResult);
          console.log('✅ 자동 ML 예측 완료:', mlPredictionResult);
        } catch (error) {
          console.error('❌ 자동 ML 예측 실패:', error);
        } finally {
          setIsPredicting(false);
        }
      }
    };

    runAutoPredicition();
  }, [currentGame.blueTeam.picks, currentGame.redTeam.picks, bluePlayers, redPlayers, isPredicting, mlPrediction]);

  // 밴픽 변경 시 기존 예측 결과 초기화
  useEffect(() => {
    // 밴픽이 변경되면 기존 ML 예측 결과 초기화
    if (mlPrediction) {
      setMlPrediction(null);
    }
  }, [currentGame.blueTeam.bans, currentGame.redTeam.bans, currentGame.blueTeam.picks, currentGame.redTeam.picks]);

  // n8n 워크플로우 구도 분석 + ML 예측 통합 함수
  const handleBettingAnalysis = async () => {
    if (!currentGame.blueTeam.picks.length || !currentGame.redTeam.picks.length) {
      alert('밴픽이 완료되지 않았습니다. 양팀 모두 챔피언을 픽해야 합니다.');
      return;
    }

    // 크레딧 확인 및 차감
    if (!CreditManager.hasCredits()) {
      alert('💳 크레딧이 부족합니다! 구도분석을 사용하려면 크레딧이 필요합니다.');
      return;
    }

    // 크레딧 차감
    const creditUsed = CreditManager.useCredit();
    if (!creditUsed) {
      alert('💳 크레딧 사용에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    const remainingCredits = CreditManager.getCreditStats()?.remaining || 0;
    console.log(`💳 크레딧 사용됨! 남은 크레딧: ${remainingCredits}`);

    setIsAnalyzing(true);
    setIsPredicting(true);
    setAnalysisResult(''); // 이전 결과 초기화
    setMlPrediction(null);
    
    try {
      console.log('🎯 구도 분석 + ML 예측 시작...');

      // 밴픽 데이터 준비
      const banPickData = {
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
          }).filter((name): name is string => Boolean(name)),
          red: currentGame.redTeam.picks.map(pick => {
            if (!pick?.id) return null;
            const champion = getChampionById(pick.id);
            return champion?.name || pick.id;
          }).filter((name): name is string => Boolean(name))
        },
        players: {
          blue: bluePlayers.map(player => ({ name: player?.nickname || 'Unknown' })),
          red: redPlayers.map(player => ({ name: player?.nickname || 'Unknown' }))
        }
      };

      // 1. ML 예측 실행 (NGBoost + XGBoost)
      console.log('🤖 ML 예측 실행 중...');
      const mlPredictionResult = await MLPredictionService.getComprehensivePrediction(banPickData);
      setMlPrediction(mlPredictionResult);
      console.log('✅ ML 예측 완료:', mlPredictionResult);

      // 2. 기존 n8n 워크플로우 분석 (병렬 실행을 위해 Promise.all 사용)
      const bettingAnalysisData = {
        team1: blueTeam?.name || 'Blue Team',
        team2: redTeam?.name || 'Red Team',
        killHandicap: killHandicap,
        totalKillsOverUnder: totalKillsOverUnder,
        gameTimeOverUnder: gameTimeOverUnder,
        patch: '25.17', // 최신 대회 패치 버전
        tournament: 'LCK 2025 Spring',
        coaches: {
          blue: blueTeam?.coach || 'Unknown Coach',
          red: redTeam?.coach || 'Unknown Coach'
        },
        banPickData: banPickData,
        // ML 예측 결과도 함께 전송
        mlPrediction: {
          killRange: mlPredictionResult.killPrediction,
          winProbability: mlPredictionResult.winPrediction,
          confidence: mlPredictionResult.metadata.confidence
        }
      };

      console.log('🚀 n8n 워크플로우 데이터:', bettingAnalysisData);
      console.log('📊 패치 버전:', bettingAnalysisData.patch);
      console.log('👨‍💼 감독 정보:', bettingAnalysisData.coaches);

      // 환경에 따른 API URL 자동 선택
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost 
        ? 'https://orunktx.app.n8n.cloud/webhook/analysis'  // 로컬 → n8n 웹훅 직접
        : 'https://lol-banpick-analyzer-8g64.vercel.app/api/analysis';  // 배포 → Vercel API
      
      console.log('🌐 사용 중인 API URL:', apiUrl);
      
      // 베팅 분석 워크플로우 호출
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bettingAnalysisData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const webhookResult = await response.json();
      console.log('✅ 베팅 분석 워크플로우 응답:', webhookResult);

      // 분석 결과 추출 및 포맷팅 (ML 예측 결과 포함)
      let formattedResult = '';
      
      // ML 예측 결과를 마크다운으로 포맷팅
      const mlSummary = `
## 🤖 ML 예측 결과

### 📊 킬수 예측 (NGBoost)
- **${blueTeam?.name || 'Blue Team'}**: ${mlPredictionResult.killPrediction.teamA.expected}킬 (범위: ${mlPredictionResult.killPrediction.teamA.range.min}-${mlPredictionResult.killPrediction.teamA.range.max})
- **${redTeam?.name || 'Red Team'}**: ${mlPredictionResult.killPrediction.teamB.expected}킬 (범위: ${mlPredictionResult.killPrediction.teamB.range.min}-${mlPredictionResult.killPrediction.teamB.range.max})
- **총 킬수**: ${mlPredictionResult.killPrediction.totalKills.expected}킬 (범위: ${mlPredictionResult.killPrediction.totalKills.range.min}-${mlPredictionResult.killPrediction.totalKills.range.max})

### 🎯 승률 예측 (XGBoost)
- **${blueTeam?.name || 'Blue Team'}**: ${mlPredictionResult.winPrediction.teamA.winRate}% 승률
- **${redTeam?.name || 'Red Team'}**: ${mlPredictionResult.winPrediction.teamB.winRate}% 승률
- **예상 승자**: ${mlPredictionResult.winPrediction.prediction === 'TEAM_A' ? blueTeam?.name || 'Blue Team' : redTeam?.name || 'Red Team'}
- **신뢰도**: ${mlPredictionResult.metadata.confidence}

---
`;
      
      if (webhookResult.result) {
        // { "result": "... 5대5 ... 구도 분석 내용" } 형태의 응답 처리 (마크다운)
        formattedResult = mlSummary + webhookResult.result;
      } else if (webhookResult.success && webhookResult.analysis && webhookResult.analysis.fullText) {
        formattedResult = mlSummary + webhookResult.analysis.fullText;
      } else if (webhookResult.analysis && webhookResult.analysis.fullText) {
        formattedResult = mlSummary + webhookResult.analysis.fullText;
      } else if (typeof webhookResult === 'string') {
        formattedResult = mlSummary + webhookResult;
      } else {
        // ML 예측만 표시 (n8n 워크플로우 실패 시)
        formattedResult = mlSummary + `\n## 📝 구도 분석\n\nn8n 워크플로우 연결을 확인해주세요.\n응답: ${JSON.stringify(webhookResult)}`;
      }
      
      setAnalysisResult(formattedResult);
      setShowAnalysisModal(true);
      
    } catch (error) {
      console.error('❌ 베팅 분석 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      // ML 예측만이라도 성공했다면 표시
      if (mlPrediction) {
        const mlSummary = `
## 🤖 ML 예측 결과

### 📊 킬수 예측 (NGBoost)
- **${blueTeam?.name || 'Blue Team'}**: ${mlPrediction.killPrediction.teamA.expected}킬 (범위: ${mlPrediction.killPrediction.teamA.range.min}-${mlPrediction.killPrediction.teamA.range.max})
- **${redTeam?.name || 'Red Team'}**: ${mlPrediction.killPrediction.teamB.expected}킬 (범위: ${mlPrediction.killPrediction.teamB.range.min}-${mlPrediction.killPrediction.teamB.range.max})

### 🎯 승률 예측 (XGBoost)
- **${blueTeam?.name || 'Blue Team'}**: ${mlPrediction.winPrediction.teamA.winRate}% 승률
- **${redTeam?.name || 'Red Team'}**: ${mlPrediction.winPrediction.teamB.winRate}% 승률

---

## ⚠️ n8n 워크플로우 오류
${errorMessage}
`;
        setAnalysisResult(mlSummary);
      } else {
        setAnalysisResult(`❌ 베팅 분석 실패\n\n오류: ${errorMessage}\n\n📋 체크리스트:\n1. n8n이 https://orunktx.app.n8n.cloud에서 실행 중인가요?\n2. 베팅 분석 워크플로우가 활성화되어 있나요?\n3. OpenAI API 키가 설정되어 있나요?\n4. Webhook URL이 올바른가요?\n\n현재 URL: https://orunktx.app.n8n.cloud/webhook/analysis`);
      }
      setShowAnalysisModal(true);
    } finally {
      setIsAnalyzing(false);
      setIsPredicting(false);
    }
  };

  const handleBanClick = (teamSide: 'BLUE' | 'RED', banIndex: number, event?: React.MouseEvent) => {
    // onContextMenu에서 호출된 경우 (우클릭)
    if (event && event.type === 'contextmenu') {
      event.preventDefault();
      event.stopPropagation();
      cancelSelection('BAN', teamSide, banIndex);
      return;
    }
    
    // 우클릭인 경우 밴 취소
    if (event && event.button === 2) {
      event.preventDefault();
      event.stopPropagation();
      cancelSelection('BAN', teamSide, banIndex);
      return;
    }
    
    setCurrentAction('BAN');
    setCurrentTeamSide(teamSide);
    setCurrentPosition(banIndex);
    setIsChampionSearchOpen(true);
  };

  const handlePickClick = (teamSide: 'BLUE' | 'RED', pickIndex: number, event?: React.MouseEvent) => {
    // onContextMenu에서 호출된 경우 (우클릭)
    if (event && event.type === 'contextmenu') {
      event.preventDefault();
      event.stopPropagation();
      cancelSelection('PICK', teamSide, pickIndex);
      return;
    }
    
    // 우클릭인 경우 픽 취소
    if (event && event.button === 2) {
      event.preventDefault();
      event.stopPropagation();
      cancelSelection('PICK', teamSide, pickIndex);
      return;
    }
    
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
          <h3 className="text-xl font-bold text-team-blue mb-2 text-center">
            {blueTeam?.name}
          </h3>
          {blueTeam?.coach && (
            <p className="text-sm text-gray-300 mb-4 text-center">
              감독: {blueTeam.coach}
            </p>
          )}
          
          {/* 밴 슬롯들 */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">밴</h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                  onClick={(e) => handleBanClick('BLUE', index, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBanClick('BLUE', index, e);
                  }}
                  title={currentGame.blueTeam.bans[index] ? "좌클릭: 변경, 우클릭: 취소" : "클릭하여 밴 선택"}
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
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBanClick('BLUE', index, e as any);
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
                <div key={position} className="flex items-center space-x-5">
                  <div
                    className="w-20 h-20 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                    onClick={(e) => handlePickClick('BLUE', index, e)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePickClick('BLUE', index, e);
                    }}
                    title={currentGame.blueTeam.picks[index] ? "좌클릭: 변경, 우클릭: 취소" : "클릭하여 픽 선택"}
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
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePickClick('BLUE', index, e as any);
                        }}
                      />
                    )}
                    {!currentGame.blueTeam.picks[index] && (
                      <span className="text-blue-400 text-xl">+</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg text-blue-400 font-medium">{position}</div>
                    <div className="text-base text-gray-400">{bluePlayers[index]?.nickname}</div>
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
            
            {/* 예측 로딩 상태 */}
            {isPredicting && !mlPrediction && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-lol-gold">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lol-gold"></div>
                  <span className="text-sm">ML 예측 실행 중...</span>
                </div>
              </div>
            )}
            
            {/* 보안 모드 토글 */}
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">
                  🔒 보안 모드 (캡쳐 시 민감정보 숨김)
                </label>
                <button
                  onClick={() => setIsSecureMode(!isSecureMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isSecureMode ? 'bg-lol-gold' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isSecureMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
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
                onClick={() => {
                  if (matchMode === 'FEARLESS') {
                    resetFearlessMatch();
                  } else {
                    resetMatch();
                  }
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-500"
              >
                매치 초기화
              </button>
            </div>

            {/* 기준 정보 입력 섹션 */}
            <div className="space-y-4 pt-4 border-t border-gray-700 relative">
              <h4 className="text-lg font-bold text-lol-gold text-center">기준 정보</h4>
              
              {isSecureMode && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-95 rounded-lg flex flex-col items-center justify-center z-10">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">🔒</div>
                    <div className="text-gray-300 font-medium">보안 모드 활성화</div>
                    <div className="text-gray-500 text-sm">베팅 기준 정보가 숨겨졌습니다</div>
                  </div>
                </div>
              )}
              
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
          <h3 className="text-xl font-bold text-team-red mb-2 text-center">
            {redTeam?.name}
          </h3>
          {redTeam?.coach && (
            <p className="text-sm text-gray-300 mb-4 text-center">
              감독: {redTeam.coach}
            </p>
          )}
          
          {/* 밴 슬롯들 */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">밴</h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-800 border-2 border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                  onClick={(e) => handleBanClick('RED', index, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBanClick('RED', index, e);
                  }}
                  title={currentGame.redTeam.bans[index] ? "좌클릭: 변경, 우클릭: 취소" : "클릭하여 밴 선택"}
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
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBanClick('RED', index, e as any);
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
                <div key={position} className="flex items-center space-x-5">
                  <span className="text-lg text-red-400 font-medium w-24">{position}</span>
                  <div className="text-base text-gray-400 flex-1 text-right">{redPlayers[index]?.nickname}</div>
                  <div
                    className="w-20 h-20 bg-gray-800 border-2 border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative overflow-hidden"
                    onClick={(e) => handlePickClick('RED', index, e)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePickClick('RED', index, e);
                    }}
                    title={currentGame.redTeam.picks[index] ? "좌클릭: 변경, 우클릭: 취소" : "클릭하여 픽 선택"}
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
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePickClick('RED', index, e as any);
                        }}
                      />
                    )}
                    {!currentGame.redTeam.picks[index] && (
                      <span className="text-red-400 text-xl">+</span>
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
                <div className="prose prose-invert max-w-none text-white whitespace-pre-wrap">
                  {analysisResult}
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