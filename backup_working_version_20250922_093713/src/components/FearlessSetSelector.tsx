import { useAppStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';

const FearlessSetSelector = () => {
  const { 
    fearlessMatch, 
    switchToSet, 
    swapTeamsInSet, 
    setSetWinner 
  } = useAppStore();

  if (!fearlessMatch) return null;

  const teamA = getTeamById(fearlessMatch.teamA.id);
  const teamB = getTeamById(fearlessMatch.teamB.id);

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-lol-gold">
          🏆 피어리스 BO5 ({fearlessMatch.score.teamA}-{fearlessMatch.score.teamB})
        </h2>
        <div className="text-sm text-gray-300">
          현재 세트: {fearlessMatch.currentSet}
        </div>
      </div>

      {/* 팀 정보 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{teamA?.name}</div>
          <div className="text-2xl font-bold text-lol-gold">{fearlessMatch.score.teamA}</div>
        </div>
        
        <div className="text-center text-gray-400">
          vs
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">{teamB?.name}</div>
          <div className="text-2xl font-bold text-lol-gold">{fearlessMatch.score.teamB}</div>
        </div>
      </div>

      {/* 세트 선택 탭 */}
      <div className="flex space-x-2 mb-4">
        {fearlessMatch.sets.map((set) => {
          const isActive = set.setNumber === fearlessMatch.currentSet;
          const isCompleted = set.isCompleted;
          
          // 승리 팀에 따른 색상 결정
          let buttonColor = 'bg-gray-700 text-white hover:bg-gray-600';
          if (isActive) {
            buttonColor = 'bg-lol-gold text-black';
          } else if (isCompleted && set.winner) {
            // 블루팀이 이긴 경우 파란색, 레드팀이 이긴 경우 빨간색
            if (set.winner === set.blueTeamId) {
              buttonColor = 'bg-blue-600 text-white hover:bg-blue-500';
            } else if (set.winner === set.redTeamId) {
              buttonColor = 'bg-red-600 text-white hover:bg-red-500';
            }
          }
          
          return (
            <button
              key={set.setNumber}
              onClick={() => switchToSet(set.setNumber)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${buttonColor}`}
            >
              Game {set.setNumber}
              {isCompleted && set.winner && (
                <div className="text-xs mt-1">
                  승: {set.winner === set.blueTeamId 
                    ? getTeamById(set.blueTeamId)?.shortName 
                    : getTeamById(set.redTeamId)?.shortName}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 현재 세트 정보 */}
      {(() => {
        const currentSet = fearlessMatch.sets.find(s => s.setNumber === fearlessMatch.currentSet);
        if (!currentSet) return null;

        const blueTeam = getTeamById(currentSet.blueTeamId);
        const redTeam = getTeamById(currentSet.redTeamId);

        return (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Game {currentSet.setNumber}</h3>
              
              {/* 팀 스위치 버튼 */}
              <button
                onClick={() => swapTeamsInSet(currentSet.setNumber)}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-500 transition-colors"
                disabled={currentSet.isCompleted}
              >
                🔄 팀 스위치
              </button>
            </div>

            {/* 팀 배치 표시 */}
            <div className="grid grid-cols-3 gap-4 items-center mb-4">
              <div className="text-center p-3 bg-blue-900/30 rounded-lg border border-blue-500">
                <div className="text-blue-400 font-bold">{blueTeam?.name}</div>
                <div className="text-xs text-blue-300">블루팀</div>
              </div>
              
              <div className="text-center text-gray-400">
                vs
              </div>
              
              <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-500">
                <div className="text-red-400 font-bold">{redTeam?.name}</div>
                <div className="text-xs text-red-300">레드팀</div>
              </div>
            </div>

            {/* 세트 결과 설정 */}
            {!currentSet.isCompleted && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setSetWinner(currentSet.setNumber, currentSet.blueTeamId)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {blueTeam?.shortName} 승리
                </button>
                <button
                  onClick={() => setSetWinner(currentSet.setNumber, currentSet.redTeamId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
                >
                  {redTeam?.shortName} 승리
                </button>
              </div>
            )}

            {currentSet.isCompleted && (
              <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-500">
                <div className="text-green-400 font-bold">
                  🏆 승리: {currentSet.winner === fearlessMatch.teamA.id ? teamA?.name : teamB?.name}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default FearlessSetSelector;