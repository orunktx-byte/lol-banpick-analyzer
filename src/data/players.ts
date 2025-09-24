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

  // === LPL 선수들 (2025년 최신 로스터) ===
  
  // BLG 선수들 (2025 시즌)
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

  // T1 LPL 선수들 (2025 신규 진출)
  {
    id: 't1_lpl_zeus',
    name: 'Choi Woo-je',
    nickname: 'Zeus',
    position: 'TOP',
    teamId: 'lpl_t1',
    profileImage: '/players/zeus.png'
  },
  {
    id: 't1_lpl_oner',
    name: 'Moon Hyeon-jun',
    nickname: 'Oner',
    position: 'JUNGLE',
    teamId: 'lpl_t1',
    profileImage: '/players/oner.png'
  },
  {
    id: 't1_lpl_faker',
    name: 'Lee Sang-hyeok',
    nickname: 'Faker',
    position: 'MID',
    teamId: 'lpl_t1',
    profileImage: '/players/faker.png'
  },
  {
    id: 't1_lpl_guma',
    name: 'Lee Min-hyeong',
    nickname: 'Gumayusi',
    position: 'ADC',
    teamId: 'lpl_t1',
    profileImage: '/players/gumayusi.png'
  },
  {
    id: 't1_lpl_keria',
    name: 'Ryu Min-seok',
    nickname: 'Keria',
    position: 'SUPPORT',
    teamId: 'lpl_t1',
    profileImage: '/players/keria.png'
  },

  // LNG 선수들 (2025 시즌)
  {
    id: 'lng_zika',
    name: 'Zhao Xin-Kai',
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
    name: 'Zhang Hang',
    nickname: 'Hang',
    position: 'SUPPORT',
    teamId: 'lpl_lng',
    profileImage: '/players/hang.png'
  },

  // WBG 선수들 (2025 시즌)
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

  // JDG 선수들 (2025 시즌)
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
    id: 'jdg_yagao',
    name: 'Zeng Qi',
    nickname: 'Yagao',
    position: 'MID',
    teamId: 'lpl_jdg',
    profileImage: '/players/yagao.png'
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
    name: 'Liu Jun',
    nickname: 'Missing',
    position: 'SUPPORT',
    teamId: 'lpl_jdg',
    profileImage: '/players/missing.png'
  },

  // TES 선수들 (2025 시즌)
  {
    id: 'tes_wayward',
    name: 'Seo Sang-won',
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
    id: 'tes_rookie',
    name: 'Song Eui-jin',
    nickname: 'Rookie',
    position: 'MID',
    teamId: 'lpl_tes',
    profileImage: '/players/rookie.png'
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

  // HLE LPL 선수들 (2025 신규 진출)
  {
    id: 'hle_lpl_doran',
    name: 'Choi Hyeon-joon',
    nickname: 'Doran',
    position: 'TOP',
    teamId: 'lpl_hle',
    profileImage: '/players/doran.png'
  },
  {
    id: 'hle_lpl_peanut',
    name: 'Han Wang-ho',
    nickname: 'Peanut',
    position: 'JUNGLE',
    teamId: 'lpl_hle',
    profileImage: '/players/peanut.png'
  },
  {
    id: 'hle_lpl_chovy',
    name: 'Jeong Ji-hoon',
    nickname: 'Chovy',
    position: 'MID',
    teamId: 'lpl_hle',
    profileImage: '/players/chovy.png'
  },
  {
    id: 'hle_lpl_viper',
    name: 'Park Do-hyeon',
    nickname: 'Viper',
    position: 'ADC',
    teamId: 'lpl_hle',
    profileImage: '/players/viper.png'
  },
  {
    id: 'hle_lpl_zeka',
    name: 'Kim Geon-woo',
    nickname: 'Zeka',
    position: 'SUPPORT',
    teamId: 'lpl_hle',
    profileImage: '/players/zeka.png'
  },

  // IG 선수들 (2025 시즌)
  {
    id: 'ig_breathe',
    name: 'Chen Chen',
    nickname: 'Breathe',
    position: 'TOP',
    teamId: 'lpl_ig',
    profileImage: '/players/breathe.png'
  },
  {
    id: 'ig_xun',
    name: 'Li Zhao-Xun',
    nickname: 'XUN',
    position: 'JUNGLE',
    teamId: 'lpl_ig',
    profileImage: '/players/xun_ig.png'
  },
  {
    id: 'ig_yuekai',
    name: 'Wang Yue-Kai',
    nickname: 'Yuekai',
    position: 'MID',
    teamId: 'lpl_ig',
    profileImage: '/players/yuekai.png'
  },
  {
    id: 'ig_ahn',
    name: 'An Young-min',
    nickname: 'Ahn',
    position: 'ADC',
    teamId: 'lpl_ig',
    profileImage: '/players/ahn.png'
  },
  {
    id: 'ig_wink',
    name: 'Wang Long',
    nickname: 'Wink',
    position: 'SUPPORT',
    teamId: 'lpl_ig',
    profileImage: '/players/wink.png'
  },

  // FPX 선수들 (2025 시즌)
  {
    id: 'fpx_xiaolaohu',
    name: 'Zhang Zhao-Yang',
    nickname: 'xiaolaohu',
    position: 'TOP',
    teamId: 'lpl_fpx',
    profileImage: '/players/xiaolaohu.png'
  },
  {
    id: 'fpx_clid',
    name: 'Kim Tae-min',
    nickname: 'Clid',
    position: 'JUNGLE',
    teamId: 'lpl_fpx',
    profileImage: '/players/clid.png'
  },
  {
    id: 'fpx_care',
    name: 'Liang Jun-Jie',
    nickname: 'Care',
    position: 'MID',
    teamId: 'lpl_fpx',
    profileImage: '/players/care.png'
  },
  {
    id: 'fpx_lwx',
    name: 'Lin Wei-Xiang',
    nickname: 'Lwx',
    position: 'ADC',
    teamId: 'lpl_fpx',
    profileImage: '/players/lwx.png'
  },
  {
    id: 'fpx_lele',
    name: 'Han Le-Le',
    nickname: 'lele',
    position: 'SUPPORT',
    teamId: 'lpl_fpx',
    profileImage: '/players/lele.png'
  },

  // RNG 선수들 (2025 시즌)
  {
    id: 'rng_breathe',
    name: 'Chen Chen',
    nickname: 'Breathe',
    position: 'TOP',
    teamId: 'lpl_rng',
    profileImage: '/players/breathe_rng.png'
  },
  {
    id: 'rng_wei',
    name: 'Li Rui',
    nickname: 'Wei',
    position: 'JUNGLE',
    teamId: 'lpl_rng',
    profileImage: '/players/wei.png'
  },
  {
    id: 'rng_zeka',
    name: 'Kim Geon-woo',
    nickname: 'Zeka',
    position: 'MID',
    teamId: 'lpl_rng',
    profileImage: '/players/zeka_rng.png'
  },
  {
    id: 'rng_gala',
    name: 'Chen Wei',
    nickname: 'GALA',
    position: 'ADC',
    teamId: 'lpl_rng',
    profileImage: '/players/gala_rng.png'
  },
  {
    id: 'rng_ming',
    name: 'Shi Sen-Ming',
    nickname: 'Ming',
    position: 'SUPPORT',
    teamId: 'lpl_rng',
    profileImage: '/players/ming.png'
  },

  // EDG 선수들 (2025 시즌)
  {
    id: 'edg_ale',
    name: 'Zhao Jia-Le',
    nickname: 'Ale',
    position: 'TOP',
    teamId: 'lpl_edg',
    profileImage: '/players/ale.png'
  },
  {
    id: 'edg_jiejie',
    name: 'Zhao Li-Jie',
    nickname: 'Jiejie',
    position: 'JUNGLE',
    teamId: 'lpl_edg',
    profileImage: '/players/jiejie.png'
  },
  {
    id: 'edg_fofo',
    name: 'Chang Che-Bin',
    nickname: 'Fofo',
    position: 'MID',
    teamId: 'lpl_edg',
    profileImage: '/players/fofo.png'
  },
  {
    id: 'edg_leave',
    name: 'Huang Huan',
    nickname: 'Leave',
    position: 'ADC',
    teamId: 'lpl_edg',
    profileImage: '/players/leave.png'
  },
  {
    id: 'edg_meiko',
    name: 'Tian Ye',
    nickname: 'Meiko',
    position: 'SUPPORT',
    teamId: 'lpl_edg',
    profileImage: '/players/meiko_edg.png'
  },

  // WE 선수들 (2025 시즌)
  {
    id: 'we_breathe',
    name: 'Li Hao-Ran',
    nickname: 'Breathe',
    position: 'TOP',
    teamId: 'lpl_we',
    profileImage: '/players/breathe_we.png'
  },
  {
    id: 'we_beishang',
    name: 'Peng Bei-Shang',
    nickname: 'Beishang',
    position: 'JUNGLE',
    teamId: 'lpl_we',
    profileImage: '/players/beishang.png'
  },
  {
    id: 'we_shanks',
    name: 'Wang Yang',
    nickname: 'shanks',
    position: 'MID',
    teamId: 'lpl_we',
    profileImage: '/players/shanks.png'
  },
  {
    id: 'we_hope',
    name: 'Jin Cheng-Lu',
    nickname: 'Hope',
    position: 'ADC',
    teamId: 'lpl_we',
    profileImage: '/players/hope.png'
  },
  {
    id: 'we_iwandy',
    name: 'Zhang Wan-Di',
    nickname: 'iwandy',
    position: 'SUPPORT',
    teamId: 'lpl_we',
    profileImage: '/players/iwandy.png'
  },

  // LGD 선수들 (2025 시즌)
  {
    id: 'lgd_fearness',
    name: 'Du Kang',
    nickname: 'Fearness',
    position: 'TOP',
    teamId: 'lpl_lgd',
    profileImage: '/players/fearness.png'
  },
  {
    id: 'lgd_tarzan',
    name: 'Liang Guo-Hao',
    nickname: 'Tarzan',
    position: 'JUNGLE',
    teamId: 'lpl_lgd',
    profileImage: '/players/tarzan_lgd.png'
  },
  {
    id: 'lgd_scout',
    name: 'Sun Zi-Hao',
    nickname: 'Scout',
    position: 'MID',
    teamId: 'lpl_lgd',
    profileImage: '/players/scout_lgd.png'
  },
  {
    id: 'lgd_eric',
    name: 'Wang Zi-Jie',
    nickname: 'Eric',
    position: 'ADC',
    teamId: 'lpl_lgd',
    profileImage: '/players/eric.png'
  },
  {
    id: 'lgd_mark',
    name: 'Zhang Jie',
    nickname: 'Mark',
    position: 'SUPPORT',
    teamId: 'lpl_lgd',
    profileImage: '/players/mark.png'
  },

  // AL 선수들 (2025 시즌)
  {
    id: 'al_zdz',
    name: 'Zhou De-Zhi',
    nickname: 'zdz',
    position: 'TOP',
    teamId: 'lpl_al',
    profileImage: '/players/zdz.png'
  },
  {
    id: 'al_xiaohao',
    name: 'Li Xiao-Hao',
    nickname: 'xiaohao',
    position: 'JUNGLE',
    teamId: 'lpl_al',
    profileImage: '/players/xiaohao.png'
  },
  {
    id: 'al_forge',
    name: 'Felix Runesson',
    nickname: 'Forge',
    position: 'MID',
    teamId: 'lpl_al',
    profileImage: '/players/forge.png'
  },
  {
    id: 'al_elk',
    name: 'Liu Jin-Hao',
    nickname: 'Elk',
    position: 'ADC',
    teamId: 'lpl_al',
    profileImage: '/players/elk_al.png'
  },
  {
    id: 'al_lvmao',
    name: 'Liu Wei-Dong',
    nickname: 'Lvmao',
    position: 'SUPPORT',
    teamId: 'lpl_al',
    profileImage: '/players/lvmao.png'
  },

  // OMG 선수들 (2025 시즌)
  {
    id: 'omg_shanji',
    name: 'Li Shan-Ji',
    nickname: 'Shanji',
    position: 'TOP',
    teamId: 'lpl_omg',
    profileImage: '/players/shanji.png'
  },
  {
    id: 'omg_aki',
    name: 'Gao Zhen-Ning',
    nickname: 'Aki',
    position: 'JUNGLE',
    teamId: 'lpl_omg',
    profileImage: '/players/aki.png'
  },
  {
    id: 'omg_creme',
    name: 'Chen Jing-Yu',
    nickname: 'Creme',
    position: 'MID',
    teamId: 'lpl_omg',
    profileImage: '/players/creme_omg.png'
  },
  {
    id: 'omg_able',
    name: 'Lin Kai-Jing',
    nickname: 'Able',
    position: 'ADC',
    teamId: 'lpl_omg',
    profileImage: '/players/able.png'
  },
  {
    id: 'omg_ppgod',
    name: 'Zhang Hong-Jie',
    nickname: 'ppgod',
    position: 'SUPPORT',
    teamId: 'lpl_omg',
    profileImage: '/players/ppgod.png'
  },

  // NIP 선수들 (2025 시즌)
  {
    id: 'nip_rich',
    name: 'Lei Hao',
    nickname: 'Rich',
    position: 'TOP',
    teamId: 'lpl_nip',
    profileImage: '/players/rich.png'
  },
  {
    id: 'nip_leyan',
    name: 'Yan Li-Yang',
    nickname: 'Leyan',
    position: 'JUNGLE',
    teamId: 'lpl_nip',
    profileImage: '/players/leyan.png'
  },
  {
    id: 'nip_rookie',
    name: 'Bae Jun-Sik',
    nickname: 'Rookie',
    position: 'MID',
    teamId: 'lpl_nip',
    profileImage: '/players/rookie_nip.png'
  },
  {
    id: 'nip_photic',
    name: 'Huang Cong-Xiang',
    nickname: 'Photic',
    position: 'ADC',
    teamId: 'lpl_nip',
    profileImage: '/players/photic.png'
  },
  {
    id: 'nip_southwind',
    name: 'Deng Nan-Feng',
    nickname: 'SouthWind',
    position: 'SUPPORT',
    teamId: 'lpl_nip',
    profileImage: '/players/southwind.png'
  },

  // UP 선수들 (2025 시즌)
  {
    id: 'up_zs',
    name: 'Zhou Shuo',
    nickname: 'zs',
    position: 'TOP',
    teamId: 'lpl_up',
    profileImage: '/players/zs.png'
  },
  {
    id: 'up_h4cker',
    name: 'Zhang Jun-Jie',
    nickname: 'H4cker',
    position: 'JUNGLE',
    teamId: 'lpl_up',
    profileImage: '/players/h4cker.png'
  },
  {
    id: 'up_cryin',
    name: 'Yuan Cheng-Wei',
    nickname: 'Cryin',
    position: 'MID',
    teamId: 'lpl_up',
    profileImage: '/players/cryin.png'
  },
  {
    id: 'up_wink',
    name: 'Chen Rui-Jie',
    nickname: 'Wink',
    position: 'ADC',
    teamId: 'lpl_up',
    profileImage: '/players/wink_up.png'
  },
  {
    id: 'up_cold',
    name: 'Leng Yu-Chen',
    nickname: 'Cold',
    position: 'SUPPORT',
    teamId: 'lpl_up',
    profileImage: '/players/cold.png'
  },


  // === LEC 선수들 (2025년 최신 로스터) ===
  
  // G2 선수들 (2025 시즌)
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
  },

  // FNC 선수들 (2025 시즌)
  {
    id: 'fnc_oscarinin',
    name: 'Óscar Muñoz Jiménez',
    nickname: 'Oscarinin',
    position: 'TOP',
    teamId: 'lec_fnc',
    profileImage: '/players/oscarinin.png'
  },
  {
    id: 'fnc_razork',
    name: 'Iván Martín Díaz',
    nickname: 'Razork',
    position: 'JUNGLE',
    teamId: 'lec_fnc',
    profileImage: '/players/razork.png'
  },
  {
    id: 'fnc_humanoid',
    name: 'Marek Brázda',
    nickname: 'Humanoid',
    position: 'MID',
    teamId: 'lec_fnc',
    profileImage: '/players/humanoid.png'
  },
  {
    id: 'fnc_noah',
    name: 'Oh Hyeon-taek',
    nickname: 'Noah',
    position: 'ADC',
    teamId: 'lec_fnc',
    profileImage: '/players/noah.png'
  },
  {
    id: 'fnc_jun',
    name: 'Yoon Se-jun',
    nickname: 'Jun',
    position: 'SUPPORT',
    teamId: 'lec_fnc',
    profileImage: '/players/jun.png'
  },

  // MAD 선수들 (2025 시즌)
  {
    id: 'mad_chasy',
    name: 'Mateusz Matczak',
    nickname: 'Chasy',
    position: 'TOP',
    teamId: 'lec_mad',
    profileImage: '/players/chasy.png'
  },
  {
    id: 'mad_elyoya',
    name: 'Javier Prades Batalla',
    nickname: 'Elyoya',
    position: 'JUNGLE',
    teamId: 'lec_mad',
    profileImage: '/players/elyoya.png'
  },
  {
    id: 'mad_nisqy',
    name: 'Yasin Dinçer',
    nickname: 'Nisqy',
    position: 'MID',
    teamId: 'lec_mad',
    profileImage: '/players/nisqy.png'
  },
  {
    id: 'mad_carzzy',
    name: 'Matyáš Orság',
    nickname: 'Carzzy',
    position: 'ADC',
    teamId: 'lec_mad',
    profileImage: '/players/carzzy.png'
  },
  {
    id: 'mad_alvaro',
    name: 'Álvaro Fernández van der Heijden',
    nickname: 'Alvaro',
    position: 'SUPPORT',
    teamId: 'lec_mad',
    profileImage: '/players/alvaro.png'
  },

  // TH 선수들 (2025 시즌)
  {
    id: 'th_wunder',
    name: 'Martin Hansen',
    nickname: 'Wunder',
    position: 'TOP',
    teamId: 'lec_th',
    profileImage: '/players/wunder.png'
  },
  {
    id: 'th_jankos',
    name: 'Marcin Jankowski',
    nickname: 'Jankos',
    position: 'JUNGLE',
    teamId: 'lec_th',
    profileImage: '/players/jankos.png'
  },
  {
    id: 'th_perkz',
    name: 'Luka Perković',
    nickname: 'Perkz',
    position: 'MID',
    teamId: 'lec_th',
    profileImage: '/players/perkz.png'
  },
  {
    id: 'th_upset',
    name: 'Elias Lipp',
    nickname: 'Upset',
    position: 'ADC',
    teamId: 'lec_th',
    profileImage: '/players/upset.png'
  },
  {
    id: 'th_labrov',
    name: 'Labros Papoutsakis',
    nickname: 'Labrov',
    position: 'SUPPORT',
    teamId: 'lec_th',
    profileImage: '/players/labrov.png'
  },

  // VIT 선수들 (2025 시즌)
  {
    id: 'vit_photon',
    name: 'Lucas Hajek',
    nickname: 'Photon',
    position: 'TOP',
    teamId: 'lec_vit',
    profileImage: '/players/photon.png'
  },
  {
    id: 'vit_daglas',
    name: 'Dag-Morten Sørvoll',
    nickname: 'Daglas',
    position: 'JUNGLE',
    teamId: 'lec_vit',
    profileImage: '/players/daglas.png'
  },
  {
    id: 'vit_vetheo',
    name: 'Vincent Berrié',
    nickname: 'Vetheo',
    position: 'MID',
    teamId: 'lec_vit',
    profileImage: '/players/vetheo.png'
  },
  {
    id: 'vit_crownie',
    name: 'Christos Mauroeidis',
    nickname: 'Crownie',
    position: 'ADC',
    teamId: 'lec_vit',
    profileImage: '/players/crownie.png'
  },
  {
    id: 'vit_hylissang',
    name: 'Zdravets Galabov',
    nickname: 'Hylissang',
    position: 'SUPPORT',
    teamId: 'lec_vit',
    profileImage: '/players/hylissang.png'
  },

  // NAVI 선수들 (2025 신규 참가팀)
  {
    id: 'navi_duke',
    name: 'Lee Ho-seong',
    nickname: 'Duke',
    position: 'TOP',
    teamId: 'lec_navi',
    profileImage: '/players/duke.png'
  },
  {
    id: 'navi_malrang',
    name: 'Kim Geun-seong',
    nickname: 'Malrang',
    position: 'JUNGLE',
    teamId: 'lec_navi',
    profileImage: '/players/malrang.png'
  },
  {
    id: 'navi_abbedagge',
    name: 'Felix Braun',
    nickname: 'Abbedagge',
    position: 'MID',
    teamId: 'lec_navi',
    profileImage: '/players/abbedagge.png'
  },
  {
    id: 'navi_isma',
    name: 'Ismael Delgado',
    nickname: 'Isma',
    position: 'ADC',
    teamId: 'lec_navi',
    profileImage: '/players/isma.png'
  },
  {
    id: 'navi_zoelys',
    name: 'Zoé Chelaia',
    nickname: 'Zoelys',
    position: 'SUPPORT',
    teamId: 'lec_navi',
    profileImage: '/players/zoelys.png'
  },

  // BDS 선수들 (2025 시즌)
  {
    id: 'bds_adam',
    name: 'Adam Maanane',
    nickname: 'Adam',
    position: 'TOP',
    teamId: 'lec_bds',
    profileImage: '/players/adam.png'
  },
  {
    id: 'bds_sheo',
    name: 'Theo Borile',
    nickname: 'Sheo',
    position: 'JUNGLE',
    teamId: 'lec_bds',
    profileImage: '/players/sheo.png'
  },
  {
    id: 'bds_nuc',
    name: 'Erlend Holm',
    nickname: 'nuc',
    position: 'MID',
    teamId: 'lec_bds',
    profileImage: '/players/nuc.png'
  },
  {
    id: 'bds_ice',
    name: 'Mykhailo Zub',
    nickname: 'Ice',
    position: 'ADC',
    teamId: 'lec_bds',
    profileImage: '/players/ice.png'
  },
  {
    id: 'bds_jackspektra',
    name: 'Jack Höfsommer',
    nickname: 'Jackspektra',
    position: 'SUPPORT',
    teamId: 'lec_bds',
    profileImage: '/players/jackspektra.png'
  },

  // KOI 선수들 (2025 시즌)
  {
    id: 'koi_szygenda',
    name: 'Andrei Pascu',
    nickname: 'Szygenda',
    position: 'TOP',
    teamId: 'lec_koi',
    profileImage: '/players/szygenda.png'
  },
  {
    id: 'koi_xerxe',
    name: 'Andrei Dragomir',
    nickname: 'Xerxe',
    position: 'JUNGLE',
    teamId: 'lec_koi',
    profileImage: '/players/xerxe.png'
  },
  {
    id: 'koi_larssen',
    name: 'Emil Larsson',
    nickname: 'Larssen',
    position: 'MID',
    teamId: 'lec_koi',
    profileImage: '/players/larssen.png'
  },
  {
    id: 'koi_sivir',
    name: 'Matúš Béreš',
    nickname: 'Sivir',
    position: 'ADC',
    teamId: 'lec_koi',
    profileImage: '/players/sivir.png'
  },
  {
    id: 'koi_targamas',
    name: 'Raphaël Crabbé',
    nickname: 'Targamas',
    position: 'SUPPORT',
    teamId: 'lec_koi',
    profileImage: '/players/targamas.png'
  },

  // GX 선수들 (2025 시즌)
  {
    id: 'gx_odoamne',
    name: 'Andrei Pascu',
    nickname: 'Odoamne',
    position: 'TOP',
    teamId: 'lec_gx',
    profileImage: '/players/odoamne.png'
  },
  {
    id: 'gx_bo',
    name: 'Liang Bó',
    nickname: 'Bo',
    position: 'JUNGLE',
    teamId: 'lec_gx',
    profileImage: '/players/bo.png'
  },
  {
    id: 'gx_caps',
    name: 'Félix Holmlund',
    nickname: 'Caps',
    position: 'MID',
    teamId: 'lec_gx',
    profileImage: '/players/caps_gx.png'
  },
  {
    id: 'gx_jackies',
    name: 'Jakob Leppänen',
    nickname: 'Jackies',
    position: 'ADC',
    teamId: 'lec_gx',
    profileImage: '/players/jackies.png'
  },
  {
    id: 'gx_mikyx',
    name: 'Mihael Mehle',
    nickname: 'Mikyx',
    position: 'SUPPORT',
    teamId: 'lec_gx',
    profileImage: '/players/mikyx_gx.png'
  },

  // SK 선수들 (2025 시즌)
  {
    id: 'sk_irrelevant',
    name: 'Tim Hamachers',
    nickname: 'Irrelevant',
    position: 'TOP',
    teamId: 'lec_sk',
    profileImage: '/players/irrelevant.png'
  },
  {
    id: 'sk_markoon',
    name: 'Mark van Woensel',
    nickname: 'Markoon',
    position: 'JUNGLE',
    teamId: 'lec_sk',
    profileImage: '/players/markoon.png'
  },
  {
    id: 'sk_dipshit',
    name: 'Daniyal Zahid',
    nickname: 'Dipshit',
    position: 'MID',
    teamId: 'lec_sk',
    profileImage: '/players/dipshit.png'
  },
  {
    id: 'sk_exakick',
    name: 'Erik Paál',
    nickname: 'Exakick',
    position: 'ADC',
    teamId: 'lec_sk',
    profileImage: '/players/exakick.png'
  },
  {
    id: 'sk_doss',
    name: 'DoA Sun-Hoon',
    nickname: 'Doss',
    position: 'SUPPORT',
    teamId: 'lec_sk',
    profileImage: '/players/doss.png'
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