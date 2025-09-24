import type { Team, League } from '../types';

export const TEAMS_DATA: Record<League, Team[]> = {
  LCK: [
    {
      id: 'lck_t1',
      name: 'T1',
      shortName: 'T1',
      league: 'LCK',
      logo: '/logos/t1.png',
      coach: 'kkOma (김정균)' // T1 2025년 현재 감독
    },
    {
      id: 'lck_gen',
      name: 'Gen.G',
      shortName: 'GEN',
      league: 'LCK',
      logo: '/logos/gen.png',
      coach: 'KIM (김정수)' // Gen.G 2025년 감독
    },
    {
      id: 'lck_hle',
      name: 'Hanwha Life Esports',
      shortName: 'HLE',
      league: 'LCK',
      logo: '/logos/hle.png',
      coach: 'DanDy (최인규)' // HLE 2025년 감독
    },
    {
      id: 'lck_drx',
      name: 'DRX',
      shortName: 'DRX',
      league: 'LCK',
      logo: '/logos/drx.png',
      coach: 'Ssong (김상수)' // DRX 2025년 감독
    },
    {
      id: 'lck_kt',
      name: 'KT Rolster',
      shortName: 'KT',
      league: 'LCK',
      logo: '/logos/kt.png',
      coach: 'Score (고동빈)' // KT 2025년 감독
    },
    {
      id: 'lck_ns',
      name: 'Nongshim RedForce',
      shortName: 'NS',
      league: 'LCK',
      logo: '/logos/ns.png',
      coach: 'Chelly (박승진)' // NS 2025년 감독
    },
    {
      id: 'lck_lsb',
      name: 'FearX',
      shortName: 'FX',
      league: 'LCK',
      logo: '/logos/fx.png',
      coach: 'Ryu (유상욱)' // FearX 2025년 감독
    },
    {
      id: 'lck_bro',
      name: 'OK Brion',
      shortName: 'BRO',
      league: 'LCK',
      logo: '/logos/bro.png',
      coach: 'Duke (이호성)' // BRO 2025년 감독
    },
    {
      id: 'lck_dk',
      name: 'DWG KIA',
      shortName: 'DK',
      league: 'LCK',
      logo: '/logos/dk.png',
      coach: 'Bengi (배성웅)' // DK 2025년 감독
    },
    {
      id: 'lck_kwangdong',
      name: 'Kwangdong Freecs',
      shortName: 'KDF',
      league: 'LCK',
      logo: '/logos/kdf.png',
      coach: 'oDin (주영달)' // KDF 2025년 감독
    }
  ],
  LPL: [
    {
      id: 'lpl_blg',
      name: 'Bilibili Gaming',
      shortName: 'BLG',
      league: 'LPL',
      logo: '/logos/blg.png',
      coach: 'BigWei (주웨이)' // BLG 2025년 감독
    },
    {
      id: 'lpl_jdg',
      name: 'JD Gaming',
      shortName: 'JDG',
      league: 'LPL',
      logo: '/logos/jdg.png',
      coach: 'Tabe (황박간)' // JDG 2025년 감독
    },
    {
      id: 'lpl_tes',
      name: 'Top Esports',
      shortName: 'TES',
      league: 'LPL',
      logo: '/logos/tes.png',
      coach: 'Homme (온성엽)' // TES 2025년 감독
    },
    {
      id: 'lpl_lng',
      name: 'LNG Esports',
      shortName: 'LNG',
      league: 'LPL',
      logo: '/logos/lng.png',
      coach: 'Maizijian (펑신이)' // LNG 2025년 감독
    },
    {
      id: 'lpl_wbg',
      name: 'Weibo Gaming',
      shortName: 'WBG',
      league: 'LPL',
      logo: '/logos/wbg.png',
      coach: 'Despa1r (저우리핑)' // WBG 2025년 감독
    },
    {
      id: 'lpl_edg',
      name: 'Edward Gaming',
      shortName: 'EDG',
      league: 'LPL',
      logo: '/logos/edg.png',
      coach: 'Mni (팡방)' // EDG 2025년 감독
    },
    {
      id: 'lpl_ig',
      name: 'Invictus Gaming',
      shortName: 'IG',
      league: 'LPL',
      logo: '/logos/ig.png',
      coach: 'Daeny (양대인)' // IG 2025년 감독
    },
    {
      id: 'lpl_rng',
      name: 'Royal Never Give Up',
      shortName: 'RNG',
      league: 'LPL',
      logo: '/logos/rng.png',
      coach: 'Heart (이람형)' // RNG 2025년 감독
    },
    {
      id: 'lpl_fpx',
      name: 'FunPlus Phoenix',
      shortName: 'FPX',
      league: 'LPL',
      logo: '/logos/fpx.png',
      coach: 'kkOma (김정균)' // FPX 2025년 감독 (BRO에서 이적)
    },
    {
      id: 'lpl_al',
      name: 'Anyone Legend',
      shortName: 'AL',
      league: 'LPL',
      logo: '/logos/al.png',
      coach: 'Blanc'
    },
    {
      id: 'lpl_omg',
      name: 'Oh My God',
      shortName: 'OMG',
      league: 'LPL',
      logo: '/logos/omg.png',
      coach: 'Mingzai'
    },
    {
      id: 'lpl_ninjas',
      name: 'Ninjas in Pyjamas',
      shortName: 'NIP',
      league: 'LPL',
      logo: '/logos/nip.png',
      coach: 'SoHwan'
    },
    {
      id: 'lpl_up',
      name: 'Ultra Prime',
      shortName: 'UP',
      league: 'LPL',
      logo: '/logos/up.png',
      coach: 'Daming'
    },
    {
      id: 'lpl_ra',
      name: 'Rare Atom',
      shortName: 'RA',
      league: 'LPL',
      logo: '/logos/ra.png',
      coach: 'Flawless'
    },
    {
      id: 'lpl_ttg',
      name: 'ThunderTalk Gaming',
      shortName: 'TTG',
      league: 'LPL',
      logo: '/logos/ttg.png',
      coach: 'Steak'
    },
    {
      id: 'lpl_lwx',
      name: 'Light Gaming',
      shortName: 'LGD',
      league: 'LPL',
      logo: '/logos/lgd.png',
      coach: 'Waowa'
    },
    {
      id: 'lpl_wolves',
      name: 'Wolves Esports',
      shortName: 'WOL',
      league: 'LPL',
      logo: '/logos/wol.png',
      coach: 'Steak'
    }
  ],
  LEC: [
    {
      id: 'lec_g2',
      name: 'G2 Esports',
      shortName: 'G2',
      league: 'LEC',
      logo: '/logos/g2.png',
      coach: 'Dylan Palco (딜런 팔코)' // G2 2025년 감독
    },
    {
      id: 'lec_fnc',
      name: 'Fnatic',
      shortName: 'FNC',
      league: 'LEC',
      logo: '/logos/fnc.png',
      coach: 'GrabbZ (파비안 로만)' // FNC 2025년 감독
    },
    {
      id: 'lec_mad',
      name: 'MAD Lions KOI',
      shortName: 'MDK',
      league: 'LEC',
      logo: '/logos/mdk.png',
      coach: 'Melzhet (도마스 캄엘루스)' // MDK 2025년 감독
    },
    {
      id: 'lec_bds',
      name: 'Team BDS',
      shortName: 'BDS',
      league: 'LEC',
      logo: '/logos/bds.png',
      coach: 'Striker (아니스 젤라)' // BDS 2025년 감독
    },
    {
      id: 'lec_th',
      name: 'Team Heretics',
      shortName: 'TH',
      league: 'LEC',
      logo: '/logos/th.png',
      coach: 'Machuki (빅토르 마추카)' // TH 2025년 감독
    },
    {
      id: 'lec_vit',
      name: 'Team Vitality',
      shortName: 'VIT',
      league: 'LEC',
      logo: '/logos/vit.png',
      coach: 'Mac (제임스 맥콜랙)' // VIT 2025년 감독
    },
    {
      id: 'lec_sk',
      name: 'SK Gaming',
      shortName: 'SK',
      league: 'LEC',
      logo: '/logos/sk.png',
      coach: 'OWN3R (다비드 포드라체스)' // SK 2025년 감독
    },
    {
      id: 'lec_kc',
      name: 'Karmine Corp',
      shortName: 'KC',
      league: 'LEC',
      logo: '/logos/kc.png',
      coach: 'Reha'
    },
    {
      id: 'lec_gia',
      name: 'Giants',
      shortName: 'GIA',
      league: 'LEC',
      logo: '/logos/gia.png',
      coach: 'Youngbuck'
    },
    {
      id: 'lec_gx',
      name: 'GIANTX',
      shortName: 'GX',
      league: 'LEC',
      logo: '/logos/gx.png',
      coach: 'Guilhoto'
    }
  ]
};

export const getTeamsByLeague = (league: League): Team[] => {
  return TEAMS_DATA[league] || [];
};

export const getTeamById = (teamId: string): Team | undefined => {
  for (const league of Object.values(TEAMS_DATA)) {
    const team = league.find(t => t.id === teamId);
    if (team) return team;
  }
  return undefined;
};