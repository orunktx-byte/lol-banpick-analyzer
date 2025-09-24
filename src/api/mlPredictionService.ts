// ML 예측 서비스 - NGBoost (킬수 범위) + XGBoost (승패 확률)
import { DataIntegrationService, type EnhancedPredictionData } from './dataIntegrationService';

export interface KillRangePrediction {
  teamA: {
    expected: number;
    range: { min: number; max: number };
    confidence: number;
  };
  teamB: {
    expected: number;
    range: { min: number; max: number };
    confidence: number;
  };
  totalKills: {
    expected: number;
    range: { min: number; max: number };
  };
}

export interface WinProbabilityPrediction {
  teamA: {
    winRate: number;
    confidence: number;
  };
  teamB: {
    winRate: number;
    confidence: number;
  };
  prediction: 'TEAM_A' | 'TEAM_B';
  margin: number; // 승률 차이
}

export interface MLPredictionResult {
  killPrediction: KillRangePrediction;
  winPrediction: WinProbabilityPrediction;
  enhancedData?: EnhancedPredictionData; // 통합 데이터 추가
  metadata: {
    modelVersion: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    dataQuality: number;
    dataSources: string[]; // 사용된 데이터 소스 추가
    timestamp: string;
  };
}

export interface BanPickData {
  bans: {
    blue: string[];
    red: string[];
  };
  picks: {
    blue: string[];
    red: string[];
  };
  players: {
    blue: Array<{ name: string }>;
    red: Array<{ name: string }>;
  };
}

export class MLPredictionService {
  private static readonly API_BASE = 'https://orunktx.app.n8n.cloud/webhook';
  
  // NGBoost 킬수 범위 예측
  static async predictKillRange(banPickData: BanPickData): Promise<KillRangePrediction> {
    try {
      const response = await fetch(`${this.API_BASE}/kill-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'NGBoost',
          data: banPickData,
          predictionType: 'kill_range'
        }),
      });

      if (!response.ok) {
        throw new Error(`킬수 예측 실패: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('❌ 킬수 범위 예측 실패:', error);
      // 폴백 - 모의 데이터
      return this.getMockKillPrediction(banPickData);
    }
  }

  // XGBoost 승패 확률 예측
  static async predictWinProbability(banPickData: BanPickData): Promise<WinProbabilityPrediction> {
    try {
      const response = await fetch(`${this.API_BASE}/win-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'XGBoost',
          data: banPickData,
          predictionType: 'win_probability'
        }),
      });

      if (!response.ok) {
        throw new Error(`승률 예측 실패: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('❌ 승률 예측 실패:', error);
      // 폴백 - 모의 데이터
      return this.getMockWinPrediction(banPickData);
    }
  }

  // 통합 예측 (킬수 + 승률 + 데이터 통합)
  static async getComprehensivePrediction(banPickData: BanPickData): Promise<MLPredictionResult> {
    // API 상태 확인
    const apiStatus = DataIntegrationService.checkAPIStatus();
    console.log('🔧 API 연결 상태:', apiStatus ? '활성화' : '모의 데이터 모드');
    
    // 기본 예측 실행
    let [killPrediction, winPrediction] = await Promise.all([
      this.predictKillRange(banPickData),
      this.predictWinProbability(banPickData)
    ]);

    let enhancedData: EnhancedPredictionData | undefined;
    let dataSources = ['MockData'];

    // 통합 데이터 수집 시도 (실제 서비스에서 활성화)
    if (apiStatus) {
      try {
        console.log('🔄 실제 API 데이터 통합 시작...');
        const banPickAnalysisData = {
          team1: 'Team Blue',
          team2: 'Team Red',
          patch: '25.17',
          banPickData: { 
            picks: banPickData.picks,
            bans: banPickData.bans,
            players: banPickData.players
          }
        };
        
        enhancedData = await DataIntegrationService.getEnhancedPrediction(banPickAnalysisData);
        dataSources = ['Leaguepedia', 'Esports API', 'MockData'];
        
        // 통합 데이터를 활용한 예측 보정
        killPrediction = this.enhanceKillPrediction(killPrediction, enhancedData);
        winPrediction = this.enhanceWinPrediction(winPrediction, enhancedData);
        
        console.log('✅ 실제 API 데이터 통합 완료 - 보정된 예측 적용');
      } catch (error) {
        console.log('⚠️ 실제 API 데이터 통합 실패, 기본 예측 사용:', error);
      }
    } else {
      console.log('📊 모의 데이터 모드로 실행 중...');
    }

    // 예측 신뢰도 계산
    const avgConfidence = (killPrediction.teamA.confidence + winPrediction.teamA.confidence) / 2;
    const confidence = avgConfidence > 0.8 ? 'HIGH' : avgConfidence > 0.6 ? 'MEDIUM' : 'LOW';

    return {
      killPrediction,
      winPrediction,
      enhancedData,
      metadata: {
        modelVersion: 'NGBoost-v1.2 + XGBoost-v2.1 + DataIntegration-v1.0',
        confidence,
        dataQuality: avgConfidence,
        dataSources,
        timestamp: new Date().toISOString()
      }
    };
  }

  // 통합 데이터로 킬수 예측 보정
  private static enhanceKillPrediction(
    basePrediction: KillRangePrediction, 
    enhancedData: EnhancedPredictionData
  ): KillRangePrediction {
    const { metaAlignment, patchImpact } = enhancedData.combined;
    
    // 메타 적합도와 패치 영향을 반영한 보정
    const adjustment = (metaAlignment + patchImpact) * 2; // -4 ~ +4 범위
    
    return {
      teamA: {
        expected: Math.max(5, basePrediction.teamA.expected + Math.round(adjustment)),
        range: {
          min: Math.max(3, basePrediction.teamA.range.min + Math.round(adjustment)),
          max: basePrediction.teamA.range.max + Math.round(adjustment)
        },
        confidence: Math.min(0.95, basePrediction.teamA.confidence + 0.1) // 통합 데이터로 신뢰도 증가
      },
      teamB: {
        expected: Math.max(5, basePrediction.teamB.expected - Math.round(adjustment)),
        range: {
          min: Math.max(3, basePrediction.teamB.range.min - Math.round(adjustment)),
          max: basePrediction.teamB.range.max - Math.round(adjustment)
        },
        confidence: Math.min(0.95, basePrediction.teamB.confidence + 0.1)
      },
      totalKills: {
        expected: basePrediction.totalKills.expected,
        range: basePrediction.totalKills.range
      }
    };
  }

  // 통합 데이터로 승률 예측 보정  
  private static enhanceWinPrediction(
    basePrediction: WinProbabilityPrediction,
    enhancedData: EnhancedPredictionData
  ): WinProbabilityPrediction {
    const { playerFormFactor, teamSynergy } = enhancedData.combined;
    
    // 선수 폼과 팀 시너지를 반영한 보정
    const adjustment = (playerFormFactor + teamSynergy) * 10; // -20% ~ +20%
    
    const adjustedTeamA = Math.max(10, Math.min(90, basePrediction.teamA.winRate + adjustment));
    const adjustedTeamB = 100 - adjustedTeamA;
    
    return {
      teamA: {
        winRate: Math.round(adjustedTeamA * 10) / 10,
        confidence: Math.min(0.95, basePrediction.teamA.confidence + 0.15)
      },
      teamB: {
        winRate: Math.round(adjustedTeamB * 10) / 10,
        confidence: Math.min(0.95, basePrediction.teamB.confidence + 0.15)
      },
      prediction: adjustedTeamA > adjustedTeamB ? 'TEAM_A' : 'TEAM_B',
      margin: Math.abs(adjustedTeamA - adjustedTeamB)
    };
  }

  // 모의 킬수 예측 데이터 (실제 모델 없을 때)
  private static getMockKillPrediction(banPickData: BanPickData): KillRangePrediction {
    // 챔피언 조합을 기반으로 한 시드 생성 (일관된 결과를 위해)
    const seed = this.generateSeed(banPickData);
    const seededRandom = this.seededRandom(seed);
    
    // 챔피언 기반 기본 킬수 계산
    const blueAggroScore = this.calculateAggroScore(banPickData.picks.blue);
    const redAggroScore = this.calculateAggroScore(banPickData.picks.red);
    
    const teamAKills = Math.round(10 + blueAggroScore + seededRandom() * 6);
    const teamBKills = Math.round(10 + redAggroScore + seededRandom() * 6);
    
    return {
      teamA: {
        expected: teamAKills,
        range: { 
          min: teamAKills - 3, 
          max: teamAKills + 4 
        },
        confidence: 0.75 + seededRandom() * 0.2
      },
      teamB: {
        expected: teamBKills,
        range: { 
          min: teamBKills - 3, 
          max: teamBKills + 4 
        },
        confidence: 0.75 + seededRandom() * 0.2
      },
      totalKills: {
        expected: teamAKills + teamBKills,
        range: { 
          min: teamAKills + teamBKills - 5, 
          max: teamAKills + teamBKills + 7 
        }
      }
    };
  }

  // 모의 승률 예측 데이터 (실제 모델 없을 때)
  private static getMockWinPrediction(banPickData: BanPickData): WinProbabilityPrediction {
    // 같은 시드 사용해서 일관된 결과 생성
    const seed = this.generateSeed(banPickData);
    const seededRandom = this.seededRandom(seed + 1000); // 다른 시드값
    
    // 팀 밸런스 점수 계산
    const blueBalance = this.calculateTeamBalance(banPickData.picks.blue);
    const redBalance = this.calculateTeamBalance(banPickData.picks.red);
    
    // 기본 승률에 밸런스 점수 반영
    const baseWinRate = 0.4 + (blueBalance - redBalance) * 0.1 + seededRandom() * 0.2;
    const teamAWinRate = Math.max(0.2, Math.min(0.8, baseWinRate)); // 20-80% 범위
    const teamBWinRate = 1 - teamAWinRate;
    
    return {
      teamA: {
        winRate: Math.round(teamAWinRate * 1000) / 10, // 1자리 소수
        confidence: 0.7 + seededRandom() * 0.25
      },
      teamB: {
        winRate: Math.round(teamBWinRate * 1000) / 10,
        confidence: 0.7 + seededRandom() * 0.25
      },
      prediction: teamAWinRate > teamBWinRate ? 'TEAM_A' : 'TEAM_B',
      margin: Math.abs(teamAWinRate - teamBWinRate) * 100
    };
  }

  // 챔피언 조합으로 시드 생성 (같은 조합 = 같은 결과)
  private static generateSeed(banPickData: BanPickData): number {
    const allChampions = [
      ...banPickData.bans.blue,
      ...banPickData.bans.red,
      ...banPickData.picks.blue,
      ...banPickData.picks.red
    ].sort().join('');
    
    let hash = 0;
    for (let i = 0; i < allChampions.length; i++) {
      const char = allChampions.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit 정수로 변환
    }
    return Math.abs(hash);
  }

  // 시드 기반 랜덤 함수 (일관된 결과)
  private static seededRandom(seed: number) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  // 어그로 점수 계산 (킬수에 영향)
  private static calculateAggroScore(champions: string[]): number {
    const aggroChampions = ['Yasuo', 'Yone', 'Jinx', 'Draven', 'Lee Sin', 'Graves', 'Pyke', 'Thresh'];
    let score = 0;
    champions.forEach(champ => {
      if (aggroChampions.some(aggro => champ.includes(aggro))) {
        score += 2;
      }
    });
    return score;
  }

  // 팀 밸런스 점수 계산 (승률에 영향)
  private static calculateTeamBalance(champions: string[]): number {
    const strongChampions = ['Azir', 'Corki', 'Jinx', 'Kai\'Sa', 'Graves', 'Nidalee'];
    let score = 0;
    champions.forEach(champ => {
      if (strongChampions.some(strong => champ.includes(strong))) {
        score += 1;
      }
    });
    return score;
  }
}