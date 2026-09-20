import { BibleBook, BibleVerse } from '../types';
import { BIBLE_BOOKS } from './bibleData';

export interface MultiVersionVerse {
  number: number;
  arc: string;
  kjv: string;
  web: string;
  jfa: string;
  vul: string;
  rvr: string;
}

/**
 * Textos bíblicos multi-versões em Domínio Público
 * Cobrindo passagens capitais e comparativas
 */
export const MULTI_VERSION_STORE: Record<string, Record<number, MultiVersionVerse[]>> = {
  romanos: {
    8: [
      {
        number: 1,
        arc: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o espírito.',
        kjv: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
        web: 'There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.',
        jfa: 'Portanto agora nenhuma condenaçaõ ha para os que estaõ em Christo Jesus, que naõ andam segundo a carne, mas segundo o Espirito.',
        vul: 'Nihil ergo nunc damnationis est his qui sunt in Christo Jesu, qui non secundum carnem ambulant.',
        rvr: 'Ahora pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme á la carne, mas conforme al espíritu.'
      },
      {
        number: 6,
        arc: 'Porque a inclinação da carne é morte; mas a inclinação do Espírito é vida e paz.',
        kjv: 'For to be carnally minded is death; but to be spiritually minded is life and peace.',
        web: 'For the mind of the flesh is death, but the mind of the Spirit is life and peace;',
        jfa: 'Porque a prudencia da carne he morte; mas a prudencia do Espirito he vida e paz.',
        vul: 'Nam prudentia carnis, mors est; prudentia autem spiritus, vita et pax.',
        rvr: 'Porque el ocuparse de la carne es muerte; mas el ocuparse del espíritu es vida y paz.'
      },
      {
        number: 14,
        arc: 'Porque todos os que são guiados pelo Espírito de Deus, esses são filhos de Deus.',
        kjv: 'For as many as are led by the Spirit of God, they are the sons of God.',
        web: 'For as many as are led by the Spirit of God, these are children of God.',
        jfa: 'Porque todos os que saõ guiados pelo Espirito de Deos, esses saõ filhos de Deos.',
        vul: 'Quicumque enim spiritu Dei aguntur, ii sunt filii Dei.',
        rvr: 'Porque todos los que son guiados por el Espíritu de Dios, los tales son hijos de Dios.'
      },
      {
        number: 26,
        arc: 'E da mesma maneira também o Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.',
        kjv: 'Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.',
        web: 'In the same way, the Spirit also helps our weaknesses, for we don’t know how to pray as we ought, but the Spirit himself makes intercession for us with groanings which can’t be uttered.',
        jfa: 'E semelhantemente tambem o Espirito ajuda as nossas fraquezas; porque naõ sabemos o que havemos de pedir como convem, mas o mesmo Espirito intercede por nós com gemidos inenarraveis.',
        vul: 'Similiter autem et Spiritus adjuvat infirmitatem nostram: nam quid oremus sicut oportet nescimus: sed ipse Spiritus postulat pro nobis gemitibus inenarrabilibus.',
        rvr: 'Y asimismo también el Espíritu ayuda nuestra flaqueza: porque qué hemos de pedir como conviene, no lo sabemos; sino que el mismo Espíritu pide por nosotros con gemidos indecibles.'
      },
      {
        number: 28,
        arc: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
        kjv: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
        web: 'We know that all things work together for good for those who love God, to those who are called according to his purpose.',
        jfa: 'E sabemos que todas as cousas concorrem para bem dos que amam a Deos, daquelles que saõ chamados segundo o seu proposito.',
        vul: 'Scimus autem quoniam diligentibus Deum omnia cooperantur in bonum, his qui secundum propositum vocati sunt sancti.',
        rvr: 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien, es á saber, á los que conforme al propósito son llamados.'
      },
      {
        number: 31,
        arc: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?',
        kjv: 'What shall we then say to these things? If God be for us, who can be against us?',
        web: 'What then shall we say about these things? If God is for us, who can be against us?',
        jfa: 'Que diremos pois a estas cousas? Se Deos he por nós, quem será contra nós?',
        vul: 'Quid ergo dicemus ad haec? Si Deus pro nobis, quis contra nos?',
        rvr: '¿Pues qué diremos á esto? Si Dios por nosotros, ¿quién contra nosotros?'
      },
      {
        number: 37,
        arc: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.',
        kjv: 'Nay, in all these things we are more than conquerors through him that loved us.',
        web: 'No, in all these things, we are more than conquerors through him who loved us.',
        jfa: 'Antes em todas estas cousas somos mais do que vencedores, por aquelle que nos amou.',
        vul: 'Sed in his omnibus superamus propter eum qui dilexit nos.',
        rvr: 'Antes, en todas estas cosas hacemos más que vencer por medio de aquel que nos amó.'
      },
      {
        number: 38,
        arc: 'Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,',
        kjv: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
        web: 'For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers,',
        jfa: 'Porque certo estou de que nem a morte, nem a vida, nem os Anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,',
        vul: 'Certus sum enim quia neque mors, neque vita, neque angeli, neque principatus, neque virtutes, neque instantia, neque futura, neque fortitudo,',
        rvr: 'Por lo cual estoy cierto que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir,'
      },
      {
        number: 39,
        arc: 'Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.',
        kjv: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',
        web: 'nor height, nor depth, nor any other created thing, will be able to separate us from the love of God, which is in Christ Jesus our Lord.',
        jfa: 'Nem a altura, nem a profundidade, nem alguma outra creatura nos poderá apartar da caridade de Deos, que he em Christo Jesus nosso Senhor.',
        vul: 'Neque altitudo, neque profundum, neque creatura alia poterit nos separare a caritate Dei, quae est in Christo Jesu Domino nostro.',
        rvr: 'Ni lo alto, ni lo bajo, ni ninguna criatura nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro.'
      }
    ]
  },
  salmos: {
    23: [
      {
        number: 1,
        arc: 'O Senhor é o meu pastor; nada me faltará.',
        kjv: 'The LORD is my shepherd; I shall not want.',
        web: 'Yahweh is my shepherd: I shall lack nothing.',
        jfa: 'O Senhor he o meu pastor: nada me faltara.',
        vul: 'Dominus regit me, et nihil mihi deerit.',
        rvr: 'Jehová es mi pastor; nada me faltará.'
      },
      {
        number: 2,
        arc: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas mansas.',
        kjv: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
        web: 'He makes me lie down in green pastures. He leads me beside still waters.',
        jfa: 'Faze-me deitar em verdes pastos, guia-me mansamente a aguas de quietaçaõ.',
        vul: 'In loco pascuae ibi me collocavit. Super aquam refectionis educavit me.',
        rvr: 'En lugares de delicados pastos me hará yacer: junto á aguas de reposo me pastoreará.'
      },
      {
        number: 3,
        arc: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.',
        kjv: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
        web: 'He restores my soul. He guides me in the paths of righteousness for his name’s sake.',
        jfa: 'Refrigera a minha alma: guia-me polas veredas da justiça, por amor de seu nome.',
        vul: 'Animam meam convertit. Deduxit me super semitas justitiae, propter nomen suum.',
        rvr: 'Confortará mi alma; guiaráme por sendas de justicia por amor de su nombre.'
      },
      {
        number: 4,
        arc: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.',
        kjv: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
        web: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.',
        jfa: 'Ainda que eu andasse polo valle da sombra da morte, naõ temeria mal algum, porque tu estás commigo: a tua vara e o teu bardaõ elles me consolam.',
        vul: 'Nam, etsi ambulavero in medio umbrae mortis, non timebo mala: quoniam tu mecum es. Virga tua, et baculus tuus, ipsa me consolata sunt.',
        rvr: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno; porque tú estarás conmigo: tu vara y tu cayado me confortarán.'
      },
      {
        number: 5,
        arc: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.',
        kjv: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
        web: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.',
        jfa: 'Aparelhas huma mesa perante mim na presença de meus angustiadores: unges a minha cabeça com oleo, o meu copo está sobejo.',
        vul: 'Parasti in conspectu meo mensam, adversus eos qui tribulant me. Impinguasti in oleo caput meum: et calix meus inebrians quam praeclarus est!',
        rvr: 'Aderezas mesa delante de mí, en presencia de mis angustiadores: ungiste mi cabeza con aceite: mi copa está rebosando.'
      },
      {
        number: 6,
        arc: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.',
        kjv: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
        web: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.',
        jfa: 'Certamente que a bondade e a misericordia me seguiraõ todos os dias de minha vida: e habitarei na casa do Senhor por longos dias.',
        vul: 'Et misericordia tua subsequetur me omnibus diebus vitae meae: et ut inhabitem in domo Domini, in longitudinem dierum.',
        rvr: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida: y en la casa de Jehová moraré por largos días.'
      }
    ]
  },
  joao: {
    1: [
      {
        number: 1,
        arc: 'No princípio, era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
        kjv: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        web: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        jfa: 'No principio era o Verbo, e o Verbo estava com Deos, e o Verbo era Deos.',
        vul: 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum.',
        rvr: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.'
      },
      {
        number: 2,
        arc: 'Ele estava no princípio com Deus.',
        kjv: 'The same was in the beginning with God.',
        web: 'The same was in the beginning with God.',
        jfa: 'Este estava no principio com Deos.',
        vul: 'Hoc erat in principio apud Deum.',
        rvr: 'Este era en el principio con Dios.'
      },
      {
        number: 3,
        arc: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.',
        kjv: 'All things were made by him; and without him was not any thing made that was made.',
        web: 'All things were made through him. Without him, nothing was made that has been made.',
        jfa: 'Todas as cousas foram feitas por elle, e sem elle nada do que foi feito se fez.',
        vul: 'Omnia per ipsum facta sunt: et sine ipso factum est nihil, quod factum est.',
        rvr: 'Todas las cosas por él fueron hechas; y sin él nada de lo que es hecho, fué hecho.'
      },
      {
        number: 4,
        arc: 'Nele estava a vida e a vida era a luz dos homens.',
        kjv: 'In him was life; and the life was the light of men.',
        web: 'In him was life, and the life was the light of men.',
        jfa: 'Nelle estava a vida, e a vida era a luz dos homens.',
        vul: 'In ipso vita erat, et vita erat lux hominum.',
        rvr: 'En él estaba la vida, y la vida era la luz de los hombres.'
      },
      {
        number: 14,
        arc: 'E o Verbo se fez carne e habitou entre nós, e vimos a sua glória, como a glória do Unigênito do Pai, cheio de graça e de verdade.',
        kjv: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
        web: 'The Word became flesh, and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth.',
        jfa: 'E o Verbo se fez carne, e habitou entre nós, e vimos a sua gloria, como a gloria do Unigenito do Pai, cheio de graça e de verdade.',
        vul: 'Et Verbum caro factum est, et habitavit in nobis: et vidimus gloriam ejus, gloriam quasi Unigeniti a Patre plenum gratiae et veritatis.',
        rvr: 'Y aquel Verbo fué hecho carne, y habitó entre nosotros (y vimos su gloria, gloria como del unigénito del Padre), lleno de gracia y de verdad.'
      }
    ]
  },
  filipenses: {
    4: [
      {
        number: 4,
        arc: 'Regozijai-vos sempre no Senhor; outra vez digo: regozijai-vos.',
        kjv: 'Rejoice in the Lord alway: and again I say, Rejoice.',
        web: 'Rejoice in the Lord always! Again I will say, “Rejoice!”',
        jfa: 'Alegrai-vos sempre no Senhor: outra vez vos digo, alegrai-vos.',
        vul: 'Gaudete in Domino semper: iterum dico gaudete.',
        rvr: 'Gozaos en el Señor siempre: otra vez digo: Que os gocéis.'
      },
      {
        number: 6,
        arc: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus, pela oração e súplicas, com ação de graças.',
        kjv: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
        web: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
        jfa: 'Naõ sejais cuidadosos de cousa alguma; mas em tudo sejam as vossas petiçoens conhecidas diante de Deos, por oraçaõ e rogos, com acçaõ de graças.',
        vul: 'Nihil solliciti sitis: sed in omni oratione et obsecratione, cum gratiarum actione, petitiones vestrae innotescant apud Deum.',
        rvr: 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias.'
      },
      {
        number: 7,
        arc: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.',
        kjv: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
        web: 'And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.',
        jfa: 'E a paz de Deos, que excede todo o entendimento, guardará os vossos coraçoens e os vossos sentimentos em Christo Jesus.',
        vul: 'Et pax Dei, quae exsuperat omnem sensum, custodiat corda vestra, et intelligentias vestras in Christo Jesu.',
        rvr: 'Y la paz de Dios, que sobrepuja todo entendimiento, guardará vuestros corazones y vuestros entendimientos en Cristo Jesús.'
      },
      {
        number: 13,
        arc: 'Posso todas as coisas naquele que me fortalece.',
        kjv: 'I can do all things through Christ which strengtheneth me.',
        web: 'I can do all things through Christ, who strengthens me.',
        jfa: 'Tudo posso naquelle que me conforta.',
        vul: 'Omnia possum in eo qui me confortat.',
        rvr: 'Todo lo puedo en Cristo que me fortalece.'
      },
      {
        number: 19,
        arc: 'O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.',
        kjv: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.',
        web: 'My God will supply every need of yours according to his riches in glory in Christ Jesus.',
        jfa: 'Mas o meu Deos segundo as suas riquezas, suprirá todas as vossas necessidades em gloria, por Christo Jesus.',
        vul: 'Deus autem meus impleat omne desiderium vestrum secundum divitias suas in gloria in Christo Jesu.',
        rvr: 'Mi Dios, pues, suplirá todo lo que os falta conforme á sus riquezas en gloria en Cristo Jesús.'
      }
    ]
  }
};

/**
 * Função para obter versículos de acordo com a versão selecionada
 */
export function getChapterVersesForVersion(
  versionId: string,
  bookId: string,
  chapter: number
): BibleVerse[] {
  const normVersion = versionId.toLowerCase();
  const multiCh = MULTI_VERSION_STORE[bookId]?.[chapter];

  if (multiCh && multiCh.length > 0) {
    return multiCh.map(v => {
      let text = v.arc;
      if (normVersion === 'kjv') text = v.kjv;
      else if (normVersion === 'web') text = v.web;
      else if (normVersion === 'jfa') text = v.jfa;
      else if (normVersion === 'vul') text = v.vul;
      else if (normVersion === 'rvr') text = v.rvr;
      return {
        number: v.number,
        text
      };
    });
  }

  // Fallback para BIBLE_BOOKS
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (book && book.chapters[chapter]) {
    return book.chapters[chapter];
  }

  return [];
}

/**
 * Função para obter todas as traduções de um versículo específico para comparação
 */
export function getVerseComparison(
  bookId: string,
  chapter: number,
  verseNumber: number
): Record<string, string> | null {
  const multiCh = MULTI_VERSION_STORE[bookId]?.[chapter];
  if (!multiCh) return null;
  const verse = multiCh.find(v => v.number === verseNumber);
  if (!verse) return null;

  return {
    arc: verse.arc,
    kjv: verse.kjv,
    web: verse.web,
    jfa: verse.jfa,
    vul: verse.vul,
    rvr: verse.rvr
  };
}
