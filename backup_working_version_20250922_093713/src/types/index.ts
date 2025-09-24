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