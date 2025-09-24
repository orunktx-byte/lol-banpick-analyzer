import { useAppStore } from '../stores/appStore';
import { TEAMS_DATA } from '../data/teams';
import type { League } from '../types';

const TeamSelection = () => {
  const {
    selectedBlueLeague,
    selectedRedLeague,
    selectedBlueTeam,
    selectedRedTeam,
    setSelectedBlueLeague,
    setSelectedRedLeague,
    setSelectedBlueTeam,
    setSelectedRedTeam,
    startFearlessMatch
  } = useAppStore();

  const handleStartMatch = () => {
    if (selectedBlueTeam && selectedRedTeam) {
      startFearlessMatch(selectedBlueTeam, selectedRedTeam);
    }
  };

  const canStartMatch = selectedBlueTeam && selectedRedTeam && selectedBlueTeam !== selectedRedTeam;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 text-shadow">
          팀 선택
        </h2>
        
        <p className="text-gray-300 text-lg">
          두 팀을 선택하여 피어리스 BO5를 시작하세요
        </p>
        
        <div className="mt-2 text-sm text-gray-400">
          피어리스 모드: 각 팀은 한 번 사용한 챔피언을 다시 사용할 수 없습니다
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 블루팀 선택 */}
        <div className="card team-card-blue">
          <h3 className="text-2xl font-bold text-team-blue mb-6 text-center">
            블루팀
          </h3>
          
          {/* 리그 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              리그 선택
            </label>
            <select
              value={selectedBlueLeague || ''}
              onChange={(e) => setSelectedBlueLeague(e.target.value as League)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-team-blue"
            >
              <option value="">리그를 선택하세요</option>
              <option value="LCK">LCK (한국)</option>
              <option value="LPL">LPL (중국)</option>
              <option value="LEC">LEC (유럽)</option>
            </select>
          </div>

          {/* 팀 선택 */}
          {selectedBlueLeague && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                팀 선택
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {TEAMS_DATA[selectedBlueLeague].map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedBlueTeam(team.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedBlueTeam === team.id
                        ? 'bg-team-blue/30 border-team-blue text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{team.shortName}</div>
                    <div className="text-xs opacity-80">{team.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedBlueTeam && (
            <div className="text-center p-4 bg-team-blue/20 rounded-lg">
              <div className="text-team-blue font-bold">선택된 팀</div>
              <div className="text-white text-lg">
                {TEAMS_DATA[selectedBlueLeague!].find(t => t.id === selectedBlueTeam)?.name}
              </div>
            </div>
          )}
        </div>

        {/* 레드팀 선택 */}
        <div className="card team-card-red">
          <h3 className="text-2xl font-bold text-team-red mb-6 text-center">
            레드팀
          </h3>
          
          {/* 리그 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              리그 선택
            </label>
            <select
              value={selectedRedLeague || ''}
              onChange={(e) => setSelectedRedLeague(e.target.value as League)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-team-red"
            >
              <option value="">리그를 선택하세요</option>
              <option value="LCK">LCK (한국)</option>
              <option value="LPL">LPL (중국)</option>
              <option value="LEC">LEC (유럽)</option>
            </select>
          </div>

          {/* 팀 선택 */}
          {selectedRedLeague && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                팀 선택
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {TEAMS_DATA[selectedRedLeague].map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedRedTeam(team.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedRedTeam === team.id
                        ? 'bg-team-red/30 border-team-red text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{team.shortName}</div>
                    <div className="text-xs opacity-80">{team.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedRedTeam && (
            <div className="text-center p-4 bg-team-red/20 rounded-lg">
              <div className="text-team-red font-bold">선택된 팀</div>
              <div className="text-white text-lg">
                {TEAMS_DATA[selectedRedLeague!].find(t => t.id === selectedRedTeam)?.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 시작 버튼 */}
      <div className="text-center">
        <button
          onClick={handleStartMatch}
          disabled={!canStartMatch}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
            canStartMatch
              ? 'bg-lol-gold text-gray-900 hover:bg-yellow-400 hover:scale-105 shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          피어리스 BO5 시작
        </button>
      </div>
    </div>
  );
};

export default TeamSelection;