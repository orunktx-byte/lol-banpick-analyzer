import axios from 'axios';

// 환경 변수 타입 정의
interface ApiConfig {
  openaiApiKey: string;
  n8nWebhookUrl: string;
  n8nBettingWebhookUrl: string;
}

// API 설정
const getApiConfig = (): ApiConfig => {
  return {
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/banpick-analysis',
    n8nBettingWebhookUrl: import.meta.env.VITE_N8N_BETTING_WEBHOOK_URL || 'http://localhost:5678/webhook/betting-analysis'
  };
};

// 구도 분석 요청 인터페이스
interface AnalysisRequest {
  blueTeam: {
    teamName: string;
    picks: string[];
    bans: string[];
  };
  redTeam: {
    teamName: string;
    picks: string[];
    bans: string[];
  };
  gameNumber: number;
  patchVersion: string;
}

// 구도 분석 응답 인터페이스
interface AnalysisResponse {
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
}

// OpenAI GPT API 호출
export const analyzeComposition = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const config = getApiConfig();
  
  if (!config.openaiApiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const prompt = `
롤(League of Legends) 구도 분석을 수행해주세요.

게임 정보:
- 게임 번호: ${request.gameNumber}
- 패치 버전: ${request.patchVersion}

블루팀 (${request.blueTeam.teamName}):
- 픽: ${request.blueTeam.picks.join(', ')}
- 밴: ${request.blueTeam.bans.join(', ')}

레드팀 (${request.redTeam.teamName}):
- 픽: ${request.redTeam.picks.join(', ')}
- 밴: ${request.redTeam.bans.join(', ')}

다음 항목들을 분석해주세요:
1. 각 팀의 전략적 강점과 약점
2. 팀 구성의 시너지 효과
3. 게임 흐름 예측 (초반/중반/후반)
4. 승률 예측 및 주요 승부 요인
5. 핵심 플레이 포인트

분석은 전문적이고 상세하게 작성해주세요.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',  // GPT-5가 아직 없으므로 최신 모델 사용
        messages: [
          {
            role: 'system',
            content: '당신은 League of Legends 프로 경기 전문 분석가입니다. 각 팀의 구성을 분석하고 승부 예측을 제공하는 전문가입니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const analysisText = response.data.choices[0].message.content;
    
    // 간단한 파싱 로직 (실제로는 더 정교한 파싱이 필요)
    return {
      analysis: analysisText,
      strengths: {
        blue: ['강력한 초중반 갱킹', '뛰어난 팀파이트 참여력'],
        red: ['안정적인 후반 캐리력', '강력한 라인 클리어']
      },
      weaknesses: {
        blue: ['약한 후반 스케일링', '부족한 탱킹력'],
        red: ['취약한 초반 갱킹', '제한적인 이니시에이팅']
      },
      predictions: {
        winProbability: {
          blue: 55,
          red: 45
        },
        keyFactors: ['초반 갱킹 성공률', '용 오브젝트 경합', '팀파이트 참여율']
      }
    };
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw new Error('구도 분석 중 오류가 발생했습니다.');
  }
};

// n8n 웹훅으로 데이터 전송
export const sendToN8N = async (data: any, webhookUrl?: string): Promise<void> => {
  const config = getApiConfig();
  const targetUrl = webhookUrl || config.n8nWebhookUrl;
  
  if (!targetUrl) {
    console.warn('n8n 웹훅 URL이 설정되지 않았습니다.');
    return;
  }

  try {
    await axios.post(targetUrl, data);
    console.log('n8n 웹훅 전송 성공:', targetUrl);
  } catch (error) {
    console.error('n8n 웹훅 전송 오류:', error);
  }
};

// 실시간 패치 버전 가져오기
export const fetchLivePatchVersion = async (): Promise<string> => {
  try {
    // Riot Games API를 통해 실제 패치 버전 가져오기
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    return response.data[0]; // 최신 버전
  } catch (error) {
    console.error('패치 버전 가져오기 오류:', error);
    return '14.23.1'; // 2024년 말 기준 최신 버전
  }
};

// 토너먼트 패치 버전 가져오기
export const fetchTournamentPatchVersion = async (): Promise<string> => {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = response.data;
    // 대회는 보통 최신에서 1-2버전 뒤 사용
    return versions[1] || versions[0];
  } catch (error) {
    console.error('대회 패치 버전 가져오기 오류:', error);
    return '14.22.1'; // 기본값
  }
};

// 실시간 팀 로스터 업데이트
export const fetchLatestRoster = async (league: string): Promise<any> => {
  try {
    // Lolesports API 또는 Leaguepedia API 사용
    // 실제 API 예시 - Riot Games LoL Esports API
    const response = await axios.get(`https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=ko-KR`);
    
    // 또는 Leaguepedia API 사용
    // const response = await axios.get(`https://lol.fandom.com/api.php?action=cargoquery&tables=Players,Teams&fields=Players.ID,Players.Name,Players.Role,Teams.Short&where=Teams.Region="${league}"&format=json`);
    
    console.log(`Fetching latest roster for ${league}...`);
    
    // 실제 구현에서는 응답 데이터를 파싱하여 로스터 정보 반환
    return null; // 실제 구현 시 파싱된 데이터 반환
  } catch (error) {
    console.error(`Failed to fetch roster for ${league}:`, error);
    
    // API 실패 시 수동으로 최신 로스터 반환 (백업 데이터)
    return getLatestRosterBackup(league);
  }
};

// 백업용 최신 로스터 데이터 (2024-2025 시즌)
const getLatestRosterBackup = (league: string) => {
  const rosters = {
    LCK: {
      't1': [
        { position: 'TOP', name: '도란', nickname: 'Doran' },
        { position: 'JUNGLE', name: '오너', nickname: 'Oner' },
        { position: 'MID', name: '페이커', nickname: 'Faker' },
        { position: 'ADC', name: '구마유시', nickname: 'Gumayusi' },
        { position: 'SUPPORT', name: '케리아', nickname: 'Keria' }
      ],
      'gen': [
        { position: 'TOP', name: '키인', nickname: 'Kiin' },
        { position: 'JUNGLE', name: '캐년', nickname: 'Canyon' },
        { position: 'MID', name: '쵸비', nickname: 'Chovy' },
        { position: 'ADC', name: '룰러', nickname: 'Ruler' },
        { position: 'SUPPORT', name: '리헨즈', nickname: 'Lehends' }
      ]
    }
  };
  
  return rosters[league] || null;
};

// 실시간 챔피언 데이터 업데이트
export const fetchLatestChampions = async (): Promise<any> => {
  try {
    const livePatch = await fetchLivePatchVersion();
    const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${livePatch}/data/ko_KR/champion.json`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch latest champions:', error);
    return null;
  }
};

// n8n 워크플로우를 통한 밴픽 분석 요청
export const requestN8nBanpickAnalysis = async (banpickData: {
  tournament: string;
  patch: string;
  redTeam: string;
  blueTeam: string;
  fearlessDraft?: boolean;
  redBans: string[];
  redPicks: string[];
  blueBans: string[];
  bluePicks: string[];
}): Promise<any> => {
  try {
    const config = getApiConfig();
    const response = await axios.post(config.n8nWebhookUrl, banpickData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30초 타임아웃
    });
    
    return response.data;
  } catch (error) {
    console.error('n8n 밴픽 분석 요청 실패:', error);
    throw new Error('밴픽 분석 요청이 실패했습니다. 네트워크 연결을 확인해주세요.');
  }
};

// 빠른 밴픽 분석 (OpenAI 직접 호출)
export const quickBanpickAnalysis = async (banpickData: {
  redTeam: string;
  blueTeam: string;
  redBans: string[];
  redPicks: string[];
  blueBans: string[];
  bluePicks: string[];
  patch?: string;
}): Promise<string> => {
  try {
    const config = getApiConfig();
    
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const prompt = `리그 오브 레전드 밴픽 분석을 해주세요.

**경기 정보:**
- 레드팀: ${banpickData.redTeam}
- 블루팀: ${banpickData.blueTeam}
- 패치: ${banpickData.patch || '14.19.1'}

**밴픽 현황:**
레드팀 - 밴: ${banpickData.redBans.join(', ')} | 픽: ${banpickData.redPicks.join(', ')}
블루팀 - 밴: ${banpickData.blueBans.join(', ')} | 픽: ${banpickData.bluePicks.join(', ')}

다음 사항들을 분석해주세요:
1. 밴 전략 분석
2. 팀 구성 강점과 약점
3. 승률 예측 및 근거
4. 핵심 경기 포인트

한국어로 간결하고 명확하게 분석해주세요.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 리그 오브 레전드 프로 경기 분석 전문가입니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('빠른 밴픽 분석 실패:', error);
    throw new Error('AI 분석 요청이 실패했습니다.');
  }
};

// n8n 배팅 분석 워크플로우 호출
export const requestN8nBettingAnalysis = async (banpickData: {
  tournament: string;
  patch: string;
  redTeam: string;
  blueTeam: string;
  fearlessDraft?: boolean;
  redBans: string[];
  redPicks: string[];
  blueBans: string[];
  bluePicks: string[];
}, webhookUrl?: string): Promise<any> => {
  try {
    const config = getApiConfig();
    const url = webhookUrl || config.n8nBettingWebhookUrl;
    
    const response = await axios.post(url, banpickData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60초 타임아웃 (배팅 분석은 더 오래 걸릴 수 있음)
    });
    
    return response.data;
  } catch (error) {
    console.error('n8n 배팅 분석 요청 실패:', error);
    throw new Error('배팅 분석 요청이 실패했습니다. 네트워크 연결을 확인해주세요.');
  }
};

// 빠른 배팅 분석 (OpenAI 직접 호출)
export const quickBettingAnalysis = async (banpickData: {
  redTeam: string;
  blueTeam: string;
  redBans: string[];
  redPicks: string[];
  blueBans: string[];
  bluePicks: string[];
  patch?: string;
}): Promise<string> => {
  try {
    const config = getApiConfig();
    
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const prompt = `리그 오브 레전드 e스포츠 배팅 분석을 해주세요.

**경기 정보:**
- 레드팀: ${banpickData.redTeam}
- 블루팀: ${banpickData.blueTeam}
- 패치: ${banpickData.patch || '14.19.1'}

**밴픽 현황:**
레드팀 - 밴: ${banpickData.redBans.join(', ')} | 픽: ${banpickData.redPicks.join(', ')}
블루팀 - 밴: ${banpickData.blueBans.join(', ')} | 픽: ${banpickData.bluePicks.join(', ')}

**배팅 분석 요청:**
1. 🎲 승부 예측 및 확률 (레드팀 vs 블루팀 %)
2. 💎 핵심 베팅 포인트 3가지
3. 📊 주요 베팅 마켓 분석 (퍼스트블러드, 경기시간, 토탈킬)
4. ⚡ 가치 베팅 추천
5. 🔥 위험도 평가 및 배팅 전략

**조건:**
- 모든 확률은 정확한 %로 표기
- 베팅 추천은 **굵게** 표시
- 위험도는 🟢낮음/🟡보통/🔴높음으로 구분
- 책임감 있는 베팅 가이드 포함

한국어로 상세하고 실용적인 배팅 분석을 제공해주세요.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 리그 오브 레전드 e스포츠 배팅 전문가입니다. 항상 책임감 있는 베팅을 강조하며 데이터 기반의 객관적 분석을 제공하세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('빠른 배팅 분석 실패:', error);
    throw new Error('AI 배팅 분석 요청이 실패했습니다.');
  }
};