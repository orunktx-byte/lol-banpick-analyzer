import { useState, useEffect } from 'react';
import { searchChampions } from '../data/champions';
import { useAppStore } from '../stores/appStore';
import { getChampionImageWithFallback } from '../utils/imageUtils';
import type { Champion } from '../types';

interface ChampionSearchProps {
  onChampionSelect: (championId: string) => void;
  onClose: () => void;
  actionType: 'BAN' | 'PICK' | null;
  teamSide: 'BLUE' | 'RED' | null;
}

const ChampionSearch = ({ onChampionSelect, onClose, actionType, teamSide }: ChampionSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const { fearlessMatch } = useAppStore();

  // 피어리스 모드에서 사용할 수 없는 챔피언들 계산
  const getUnavailableChampions = (): Set<string> => {
    if (!fearlessMatch) return new Set();
    
    const unavailable = new Set<string>();
    
    // 전체적으로 사용된 챔피언들 (픽만)
    fearlessMatch.usedChampions.teamA.forEach(c => unavailable.add(c.id));
    fearlessMatch.usedChampions.teamB.forEach(c => unavailable.add(c.id));
    
    // 완료된 세트들의 모든 픽과 밴
    fearlessMatch.sets.forEach(set => {
      if (set.isCompleted) {
        // 완료된 세트의 모든 픽 챔피언
        set.game.blueTeam.picks.forEach(pick => {
          if (pick) unavailable.add(pick.id);
        });
        set.game.redTeam.picks.forEach(pick => {
          if (pick) unavailable.add(pick.id);
        });
        // 완료된 세트의 모든 밴 챔피언
        set.game.blueTeam.bans.forEach(ban => {
          if (ban) unavailable.add(ban.id);
        });
        set.game.redTeam.bans.forEach(ban => {
          if (ban) unavailable.add(ban.id);
        });
      }
    });
    
    return unavailable;
  };

  const unavailableChampions = getUnavailableChampions();

  useEffect(() => {
    const results = searchChampions(searchQuery);
    setFilteredChampions(results);
  }, [searchQuery]);

  const handleChampionClick = (championId: string) => {
    // 피어리스 모드에서 사용할 수 없는 챔피언인지 확인
    if (unavailableChampions.has(championId)) {
      alert('이 챔피언은 이미 사용되어 선택할 수 없습니다. (Fearless Rule)');
      return;
    }
    onChampionSelect(championId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-lol-light-blue rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              챔피언 {actionType === 'BAN' ? '밴' : '픽'} - 
              <span className={teamSide === 'BLUE' ? 'text-team-blue' : 'text-team-red'}>
                {teamSide === 'BLUE' ? '블루팀' : '레드팀'}
              </span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* 검색 입력 */}
        <div className="p-6 border-b border-gray-600">
          <input
            type="text"
            placeholder="챔피언 이름을 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-lol-gold focus:border-transparent"
            autoFocus
          />
        </div>

        {/* 챔피언 그리드 */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredChampions.map((champion) => {
              const isUnavailable = unavailableChampions.has(champion.id);
              return (
                <div
                  key={champion.id}
                  onClick={() => handleChampionClick(champion.id)}
                  className={`group ${isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`bg-gray-800 rounded-lg p-3 transition-all duration-200 relative ${
                    isUnavailable 
                      ? 'opacity-50 hover:opacity-60' 
                      : 'hover:bg-gray-700 hover:scale-105 hover:shadow-lg'
                  }`}>
                    {/* 피어리스 규칙 표시 */}
                    {isUnavailable && (
                      <div className="absolute inset-0 bg-red-900/80 rounded-lg flex items-center justify-center z-10">
                        <div className="text-white text-xs font-bold text-center">
                          <div>🚫</div>
                          <div>USED</div>
                        </div>
                      </div>
                    )}
                    <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden flex items-center justify-center relative">
                      <img 
                        src={getChampionImageWithFallback(champion).src} 
                        alt={champion.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = getChampionImageWithFallback(champion).fallback;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          } else {
                            target.style.display = 'none';
                            const fallbackDiv = target.nextElementSibling as HTMLElement;
                            if (fallbackDiv) fallbackDiv.style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        className="w-full h-full bg-gradient-to-br from-lol-gold to-yellow-600 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg absolute top-0 left-0"
                        style={{ display: 'none' }}
                      >
                        {champion.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm font-medium truncate">
                        {champion.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {champion.tags.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredChampions.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                "{searchQuery}"에 대한 검색 결과가 없습니다.
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-600 text-center">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChampionSearch;