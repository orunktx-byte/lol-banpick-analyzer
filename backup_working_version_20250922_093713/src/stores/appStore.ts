import { create } from 'zustand';
import type { MatchState, GameState, League, BanPickAction, Champion, Player, FearlessMatchState, SetResult } from '../types';
import { analyzeComposition, sendToN8N, fetchLivePatchVersion, fetchTournamentPatchVersion, fetchLatestRoster, fetchLatestChampions } from '../api/analysisService';
import { getChampionById, CHAMPIONS_DATA } from '../data/champions';
import { getTeamById } from '../data/teams';

interface AppStore {
  // 기존 매치 상태 (호환성 유지)
  matchState: MatchState | null;
  
  // 피어리스 BO5 상태
  fearlessMatch: FearlessMatchState | null;
  matchMode: 'CLASSIC' | 'FEARLESS';
  
  // 패치 버전
  livePatchVersion: string;
  tournamentPatchVersion: string;
  
  // UI 상태
  selectedBlueLeague: League | null;
  selectedRedLeague: League | null;
  selectedBlueTeam: string | null;
  selectedRedTeam: string | null;
  
  // 현재 밴픽 단계
  currentPhase: 'SETUP' | 'BANPICK' | 'ANALYSIS' | 'COMPLETED';
  
  // 구도 분석 결과
  analysisResult: string | null;
  isAnalyzing: boolean;
  analysisCompleted: boolean;
  showAnalysisModal: boolean;
  
  // n8n 연결 설정
  n8nWebhookUrl: string;
  
  // Actions
  setLivePatchVersion: (version: string) => void;
  setTournamentPatchVersion: (version: string) => void;
  setSelectedBlueLeague: (league: League | null) => void;
  setSelectedRedLeague: (league: League | null) => void;
  setSelectedBlueTeam: (teamId: string | null) => void;
  setSelectedRedTeam: (teamId: string | null) => void;
  
  startMatch: (blueTeamId: string, redTeamId: string) => void;
  executeBanPickAction: (action: BanPickAction, championId?: string, playerId?: string) => void;
  selectChampion: (championId: string, action: 'BAN' | 'PICK', team: 'BLUE' | 'RED', position?: number) => void;
  removeChampion: (action: 'BAN' | 'PICK', team: 'BLUE' | 'RED', position: number) => void;
  generateRandomSample: () => void;
  resetMatch: () => void;
  
  // 피어리스 매치 관련 액션
  startFearlessMatch: (teamAId: string, teamBId: string) => void;
  setMatchMode: (mode: 'CLASSIC' | 'FEARLESS') => void;
  switchToSet: (setNumber: number) => void;
  swapTeamsInSet: (setNumber: number) => void;
  setSetWinner: (setNumber: number, winnerId: string) => void;
  addUsedChampion: (teamId: string, champion: Champion) => void;
  resetFearlessMatch: () => void;
  
  startAnalysis: () => void;
  setAnalysisResult: (result: string) => void;
  setShowAnalysisModal: (show: boolean) => void;
  setN8nWebhookUrl: (url: string) => void;
  
  // API 관련
  fetchPatchVersions: () => Promise<void>;
  performAnalysis: () => Promise<void>;
  updateRoster: (league: League) => Promise<void>;
  updateChampions: () => Promise<void>;
  startAutoUpdate: () => void;
  stopAutoUpdate: () => void;
  
  // Fearless 밴픽 순서 생성
  generateBanPickOrder: (gameNumber: number) => BanPickAction[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 초기 상태
  matchState: null,
  fearlessMatch: null,
  matchMode: 'FEARLESS',
  livePatchVersion: '14.19',
  tournamentPatchVersion: '14.18',
  selectedBlueLeague: null,
  selectedRedLeague: null,
  selectedBlueTeam: null,
  selectedRedTeam: null,
  currentPhase: 'SETUP',
  analysisResult: null,
  isAnalyzing: false,
  analysisCompleted: false,
  showAnalysisModal: false,
  n8nWebhookUrl: '',
  
  // Actions
  setLivePatchVersion: (version) => set({ livePatchVersion: version }),
  setTournamentPatchVersion: (version) => set({ tournamentPatchVersion: version }),
  setSelectedBlueLeague: (league) => set({ selectedBlueLeague: league, selectedBlueTeam: null }),
  setSelectedRedLeague: (league) => set({ selectedRedLeague: league, selectedRedTeam: null }),
  setSelectedBlueTeam: (teamId) => set({ selectedBlueTeam: teamId }),
  setSelectedRedTeam: (teamId) => set({ selectedRedTeam: teamId }),
  
  startMatch: (blueTeamId, redTeamId) => {
    const newMatch: MatchState = {
      id: Date.now().toString(),
      blueTeamId,
      redTeamId,
      games: [],
      currentGame: 1,
      score: { blue: 0, red: 0 },
      livePatchVersion: get().livePatchVersion,
      tournamentPatchVersion: get().tournamentPatchVersion
    };
    
    // 첫 번째 게임 생성
    const firstGame: GameState = {
      gameNumber: 1,
      blueTeam: { teamId: blueTeamId, players: [], picks: Array(5).fill(null), bans: [] },
      redTeam: { teamId: redTeamId, players: [], picks: Array(5).fill(null), bans: [] },
      currentAction: null,
      isCompleted: false,
      winner: null
    };
    
    newMatch.games = [firstGame];
    
    set({ 
      matchState: newMatch, 
      currentPhase: 'BANPICK',
      analysisResult: null 
    });
  },
  
  executeBanPickAction: (action, championId, playerId) => {
    const { matchState } = get();
    if (!matchState || !championId) return;
    
    const currentGame = matchState.games[matchState.currentGame - 1];
    if (!currentGame) return;
    
    // 밴픽 액션 실행 로직
    const updatedMatch = { ...matchState };
    const updatedGame = { ...currentGame };
    
    if (action.phase === 'BAN') {
      const champion = { id: championId } as Champion;
      if (action.teamSide === 'BLUE') {
        updatedGame.blueTeam.bans.push(champion);
      } else {
        updatedGame.redTeam.bans.push(champion);
      }
    } else if (action.phase === 'PICK') {
      const champion = { id: championId } as Champion;
      const player = { id: playerId } as Player;
      
      if (action.teamSide === 'BLUE') {
        updatedGame.blueTeam.picks.push(champion);
        if (player) updatedGame.blueTeam.players.push(player);
      } else {
        updatedGame.redTeam.picks.push(champion);
        if (player) updatedGame.redTeam.players.push(player);
      }
    }
    
    updatedMatch.games[matchState.currentGame - 1] = updatedGame;
    set({ matchState: updatedMatch });
  },

  selectChampion: (championId, action, team, position) => {
    const { matchState, fearlessMatch, matchMode } = get();
    
    // 피어리스 모드 처리
    if (matchMode === 'FEARLESS' && fearlessMatch) {
      const currentSet = fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet);
      if (!currentSet) return;
      
      const champion = getChampionById(championId);
      if (!champion) return;
      
      // 피어리스 룰 체크: 이미 사용된 챔피언인지 확인
      const allUsedChampions = [
        ...fearlessMatch.usedChampions.teamA,
        ...fearlessMatch.usedChampions.teamB
      ];
      
      if (allUsedChampions.some(c => c.id === championId)) {
        console.warn('피어리스 룰: 이미 사용된 챔피언입니다.');
        return;
      }
      
      const updatedGame = { ...currentSet.game };
      
      if (action === 'BAN') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.bans.push({
            id: champion.id,
            name: champion.name,
            key: champion.key,
            image: champion.image,
            tags: champion.tags
          } as Champion);
        } else {
          updatedGame.redTeam.bans.push({
            id: champion.id,
            name: champion.name,
            key: champion.key,
            image: champion.image,
            tags: champion.tags
          } as Champion);
        }
      } else if (action === 'PICK' && typeof position === 'number') {
        const championToAdd = {
          id: champion.id,
          name: champion.name,
          key: champion.key,
          image: champion.image,
          tags: champion.tags
        } as Champion;
        
        if (team === 'BLUE') {
          updatedGame.blueTeam.picks[position] = championToAdd;
        } else {
          updatedGame.redTeam.picks[position] = championToAdd;
        }
        
        // 픽한 챔피언을 사용된 챔피언 목록에 추가
        const actualTeamId = team === 'BLUE' ? currentSet.blueTeamId : currentSet.redTeamId;
        const isTeamA = actualTeamId === fearlessMatch.teamA.id;
        
        const updatedUsedChampions = { ...fearlessMatch.usedChampions };
        
        if (isTeamA) {
          updatedUsedChampions.teamA = [...updatedUsedChampions.teamA, championToAdd];
        } else {
          updatedUsedChampions.teamB = [...updatedUsedChampions.teamB, championToAdd];
        }
        
        const updatedSets = fearlessMatch.sets.map(set => {
          if (set.setNumber === fearlessMatch.currentSet) {
            return { ...set, game: updatedGame };
          }
          return set;
        });
        
        set({
          fearlessMatch: {
            ...fearlessMatch,
            sets: updatedSets,
            usedChampions: updatedUsedChampions
          }
        });
        return;
      }
      
      // 밴의 경우 세트만 업데이트
      const updatedSets = fearlessMatch.sets.map(set => {
        if (set.setNumber === fearlessMatch.currentSet) {
          return { ...set, game: updatedGame };
        }
        return set;
      });
      
      set({
        fearlessMatch: {
          ...fearlessMatch,
          sets: updatedSets
        }
      });
      
      return;
    }
    
    // 클래식 모드 처리 (기존 코드)
    if (!matchState) return;
    
    const currentGame = matchState.games[matchState.currentGame - 1];
    if (!currentGame) return;
    
    const updatedMatch = { ...matchState };
    const updatedGame = { ...currentGame };
    
    if (action === 'BAN') {
      const champion = { id: championId } as Champion;
      if (team === 'BLUE') {
        updatedGame.blueTeam.bans.push(champion);
      } else {
        updatedGame.redTeam.bans.push(champion);
      }
    } else if (action === 'PICK' && typeof position === 'number') {
      const champion = { id: championId } as Champion;
      if (team === 'BLUE') {
        updatedGame.blueTeam.picks[position] = champion;
      } else {
        updatedGame.redTeam.picks[position] = champion;
      }
    }
    
    updatedMatch.games[matchState.currentGame - 1] = updatedGame;
    set({ matchState: updatedMatch });
  },

  removeChampion: (action, team, position) => {
    const { matchState, fearlessMatch, matchMode } = get();
    
    // 피어리스 모드 처리
    if (matchMode === 'FEARLESS' && fearlessMatch) {
      const currentSet = fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet);
      if (!currentSet) return;
      
      const updatedGame = { ...currentSet.game };
      let removedChampion: Champion | null = null;
      
      if (action === 'BAN') {
        if (team === 'BLUE') {
          updatedGame.blueTeam.bans.splice(position, 1);
        } else {
          updatedGame.redTeam.bans.splice(position, 1);
        }
      } else if (action === 'PICK') {
        // 제거할 챔피언 정보 저장
        if (team === 'BLUE' && updatedGame.blueTeam.picks[position]) {
          removedChampion = updatedGame.blueTeam.picks[position];
          updatedGame.blueTeam.picks[position] = null;
        } else if (team === 'RED' && updatedGame.redTeam.picks[position]) {
          removedChampion = updatedGame.redTeam.picks[position];
          updatedGame.redTeam.picks[position] = null;
        }
        
        // 사용된 챔피언 목록에서 제거
        if (removedChampion) {
          const actualTeamId = team === 'BLUE' ? currentSet.blueTeamId : currentSet.redTeamId;
          const isTeamA = actualTeamId === fearlessMatch.teamA.id;
          
          const updatedUsedChampions = { ...fearlessMatch.usedChampions };
          if (isTeamA) {
            updatedUsedChampions.teamA = updatedUsedChampions.teamA.filter(c => c.id !== removedChampion!.id);
          } else {
            updatedUsedChampions.teamB = updatedUsedChampions.teamB.filter(c => c.id !== removedChampion!.id);
          }
          
          const updatedSets = fearlessMatch.sets.map(set => {
            if (set.setNumber === fearlessMatch.currentSet) {
              return { ...set, game: updatedGame };
            }
            return set;
          });
          
          set({
            fearlessMatch: {
              ...fearlessMatch,
              sets: updatedSets,
              usedChampions: updatedUsedChampions
            }
          });
          return;
        }
      }
      
      // 밴 제거의 경우 세트만 업데이트
      const updatedSets = fearlessMatch.sets.map(set => {
        if (set.setNumber === fearlessMatch.currentSet) {
          return { ...set, game: updatedGame };
        }
        return set;
      });
      
      set({
        fearlessMatch: {
          ...fearlessMatch,
          sets: updatedSets
        }
      });
      return;
    }
    
    // 클래식 모드 처리 (기존 코드)
    if (!matchState) return;
    
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
        updatedGame.blueTeam.picks[position] = null;
      } else {
        updatedGame.redTeam.picks[position] = null;
      }
    }
    
    updatedMatch.games[matchState.currentGame - 1] = updatedGame;
    set({ matchState: updatedMatch });
  },

  generateRandomSample: () => {
    const { matchState, fearlessMatch, matchMode } = get();
    
    // 피어리스 모드 처리
    if (matchMode === 'FEARLESS' && fearlessMatch) {
      const currentSet = fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet);
      if (!currentSet) return;
      
      // 챔피언 데이터 가져오기
      const allChampions = [...CHAMPIONS_DATA];
      
      // 피어리스 규칙: 이미 사용된 모든 챔피언 제외
      const usedChampionIds = new Set<string>();
      
      // 1. 전체적으로 사용된 챔피언들 (픽만)
      fearlessMatch.usedChampions.teamA.forEach(c => usedChampionIds.add(c.id));
      fearlessMatch.usedChampions.teamB.forEach(c => usedChampionIds.add(c.id));
      
      // 2. 완료된 세트들의 모든 픽과 밴 (현재 세트 제외)
      fearlessMatch.sets.forEach(set => {
        if (set.isCompleted && set.setNumber !== fearlessMatch.currentSet) {
          // 완료된 세트의 모든 픽 챔피언
          set.game.blueTeam.picks.forEach(pick => {
            if (pick) usedChampionIds.add(pick.id);
          });
          set.game.redTeam.picks.forEach(pick => {
            if (pick) usedChampionIds.add(pick.id);
          });
          // 완료된 세트의 모든 밴 챔피언
          set.game.blueTeam.bans.forEach(ban => {
            if (ban) usedChampionIds.add(ban.id);
          });
          set.game.redTeam.bans.forEach(ban => {
            if (ban) usedChampionIds.add(ban.id);
          });
        }
      });
      
      const availableChampions = allChampions.filter(c => !usedChampionIds.has(c.id));
      const shuffledChampions = [...availableChampions].sort(() => Math.random() - 0.5);
      
      console.log(`3-5세트 디버그: 세트 ${fearlessMatch.currentSet}, 사용된 챔피언 ${usedChampionIds.size}개, 사용 가능한 챔피언 ${shuffledChampions.length}개`);
      
      if (shuffledChampions.length < 20) {
        console.warn(`피어리스 모드: 사용 가능한 챔피언이 부족합니다. (필요: 20개, 사용 가능: ${shuffledChampions.length}개)`);
        alert(`사용 가능한 챔피언이 부족합니다.\n필요: 20개\n사용 가능: ${shuffledChampions.length}개\n\n일부 세트를 초기화하거나 완료된 세트의 승부 결과를 설정해주세요.`);
        return;
      }
      
      let usedIndex = 0;
      const updatedGame = { ...currentSet.game };
      
      // 블루팀 밴 (5개)
      updatedGame.blueTeam.bans = [];
      for (let i = 0; i < 5; i++) {
        const champion = shuffledChampions[usedIndex];
        updatedGame.blueTeam.bans.push({
          id: champion.id,
          name: champion.name,
          key: champion.key,
          image: champion.image,
          tags: champion.tags
        } as Champion);
        usedIndex++;
      }
      
      // 레드팀 밴 (5개)
      updatedGame.redTeam.bans = [];
      for (let i = 0; i < 5; i++) {
        const champion = shuffledChampions[usedIndex];
        updatedGame.redTeam.bans.push({
          id: champion.id,
          name: champion.name,
          key: champion.key,
          image: champion.image,
          tags: champion.tags
        } as Champion);
        usedIndex++;
      }
      
      // 블루팀 픽 (5개)
      updatedGame.blueTeam.picks = [];
      for (let i = 0; i < 5; i++) {
        const champion = shuffledChampions[usedIndex];
        updatedGame.blueTeam.picks.push({
          id: champion.id,
          name: champion.name,
          key: champion.key,
          image: champion.image,
          tags: champion.tags
        } as Champion);
        usedIndex++;
      }
      
      // 레드팀 픽 (5개)
      updatedGame.redTeam.picks = [];
      for (let i = 0; i < 5; i++) {
        const champion = shuffledChampions[usedIndex];
        updatedGame.redTeam.picks.push({
          id: champion.id,
          name: champion.name,
          key: champion.key,
          image: champion.image,
          tags: champion.tags
        } as Champion);
        usedIndex++;
      }
      
      // 피어리스 usedChampions 업데이트
      const newUsedChampions = { ...fearlessMatch.usedChampions };
      
      // 현재 세트의 픽 챔피언들을 usedChampions에 추가
      updatedGame.blueTeam.picks.forEach(pick => {
        if (pick) {
          // 블루팀이 teamA인지 teamB인지 확인
          if (currentSet.blueTeamId === fearlessMatch.teamA.id) {
            newUsedChampions.teamA.push(pick);
          } else {
            newUsedChampions.teamB.push(pick);
          }
        }
      });
      
      updatedGame.redTeam.picks.forEach(pick => {
        if (pick) {
          // 레드팀이 teamA인지 teamB인지 확인
          if (currentSet.redTeamId === fearlessMatch.teamA.id) {
            newUsedChampions.teamA.push(pick);
          } else {
            newUsedChampions.teamB.push(pick);
          }
        }
      });
      
      // 피어리스 상태 업데이트
      const updatedSets = fearlessMatch.sets.map(set => {
        if (set.setNumber === fearlessMatch.currentSet) {
          return { ...set, game: updatedGame };
        }
        return set;
      });
      
      set({
        fearlessMatch: {
          ...fearlessMatch,
          sets: updatedSets,
          usedChampions: newUsedChampions
        }
      });
      
      return;
    }
    
    // 클래식 모드 처리 (기존 코드)
    if (!matchState) return;
    
    const currentGame = matchState.games[matchState.currentGame - 1];
    if (!currentGame) return;
    
    // 챔피언 데이터 가져오기
    const allChampions = [...CHAMPIONS_DATA];
    const shuffledChampions = [...allChampions].sort(() => Math.random() - 0.5);
    
    const updatedMatch = { ...matchState };
    const updatedGame = { ...currentGame };
    
    let usedIndex = 0;
    
    // 블루팀 밴 (5개)
    updatedGame.blueTeam.bans = [];
    for (let i = 0; i < 5; i++) {
      updatedGame.blueTeam.bans.push({ id: shuffledChampions[usedIndex].id } as Champion);
      usedIndex++;
    }
    
    // 레드팀 밴 (5개)
    updatedGame.redTeam.bans = [];
    for (let i = 0; i < 5; i++) {
      updatedGame.redTeam.bans.push({ id: shuffledChampions[usedIndex].id } as Champion);
      usedIndex++;
    }
    
    // 블루팀 픽 (5개)
    updatedGame.blueTeam.picks = [];
    for (let i = 0; i < 5; i++) {
      updatedGame.blueTeam.picks.push({ id: shuffledChampions[usedIndex].id } as Champion);
      usedIndex++;
    }
    
    // 레드팀 픽 (5개)
    updatedGame.redTeam.picks = [];
    for (let i = 0; i < 5; i++) {
      updatedGame.redTeam.picks.push({ id: shuffledChampions[usedIndex].id } as Champion);
      usedIndex++;
    }
    
    updatedMatch.games[matchState.currentGame - 1] = updatedGame;
    set({ matchState: updatedMatch });
  },
  
  resetMatch: () => {
    set({
      matchState: null,
      currentPhase: 'SETUP',
      analysisResult: null,
      isAnalyzing: false,
      analysisCompleted: false,
      showAnalysisModal: false,
      selectedBlueLeague: null,
      selectedRedLeague: null,
      selectedBlueTeam: null,
      selectedRedTeam: null
    });
  },

  // 피어리스 매치 관련 함수들
  startFearlessMatch: (teamAId, teamBId) => {
    const teamA = getTeamById(teamAId);
    const teamB = getTeamById(teamBId);
    
    if (!teamA || !teamB) return;

    const fearlessMatch: FearlessMatchState = {
      id: `fearless-${Date.now()}`,
      teamA: { id: teamAId, name: teamA.name },
      teamB: { id: teamBId, name: teamB.name },
      sets: [],
      currentSet: 1,
      score: { teamA: 0, teamB: 0 },
      usedChampions: { teamA: [], teamB: [] },
      bannedChampions: { teamA: [], teamB: [] },
      livePatchVersion: get().livePatchVersion,
      tournamentPatchVersion: get().tournamentPatchVersion
    };

    // 5개 세트 초기화 - 모든 세트에서 teamA=블루, teamB=레드로 고정
    for (let i = 1; i <= 5; i++) {
      const setResult: SetResult = {
        setNumber: i,
        blueTeamId: teamAId, // 모든 세트에서 teamA가 블루
        redTeamId: teamBId,  // 모든 세트에서 teamB가 레드
        winner: null,
        isCompleted: false,
        game: {
          gameNumber: i,
          blueTeam: { 
            teamId: teamAId, // 모든 세트에서 teamA가 블루
            players: [], 
            picks: Array(5).fill(null), 
            bans: [] 
          },
          redTeam: { 
            teamId: teamBId, // 모든 세트에서 teamB가 레드
            players: [], 
            picks: Array(5).fill(null), 
            bans: [] 
          },
          currentAction: null,
          isCompleted: false,
          winner: null
        }
      };
      fearlessMatch.sets.push(setResult);
    }

    set({ 
      fearlessMatch,
      matchMode: 'FEARLESS',
      currentPhase: 'BANPICK',
      analysisResult: null,
      isAnalyzing: false,
      analysisCompleted: false,
      showAnalysisModal: false
    });
  },

  setMatchMode: (mode) => {
    set({ matchMode: mode });
  },

  switchToSet: (setNumber) => {
    const { fearlessMatch } = get();
    if (!fearlessMatch || setNumber < 1 || setNumber > 5) return;
    
    set({
      fearlessMatch: {
        ...fearlessMatch,
        currentSet: setNumber
      }
    });
  },

  swapTeamsInSet: (setNumber) => {
    const { fearlessMatch } = get();
    if (!fearlessMatch) return;

    // fearlessMatch 전체의 teamA와 teamB를 교체
    const newTeamA = fearlessMatch.teamB;
    const newTeamB = fearlessMatch.teamA;

    // 모든 세트의 팀 배치를 업데이트 (teamA가 항상 블루, teamB가 항상 레드)
    const updatedSets = fearlessMatch.sets.map(set => {
      return {
        ...set,
        blueTeamId: newTeamA.id,  // 새로운 teamA가 블루
        redTeamId: newTeamB.id,   // 새로운 teamB가 레드
        // 게임 데이터는 기존 블루/레드 데이터를 교체
        game: {
          ...set.game,
          blueTeam: { ...set.game.redTeam, teamId: newTeamA.id },
          redTeam: { ...set.game.blueTeam, teamId: newTeamB.id }
        }
      };
    });

    // usedChampions도 교체
    const newUsedChampions = {
      teamA: fearlessMatch.usedChampions.teamB,
      teamB: fearlessMatch.usedChampions.teamA
    };

    // bannedChampions도 교체
    const newBannedChampions = {
      teamA: fearlessMatch.bannedChampions.teamB,
      teamB: fearlessMatch.bannedChampions.teamA
    };

    // 스코어도 교체
    const newScore = {
      teamA: fearlessMatch.score.teamB,
      teamB: fearlessMatch.score.teamA
    };

    set({
      fearlessMatch: {
        ...fearlessMatch,
        teamA: newTeamA,
        teamB: newTeamB,
        sets: updatedSets,
        usedChampions: newUsedChampions,
        bannedChampions: newBannedChampions,
        score: newScore
      }
    });
  },

  setSetWinner: (setNumber, winnerId) => {
    const { fearlessMatch } = get();
    if (!fearlessMatch) return;

    const updatedSets = fearlessMatch.sets.map(set => {
      if (set.setNumber === setNumber) {
        return {
          ...set,
          winner: winnerId,
          isCompleted: true,
          game: { ...set.game, winner: winnerId, isCompleted: true }
        };
      }
      return set;
    });

    // 스코어 계산
    const teamAWins = updatedSets.filter(set => set.winner === fearlessMatch.teamA.id).length;
    const teamBWins = updatedSets.filter(set => set.winner === fearlessMatch.teamB.id).length;

    set({
      fearlessMatch: {
        ...fearlessMatch,
        sets: updatedSets,
        score: { teamA: teamAWins, teamB: teamBWins }
      }
    });
  },

  addUsedChampion: (teamId, champion) => {
    const { fearlessMatch } = get();
    if (!fearlessMatch) return;

    const isTeamA = teamId === fearlessMatch.teamA.id;
    const currentUsed = isTeamA ? fearlessMatch.usedChampions.teamA : fearlessMatch.usedChampions.teamB;
    
    // 이미 사용된 챔피언인지 확인
    if (currentUsed.some(c => c.id === champion.id)) return;

    set({
      fearlessMatch: {
        ...fearlessMatch,
        usedChampions: {
          ...fearlessMatch.usedChampions,
          [isTeamA ? 'teamA' : 'teamB']: [...currentUsed, champion]
        }
      }
    });
  },

  resetFearlessMatch: () => {
    set({
      fearlessMatch: null,
      matchMode: 'CLASSIC',
      currentPhase: 'SETUP',
      analysisResult: null,
      isAnalyzing: false,
      analysisCompleted: false,
      showAnalysisModal: false,
      selectedBlueLeague: null,
      selectedRedLeague: null,
      selectedBlueTeam: null,
      selectedRedTeam: null
    });
  },
  
  startAnalysis: () => {
    set({ isAnalyzing: true, analysisCompleted: false });
    // 실제 분석 API 호출은 별도 함수에서 처리
  },
  
  setAnalysisResult: (result) => {
    set({ 
      analysisResult: result, 
      isAnalyzing: false, 
      analysisCompleted: true 
    });
  },
  
  setShowAnalysisModal: (show) => {
    set({ showAnalysisModal: show });
  },
  
  setN8nWebhookUrl: (url) => {
    set({ n8nWebhookUrl: url });
  },
  
  generateBanPickOrder: (gameNumber) => {
    // Fearless 밴픽 순서 (BO5 기준)
    const baseOrder: BanPickAction[] = [
      // 첫 번째 밴 페이즈
      { id: '1', phase: 'BAN', teamSide: 'BLUE', order: 1, gameNumber },
      { id: '2', phase: 'BAN', teamSide: 'RED', order: 2, gameNumber },
      { id: '3', phase: 'BAN', teamSide: 'BLUE', order: 3, gameNumber },
      { id: '4', phase: 'BAN', teamSide: 'RED', order: 4, gameNumber },
      { id: '5', phase: 'BAN', teamSide: 'BLUE', order: 5, gameNumber },
      { id: '6', phase: 'BAN', teamSide: 'RED', order: 6, gameNumber },
      
      // 첫 번째 픽 페이즈
      { id: '7', phase: 'PICK', teamSide: 'BLUE', order: 7, gameNumber },
      { id: '8', phase: 'PICK', teamSide: 'RED', order: 8, gameNumber },
      { id: '9', phase: 'PICK', teamSide: 'RED', order: 9, gameNumber },
      { id: '10', phase: 'PICK', teamSide: 'BLUE', order: 10, gameNumber },
      
      // 두 번째 밴 페이즈
      { id: '11', phase: 'BAN', teamSide: 'RED', order: 11, gameNumber },
      { id: '12', phase: 'BAN', teamSide: 'BLUE', order: 12, gameNumber },
      { id: '13', phase: 'BAN', teamSide: 'RED', order: 13, gameNumber },
      { id: '14', phase: 'BAN', teamSide: 'BLUE', order: 14, gameNumber },
      
      // 두 번째 픽 페이즈
      { id: '15', phase: 'PICK', teamSide: 'BLUE', order: 15, gameNumber },
      { id: '16', phase: 'PICK', teamSide: 'RED', order: 16, gameNumber },
      { id: '17', phase: 'PICK', teamSide: 'RED', order: 17, gameNumber },
      { id: '18', phase: 'PICK', teamSide: 'BLUE', order: 18, gameNumber },
      
      // 마지막 픽
      { id: '19', phase: 'PICK', teamSide: 'RED', order: 19, gameNumber },
      { id: '20', phase: 'PICK', teamSide: 'BLUE', order: 20, gameNumber },
    ];
    
    return baseOrder;
  },
  
  // API 메서드들
  fetchPatchVersions: async () => {
    try {
      const [liveVersion, tournamentVersion] = await Promise.all([
        fetchLivePatchVersion(),
        fetchTournamentPatchVersion()
      ]);
      
      set({
        livePatchVersion: liveVersion,
        tournamentPatchVersion: tournamentVersion
      });
    } catch (error) {
      console.error('패치 버전 가져오기 실패:', error);
    }
  },
  
  performAnalysis: async () => {
    const { matchState, n8nWebhookUrl } = get();
    if (!matchState) return;
    
    set({ isAnalyzing: true });
    
    try {
      const currentGame = matchState.games[matchState.currentGame - 1];
      const blueTeam = getTeamById(matchState.blueTeamId);
      const redTeam = getTeamById(matchState.redTeamId);
      
      if (!blueTeam || !redTeam) {
        throw new Error('팀 정보를 찾을 수 없습니다.');
      }
      
      const request = {
        blueTeam: {
          teamName: blueTeam.name,
          picks: currentGame.blueTeam.picks.filter(p => p !== null).map(p => getChampionById(p.id)?.name || p.id),
          bans: currentGame.blueTeam.bans.map(b => getChampionById(b.id)?.name || b.id)
        },
        redTeam: {
          teamName: redTeam.name,
          picks: currentGame.redTeam.picks.filter(p => p !== null).map(p => getChampionById(p.id)?.name || p.id),
          bans: currentGame.redTeam.bans.map(b => getChampionById(b.id)?.name || b.id)
        },
        gameNumber: matchState.currentGame,
        patchVersion: matchState.livePatchVersion
      };
      
      // n8n으로 데이터 전송 (사용자가 설정한 URL 사용)
      if (n8nWebhookUrl) {
        await sendToN8N({
          type: 'analysis_request',
          matchId: matchState.id,
          gameNumber: matchState.currentGame,
          data: request
        }, n8nWebhookUrl);
      }
      
      // OpenAI로 분석 수행
      const analysisResult = await analyzeComposition(request);
      
      set({
        analysisResult: analysisResult.analysis,
        isAnalyzing: false,
        analysisCompleted: true,
        currentPhase: 'ANALYSIS'
      });
      
    } catch (error) {
      console.error('구도 분석 실패:', error);
      set({
        analysisResult: '분석 중 오류가 발생했습니다. 다시 시도해주세요.',
        isAnalyzing: false,
        analysisCompleted: true
      });
    }
  },

  updateRoster: async (league) => {
    try {
      console.log(`${league} 로스터 업데이트 시작...`);
      
      // 실제 API에서 로스터 데이터 가져오기
      const rosterData = await fetchLatestRoster(league);
      
      if (rosterData) {
        console.log(`${league} 로스터가 성공적으로 업데이트되었습니다.`);
        
        // 실제로는 가져온 데이터로 PLAYERS_DATA 업데이트
        // 예: 새로운 선수 데이터로 상태 업데이트
        // set({ playersData: updatedPlayersData });
        
        // 현재는 콘솔로만 로그 출력
        console.log('최신 로스터 정보:', rosterData);
      } else {
        console.log(`${league} 로스터 API 응답이 없습니다. 기본 데이터 사용.`);
      }
    } catch (error) {
      console.error(`${league} 로스터 업데이트 오류:`, error);
    }
  },

  updateChampions: async () => {
    try {
      const championsData = await fetchLatestChampions();
      if (championsData) {
        console.log('챔피언 데이터가 업데이트되었습니다.');
        // 실제로는 새로운 챔피언 데이터로 상태 업데이트
      }
    } catch (error) {
      console.error('챔피언 데이터 업데이트 오류:', error);
    }
  },

  startAutoUpdate: () => {
    const { fetchPatchVersions, updateRoster, updateChampions } = get();
    
    // 패치 버전 자동 업데이트 (10분마다)
    setInterval(() => {
      fetchPatchVersions();
    }, 10 * 60 * 1000);

    // 로스터 자동 업데이트 (1시간마다)
    setInterval(() => {
      updateRoster('LCK');
      updateRoster('LPL');
      updateRoster('LEC');
    }, 60 * 60 * 1000);

    // 챔피언 데이터 자동 업데이트 (1일마다)
    setInterval(() => {
      updateChampions();
    }, 24 * 60 * 60 * 1000);

    // 초기 업데이트 실행
    fetchPatchVersions();
    updateChampions();

    console.log('실시간 자동 업데이트가 시작되었습니다.');
  },

  stopAutoUpdate: () => {
    console.log('실시간 자동 업데이트가 중지되었습니다.');
  }
}));