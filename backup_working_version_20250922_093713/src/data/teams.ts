import type { Team, League } from '../types';

export const TEAMS_DATA: Record<League, Team[]> = {
  LCK: [
    {
      id: 'lck_t1',
      name: 'T1',
      shortName: 'T1',
      league: 'LCK',
      logo: '/logos/t1.png'
    },
    {
      id: 'lck_gen',
      name: 'Gen.G',
      shortName: 'GEN',
      league: 'LCK',
      logo: '/logos/gen.png'
    },
    {
      id: 'lck_hle',
      name: 'Hanwha Life Esports',
      shortName: 'HLE',
      league: 'LCK',
      logo: '/logos/hle.png'
    },
    {
      id: 'lck_drx',
      name: 'DRX',
      shortName: 'DRX',
      league: 'LCK',
      logo: '/logos/drx.png'
    },
    {
      id: 'lck_kt',
      name: 'KT Rolster',
      shortName: 'KT',
      league: 'LCK',
      logo: '/logos/kt.png'
    },
    {
      id: 'lck_ns',
      name: 'Nongshim RedForce',
      shortName: 'NS',
      league: 'LCK',
      logo: '/logos/ns.png'
    },
    {
      id: 'lck_lsb',
      name: 'FearX',
      shortName: 'FX',
      league: 'LCK',
      logo: '/logos/fx.png'
    },
    {
      id: 'lck_bro',
      name: 'OK Brion',
      shortName: 'BRO',
      league: 'LCK',
      logo: '/logos/bro.png'
    },
    {
      id: 'lck_dk',
      name: 'DWG KIA',
      shortName: 'DK',
      league: 'LCK',
      logo: '/logos/dk.png'
    },
    {
      id: 'lck_kwangdong',
      name: 'Kwangdong Freecs',
      shortName: 'KDF',
      league: 'LCK',
      logo: '/logos/kdf.png'
    }
  ],
  LPL: [
    {
      id: 'lpl_blg',
      name: 'Bilibili Gaming',
      shortName: 'BLG',
      league: 'LPL',
      logo: '/logos/blg.png'
    },
    {
      id: 'lpl_jdg',
      name: 'JD Gaming',
      shortName: 'JDG',
      league: 'LPL',
      logo: '/logos/jdg.png'
    },
    {
      id: 'lpl_tes',
      name: 'Top Esports',
      shortName: 'TES',
      league: 'LPL',
      logo: '/logos/tes.png'
    },
    {
      id: 'lpl_lng',
      name: 'LNG Esports',
      shortName: 'LNG',
      league: 'LPL',
      logo: '/logos/lng.png'
    },
    {
      id: 'lpl_wbg',
      name: 'Weibo Gaming',
      shortName: 'WBG',
      league: 'LPL',
      logo: '/logos/wbg.png'
    },
    {
      id: 'lpl_edg',
      name: 'Edward Gaming',
      shortName: 'EDG',
      league: 'LPL',
      logo: '/logos/edg.png'
    },
    {
      id: 'lpl_ig',
      name: 'Invictus Gaming',
      shortName: 'IG',
      league: 'LPL',
      logo: '/logos/ig.png'
    },
    {
      id: 'lpl_rng',
      name: 'Royal Never Give Up',
      shortName: 'RNG',
      league: 'LPL',
      logo: '/logos/rng.png'
    },
    {
      id: 'lpl_fpx',
      name: 'FunPlus Phoenix',
      shortName: 'FPX',
      league: 'LPL',
      logo: '/logos/fpx.png'
    },
    {
      id: 'lpl_al',
      name: 'Anyone Legend',
      shortName: 'AL',
      league: 'LPL',
      logo: '/logos/al.png'
    },
    {
      id: 'lpl_omg',
      name: 'Oh My God',
      shortName: 'OMG',
      league: 'LPL',
      logo: '/logos/omg.png'
    },
    {
      id: 'lpl_ninjas',
      name: 'Ninjas in Pyjamas',
      shortName: 'NIP',
      league: 'LPL',
      logo: '/logos/nip.png'
    },
    {
      id: 'lpl_up',
      name: 'Ultra Prime',
      shortName: 'UP',
      league: 'LPL',
      logo: '/logos/up.png'
    },
    {
      id: 'lpl_ra',
      name: 'Rare Atom',
      shortName: 'RA',
      league: 'LPL',
      logo: '/logos/ra.png'
    },
    {
      id: 'lpl_ttg',
      name: 'ThunderTalk Gaming',
      shortName: 'TTG',
      league: 'LPL',
      logo: '/logos/ttg.png'
    },
    {
      id: 'lpl_lwx',
      name: 'Light Gaming',
      shortName: 'LGD',
      league: 'LPL',
      logo: '/logos/lgd.png'
    },
    {
      id: 'lpl_wolves',
      name: 'Wolves Esports',
      shortName: 'WOL',
      league: 'LPL',
      logo: '/logos/wol.png'
    }
  ],
  LEC: [
    {
      id: 'lec_g2',
      name: 'G2 Esports',
      shortName: 'G2',
      league: 'LEC',
      logo: '/logos/g2.png'
    },
    {
      id: 'lec_fnc',
      name: 'Fnatic',
      shortName: 'FNC',
      league: 'LEC',
      logo: '/logos/fnc.png'
    },
    {
      id: 'lec_mad',
      name: 'MAD Lions KOI',
      shortName: 'MDK',
      league: 'LEC',
      logo: '/logos/mdk.png'
    },
    {
      id: 'lec_bds',
      name: 'Team BDS',
      shortName: 'BDS',
      league: 'LEC',
      logo: '/logos/bds.png'
    },
    {
      id: 'lec_th',
      name: 'Team Heretics',
      shortName: 'TH',
      league: 'LEC',
      logo: '/logos/th.png'
    },
    {
      id: 'lec_vit',
      name: 'Team Vitality',
      shortName: 'VIT',
      league: 'LEC',
      logo: '/logos/vit.png'
    },
    {
      id: 'lec_sk',
      name: 'SK Gaming',
      shortName: 'SK',
      league: 'LEC',
      logo: '/logos/sk.png'
    },
    {
      id: 'lec_kc',
      name: 'Karmine Corp',
      shortName: 'KC',
      league: 'LEC',
      logo: '/logos/kc.png'
    },
    {
      id: 'lec_gia',
      name: 'Giants',
      shortName: 'GIA',
      league: 'LEC',
      logo: '/logos/gia.png'
    },
    {
      id: 'lec_gx',
      name: 'GIANTX',
      shortName: 'GX',
      league: 'LEC',
      logo: '/logos/gx.png'
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