import type { Champion } from '../types';

// Riot Games Data Dragon 이미지 URL 베이스 (안정적인 검증된 패치)
// 2025년 현재 Data Dragon은 여전히 15.x.x 형태 사용
const CHAMPION_IMAGE_BASE = 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/';

export const CHAMPIONS_DATA: Champion[] = [
  // A로 시작하는 챔피언들
  { id: 'aatrox', name: '아트록스', key: 'Aatrox', image: `${CHAMPION_IMAGE_BASE}Aatrox.png`, tags: ['Fighter', 'Tank'] },
  { id: 'ahri', name: '아리', key: 'Ahri', image: `${CHAMPION_IMAGE_BASE}Ahri.png`, tags: ['Mage'] },
  { id: 'akali', name: '아칼리', key: 'Akali', image: `${CHAMPION_IMAGE_BASE}Akali.png`, tags: ['Assassin'] },
  { id: 'akshan', name: '아크샨', key: 'Akshan', image: `${CHAMPION_IMAGE_BASE}Akshan.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'alistar', name: '알리스타', key: 'Alistar', image: `${CHAMPION_IMAGE_BASE}Alistar.png`, tags: ['Tank', 'Support'] },
  { id: 'ambessa', name: '암베사', key: 'Ambessa', image: `${CHAMPION_IMAGE_BASE}Ambessa.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'amumu', name: '아무무', key: 'Amumu', image: `${CHAMPION_IMAGE_BASE}Amumu.png`, tags: ['Tank', 'Mage'] },
  { id: 'anivia', name: '애니비아', key: 'Anivia', image: `${CHAMPION_IMAGE_BASE}Anivia.png`, tags: ['Mage'] },
  { id: 'annie', name: '애니', key: 'Annie', image: `${CHAMPION_IMAGE_BASE}Annie.png`, tags: ['Mage'] },
  { id: 'aphelios', name: '아펠리오스', key: 'Aphelios', image: `${CHAMPION_IMAGE_BASE}Aphelios.png`, tags: ['Marksman'] },
  { id: 'ashe', name: '애쉬', key: 'Ashe', image: `${CHAMPION_IMAGE_BASE}Ashe.png`, tags: ['Marksman', 'Support'] },
  { id: 'aurelionsol', name: '아우렐리온 솔', key: 'AurelionSol', image: `${CHAMPION_IMAGE_BASE}AurelionSol.png`, tags: ['Mage'] },
  { id: 'aurora', name: '오로라', key: 'Aurora', image: `${CHAMPION_IMAGE_BASE}Aurora.png`, tags: ['Mage', 'Assassin'] },
  { id: 'azir', name: '아지르', key: 'Azir', image: `${CHAMPION_IMAGE_BASE}Azir.png`, tags: ['Mage', 'Marksman'] },

  // B로 시작하는 챔피언들
  { id: 'bard', name: '바드', key: 'Bard', image: `${CHAMPION_IMAGE_BASE}Bard.png`, tags: ['Support', 'Mage'] },
  { id: 'belveth', name: '벨베스', key: 'Belveth', image: `${CHAMPION_IMAGE_BASE}Belveth.png`, tags: ['Fighter'] },
  { id: 'blitzcrank', name: '블리츠크랭크', key: 'Blitzcrank', image: `${CHAMPION_IMAGE_BASE}Blitzcrank.png`, tags: ['Tank', 'Fighter'] },
  { id: 'brand', name: '브랜드', key: 'Brand', image: `${CHAMPION_IMAGE_BASE}Brand.png`, tags: ['Mage'] },
  { id: 'braum', name: '브라움', key: 'Braum', image: `${CHAMPION_IMAGE_BASE}Braum.png`, tags: ['Support', 'Tank'] },
  { id: 'briar', name: '브라이어', key: 'Briar', image: `${CHAMPION_IMAGE_BASE}Briar.png`, tags: ['Fighter', 'Assassin'] },

  // C로 시작하는 챔피언들
  { id: 'caitlyn', name: '케이틀린', key: 'Caitlyn', image: `${CHAMPION_IMAGE_BASE}Caitlyn.png`, tags: ['Marksman'] },
  { id: 'camille', name: '카밀', key: 'Camille', image: `${CHAMPION_IMAGE_BASE}Camille.png`, tags: ['Fighter'] },
  { id: 'cassiopeia', name: '카시오페아', key: 'Cassiopeia', image: `${CHAMPION_IMAGE_BASE}Cassiopeia.png`, tags: ['Mage'] },
  { id: 'chogath', name: '초가스', key: 'Chogath', image: `${CHAMPION_IMAGE_BASE}Chogath.png`, tags: ['Tank', 'Mage'] },
  { id: 'corki', name: '코르키', key: 'Corki', image: `${CHAMPION_IMAGE_BASE}Corki.png`, tags: ['Marksman', 'Mage'] },

  // D로 시작하는 챔피언들
  { id: 'darius', name: '다리우스', key: 'Darius', image: `${CHAMPION_IMAGE_BASE}Darius.png`, tags: ['Fighter', 'Tank'] },
  { id: 'diana', name: '다이애나', key: 'Diana', image: `${CHAMPION_IMAGE_BASE}Diana.png`, tags: ['Fighter', 'Mage'] },
  { id: 'draven', name: '드레이븐', key: 'Draven', image: `${CHAMPION_IMAGE_BASE}Draven.png`, tags: ['Marksman'] },
  { id: 'drmundo', name: '문도 박사', key: 'DrMundo', image: `${CHAMPION_IMAGE_BASE}DrMundo.png`, tags: ['Fighter', 'Tank'] },

  // E로 시작하는 챔피언들
  { id: 'ekko', name: '에코', key: 'Ekko', image: `${CHAMPION_IMAGE_BASE}Ekko.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'elise', name: '엘리스', key: 'Elise', image: `${CHAMPION_IMAGE_BASE}Elise.png`, tags: ['Mage'] },
  { id: 'evelynn', name: '이블린', key: 'Evelynn', image: `${CHAMPION_IMAGE_BASE}Evelynn.png`, tags: ['Assassin', 'Mage'] },
  { id: 'ezreal', name: '이즈리얼', key: 'Ezreal', image: `${CHAMPION_IMAGE_BASE}Ezreal.png`, tags: ['Marksman', 'Mage'] },

  // F로 시작하는 챔피언들
  { id: 'fiddlesticks', name: '피들스틱', key: 'Fiddlesticks', image: `${CHAMPION_IMAGE_BASE}Fiddlesticks.png`, tags: ['Mage', 'Support'] },
  { id: 'fiora', name: '피오라', key: 'Fiora', image: `${CHAMPION_IMAGE_BASE}Fiora.png`, tags: ['Fighter'] },
  { id: 'fizz', name: '피즈', key: 'Fizz', image: `${CHAMPION_IMAGE_BASE}Fizz.png`, tags: ['Assassin', 'Fighter'] },

  // G로 시작하는 챔피언들
  { id: 'galio', name: '갈리오', key: 'Galio', image: `${CHAMPION_IMAGE_BASE}Galio.png`, tags: ['Tank', 'Mage'] },
  { id: 'gangplank', name: '갱플랭크', key: 'Gangplank', image: `${CHAMPION_IMAGE_BASE}Gangplank.png`, tags: ['Fighter'] },
  { id: 'garen', name: '가렌', key: 'Garen', image: `${CHAMPION_IMAGE_BASE}Garen.png`, tags: ['Fighter', 'Tank'] },
  { id: 'gnar', name: '나르', key: 'Gnar', image: `${CHAMPION_IMAGE_BASE}Gnar.png`, tags: ['Fighter', 'Tank'] },
  { id: 'gragas', name: '그라가스', key: 'Gragas', image: `${CHAMPION_IMAGE_BASE}Gragas.png`, tags: ['Fighter', 'Mage'] },
  { id: 'graves', name: '그레이브즈', key: 'Graves', image: `${CHAMPION_IMAGE_BASE}Graves.png`, tags: ['Marksman'] },
  { id: 'gwen', name: '그웬', key: 'Gwen', image: `${CHAMPION_IMAGE_BASE}Gwen.png`, tags: ['Fighter', 'Assassin'] },

  // H로 시작하는 챔피언들
  { id: 'hecarim', name: '헤카림', key: 'Hecarim', image: `${CHAMPION_IMAGE_BASE}Hecarim.png`, tags: ['Fighter'] },
  { id: 'heimerdinger', name: '하이머딩거', key: 'Heimerdinger', image: `${CHAMPION_IMAGE_BASE}Heimerdinger.png`, tags: ['Mage', 'Support'] },
  { id: 'hwei', name: '흐웨이', key: 'Hwei', image: `${CHAMPION_IMAGE_BASE}Hwei.png`, tags: ['Mage'] },

  // I로 시작하는 챔피언들
  { id: 'illaoi', name: '일라오이', key: 'Illaoi', image: `${CHAMPION_IMAGE_BASE}Illaoi.png`, tags: ['Fighter', 'Tank'] },
  { id: 'irelia', name: '이렐리아', key: 'Irelia', image: `${CHAMPION_IMAGE_BASE}Irelia.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'ivern', name: '아이번', key: 'Ivern', image: `${CHAMPION_IMAGE_BASE}Ivern.png`, tags: ['Support', 'Mage'] },

  // J로 시작하는 챔피언들
  { id: 'janna', name: '잔나', key: 'Janna', image: `${CHAMPION_IMAGE_BASE}Janna.png`, tags: ['Support', 'Mage'] },
  { id: 'jarvaniv', name: '자르반 4세', key: 'JarvanIV', image: `${CHAMPION_IMAGE_BASE}JarvanIV.png`, tags: ['Tank', 'Fighter'] },
  { id: 'jax', name: '잭스', key: 'Jax', image: `${CHAMPION_IMAGE_BASE}Jax.png`, tags: ['Fighter'] },
  { id: 'jayce', name: '제이스', key: 'Jayce', image: `${CHAMPION_IMAGE_BASE}Jayce.png`, tags: ['Fighter', 'Marksman'] },
  { id: 'jhin', name: '진', key: 'Jhin', image: `${CHAMPION_IMAGE_BASE}Jhin.png`, tags: ['Marksman'] },
  { id: 'jinx', name: '징크스', key: 'Jinx', image: `${CHAMPION_IMAGE_BASE}Jinx.png`, tags: ['Marksman'] },

  // K로 시작하는 챔피언들
  { id: 'kaisa', name: '카이사', key: 'Kaisa', image: `${CHAMPION_IMAGE_BASE}Kaisa.png`, tags: ['Marksman'] },
  { id: 'kalista', name: '칼리스타', key: 'Kalista', image: `${CHAMPION_IMAGE_BASE}Kalista.png`, tags: ['Marksman'] },
  { id: 'karma', name: '카르마', key: 'Karma', image: `${CHAMPION_IMAGE_BASE}Karma.png`, tags: ['Mage', 'Support'] },
  { id: 'karthus', name: '카서스', key: 'Karthus', image: `${CHAMPION_IMAGE_BASE}Karthus.png`, tags: ['Mage'] },
  { id: 'kassadin', name: '카사딘', key: 'Kassadin', image: `${CHAMPION_IMAGE_BASE}Kassadin.png`, tags: ['Assassin', 'Mage'] },
  { id: 'katarina', name: '카타리나', key: 'Katarina', image: `${CHAMPION_IMAGE_BASE}Katarina.png`, tags: ['Assassin', 'Mage'] },
  { id: 'kayle', name: '케일', key: 'Kayle', image: `${CHAMPION_IMAGE_BASE}Kayle.png`, tags: ['Fighter', 'Marksman'] },
  { id: 'kayn', name: '케인', key: 'Kayn', image: `${CHAMPION_IMAGE_BASE}Kayn.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'kennen', name: '케넨', key: 'Kennen', image: `${CHAMPION_IMAGE_BASE}Kennen.png`, tags: ['Mage', 'Marksman'] },
  { id: 'khazix', name: '카직스', key: 'Khazix', image: `${CHAMPION_IMAGE_BASE}Khazix.png`, tags: ['Assassin'] },
  { id: 'kindred', name: '킨드레드', key: 'Kindred', image: `${CHAMPION_IMAGE_BASE}Kindred.png`, tags: ['Marksman'] },
  { id: 'kled', name: '클레드', key: 'Kled', image: `${CHAMPION_IMAGE_BASE}Kled.png`, tags: ['Fighter', 'Tank'] },
  { id: 'kogmaw', name: '코그모', key: 'KogMaw', image: `${CHAMPION_IMAGE_BASE}KogMaw.png`, tags: ['Marksman', 'Mage'] },
  { id: 'ksante', name: '크산테', key: 'KSante', image: `${CHAMPION_IMAGE_BASE}KSante.png`, tags: ['Tank', 'Fighter'] },

  // L로 시작하는 챔피언들
  { id: 'leblanc', name: '르블랑', key: 'LeBlanc', image: `${CHAMPION_IMAGE_BASE}LeBlanc.png`, tags: ['Assassin', 'Mage'] },
  { id: 'leesin', name: '리 신', key: 'LeeSin', image: `${CHAMPION_IMAGE_BASE}LeeSin.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'leona', name: '레오나', key: 'Leona', image: `${CHAMPION_IMAGE_BASE}Leona.png`, tags: ['Tank', 'Support'] },
  { id: 'lillia', name: '릴리아', key: 'Lillia', image: `${CHAMPION_IMAGE_BASE}Lillia.png`, tags: ['Fighter', 'Mage'] },
  { id: 'lissandra', name: '리산드라', key: 'Lissandra', image: `${CHAMPION_IMAGE_BASE}Lissandra.png`, tags: ['Mage'] },
  { id: 'lucian', name: '루시안', key: 'Lucian', image: `${CHAMPION_IMAGE_BASE}Lucian.png`, tags: ['Marksman'] },
  { id: 'lulu', name: '룰루', key: 'Lulu', image: `${CHAMPION_IMAGE_BASE}Lulu.png`, tags: ['Support', 'Mage'] },
  { id: 'lux', name: '럭스', key: 'Lux', image: `${CHAMPION_IMAGE_BASE}Lux.png`, tags: ['Mage', 'Support'] },

  // M로 시작하는 챔피언들
  { id: 'malphite', name: '말파이트', key: 'Malphite', image: `${CHAMPION_IMAGE_BASE}Malphite.png`, tags: ['Tank', 'Fighter'] },
  { id: 'malzahar', name: '말자하', key: 'Malzahar', image: `${CHAMPION_IMAGE_BASE}Malzahar.png`, tags: ['Mage', 'Assassin'] },
  { id: 'maokai', name: '마오카이', key: 'Maokai', image: `${CHAMPION_IMAGE_BASE}Maokai.png`, tags: ['Tank', 'Mage'] },
  { id: 'masteryi', name: '마스터 이', key: 'MasterYi', image: `${CHAMPION_IMAGE_BASE}MasterYi.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'milio', name: '밀리오', key: 'Milio', image: `${CHAMPION_IMAGE_BASE}Milio.png`, tags: ['Support', 'Mage'] },
  { id: 'missfortune', name: '미스 포츈', key: 'MissFortune', image: `${CHAMPION_IMAGE_BASE}MissFortune.png`, tags: ['Marksman'] },
  { id: 'mordekaiser', name: '모데카이저', key: 'Mordekaiser', image: `${CHAMPION_IMAGE_BASE}Mordekaiser.png`, tags: ['Fighter', 'Tank'] },
  { id: 'morgana', name: '모르가나', key: 'Morgana', image: `${CHAMPION_IMAGE_BASE}Morgana.png`, tags: ['Mage', 'Support'] },

  // N로 시작하는 챔피언들
  { id: 'naafiri', name: '나피리', key: 'Naafiri', image: `${CHAMPION_IMAGE_BASE}Naafiri.png`, tags: ['Assassin'] },
  { id: 'nami', name: '나미', key: 'Nami', image: `${CHAMPION_IMAGE_BASE}Nami.png`, tags: ['Support', 'Mage'] },
  { id: 'nasus', name: '나서스', key: 'Nasus', image: `${CHAMPION_IMAGE_BASE}Nasus.png`, tags: ['Fighter', 'Tank'] },
  { id: 'nautilus', name: '노틸러스', key: 'Nautilus', image: `${CHAMPION_IMAGE_BASE}Nautilus.png`, tags: ['Tank', 'Support'] },
  { id: 'neeko', name: '니코', key: 'Neeko', image: `${CHAMPION_IMAGE_BASE}Neeko.png`, tags: ['Mage', 'Support'] },
  { id: 'nidalee', name: '니달리', key: 'Nidalee', image: `${CHAMPION_IMAGE_BASE}Nidalee.png`, tags: ['Assassin', 'Mage'] },
  { id: 'nilah', name: '닐라', key: 'Nilah', image: `${CHAMPION_IMAGE_BASE}Nilah.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'nocturne', name: '녹턴', key: 'Nocturne', image: `${CHAMPION_IMAGE_BASE}Nocturne.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'nunu', name: '누누와 윌럼프', key: 'Nunu', image: `${CHAMPION_IMAGE_BASE}Nunu.png`, tags: ['Tank', 'Fighter'] },

  // O로 시작하는 챔피언들
  { id: 'olaf', name: '올라프', key: 'Olaf', image: `${CHAMPION_IMAGE_BASE}Olaf.png`, tags: ['Fighter', 'Tank'] },
  { id: 'orianna', name: '오리아나', key: 'Orianna', image: `${CHAMPION_IMAGE_BASE}Orianna.png`, tags: ['Mage'] },
  { id: 'ornn', name: '오른', key: 'Ornn', image: `${CHAMPION_IMAGE_BASE}Ornn.png`, tags: ['Tank', 'Fighter'] },

  // P로 시작하는 챔피언들
  { id: 'pantheon', name: '판테온', key: 'Pantheon', image: `${CHAMPION_IMAGE_BASE}Pantheon.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'poppy', name: '뽀삐', key: 'Poppy', image: `${CHAMPION_IMAGE_BASE}Poppy.png`, tags: ['Tank'] },
  { id: 'pyke', name: '파이크', key: 'Pyke', image: `${CHAMPION_IMAGE_BASE}Pyke.png`, tags: ['Support', 'Assassin'] },

  // Q로 시작하는 챔피언들
  { id: 'qiyana', name: '키아나', key: 'Qiyana', image: `${CHAMPION_IMAGE_BASE}Qiyana.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'quinn', name: '퀸', key: 'Quinn', image: `${CHAMPION_IMAGE_BASE}Quinn.png`, tags: ['Marksman', 'Assassin'] },

  // R로 시작하는 챔피언들
  { id: 'rakan', name: '라칸', key: 'Rakan', image: `${CHAMPION_IMAGE_BASE}Rakan.png`, tags: ['Support'] },
  { id: 'rammus', name: '람머스', key: 'Rammus', image: `${CHAMPION_IMAGE_BASE}Rammus.png`, tags: ['Tank', 'Fighter'] },
  { id: 'reksai', name: '렉사이', key: 'RekSai', image: `${CHAMPION_IMAGE_BASE}RekSai.png`, tags: ['Fighter'] },
  { id: 'rell', name: '렐', key: 'Rell', image: `${CHAMPION_IMAGE_BASE}Rell.png`, tags: ['Tank', 'Support'] },
  { id: 'renata', name: '레나타 글라스크', key: 'Renata', image: `${CHAMPION_IMAGE_BASE}Renata.png`, tags: ['Support', 'Mage'] },
  { id: 'renekton', name: '레넥톤', key: 'Renekton', image: `${CHAMPION_IMAGE_BASE}Renekton.png`, tags: ['Fighter', 'Tank'] },
  { id: 'rengar', name: '렝가', key: 'Rengar', image: `${CHAMPION_IMAGE_BASE}Rengar.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'riven', name: '리븐', key: 'Riven', image: `${CHAMPION_IMAGE_BASE}Riven.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'rumble', name: '럼블', key: 'Rumble', image: `${CHAMPION_IMAGE_BASE}Rumble.png`, tags: ['Fighter', 'Mage'] },
  { id: 'ryze', name: '라이즈', key: 'Ryze', image: `${CHAMPION_IMAGE_BASE}Ryze.png`, tags: ['Mage'] },

  // S로 시작하는 챔피언들
  { id: 'samira', name: '사미라', key: 'Samira', image: `${CHAMPION_IMAGE_BASE}Samira.png`, tags: ['Marksman'] },
  { id: 'sejuani', name: '세주아니', key: 'Sejuani', image: `${CHAMPION_IMAGE_BASE}Sejuani.png`, tags: ['Tank'] },
  { id: 'senna', name: '세나', key: 'Senna', image: `${CHAMPION_IMAGE_BASE}Senna.png`, tags: ['Marksman', 'Support'] },
  { id: 'seraphine', name: '세라핀', key: 'Seraphine', image: `${CHAMPION_IMAGE_BASE}Seraphine.png`, tags: ['Mage', 'Support'] },
  { id: 'sett', name: '세트', key: 'Sett', image: `${CHAMPION_IMAGE_BASE}Sett.png`, tags: ['Fighter', 'Tank'] },
  { id: 'shaco', name: '샤코', key: 'Shaco', image: `${CHAMPION_IMAGE_BASE}Shaco.png`, tags: ['Assassin'] },
  { id: 'shen', name: '쉔', key: 'Shen', image: `${CHAMPION_IMAGE_BASE}Shen.png`, tags: ['Tank', 'Support'] },
  { id: 'shyvana', name: '쉬바나', key: 'Shyvana', image: `${CHAMPION_IMAGE_BASE}Shyvana.png`, tags: ['Fighter', 'Tank'] },
  { id: 'singed', name: '신지드', key: 'Singed', image: `${CHAMPION_IMAGE_BASE}Singed.png`, tags: ['Tank', 'Fighter'] },
  { id: 'sion', name: '사이온', key: 'Sion', image: `${CHAMPION_IMAGE_BASE}Sion.png`, tags: ['Tank', 'Fighter'] },
  { id: 'sivir', name: '시비르', key: 'Sivir', image: `${CHAMPION_IMAGE_BASE}Sivir.png`, tags: ['Marksman'] },
  { id: 'skarner', name: '스카너', key: 'Skarner', image: `${CHAMPION_IMAGE_BASE}Skarner.png`, tags: ['Fighter', 'Tank'] },
  { id: 'smolder', name: '스몰더', key: 'Smolder', image: `${CHAMPION_IMAGE_BASE}Smolder.png`, tags: ['Marksman', 'Mage'] },
  { id: 'sona', name: '소나', key: 'Sona', image: `${CHAMPION_IMAGE_BASE}Sona.png`, tags: ['Support', 'Mage'] },
  { id: 'soraka', name: '소라카', key: 'Soraka', image: `${CHAMPION_IMAGE_BASE}Soraka.png`, tags: ['Support', 'Mage'] },
  { id: 'swain', name: '스웨인', key: 'Swain', image: `${CHAMPION_IMAGE_BASE}Swain.png`, tags: ['Mage', 'Fighter'] },
  { id: 'sylas', name: '사일러스', key: 'Sylas', image: `${CHAMPION_IMAGE_BASE}Sylas.png`, tags: ['Mage', 'Assassin'] },
  { id: 'syndra', name: '신드라', key: 'Syndra', image: `${CHAMPION_IMAGE_BASE}Syndra.png`, tags: ['Mage'] },

  // T로 시작하는 챔피언들
  { id: 'tahmkench', name: '탐 켄치', key: 'TahmKench', image: `${CHAMPION_IMAGE_BASE}TahmKench.png`, tags: ['Support', 'Tank'] },
  { id: 'taliyah', name: '탈리야', key: 'Taliyah', image: `${CHAMPION_IMAGE_BASE}Taliyah.png`, tags: ['Mage', 'Support'] },
  { id: 'talon', name: '탈론', key: 'Talon', image: `${CHAMPION_IMAGE_BASE}Talon.png`, tags: ['Assassin'] },
  { id: 'taric', name: '타릭', key: 'Taric', image: `${CHAMPION_IMAGE_BASE}Taric.png`, tags: ['Support', 'Fighter'] },
  { id: 'teemo', name: '티모', key: 'Teemo', image: `${CHAMPION_IMAGE_BASE}Teemo.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'thresh', name: '쓰레쉬', key: 'Thresh', image: `${CHAMPION_IMAGE_BASE}Thresh.png`, tags: ['Support'] },
  { id: 'tristana', name: '트리스타나', key: 'Tristana', image: `${CHAMPION_IMAGE_BASE}Tristana.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'trundle', name: '트런들', key: 'Trundle', image: `${CHAMPION_IMAGE_BASE}Trundle.png`, tags: ['Fighter', 'Tank'] },
  { id: 'tryndamere', name: '트린다미어', key: 'Tryndamere', image: `${CHAMPION_IMAGE_BASE}Tryndamere.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'twistedfate', name: '트위스티드 페이트', key: 'TwistedFate', image: `${CHAMPION_IMAGE_BASE}TwistedFate.png`, tags: ['Mage'] },
  { id: 'twitch', name: '트위치', key: 'Twitch', image: `${CHAMPION_IMAGE_BASE}Twitch.png`, tags: ['Marksman', 'Assassin'] },

  // U로 시작하는 챔피언들
  { id: 'udyr', name: '우디르', key: 'Udyr', image: `${CHAMPION_IMAGE_BASE}Udyr.png`, tags: ['Fighter', 'Tank'] },
  { id: 'urgot', name: '우르곳', key: 'Urgot', image: `${CHAMPION_IMAGE_BASE}Urgot.png`, tags: ['Fighter', 'Tank'] },

  // V로 시작하는 챔피언들
  { id: 'varus', name: '바루스', key: 'Varus', image: `${CHAMPION_IMAGE_BASE}Varus.png`, tags: ['Marksman', 'Mage'] },
  { id: 'vayne', name: '베인', key: 'Vayne', image: `${CHAMPION_IMAGE_BASE}Vayne.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'veigar', name: '베이가', key: 'Veigar', image: `${CHAMPION_IMAGE_BASE}Veigar.png`, tags: ['Mage'] },
  { id: 'velkoz', name: '벨코즈', key: 'Velkoz', image: `${CHAMPION_IMAGE_BASE}Velkoz.png`, tags: ['Mage'] },
  { id: 'vex', name: '벡스', key: 'Vex', image: `${CHAMPION_IMAGE_BASE}Vex.png`, tags: ['Mage', 'Assassin'] },
  { id: 'vi', name: '바이', key: 'Vi', image: `${CHAMPION_IMAGE_BASE}Vi.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'viego', name: '비에고', key: 'Viego', image: `${CHAMPION_IMAGE_BASE}Viego.png`, tags: ['Assassin'] },
  { id: 'viktor', name: '빅토르', key: 'Viktor', image: `${CHAMPION_IMAGE_BASE}Viktor.png`, tags: ['Mage'] },
  { id: 'vladimir', name: '블라디미르', key: 'Vladimir', image: `${CHAMPION_IMAGE_BASE}Vladimir.png`, tags: ['Mage'] },
  { id: 'volibear', name: '볼리베어', key: 'Volibear', image: `${CHAMPION_IMAGE_BASE}Volibear.png`, tags: ['Fighter', 'Tank'] },

  // W로 시작하는 챔피언들
  { id: 'warwick', name: '워윅', key: 'Warwick', image: `${CHAMPION_IMAGE_BASE}Warwick.png`, tags: ['Fighter', 'Tank'] },
  { id: 'wukong', name: '오공', key: 'MonkeyKing', image: `${CHAMPION_IMAGE_BASE}MonkeyKing.png`, tags: ['Fighter', 'Tank'] },

  // X로 시작하는 챔피언들
  { id: 'xayah', name: '자야', key: 'Xayah', image: `${CHAMPION_IMAGE_BASE}Xayah.png`, tags: ['Marksman'] },
  { id: 'xerath', name: '제라스', key: 'Xerath', image: `${CHAMPION_IMAGE_BASE}Xerath.png`, tags: ['Mage', 'Artillery'] },
  { id: 'xinzhao', name: '신 짜오', key: 'XinZhao', image: `${CHAMPION_IMAGE_BASE}XinZhao.png`, tags: ['Fighter', 'Assassin'] },

  // Y로 시작하는 챔피언들
  { id: 'yasuo', name: '야스오', key: 'Yasuo', image: `${CHAMPION_IMAGE_BASE}Yasuo.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'yone', name: '요네', key: 'Yone', image: `${CHAMPION_IMAGE_BASE}Yone.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'yorick', name: '요릭', key: 'Yorick', image: `${CHAMPION_IMAGE_BASE}Yorick.png`, tags: ['Fighter', 'Tank'] },
  { id: 'yuumi', name: '유미', key: 'Yuumi', image: `${CHAMPION_IMAGE_BASE}Yuumi.png`, tags: ['Support', 'Mage'] },
  { id: 'yunnara', name: '유나라', key: 'Yunnara', image: `${CHAMPION_IMAGE_BASE}Yunnara.png`, tags: ['Mage', 'Support'] },

  // Z로 시작하는 챔피언들
  { id: 'zac', name: '자크', key: 'Zac', image: `${CHAMPION_IMAGE_BASE}Zac.png`, tags: ['Tank', 'Fighter'] },
  { id: 'zed', name: '제드', key: 'Zed', image: `${CHAMPION_IMAGE_BASE}Zed.png`, tags: ['Assassin'] },
  { id: 'zeri', name: '제리', key: 'Zeri', image: `${CHAMPION_IMAGE_BASE}Zeri.png`, tags: ['Marksman'] },
  { id: 'ziggs', name: '직스', key: 'Ziggs', image: `${CHAMPION_IMAGE_BASE}Ziggs.png`, tags: ['Mage', 'Artillery'] },
  { id: 'zilean', name: '질리언', key: 'Zilean', image: `${CHAMPION_IMAGE_BASE}Zilean.png`, tags: ['Support', 'Mage'] },
  { id: 'zoe', name: '조이', key: 'Zoe', image: `${CHAMPION_IMAGE_BASE}Zoe.png`, tags: ['Mage', 'Burst'] },
  { id: 'zyra', name: '자이라', key: 'Zyra', image: `${CHAMPION_IMAGE_BASE}Zyra.png`, tags: ['Mage', 'Support'] },
  
  // 추가 챔피언들 (더 많은 선택지 확보)
  { id: 'annie', name: '애니', key: 'Annie', image: `${CHAMPION_IMAGE_BASE}Annie.png`, tags: ['Mage'] },
  { id: 'ashe', name: '애쉬', key: 'Ashe', image: `${CHAMPION_IMAGE_BASE}Ashe.png`, tags: ['Marksman', 'Support'] },
  { id: 'brand', name: '브랜드', key: 'Brand', image: `${CHAMPION_IMAGE_BASE}Brand.png`, tags: ['Mage'] },
  { id: 'diana', name: '다이애나', key: 'Diana', image: `${CHAMPION_IMAGE_BASE}Diana.png`, tags: ['Fighter', 'Mage'] },
  { id: 'evelynn', name: '이블린', key: 'Evelynn', image: `${CHAMPION_IMAGE_BASE}Evelynn.png`, tags: ['Assassin', 'Mage'] },
  { id: 'fiddlesticks', name: '피들스틱', key: 'Fiddlesticks', image: `${CHAMPION_IMAGE_BASE}Fiddlesticks.png`, tags: ['Mage', 'Support'] },
  { id: 'garen', name: '가렌', key: 'Garen', image: `${CHAMPION_IMAGE_BASE}Garen.png`, tags: ['Fighter', 'Tank'] },
  { id: 'heimerdinger', name: '하이머딩거', key: 'Heimerdinger', image: `${CHAMPION_IMAGE_BASE}Heimerdinger.png`, tags: ['Mage', 'Support'] },
  { id: 'irelia', name: '이렐리아', key: 'Irelia', image: `${CHAMPION_IMAGE_BASE}Irelia.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'jarvaniv', name: '자르반 4세', key: 'JarvanIV', image: `${CHAMPION_IMAGE_BASE}JarvanIV.png`, tags: ['Tank', 'Fighter'] },
  { id: 'karma', name: '카르마', key: 'Karma', image: `${CHAMPION_IMAGE_BASE}Karma.png`, tags: ['Mage', 'Support'] },
  { id: 'leesin', name: '리 신', key: 'LeeSin', image: `${CHAMPION_IMAGE_BASE}LeeSin.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'malphite', name: '말파이트', key: 'Malphite', image: `${CHAMPION_IMAGE_BASE}Malphite.png`, tags: ['Tank', 'Fighter'] },
  { id: 'nami', name: '나미', key: 'Nami', image: `${CHAMPION_IMAGE_BASE}Nami.png`, tags: ['Support', 'Mage'] },
  { id: 'olaf', name: '올라프', key: 'Olaf', image: `${CHAMPION_IMAGE_BASE}Olaf.png`, tags: ['Fighter', 'Tank'] },
  { id: 'pantheon', name: '판테온', key: 'Pantheon', image: `${CHAMPION_IMAGE_BASE}Pantheon.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'quinn', name: '퀸', key: 'Quinn', image: `${CHAMPION_IMAGE_BASE}Quinn.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'renekton', name: '레넥톤', key: 'Renekton', image: `${CHAMPION_IMAGE_BASE}Renekton.png`, tags: ['Fighter', 'Tank'] },
  { id: 'shen', name: '쉔', key: 'Shen', image: `${CHAMPION_IMAGE_BASE}Shen.png`, tags: ['Tank', 'Support'] },
  { id: 'talon', name: '탈론', key: 'Talon', image: `${CHAMPION_IMAGE_BASE}Talon.png`, tags: ['Assassin'] },
  { id: 'udyr', name: '우디르', key: 'Udyr', image: `${CHAMPION_IMAGE_BASE}Udyr.png`, tags: ['Fighter', 'Tank'] },
  { id: 'vayne', name: '베인', key: 'Vayne', image: `${CHAMPION_IMAGE_BASE}Vayne.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'warwick', name: '워윅', key: 'Warwick', image: `${CHAMPION_IMAGE_BASE}Warwick.png`, tags: ['Fighter', 'Tank'] },
  { id: 'xerath', name: '제라스', key: 'Xerath', image: `${CHAMPION_IMAGE_BASE}Xerath.png`, tags: ['Mage', 'Artillery'] },
  { id: 'yorick', name: '요릭', key: 'Yorick', image: `${CHAMPION_IMAGE_BASE}Yorick.png`, tags: ['Fighter', 'Tank'] },
  { id: 'zed', name: '제드', key: 'Zed', image: `${CHAMPION_IMAGE_BASE}Zed.png`, tags: ['Assassin'] },
  { id: 'ziggs', name: '직스', key: 'Ziggs', image: `${CHAMPION_IMAGE_BASE}Ziggs.png`, tags: ['Mage', 'Artillery'] },
  { id: 'zyra', name: '자이라', key: 'Zyra', image: `${CHAMPION_IMAGE_BASE}Zyra.png`, tags: ['Mage', 'Support'] },
  { id: 'kayle', name: '케일', key: 'Kayle', image: `${CHAMPION_IMAGE_BASE}Kayle.png`, tags: ['Fighter', 'Marksman'] },
  { id: 'morgana', name: '모르가나', key: 'Morgana', image: `${CHAMPION_IMAGE_BASE}Morgana.png`, tags: ['Mage', 'Support'] },
  { id: 'rengar', name: '렝가', key: 'Rengar', image: `${CHAMPION_IMAGE_BASE}Rengar.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'shaco', name: '샤코', key: 'Shaco', image: `${CHAMPION_IMAGE_BASE}Shaco.png`, tags: ['Assassin'] },
  { id: 'soraka', name: '소라카', key: 'Soraka', image: `${CHAMPION_IMAGE_BASE}Soraka.png`, tags: ['Support', 'Mage'] },
  { id: 'teemo', name: '티모', key: 'Teemo', image: `${CHAMPION_IMAGE_BASE}Teemo.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'vladimir', name: '블라디미르', key: 'Vladimir', image: `${CHAMPION_IMAGE_BASE}Vladimir.png`, tags: ['Mage'] },
  { id: 'zoe', name: '조이', key: 'Zoe', image: `${CHAMPION_IMAGE_BASE}Zoe.png`, tags: ['Mage', 'Burst'] },
  
  // 최신 챔피언들 추가
  { id: 'gwen', name: '그웬', key: 'Gwen', image: `${CHAMPION_IMAGE_BASE}Gwen.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'akshan', name: '아크샨', key: 'Akshan', image: `${CHAMPION_IMAGE_BASE}Akshan.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'vex', name: '벡스', key: 'Vex', image: `${CHAMPION_IMAGE_BASE}Vex.png`, tags: ['Mage', 'Assassin'] },
  { id: 'zeri', name: '제리', key: 'Zeri', image: `${CHAMPION_IMAGE_BASE}Zeri.png`, tags: ['Marksman'] },
  { id: 'belveth', name: '벨베스', key: 'Belveth', image: `${CHAMPION_IMAGE_BASE}Belveth.png`, tags: ['Fighter'] },
  { id: 'nilah', name: '닐라', key: 'Nilah', image: `${CHAMPION_IMAGE_BASE}Nilah.png`, tags: ['Marksman', 'Assassin'] },
  { id: 'ksante', name: '크산테', key: 'KSante', image: `${CHAMPION_IMAGE_BASE}KSante.png`, tags: ['Tank', 'Fighter'] },
  { id: 'naafiri', name: '나피리', key: 'Naafiri', image: `${CHAMPION_IMAGE_BASE}Naafiri.png`, tags: ['Assassin'] },
  { id: 'briar', name: '브라이어', key: 'Briar', image: `${CHAMPION_IMAGE_BASE}Briar.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'hwei', name: '흐웨이', key: 'Hwei', image: `${CHAMPION_IMAGE_BASE}Hwei.png`, tags: ['Mage'] },
  { id: 'smolder', name: '스몰더', key: 'Smolder', image: `${CHAMPION_IMAGE_BASE}Smolder.png`, tags: ['Marksman', 'Mage'] },
  { id: 'aurora', name: '오로라', key: 'Aurora', image: `${CHAMPION_IMAGE_BASE}Aurora.png`, tags: ['Mage', 'Assassin'] },
  
  // 더 많은 챔피언들 (피어리스 BO5 지원을 위해)
  { id: 'amumu', name: '아무무', key: 'Amumu', image: `${CHAMPION_IMAGE_BASE}Amumu.png`, tags: ['Tank', 'Mage'] },
  { id: 'anivia', name: '애니비아', key: 'Anivia', image: `${CHAMPION_IMAGE_BASE}Anivia.png`, tags: ['Mage'] },
  { id: 'aurelionsol', name: '아우렐리온 솔', key: 'AurelionSol', image: `${CHAMPION_IMAGE_BASE}AurelionSol.png`, tags: ['Mage'] },
  { id: 'chogath', name: '초가스', key: 'Chogath', image: `${CHAMPION_IMAGE_BASE}Chogath.png`, tags: ['Tank', 'Mage'] },
  { id: 'drmundo', name: '문도 박사', key: 'DrMundo', image: `${CHAMPION_IMAGE_BASE}DrMundo.png`, tags: ['Fighter', 'Tank'] },
  { id: 'fizz', name: '피즈', key: 'Fizz', image: `${CHAMPION_IMAGE_BASE}Fizz.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'gangplank', name: '갱플랭크', key: 'Gangplank', image: `${CHAMPION_IMAGE_BASE}Gangplank.png`, tags: ['Fighter'] },
  { id: 'gwen', name: '그웬', key: 'Gwen', image: `${CHAMPION_IMAGE_BASE}Gwen.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'janna', name: '잔나', key: 'Janna', image: `${CHAMPION_IMAGE_BASE}Janna.png`, tags: ['Support', 'Mage'] },
  { id: 'karthus', name: '카서스', key: 'Karthus', image: `${CHAMPION_IMAGE_BASE}Karthus.png`, tags: ['Mage'] },
  { id: 'kassadin', name: '카사딘', key: 'Kassadin', image: `${CHAMPION_IMAGE_BASE}Kassadin.png`, tags: ['Assassin', 'Mage'] },
  { id: 'katarina', name: '카타리나', key: 'Katarina', image: `${CHAMPION_IMAGE_BASE}Katarina.png`, tags: ['Assassin', 'Mage'] },
  { id: 'lissandra', name: '리산드라', key: 'Lissandra', image: `${CHAMPION_IMAGE_BASE}Lissandra.png`, tags: ['Mage'] },
  { id: 'malzahar', name: '말자하', key: 'Malzahar', image: `${CHAMPION_IMAGE_BASE}Malzahar.png`, tags: ['Mage', 'Assassin'] },
  { id: 'maokai', name: '마오카이', key: 'Maokai', image: `${CHAMPION_IMAGE_BASE}Maokai.png`, tags: ['Tank', 'Mage'] },
  { id: 'missfortune', name: '미스 포츈', key: 'MissFortune', image: `${CHAMPION_IMAGE_BASE}MissFortune.png`, tags: ['Marksman'] },
  { id: 'nocturne', name: '녹턴', key: 'Nocturne', image: `${CHAMPION_IMAGE_BASE}Nocturne.png`, tags: ['Assassin', 'Fighter'] },
  { id: 'nunu', name: '누누와 윌럼프', key: 'Nunu', image: `${CHAMPION_IMAGE_BASE}Nunu.png`, tags: ['Tank', 'Fighter'] },
  { id: 'ornn', name: '오른', key: 'Ornn', image: `${CHAMPION_IMAGE_BASE}Ornn.png`, tags: ['Tank', 'Fighter'] },
  { id: 'rammus', name: '람머스', key: 'Rammus', image: `${CHAMPION_IMAGE_BASE}Rammus.png`, tags: ['Tank', 'Fighter'] },
  { id: 'riven', name: '리븐', key: 'Riven', image: `${CHAMPION_IMAGE_BASE}Riven.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'singed', name: '신지드', key: 'Singed', image: `${CHAMPION_IMAGE_BASE}Singed.png`, tags: ['Tank', 'Fighter'] },
  { id: 'sion', name: '사이온', key: 'Sion', image: `${CHAMPION_IMAGE_BASE}Sion.png`, tags: ['Tank', 'Fighter'] },
  { id: 'sona', name: '소나', key: 'Sona', image: `${CHAMPION_IMAGE_BASE}Sona.png`, tags: ['Support', 'Mage'] },
  { id: 'swain', name: '스웨인', key: 'Swain', image: `${CHAMPION_IMAGE_BASE}Swain.png`, tags: ['Mage', 'Fighter'] },
  { id: 'taric', name: '타릭', key: 'Taric', image: `${CHAMPION_IMAGE_BASE}Taric.png`, tags: ['Support', 'Fighter'] },
  { id: 'tryndamere', name: '트린다미어', key: 'Tryndamere', image: `${CHAMPION_IMAGE_BASE}Tryndamere.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'twisted_fate', name: '트위스티드 페이트', key: 'TwistedFate', image: `${CHAMPION_IMAGE_BASE}TwistedFate.png`, tags: ['Mage'] },
  { id: 'varus', name: '바루스', key: 'Varus', image: `${CHAMPION_IMAGE_BASE}Varus.png`, tags: ['Marksman', 'Mage'] },
  { id: 'veigar', name: '베이가', key: 'Veigar', image: `${CHAMPION_IMAGE_BASE}Veigar.png`, tags: ['Mage'] },
  { id: 'velkoz', name: '벨코즈', key: 'Velkoz', image: `${CHAMPION_IMAGE_BASE}Velkoz.png`, tags: ['Mage'] },
  { id: 'vi', name: '바이', key: 'Vi', image: `${CHAMPION_IMAGE_BASE}Vi.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'viktor', name: '빅토르', key: 'Viktor', image: `${CHAMPION_IMAGE_BASE}Viktor.png`, tags: ['Mage'] },
  { id: 'volibear', name: '볼리베어', key: 'Volibear', image: `${CHAMPION_IMAGE_BASE}Volibear.png`, tags: ['Fighter', 'Tank'] },
  { id: 'wukong', name: '오공', key: 'MonkeyKing', image: `${CHAMPION_IMAGE_BASE}MonkeyKing.png`, tags: ['Fighter', 'Tank'] },
  { id: 'xinzhao', name: '신 짜오', key: 'XinZhao', image: `${CHAMPION_IMAGE_BASE}XinZhao.png`, tags: ['Fighter', 'Assassin'] },
  { id: 'zilean', name: '질리언', key: 'Zilean', image: `${CHAMPION_IMAGE_BASE}Zilean.png`, tags: ['Support', 'Mage'] },
];

export const searchChampions = (query: string): Champion[] => {
  if (!query.trim()) return CHAMPIONS_DATA;
  
  const lowerQuery = query.toLowerCase();
  return CHAMPIONS_DATA.filter(champion => 
    champion.name.toLowerCase().includes(lowerQuery) ||
    champion.key.toLowerCase().includes(lowerQuery)
  );
};

export const getChampionById = (championId: string): Champion | undefined => {
  return CHAMPIONS_DATA.find(champion => champion.id === championId);
};

export const getChampionsByTags = (tags: string[]): Champion[] => {
  return CHAMPIONS_DATA.filter(champion =>
    tags.some(tag => champion.tags.includes(tag))
  );
};