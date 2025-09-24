// 리그 타입
export type League = 'LCK' | 'LPL' | 'LEC';

// 포지션 타입
export type Position = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

// 팀 인터페이스
export interface Team {
  id: string;
  name: string;
  shortName: string;
  league: League;
  logo: string;
  coach?: string;
}

// 선수 인터페이스
export interface Player {
  id: string;
  name: string;
  nickname: string;
  position: Position;
  teamId: string;
  profileImage: string;
}

// 챔피언 인터페이스
export interface Champion {
  id: string;
  name: string;
  key: string;
  image: string;
  tags: string[];
}

// 밴픽 페이즈
export type BanPickPhase = 'BAN' | 'PICK';

// 팀 사이드
export type TeamSide = 'BLUE' | 'RED';

// 밴픽 액션
export interface BanPickAction {
  id: string;
  phase: BanPickPhase;
  teamSide: TeamSide;
  championId?: string;
  playerId?: string;
  order: number;
  gameNumber: number;
}

// 게임 상태
export interface GameState {
  gameNumber: number;
  blueTeam: {
    teamId: string;
    players: Player[];
    picks: (Champion | null)[];
    bans: Champion[];
  };
  redTeam: {
    teamId: string;
    players: Player[];
    picks: (Champion | null)[];
    bans: Champion[];
  };
  currentAction: BanPickAction | null;
  isCompleted: boolean;
  winner: string | null; // 승리한 팀 ID
}

// 피어리스 BO5를 위한 세트 결과
export interface SetResult {
  setNumber: number;
  blueTeamId: string;
  redTeamId: string;
  winner: string | null;
  isCompleted: boolean;
  game: GameState;
}

// 피어리스 매치 상태 (팀명 기준 추적)
export interface FearlessMatchState {
  id: string;
  teamA: {
    id: string;
    name: string;
  };
  teamB: {
    id: string;
    name: string;
  };
  sets: SetResult[];
  currentSet: number;
  score: {
    teamA: number;
    teamB: number;
  };
  usedChampions: {
    teamA: Champion[]; // 팀A가 사용한 모든 챔피언
    teamB: Champion[]; // 팀B가 사용한 모든 챔피언
  };
  bannedChampions: {
    teamA: Champion[]; // 팀A가 밴한 모든 챔피언
    teamB: Champion[]; // 팀B가 밴한 모든 챔피언
  };
  livePatchVersion: string;
  tournamentPatchVersion: string;
}

// 매치 상태 (기존 호환성 유지)
export interface MatchState {
  id: string;
  blueTeamId: string;
  redTeamId: string;
  games: GameState[];
  currentGame: number;
  score: {
    blue: number;
    red: number;
  };
  livePatchVersion: string;
  tournamentPatchVersion: string;
}

// 구도 분석 결과
export interface AnalysisResult {
  id: string;
  matchId: string;
  gameNumber: number;
  analysis: string;
  strengths: {
    blue: string[];
    red: string[];
  };
  weaknesses: {
    blue: string[];
    red: string[];
  };
  predictions: {
    winProbability: {
      blue: number;
      red: number;
    };
    keyFactors: string[];
  };
  createdAt: string;
}

// 고급 구도 분석을 위한 새로운 타입들
export interface TeamTendency {
  teamId: string;
  teamName: string;
  playstyle: 'aggressive' | 'passive' | 'balanced';
  earlyGameFocus: number; // 1-10 점수
  lateGameFocus: number; // 1-10 점수
  teamfightPreference: number; // 1-10 점수
  splitPushTendency: number; // 1-10 점수
  objectiveControl: number; // 1-10 점수
  recentPerformance: {
    winRate: number;
    averageGameTime: number;
    firstBloodRate: number;
    firstDragonRate: number;
  };
}

export interface CoachTendency {
  coachName: string;
  draftStyle: 'comfort' | 'meta' | 'counter' | 'innovative';
  priorityLanes: ('top' | 'jungle' | 'mid' | 'adc' | 'support')[];
  banPhilosophy: 'target_ban' | 'meta_deny' | 'flex_deny';
  adaptability: number; // 1-10 점수
  historicalSuccess: {
    championPriorityAccuracy: number;
    draftWinRate: number;
  };
}

export interface PlayerChampionTendency {
  playerId: string;
  playerName: string;
  position: string;
  championId: string;
  championName: string;
  mastery: {
    gameCount: number;
    winRate: number;
    averageKDA: number;
    averageDamage: number;
  };
  playstyle: {
    aggression: number; // 1-10
    roaming: number; // 1-10
    teamfightContribution: number; // 1-10
    laning: number; // 1-10
  };
  synergies: string[]; // 잘 어울리는 챔피언들
  counters: string[]; // 약한 상대 챔피언들
}

export interface DraftIntent {
  phase: 'ban1' | 'pick1' | 'ban2' | 'pick2' | 'ban3' | 'pick3';
  teamSide: 'blue' | 'red';
  action: 'ban' | 'pick';
  championId: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  targetPlayer?: string;
  strategicValue: number; // 1-10
}

export interface CompositionAnalysis {
  teamSide: 'blue' | 'red';
  composition: {
    champions: string[];
    roles: string[];
  };
  strengths: string[];
  weaknesses: string[];
  powerSpikes: {
    early: number; // 1-10
    mid: number; // 1-10
    late: number; // 1-10
  };
  teamfightPattern: {
    engage: string[];
    peel: string[];
    damage: string[];
    utility: string[];
  };
  objectives: {
    dragonPriority: number; // 1-10
    baronPriority: number; // 1-10
    towerPriority: number; // 1-10
  };
}

export interface EarlyGameAnalysis {
  dragonFight: {
    timing: string; // "6-8분"
    blueAdvantage: number; // -10 to +10
    redAdvantage: number; // -10 to +10
    recommendation: {
      blue: 'contest' | 'give_up' | 'setup_counter';
      red: 'contest' | 'give_up' | 'setup_counter';
    };
    alternativeStrategy: {
      blue: string;
      red: string;
    };
  };
  lanePhase: {
    topLaneAdvantage: number; // -10 to +10
    jungleAdvantage: number;
    midLaneAdvantage: number;
    botLaneAdvantage: number;
  };
}

export interface ComprehensiveAnalysisRequest {
  // 기존 기준 정보
  baselineInfo: {
    killHandicap: string;
    totalKillsOverUnder: string;
    gameTimeOverUnder: string;
  };
  
  // 팀 및 플레이어 정보
  teams: {
    blue: TeamTendency;
    red: TeamTendency;
  };
  
  coaches: {
    blue: CoachTendency;
    red: CoachTendency;
  };
  
  // 현재 드래프트 상태
  draft: {
    bans: {
      blue: string[];
      red: string[];
    };
    picks: {
      blue: string[];
      red: string[];
    };
    draftHistory: DraftIntent[];
  };
  
  // 플레이어별 챔피언 성향
  playerTendencies: PlayerChampionTendency[];
  
  // 메타 정보
  meta: {
    patch: string;
    league: string;
    tournament: string;
  };
  
  // 요청된 분석 타입
  analysisType: {
    teamTendencies: boolean;
    coachTendencies: boolean;
    playerChampionTendencies: boolean;
    draftIntent: boolean;
    compositionIntent: boolean;
    earlyGameAnalysis: boolean;
    teamfightTendencies: boolean;
  };
}