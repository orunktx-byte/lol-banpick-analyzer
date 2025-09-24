import type { Player, Position } from '../types';

export const PLAYERS_DATA: Player[] = [
  // T1 선수들 (2024-2025 시즌 최신 로스터)
  {
    id: 't1_doran',
    name: 'Choi Hyeon-joon',
    nickname: 'Doran',
    position: 'TOP',
    teamId: 'lck_t1',
    profileImage: '/players/doran.png'
  },
  {
    id: 't1_oner',
    name: 'Moon Hyeon-jun',
    nickname: 'Oner',
    position: 'JUNGLE',
    teamId: 'lck_t1',
    profileImage: '/players/oner.png'
  },
  {
    id: 't1_faker',
    name: 'Lee Sang-hyeok',
    nickname: 'Faker',
    position: 'MID',
    teamId: 'lck_t1',
    profileImage: '/players/faker.png'
  },
  {
    id: 't1_gumayusi',
    name: 'Lee Min-hyeong',
    nickname: 'Gumayusi',
    position: 'ADC',
    teamId: 'lck_t1',
    profileImage: '/players/gumayusi.png'
  },
  {
    id: 't1_keria',
    name: 'Ryu Min-seok',
    nickname: 'Keria',
    position: 'SUPPORT',
    teamId: 'lck_t1',
    profileImage: '/players/keria.png'
  },
  
  // Gen.G 선수들 (2024-2025 시즌 최신 로스터)
  {
    id: 'gen_kiin',
    name: 'Kim Gi-in',
    nickname: 'Kiin',
    position: 'TOP',
    teamId: 'lck_gen',
    profileImage: '/players/kiin.png'
  },
  {
    id: 'gen_canyon',
    name: 'Kim Geon-bu',
    nickname: 'Canyon',
    position: 'JUNGLE',
    teamId: 'lck_gen',
    profileImage: '/players/canyon.png'
  },
  {
    id: 'gen_chovy',
    name: 'Jeong Ji-hoon',
    nickname: 'Chovy',
    position: 'MID',
    teamId: 'lck_gen',
    profileImage: '/players/chovy.png'
  },
  {
    id: 'gen_ruler',
    name: 'Park Jae-hyuk',
    nickname: 'Ruler',
    position: 'ADC',
    teamId: 'lck_gen',
    profileImage: '/players/ruler.png'
  },
  {
    id: 'gen_duro',
    name: 'Lee Dong-ju',
    nickname: 'Duro',
    position: 'SUPPORT',
    teamId: 'lck_gen',
    profileImage: '/players/duro.png'
  },

  // HLE 선수들 (2024-2025 시즌 최신 로스터)
  {
    id: 'hle_zeus',
    name: 'Choi Woo-je',
    nickname: 'Zeus',
    position: 'TOP',
    teamId: 'lck_hle',
    profileImage: '/players/zeus.png'
  },
  {
    id: 'hle_peanut',
    name: 'Han Wang-ho',
    nickname: 'Peanut',
    position: 'JUNGLE',
    teamId: 'lck_hle',
    profileImage: '/players/peanut.png'
  },
  {
    id: 'hle_zeka',
    name: 'Kim Geon-woo',
    nickname: 'Zeka',
    position: 'MID',
    teamId: 'lck_hle',
    profileImage: '/players/zeka.png'
  },
  {
    id: 'hle_viper',
    name: 'Park Do-hyeon',
    nickname: 'Viper',
    position: 'ADC',
    teamId: 'lck_hle',
    profileImage: '/players/viper.png'
  },
  {
    id: 'hle_delight',
    name: 'Yoo Hwan-joong',
    nickname: 'Delight',
    position: 'SUPPORT',
    teamId: 'lck_hle',
    profileImage: '/players/delight.png'
  },

  // DRX 선수들 (2025시즌)
  {
    id: 'drx_kingen',
    name: 'Hwang Seong-hoon',
    nickname: 'Kingen',
    position: 'TOP',
    teamId: 'lck_drx',
    profileImage: '/players/kingen.png'
  },
  {
    id: 'drx_croco',
    name: 'Park Jong-hoon',
    nickname: 'Croco',
    position: 'JUNGLE',
    teamId: 'lck_drx',
    profileImage: '/players/croco.png'
  },
  {
    id: 'drx_showmaker',
    name: 'Heo Su',
    nickname: 'ShowMaker',
    position: 'MID',
    teamId: 'lck_drx',
    profileImage: '/players/showmaker.png'
  },
  {
    id: 'drx_deft',
    name: 'Kim Hyuk-kyu',
    nickname: 'Deft',
    position: 'ADC',
    teamId: 'lck_drx',
    profileImage: '/players/deft.png'
  },
  {
    id: 'drx_beryl',
    name: 'Cho Geon-hee',
    nickname: 'BeryL',
    position: 'SUPPORT',
    teamId: 'lck_drx',
    profileImage: '/players/beryl.png'
  },

  // KT Rolster 선수들 (2025시즌)
  {
    id: 'kt_bdd',
    name: 'Gwak Bo-seong',
    nickname: 'BDD',
    position: 'TOP',
    teamId: 'lck_kt',
    profileImage: '/players/bdd.png'
  },
  {
    id: 'kt_pyosik',
    name: 'Hong Chang-hyeon',
    nickname: 'Pyosik',
    position: 'JUNGLE',
    teamId: 'lck_kt',
    profileImage: '/players/pyosik.png'
  },
  {
    id: 'kt_bdd_mid',
    name: 'Gwak Bo-seong',
    nickname: 'BDD',
    position: 'MID',
    teamId: 'lck_kt',
    profileImage: '/players/bdd.png'
  },
  {
    id: 'kt_aiming',
    name: 'Kim Ha-ram',
    nickname: 'Aiming',
    position: 'ADC',
    teamId: 'lck_kt',
    profileImage: '/players/aiming.png'
  },
  {
    id: 'kt_life',
    name: 'Park Jeong-sik',
    nickname: 'Life',
    position: 'SUPPORT',
    teamId: 'lck_kt',
    profileImage: '/players/life.png'
  },

  // Nongshim RedForce 선수들 (2025시즌)
  {
    id: 'ns_dplus',
    name: 'Park Jin-cheol',
    nickname: 'DPlus',
    position: 'TOP',
    teamId: 'lck_ns',
    profileImage: '/players/dplus.png'
  },
  {
    id: 'ns_willer',
    name: 'Kim Dong-yoon',
    nickname: 'Willer',
    position: 'JUNGLE',
    teamId: 'lck_ns',
    profileImage: '/players/willer.png'
  },
  {
    id: 'ns_fisher',
    name: 'Park Jun-ho',
    nickname: 'Fisher',
    position: 'MID',
    teamId: 'lck_ns',
    profileImage: '/players/fisher.png'
  },
  {
    id: 'ns_hena',
    name: 'Kim Min-seung',
    nickname: 'Hena',
    position: 'ADC',
    teamId: 'lck_ns',
    profileImage: '/players/hena.png'
  },
  {
    id: 'ns_effort',
    name: 'Lee Sang-ho',
    nickname: 'Effort',
    position: 'SUPPORT',
    teamId: 'lck_ns',
    profileImage: '/players/effort.png'
  },

  // FearX 선수들 (2025시즌) 
  {
    id: 'fx_clear',
    name: 'Lee Seung-hoon',
    nickname: 'Clear',
    position: 'TOP',
    teamId: 'lck_lsb',
    profileImage: '/players/clear.png'
  },
  {
    id: 'fx_yoon',
    name: 'Yoon Se-hyun',
    nickname: 'Yoon',
    position: 'JUNGLE',
    teamId: 'lck_lsb',
    profileImage: '/players/yoon.png'
  },
  {
    id: 'fx_clozer',
    name: 'Lee Ju-hyeon',
    nickname: 'Clozer',
    position: 'MID',
    teamId: 'lck_lsb',
    profileImage: '/players/clozer.png'
  },
  {
    id: 'fx_teddy',
    name: 'Park Jin-seong',
    nickname: 'Teddy',
    position: 'ADC',
    teamId: 'lck_lsb',
    profileImage: '/players/teddy.png'
  },
  {
    id: 'fx_kael',
    name: 'Kim Jin-hong',
    nickname: 'Kael',
    position: 'SUPPORT',
    teamId: 'lck_lsb',
    profileImage: '/players/kael.png'
  },

  // OK Brion 선수들 (2025시즌)
  {
    id: 'bro_morgan',
    name: 'Park Gi-tae',
    nickname: 'Morgan',
    position: 'TOP',
    teamId: 'lck_bro',
    profileImage: '/players/morgan.png'
  },
  {
    id: 'bro_lucid',
    name: 'Lee Kyung-hyun',
    nickname: 'Lucid',
    position: 'JUNGLE',
    teamId: 'lck_bro',
    profileImage: '/players/lucid.png'
  },
  {
    id: 'bro_karis',
    name: 'Lee Hong-jo',
    nickname: 'Karis',
    position: 'MID',
    teamId: 'lck_bro',
    profileImage: '/players/karis.png'
  },
  {
    id: 'bro_hype',
    name: 'Kim Hyeong-jun',
    nickname: 'Hype',
    position: 'ADC',
    teamId: 'lck_bro',
    profileImage: '/players/hype.png'
  },
  {
    id: 'bro_pollu',
    name: 'Park Jung-won',
    nickname: 'Pollu',
    position: 'SUPPORT',
    teamId: 'lck_bro',
    profileImage: '/players/pollu.png'
  },

  // DWG KIA 선수들 (2025시즌)
  {
    id: 'dk_rascal',
    name: 'Kim Kwang-hee',
    nickname: 'Rascal',
    position: 'TOP',
    teamId: 'lck_dk',
    profileImage: '/players/rascal.png'
  },
  {
    id: 'dk_canyon_alt',
    name: 'Kim Geon-bu',
    nickname: 'Canyon',
    position: 'JUNGLE',
    teamId: 'lck_dk',
    profileImage: '/players/canyon.png'
  },
  {
    id: 'dk_showmaker_alt',
    name: 'Heo Su',
    nickname: 'ShowMaker',
    position: 'MID',
    teamId: 'lck_dk',
    profileImage: '/players/showmaker.png'
  },
  {
    id: 'dk_kellin',
    name: 'Kim Hyeong-gyu',
    nickname: 'Kellin',
    position: 'ADC',
    teamId: 'lck_dk',
    profileImage: '/players/kellin.png'
  },
  {
    id: 'dk_beryl_alt',
    name: 'Cho Geon-hee',
    nickname: 'BeryL',
    position: 'SUPPORT',
    teamId: 'lck_dk',
    profileImage: '/players/beryl.png'
  },

  // Kwangdong Freecs 선수들 (2025시즌)
  {
    id: 'kdf_dove',
    name: 'Lee Jae-yong',
    nickname: 'Dove',
    position: 'TOP',
    teamId: 'lck_kwangdong',
    profileImage: '/players/dove.png'
  },
  {
    id: 'kdf_pullbae',
    name: 'Kim Dae-hwan',
    nickname: 'Pullbae',
    position: 'JUNGLE',
    teamId: 'lck_kwangdong',
    profileImage: '/players/pullbae.png'
  },
  {
    id: 'kdf_bdd_kdf',
    name: 'Park Chan-young',
    nickname: 'Fly',
    position: 'MID',
    teamId: 'lck_kwangdong',
    profileImage: '/players/fly.png'
  },
  {
    id: 'kdf_envyy',
    name: 'Jeong Hyeon-su',
    nickname: 'Envyy',
    position: 'ADC',
    teamId: 'lck_kwangdong',
    profileImage: '/players/envyy.png'
  },
  {
    id: 'kdf_andil',
    name: 'Kim Seong-hyeon',
    nickname: 'Andil',
    position: 'SUPPORT',
    teamId: 'lck_kwangdong',
    profileImage: '/players/andil.png'
  },

  // BLG 선수들
  {
    id: 'blg_bin',
    name: 'Chen Ze-Bin',
    nickname: 'Bin',
    position: 'TOP',
    teamId: 'lpl_blg',
    profileImage: '/players/bin.png'
  },
  {
    id: 'blg_xun',
    name: 'Peng Li-Xun',
    nickname: 'Xun',
    position: 'JUNGLE',
    teamId: 'lpl_blg',
    profileImage: '/players/xun.png'
  },
  {
    id: 'blg_knight',
    name: 'Zhuo Ding',
    nickname: 'Knight',
    position: 'MID',
    teamId: 'lpl_blg',
    profileImage: '/players/knight.png'
  },
  {
    id: 'blg_elk',
    name: 'Zhao Jia-Hao',
    nickname: 'Elk',
    position: 'ADC',
    teamId: 'lpl_blg',
    profileImage: '/players/elk.png'
  },
  {
    id: 'blg_on',
    name: 'Luo Wen-Jun',
    nickname: 'ON',
    position: 'SUPPORT',
    teamId: 'lpl_blg',
    profileImage: '/players/on.png'
  },

  // JDG 선수들 (2024-2025 시즌)
  {
    id: 'jdg_369',
    name: 'Bai Jia-Hao',
    nickname: '369',
    position: 'TOP',
    teamId: 'lpl_jdg',
    profileImage: '/players/369.png'
  },
  {
    id: 'jdg_kanavi',
    name: 'Seo Jin-hyeok',
    nickname: 'Kanavi',
    position: 'JUNGLE',
    teamId: 'lpl_jdg',
    profileImage: '/players/kanavi.png'
  },
  {
    id: 'jdg_knight',
    name: 'Zhuo Ding',
    nickname: 'Knight',
    position: 'MID',
    teamId: 'lpl_jdg',
    profileImage: '/players/knight.png'
  },
  {
    id: 'jdg_ruler',
    name: 'Park Jae-hyuk',
    nickname: 'Ruler',
    position: 'ADC',
    teamId: 'lpl_jdg',
    profileImage: '/players/ruler.png'
  },
  {
    id: 'jdg_missing',
    name: 'Shi Sen-Ming',
    nickname: 'Missing',
    position: 'SUPPORT',
    teamId: 'lpl_jdg',
    profileImage: '/players/missing.png'
  },

  // TES 선수들 (2024-2025 시즌)
  {
    id: 'tes_wayward',
    name: 'Wu Hao-Yang',
    nickname: 'Wayward',
    position: 'TOP',
    teamId: 'lpl_tes',
    profileImage: '/players/wayward.png'
  },
  {
    id: 'tes_tian',
    name: 'Gao Tian-Liang',
    nickname: 'Tian',
    position: 'JUNGLE',
    teamId: 'lpl_tes',
    profileImage: '/players/tian.png'
  },
  {
    id: 'tes_creme',
    name: 'Chen Jing-Yu',
    nickname: 'Creme',
    position: 'MID',
    teamId: 'lpl_tes',
    profileImage: '/players/creme.png'
  },
  {
    id: 'tes_jackeylove',
    name: 'Yu Wen-Bo',
    nickname: 'JackeyLove',
    position: 'ADC',
    teamId: 'lpl_tes',
    profileImage: '/players/jackeylove.png'
  },
  {
    id: 'tes_meiko',
    name: 'Tian Ye',
    nickname: 'Meiko',
    position: 'SUPPORT',
    teamId: 'lpl_tes',
    profileImage: '/players/meiko.png'
  },

  // LNG 선수들 (2024-2025 시즌)
  {
    id: 'lng_zika',
    name: 'Liu Wei-Chen',
    nickname: 'Zika',
    position: 'TOP',
    teamId: 'lpl_lng',
    profileImage: '/players/zika.png'
  },
  {
    id: 'lng_tarzan',
    name: 'Lee Seung-yong',
    nickname: 'Tarzan',
    position: 'JUNGLE',
    teamId: 'lpl_lng',
    profileImage: '/players/tarzan.png'
  },
  {
    id: 'lng_scout',
    name: 'Lee Ye-chan',
    nickname: 'Scout',
    position: 'MID',
    teamId: 'lpl_lng',
    profileImage: '/players/scout.png'
  },
  {
    id: 'lng_gala',
    name: 'Chen Wei',
    nickname: 'GALA',
    position: 'ADC',
    teamId: 'lpl_lng',
    profileImage: '/players/gala.png'
  },
  {
    id: 'lng_hang',
    name: 'Wang Hang',
    nickname: 'Hang',
    position: 'SUPPORT',
    teamId: 'lpl_lng',
    profileImage: '/players/hang.png'
  },

  // WBG 선수들 (2024-2025 시즌)
  {
    id: 'wbg_theshy',
    name: 'Kang Seung-lok',
    nickname: 'TheShy',
    position: 'TOP',
    teamId: 'lpl_wbg',
    profileImage: '/players/theshy.png'
  },
  {
    id: 'wbg_weiwei',
    name: 'Du Peng',
    nickname: 'WeiWei',
    position: 'JUNGLE',
    teamId: 'lpl_wbg',
    profileImage: '/players/weiwei.png'
  },
  {
    id: 'wbg_xiaohu',
    name: 'Li Yuan-Hao',
    nickname: 'Xiaohu',
    position: 'MID',
    teamId: 'lpl_wbg',
    profileImage: '/players/xiaohu.png'
  },
  {
    id: 'wbg_light',
    name: 'Wang Guang-Yu',
    nickname: 'Light',
    position: 'ADC',
    teamId: 'lpl_wbg',
    profileImage: '/players/light.png'
  },
  {
    id: 'wbg_crisp',
    name: 'Liu Qing-Song',
    nickname: 'Crisp',
    position: 'SUPPORT',
    teamId: 'lpl_wbg',
    profileImage: '/players/crisp.png'
  },

  // G2 선수들
  {
    id: 'g2_brokenblade',
    name: 'Sergen Çelik',
    nickname: 'BrokenBlade',
    position: 'TOP',
    teamId: 'lec_g2',
    profileImage: '/players/brokenblade.png'
  },
  {
    id: 'g2_yike',
    name: 'Martin Sundelin',
    nickname: 'Yike',
    position: 'JUNGLE',
    teamId: 'lec_g2',
    profileImage: '/players/yike.png'
  },
  {
    id: 'g2_caps',
    name: 'Rasmus Winther',
    nickname: 'Caps',
    position: 'MID',
    teamId: 'lec_g2',
    profileImage: '/players/caps.png'
  },
  {
    id: 'g2_hans',
    name: 'Steven Liv',
    nickname: 'Hans sama',
    position: 'ADC',
    teamId: 'lec_g2',
    profileImage: '/players/hans.png'
  },
  {
    id: 'g2_mikyx',
    name: 'Mihael Mehle',
    nickname: 'Mikyx',
    position: 'SUPPORT',
    teamId: 'lec_g2',
    profileImage: '/players/mikyx.png'
  }
];

export const getPlayersByTeam = (teamId: string): Player[] => {
  return PLAYERS_DATA.filter(player => player.teamId === teamId);
};

export const getPlayersByPosition = (teamId: string, position: Position): Player | undefined => {
  return PLAYERS_DATA.find(player => player.teamId === teamId && player.position === position);
};

export const getPlayerById = (playerId: string): Player | undefined => {
  return PLAYERS_DATA.find(player => player.id === playerId);
};