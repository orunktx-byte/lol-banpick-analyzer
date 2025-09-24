import axios from 'axios';
import type { TeamTendency, CoachTendency, PlayerChampionTendency } from '../types';

// Riot Games API 엔드포인트들
const RIOT_API_BASE = 'https://esports-api.lolesports.com/persisted/gw';
const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

// API 키가 필요한 경우를 위한 설정
const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'TomiyaAnalysis/1.0'
  }
};

/**
 * 실시간 팀 성향 데이터 수집
 */
export const fetchTeamTendencies = async (teamId: string, league: string): Promise<TeamTendency> => {
  try {
    // 여러 API에서 데이터를 수집하여 팀 성향 분석
    
    // 1. Riot Esports API에서 팀 기본 정보
    const teamResponse = await axios.get(`${RIOT_API_BASE}/getTeams`, {
      params: { hl: 'ko-KR' },
      ...API_CONFIG
    });
    
    // 2. 최근 경기 데이터
    const matchesResponse = await axios.get(`${RIOT_API_BASE}/getEventDetails`, {
      params: { hl: 'ko-KR', id: 'recent_matches' },
      ...API_CONFIG
    });
    
    // 3. 리그 통계 데이터
    const statsResponse = await axios.get(`${RIOT_API_BASE}/getStandings`, {
      params: { hl: 'ko-KR', tournamentId: league },
      ...API_CONFIG
    });

    // 실제 구현에서는 API 응답을 파싱하여 팀 성향 계산
    const teamTendency: TeamTendency = {
      teamId,
      teamName: `Team ${teamId}`,
      playstyle: calculatePlaystyle(teamResponse.data),
      earlyGameFocus: calculateEarlyGameFocus(matchesResponse.data),
      lateGameFocus: calculateLateGameFocus(matchesResponse.data),
      teamfightPreference: calculateTeamfightPreference(matchesResponse.data),
      splitPushTendency: calculateSplitPushTendency(matchesResponse.data),
      objectiveControl: calculateObjectiveControl(matchesResponse.data),
      recentPerformance: {
        winRate: calculateWinRate(statsResponse.data),
        averageGameTime: calculateAverageGameTime(matchesResponse.data),
        firstBloodRate: calculateFirstBloodRate(matchesResponse.data),
        firstDragonRate: calculateFirstDragonRate(matchesResponse.data)
      }
    };

    return teamTendency;
    
  } catch (error) {
    console.error('팀 성향 데이터 수집 오류:', error);
    
    // 오류 시 기본값 반환
    return {
      teamId,
      teamName: `Team ${teamId}`,
      playstyle: 'balanced',
      earlyGameFocus: 5,
      lateGameFocus: 5,
      teamfightPreference: 5,
      splitPushTendency: 5,
      objectiveControl: 5,
      recentPerformance: {
        winRate: 0.5,
        averageGameTime: 32,
        firstBloodRate: 0.5,
        firstDragonRate: 0.5
      }
    };
  }
};

/**
 * 코치 성향 데이터 수집
 */
export const fetchCoachTendencies = async (coachName: string, teamId: string): Promise<CoachTendency> => {
  try {
    // 코치의 드래프트 히스토리와 성향 분석
    const draftHistoryResponse = await axios.get(`${RIOT_API_BASE}/getDraftHistory`, {
      params: { coach: coachName, team: teamId },
      ...API_CONFIG
    });

    return {
      coachName,
      draftStyle: analyzeDraftStyle(draftHistoryResponse.data),
      priorityLanes: analyzePriorityLanes(draftHistoryResponse.data),
      banPhilosophy: analyzeBanPhilosophy(draftHistoryResponse.data),
      adaptability: calculateAdaptability(draftHistoryResponse.data),
      historicalSuccess: {
        championPriorityAccuracy: calculatePriorityAccuracy(draftHistoryResponse.data),
        draftWinRate: calculateDraftWinRate(draftHistoryResponse.data)
      }
    };
    
  } catch (error) {
    console.error('코치 성향 데이터 수집 오류:', error);
    
    return {
      coachName,
      draftStyle: 'balanced' as any,
      priorityLanes: ['mid', 'jungle'],
      banPhilosophy: 'meta_deny',
      adaptability: 5,
      historicalSuccess: {
        championPriorityAccuracy: 0.7,
        draftWinRate: 0.5
      }
    };
  }
};

/**
 * 플레이어 챔피언 성향 데이터 수집
 */
export const fetchPlayerChampionTendencies = async (
  playerId: string, 
  championId: string
): Promise<PlayerChampionTendency> => {
  try {
    // 플레이어의 특정 챔피언 성과 데이터
    const playerStatsResponse = await axios.get(`${RIOT_API_BASE}/getPlayerStats`, {
      params: { playerId, championId },
      ...API_CONFIG
    });

    return {
      playerId,
      playerName: `Player ${playerId}`,
      position: determinePosition(playerStatsResponse.data),
      championId,
      championName: await getChampionName(championId),
      mastery: {
        gameCount: playerStatsResponse.data?.gameCount || 0,
        winRate: playerStatsResponse.data?.winRate || 0.5,
        averageKDA: playerStatsResponse.data?.averageKDA || 2.0,
        averageDamage: playerStatsResponse.data?.averageDamage || 15000
      },
      playstyle: {
        aggression: calculateAggression(playerStatsResponse.data),
        roaming: calculateRoaming(playerStatsResponse.data),
        teamfightContribution: calculateTeamfightContribution(playerStatsResponse.data),
        laning: calculateLaning(playerStatsResponse.data)
      },
      synergies: await analyzeSynergies(playerId, championId),
      counters: await analyzeCounters(playerId, championId)
    };
    
  } catch (error) {
    console.error('플레이어 챔피언 성향 데이터 수집 오류:', error);
    
    return {
      playerId,
      playerName: `Player ${playerId}`,
      position: 'unknown',
      championId,
      championName: championId,
      mastery: {
        gameCount: 0,
        winRate: 0.5,
        averageKDA: 2.0,
        averageDamage: 15000
      },
      playstyle: {
        aggression: 5,
        roaming: 5,
        teamfightContribution: 5,
        laning: 5
      },
      synergies: [],
      counters: []
    };
  }
};

/**
 * 메타 분석 데이터 수집
 */
export const fetchMetaAnalysis = async (patch: string, league: string) => {
  try {
    const metaResponse = await axios.get(`${RIOT_API_BASE}/getMetaAnalysis`, {
      params: { patch, league },
      ...API_CONFIG
    });

    return {
      patch,
      league,
      popularPicks: metaResponse.data?.popularPicks || [],
      popularBans: metaResponse.data?.popularBans || [],
      emergingPicks: metaResponse.data?.emergingPicks || [],
      winRates: metaResponse.data?.winRates || {},
      priorityRoles: metaResponse.data?.priorityRoles || []
    };
    
  } catch (error) {
    console.error('메타 분석 데이터 수집 오류:', error);
    return {
      patch,
      league,
      popularPicks: [],
      popularBans: [],
      emergingPicks: [],
      winRates: {},
      priorityRoles: []
    };
  }
};

// 헬퍼 함수들
function calculatePlaystyle(teamData: any): 'aggressive' | 'passive' | 'balanced' {
  // 팀 데이터를 기반으로 플레이스타일 계산
  const avgGameTime = teamData?.averageGameTime || 30;
  const firstBloodRate = teamData?.firstBloodRate || 0.5;
  
  if (avgGameTime < 28 && firstBloodRate > 0.6) return 'aggressive';
  if (avgGameTime > 35 && firstBloodRate < 0.4) return 'passive';
  return 'balanced';
}

function calculateEarlyGameFocus(_matchData: any): number {
  // 초반 게임 집중도 계산 (1-10)
  return Math.floor(Math.random() * 10) + 1; // 임시 구현
}

function calculateLateGameFocus(_matchData: any): number {
  // 후반 게임 집중도 계산 (1-10)
  return Math.floor(Math.random() * 10) + 1; // 임시 구현
}

function calculateTeamfightPreference(_matchData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateSplitPushTendency(_matchData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateObjectiveControl(_matchData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateWinRate(statsData: any): number {
  return statsData?.winRate || 0.5;
}

function calculateAverageGameTime(matchData: any): number {
  return matchData?.averageGameTime || 32;
}

function calculateFirstBloodRate(matchData: any): number {
  return matchData?.firstBloodRate || 0.5;
}

function calculateFirstDragonRate(matchData: any): number {
  return matchData?.firstDragonRate || 0.5;
}

function analyzeDraftStyle(draftData: any): 'comfort' | 'meta' | 'counter' | 'innovative' {
  return 'meta'; // 임시 구현
}

function analyzePriorityLanes(draftData: any): ('top' | 'jungle' | 'mid' | 'adc' | 'support')[] {
  return ['mid', 'jungle']; // 임시 구현
}

function analyzeBanPhilosophy(draftData: any): 'target_ban' | 'meta_deny' | 'flex_deny' {
  return 'meta_deny'; // 임시 구현
}

function calculateAdaptability(draftData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculatePriorityAccuracy(draftData: any): number {
  return 0.7; // 임시 구현
}

function calculateDraftWinRate(draftData: any): number {
  return 0.5; // 임시 구현
}

function determinePosition(playerData: any): string {
  return playerData?.position || 'unknown';
}

async function getChampionName(championId: string): Promise<string> {
  try {
    const response = await axios.get(`${DATA_DRAGON_BASE}/15.18.1/data/ko_KR/champion.json`);
    const champions = response.data.data;
    
    for (const champion of Object.values(champions) as any[]) {
      if (champion.id === championId) {
        return champion.name;
      }
    }
    
    return championId;
  } catch (error) {
    return championId;
  }
}

function calculateAggression(playerData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateRoaming(playerData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateTeamfightContribution(playerData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

function calculateLaning(playerData: any): number {
  return Math.floor(Math.random() * 10) + 1;
}

async function analyzeSynergies(playerId: string, championId: string): Promise<string[]> {
  // 시너지 분석 로직
  return ['Azir', 'Orianna', 'Syndra']; // 임시 구현
}

async function analyzeCounters(playerId: string, championId: string): Promise<string[]> {
  // 카운터 분석 로직
  return ['Yasuo', 'Zed', 'Talon']; // 임시 구현
}