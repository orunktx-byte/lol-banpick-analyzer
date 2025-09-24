// 챔피언 이미지 URL을 생성하고 fallback을 제공하는 유틸리티
// 2025년 현재 Data Dragon은 여전히 15.x.x 형태 사용
const CHAMPION_IMAGE_BASE = 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/';
const FALLBACK_IMAGE = 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Aatrox.png';

// 특별한 챔피언들을 위한 커스텀 이미지 맵
const CUSTOM_CHAMPION_IMAGES: Record<string, string> = {
  'yunnara': 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Yuumi.png', // 유나라를 위한 임시 이미지 (유미 사용)
  'Yunnara': 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Yuumi.png'
};

export const getChampionImageUrl = (champion: any): string => {
  if (!champion) return FALLBACK_IMAGE;
  
  // 커스텀 이미지가 있는지 확인
  const championId = champion.id || champion.key;
  if (championId && CUSTOM_CHAMPION_IMAGES[championId]) {
    return CUSTOM_CHAMPION_IMAGES[championId];
  }
  
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
  const championId = champion?.id || champion?.key;
  
  // 커스텀 이미지가 있는 경우
  if (championId && CUSTOM_CHAMPION_IMAGES[championId]) {
    return {
      src: CUSTOM_CHAMPION_IMAGES[championId],
      fallback: CUSTOM_CHAMPION_IMAGES[championId] // 커스텀 이미지는 항상 사용 가능하다고 가정
    };
  }
  
  const primaryUrl = getChampionImageUrl(champion);
  const fallbackUrl = champion?.key 
    ? `${CHAMPION_IMAGE_BASE}${champion.key}.png`
    : `${CHAMPION_IMAGE_BASE}${champion?.id || 'Aatrox'}.png`;
    
  return {
    src: primaryUrl,
    fallback: fallbackUrl !== primaryUrl ? fallbackUrl : FALLBACK_IMAGE
  };
};