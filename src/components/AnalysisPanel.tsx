import { useAppStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';
import { getChampionById } from '../data/champions';

const AnalysisPanel = () => {
  const { matchState, analysisResult, isAnalyzing, resetMatch, performAnalysis } = useAppStore();

  if (!matchState) return null;

  const blueTeam = getTeamById(matchState.blueTeamId);
  const redTeam = getTeamById(matchState.redTeamId);
  const currentGame = matchState.games[matchState.currentGame - 1];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          구도 분석 결과
        </h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-team-blue font-bold">{blueTeam?.shortName}</span>
            <span className="text-2xl font-bold text-team-blue">{matchState.score.blue}</span>
          </div>
          <span className="text-gray-400">vs</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-team-red">{matchState.score.red}</span>
            <span className="text-team-red font-bold">{redTeam?.shortName}</span>
          </div>
        </div>
      </div>

      {/* 팀 구성 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 블루팀 구성 */}
        <div className="card team-card-blue">
          <h3 className="text-xl font-bold text-team-blue mb-4 text-center">
            {blueTeam?.name} - 팀 구성
          </h3>
          
          <div className="space-y-3">
            {currentGame.blueTeam.picks.map((champion, index) => {
              const championData = getChampionById(champion.id);
              const positions = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
              
              return (
                <div key={index} className="flex items-center space-x-3 p-2 bg-team-blue/10 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={championData?.image}
                      alt={championData?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{championData?.name}</div>
                    <div className="text-team-blue text-sm">{positions[index]}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {championData?.tags.join(' • ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 밴 목록 */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">밴한 챔피언</h4>
            <div className="flex space-x-2">
              {currentGame.blueTeam.bans.map((ban, index) => {
                const championData = getChampionById(ban.id);
                return (
                  <div key={index} className="relative">
                    <img
                      src={championData?.image}
                      alt={championData?.name}
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="absolute inset-0 bg-red-500/30 rounded-md"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 레드팀 구성 */}
        <div className="card team-card-red">
          <h3 className="text-xl font-bold text-team-red mb-4 text-center">
            {redTeam?.name} - 팀 구성
          </h3>
          
          <div className="space-y-3">
            {currentGame.redTeam.picks.map((champion, index) => {
              const championData = getChampionById(champion.id);
              const positions = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
              
              return (
                <div key={index} className="flex items-center space-x-3 p-2 bg-team-red/10 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={championData?.image}
                      alt={championData?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{championData?.name}</div>
                    <div className="text-team-red text-sm">{positions[index]}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {championData?.tags.join(' • ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 밴 목록 */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">밴한 챔피언</h4>
            <div className="flex space-x-2">
              {currentGame.redTeam.bans.map((ban, index) => {
                const championData = getChampionById(ban.id);
                return (
                  <div key={index} className="relative">
                    <img
                      src={championData?.image}
                      alt={championData?.name}
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="absolute inset-0 bg-red-500/30 rounded-md"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 분석 결과 */}
      <div className="card">
        <h3 className="text-2xl font-bold text-lol-gold mb-6 text-center">
          AI 구도 분석 결과
        </h3>
        
        {isAnalyzing ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lol-gold mb-4"></div>
            <div className="text-white text-lg">AI가 구도를 분석 중입니다...</div>
            <div className="text-gray-400 text-sm mt-2">
              n8n 데이터와 GPT-5를 활용하여 심층 분석을 진행합니다
            </div>
          </div>
        ) : analysisResult ? (
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800 rounded-lg p-6 whitespace-pre-wrap">
              {analysisResult}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              분석 결과가 없습니다.
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetMatch}
          className="btn-secondary"
        >
          새로운 매치 시작
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            // TODO: 분석 결과 내보내기 기능
            console.log('Export analysis');
          }}
        >
          분석 결과 내보내기
        </button>
      </div>
    </div>
  );
};

export default AnalysisPanel;