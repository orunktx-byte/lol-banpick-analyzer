// 챔피언 이미지 URL을 생성하고 fallback을 제공하는 유틸리티

const CHAMPION_IMAGE_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/';
const FALLBACK_IMAGE = 'https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/Aatrox.png';

export const getChampionImageUrl = (champion: any): string => {
  if (!champion) return FALLBACK_IMAGE;
  
  // 이미 완전한 URL이 있다면 사용
  if (champion.image && champion.image.startsWith('https://')) {
    return champion.image;
  }
  
  // 챔피언 키나 ID를 사용해서 URL 생성
  const key = champion.key || champion.id;
  if (!key) return FALLBACK_IMAGE;
  
  // 첫 글자를 대문자로 변환
  const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
  
  return `${CHAMPION_IMAGE_BASE}${formattedKey}.png`;
};

export const getChampionImageWithFallback = (champion: any): { src: string; fallback: string } => {
  const primaryUrl = getChampionImageUrl(champion);
  const fallbackUrl = champion?.key 
    ? `${CHAMPION_IMAGE_BASE}${champion.key}.png`
    : `${CHAMPION_IMAGE_BASE}${champion?.id || 'Aatrox'}.png`;
    
  return {
    src: primaryUrl,
    fallback: fallbackUrl !== primaryUrl ? fallbackUrl : FALLBACK_IMAGE
  };
};