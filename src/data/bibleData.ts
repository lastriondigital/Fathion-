import { BibleBook, VerseOfDay } from '../types';

export const INITIAL_VERSE_OF_THE_DAY: VerseOfDay = {
  reference: 'Filipenses 4:6-7',
  text: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará os seus corações e as suas mentes em Cristo Jesus.',
  version: 'NVI',
  whyMeditate: 'Deus convida você a trocar a ansiedade paralisante pela entrega confiante em oração com gratidão.',
  practicalApplication: 'Em vez de ruminar os problemas de hoje, transforme cada preocupação em um pedido de oração e agradeça por uma providência passada.',
  bookId: 'filipenses',
  chapter: 4,
};

export const BIBLE_BOOKS: BibleBook[] = [
  {
    id: 'genesis',
    name: 'Gênesis',
    testament: 'AT',
    category: 'Pentateuco',
    chaptersCount: 50,
    chapters: {
      1: [
        { number: 1, text: 'No princípio Deus criou os céus e a terra.' },
        { number: 2, text: 'Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.' },
        { number: 3, text: 'Disse Deus: "Haja luz", e houve luz.' },
        { number: 4, text: 'Deus viu que a luz era boa, e separou a luz das trevas.' },
        { number: 26, text: 'Então disse Deus: "Façamos o homem à nossa imagem, conforme a nossa semelhança. Reine ele sobre os peixes do mar, sobre as aves do céu, sobre os grandes animais de toda a terra e sobre todos os pequenos animais que se movem rente ao chão".' },
        { number: 27, text: 'Criou Deus o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.' },
        { number: 31, text: 'E Deus viu tudo o que havia feito, e tudo havia ficado muito bom. Passaram-se a tarde e a manhã; esse foi o sexto dia.' },
      ]
    }
  },
  {
    id: 'salmos',
    name: 'Salmos',
    testament: 'AT',
    category: 'Poéticos',
    chaptersCount: 150,
    chapters: {
      1: [
        { number: 1, text: 'Como é feliz aquele que não segue o conselho dos ímpios, não imita a conduta dos pecadores, nem se assenta na roda dos zombadores!' },
        { number: 2, text: 'Ao contrário, sua satisfação está na lei do Senhor, e nessa lei medita dia e noite.' },
        { number: 3, text: 'Ele é como árvore plantada à beira de águas correntes: dá fruto no tempo certo e suas folhas não murcham. Tudo o que ele faz prospera!' },
        { number: 4, text: 'Não é o caso dos ímpios! São como palha que o vento leva.' },
        { number: 6, text: 'Pois o Senhor conhece o caminho dos justos, mas o caminho dos ímpios perecerá.' }
      ],
      23: [
        { number: 1, text: 'O Senhor é o meu pastor; de nada terei falta.' },
        { number: 2, text: 'Em verdes pastagens me faz repousar e me conduz a águas tranquilas;' },
        { number: 3, text: 'restaura-me o vigor. Guia-me pelas veredas da justiça por amor do seu nome.' },
        { number: 4, text: 'Mesmo quando eu andar por um vale de trevas e morte, não temerei perigo algum, pois tu estás comigo; a tua vara e o teu cajado me protegem.' },
        { number: 5, text: 'Preparas um banquete para mim à vista dos meus inimigos. Tu unges a minha cabeça com óleo e o meu cálice transborda.' },
        { number: 6, text: 'Sei que a bondade e a fidelidade me acompanharão todos os dias da minha vida, e voltarei à casa do Senhor enquanto eu viver.' }
      ],
      91: [
        { number: 1, text: 'Aquele que habita no abrigo do Altíssimo e descansa à sombra do Todo-poderoso' },
        { number: 2, text: 'pode dizer ao Senhor: "Tu és o meu refúgio e a minha fortaleza, o meu Deus, em quem confio".' },
        { number: 4, text: 'Ele o cobrirá com as suas asas, e sob elas você encontrará refúgio; a fidelidade dele será o seu escudo protetor.' },
        { number: 11, text: 'Porque a seus anjos ele dará ordens a seu respeito, para que o protejam em todos os seus caminhos;' },
        { number: 14, text: '"Porque ele me ama, eu o resgatarei; eu o protegerei, pois conhece o meu nome.' },
        { number: 15, text: 'Ele clamará a mim, e eu lhe responderei; na angústia estarei com ele, vou livrá-lo e honrá-lo."' }
      ],
      121: [
        { number: 1, text: 'Levanto os meus olhos para os montes e pergunto: De onde me vem o socorro?' },
        { number: 2, text: 'O meu socorro vem do Senhor, que fez os céus e a terra.' },
        { number: 3, text: 'Ele não permitirá que você tropece; aquele que o guarda não dormitará!' },
        { number: 5, text: 'O Senhor é o seu protetor; como sombra que o protege, ele está à sua direita.' },
        { number: 8, text: 'O Senhor guardará a sua saída e a sua chegada, desde agora e para sempre.' }
      ]
    }
  },
  {
    id: 'proverbios',
    name: 'Provérbios',
    testament: 'AT',
    category: 'Poéticos',
    chaptersCount: 31,
    chapters: {
      3: [
        { number: 1, text: 'Meu filho, não se esqueça do meu ensino, mas guarde no coração os meus mandamentos,' },
        { number: 2, text: 'pois eles prolongarão a sua vida por muitos anos e lhe darão prosperidade e paz.' },
        { number: 5, text: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento;' },
        { number: 6, text: 'reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.' },
        { number: 7, text: 'Não seja sábio aos seus próprios olhos; tema o Senhor e evite o mal.' },
        { number: 9, text: 'Honre o Senhor com todos os seus recursos e com os primeiros frutos de todas as suas plantações;' }
      ],
      4: [
        { number: 18, text: 'A vereda do justo é como a luz da alvorada, que brilha cada vez mais até a plena claridade do dia.' },
        { number: 23, text: 'Acima de tudo, guarde o seu coração, pois dele procedem os mananciais da vida.' },
        { number: 26, text: 'Pondere a vereda de seus pés e todos os seus caminhos serão seguros.' }
      ]
    }
  },
  {
    id: 'isaias',
    name: 'Isaías',
    testament: 'AT',
    category: 'Profetas',
    chaptersCount: 66,
    chapters: {
      40: [
        { number: 28, text: 'Será que você não sabe? Nunca ouviu falar? O Senhor é o Deus eterno, o Criador de toda a terra. Ele não se cansa nem fica exausto, sua sabedoria é insondável.' },
        { number: 29, text: 'Ele fortalece o cansado e dá grande vigor ao que está sem forças.' },
        { number: 31, text: 'Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.' }
      ],
      53: [
        { number: 4, text: 'Certamente ele tomou sobre si as nossas enfermidades e sobre si levou as nossas dores, contudo nós o consideramos castigado por Deus, por ele atingido e afligido.' },
        { number: 5, text: 'Mas ele foi traspassado por causa das nossas transgressões, foi esmagado por causa de nossas iniquidades; o castigo que nos trouxe paz estava sobre ele, e pelas suas feridas fomos curados.' }
      ]
    }
  },
  {
    id: 'mateus',
    name: 'Mateus',
    testament: 'NT',
    category: 'Evangelhos',
    chaptersCount: 28,
    chapters: {
      5: [
        { number: 1, text: 'Vendo as multidões, Jesus subiu ao monte e se assentou. Seus discípulos aproximaram-se dele,' },
        { number: 3, text: '"Bem-aventurados os pobres em espírito, pois deles é o Reino dos céus.' },
        { number: 4, text: 'Bem-aventurados os que choram, pois serão consolados.' },
        { number: 5, text: 'Bem-aventurados os mansos, pois herdarão a terra.' },
        { number: 6, text: 'Bem-aventurados os que têm fome e sede de justiça, pois serão fartos.' },
        { number: 7, text: 'Bem-aventurados os misericordiosos, pois obterão misericórdia.' },
        { number: 8, text: 'Bem-aventurados os puros de coração, pois verão a Deus.' },
        { number: 9, text: 'Bem-aventurados os pacificadores, pois serão chamados filhos de Deus."' },
        { number: 14, text: '"Vocês são a luz do mundo. Não se pode esconder uma cidade construída sobre um monte."' }
      ],
      6: [
        { number: 6, text: 'Mas quando você orar, vá para seu quarto, feche a porta e ore a seu Pai, que está no secreto. Então seu Pai, que vê no secreto, o recompensará.' },
        { number: 9, text: 'Vocês, orem assim: "Pai nosso, que estás nos céus! Santificado seja o teu nome.' },
        { number: 10, text: 'Venha o teu Reino; seja feita a tua vontade, assim na terra como no céu.' },
        { number: 11, text: 'Dá-nos hoje o nosso pão de cada dia.' },
        { number: 12, text: 'Perdoa as nossas dívidas, assim como perdoamos aos nossos devedores.' },
        { number: 13, text: 'E não nos deixes cair em tentação, mas livra-nos do mal, porque teu é o Reino, o poder e a glória para sempre. Amém."' },
        { number: 33, text: 'Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas.' },
        { number: 34, text: 'Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações. Basta a cada dia o seu próprio mal.' }
      ]
    }
  },
  {
    id: 'joao',
    name: 'João',
    testament: 'NT',
    category: 'Evangelhos',
    chaptersCount: 21,
    chapters: {
      1: [
        { number: 1, text: 'No princípio era aquele que é a Palavra. Ele estava com Deus, e era Deus.' },
        { number: 2, text: 'Ela estava com Deus no princípio.' },
        { number: 3, text: 'Todas as coisas foram feitas por intermédio dele; sem ele, nada do que existe teria sido feito.' },
        { number: 4, text: 'Nele estava a vida, e esta era a luz dos homens.' },
        { number: 14, text: 'Aquele que é a Palavra tornou-se carne e viveu entre nós. Vimos a sua glória, glória do Filho unigênito vindo do Pai, cheio de graça e da verdade.' }
      ],
      14: [
        { number: 1, text: '"Não se turbe o vosso coração. Creiam em Deus; creiam também em mim.' },
        { number: 6, text: 'Respondeu Jesus: "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai, a não ser por mim.' },
        { number: 27, text: 'Deixo-lhes a paz; a minha paz lhes dou. Não lha dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize."' }
      ],
      15: [
        { number: 5, text: '"Eu sou a videira; vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dará muito fruto; pois sem mim vocês não podem fazer coisa alguma.' },
        { number: 7, text: 'Se vocês permanecerem em mim, e as minhas palavras permanecerem em vocês, pedirão o que quiserem, e lhes será concedido.' },
        { number: 12, text: 'O meu mandamento é este: Amem-se uns aos outros como eu os amei."' }
      ]
    }
  },
  {
    id: 'romanos',
    name: 'Romanos',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 16,
    chapters: {
      8: [
        { number: 1, text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, pois por meio de Cristo Jesus a lei do Espírito de vida me libertou da lei do pecado e da morte.' },
        { number: 6, text: 'A mentalidade da carne é morte, mas a mentalidade do Espírito é vida e paz.' },
        { number: 14, text: 'Porque todos os que são guiados pelo Espírito de Deus são filhos de Deus.' },
        { number: 26, text: 'Da mesma forma o Espírito nos ajuda em nossa fraqueza, pois não sabemos como orar, mas o próprio Espírito intercede por nós com gemidos inexprimíveis.' },
        { number: 28, text: 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.' },
        { number: 31, text: 'Que diremos, pois, diante dessas coisas? Se Deus é por nós, quem será contra nós?' },
        { number: 37, text: 'Mas, em todas estas coisas somos mais que vencedores, por meio daquele que nos amou.' },
        { number: 38, text: 'Pois estou convencido de que nem morte nem vida, nem anjos nem demônios, nem o presente nem o futuro, nem quaisquer poderes,' },
        { number: 39, text: 'nem altura nem profundidade, nem qualquer outra coisa na criação será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.' }
      ],
      12: [
        { number: 1, text: 'Portanto, irmãos, rogo-lhes pelas misericórdias de Deus que se ofereçam em sacrifício vivo, santo e agradável a Deus; este é o culto racional de vocês.' },
        { number: 2, text: 'Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente, para que sejam capazes de experimentar e comprovar a boa, agradável e perfeita vontade de Deus.' },
        { number: 12, text: 'Alegrem-se na esperança, sejam pacientes na tribulação, perseverem na oração.' }
      ]
    }
  },
  {
    id: '1corintios',
    name: '1 Coríntios',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 16,
    chapters: {
      13: [
        { number: 4, text: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.' },
        { number: 5, text: 'Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.' },
        { number: 7, text: 'Tudo sofre, tudo crê, tudo espera, tudo suporta.' },
        { number: 13, text: 'Assim, permanecem agora estes três: a fé, a esperança e o amor. O maior deles, porém, é o amor.' }
      ]
    }
  },
  {
    id: 'filipenses',
    name: 'Filipenses',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 4,
    chapters: {
      4: [
        { number: 4, text: 'Alegrem-se sempre no Senhor. Novamente direi: Alegrem-se!' },
        { number: 6, text: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.' },
        { number: 7, text: 'E a paz de Deus, que excede todo o entendimento, guardará os seus corações e as suas mentes em Cristo Jesus.' },
        { number: 8, text: 'Finalmente, irmãos, tudo o que for verdadeiro, tudo o que for nobre, tudo o que for correto, tudo o que for puro, tudo o que for amável, tudo o que for de boa fama, se houver algo de excelente ou digno de louvor, pensem nessas coisas.' },
        { number: 13, text: 'Tudo posso naquele que me fortalece.' },
        { number: 19, text: 'O meu Deus suprirá todas as necessidades de vocês, de acordo com as suas gloriosas riquezas em Cristo Jesus.' }
      ]
    }
  },
  {
    id: 'tiago',
    name: 'Tiago',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 5,
    chapters: {
      1: [
        { number: 2, text: 'Meus irmãos, considerem motivo de grande alegria o fato de passarem por diversas provações,' },
        { number: 3, text: 'pois vocês sabem que a prova da sua fé produz perseverança.' },
        { number: 5, text: 'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade; e lhe será concedida.' },
        { number: 22, text: 'Sejam praticantes da palavra, e não apenas ouvintes, enganando-se a si mesmos.' }
      ]
    }
  },
  {
    id: 'exodo',
    name: 'Êxodo',
    testament: 'AT',
    category: 'Pentateuco',
    chaptersCount: 40,
    chapters: {
      20: [
        { number: 1, text: 'E falou Deus todas estas palavras, dizendo:' },
        { number: 2, text: 'Eu sou o Senhor teu Deus, que te tirei da terra do Egito, da casa da servidão.' },
        { number: 3, text: 'Não terás outros deuses diante de mim.' },
        { number: 7, text: 'Não tomarás o nome do Senhor teu Deus em vão; porque o Senhor não terá por inocente o que tomar o seu nome em vão.' },
        { number: 8, text: 'Lembra-te do dia do sábado, para o santificar.' },
        { number: 12, text: 'Honra a teu pai e a tua mãe, para que se prolonguem os teus dias na terra que o Senhor teu Deus te dá.' }
      ]
    }
  },
  {
    id: 'josue',
    name: 'Josué',
    testament: 'AT',
    category: 'Históricos',
    chaptersCount: 24,
    chapters: {
      1: [
        { number: 7, text: 'Tão-somente esforça-te e tem muito bom ânimo, para teres o cuidado de fazer conforme a toda a lei que meu servo Moisés te ordenou; dela não te desvies, nem para a direita nem para a esquerda, para que prudentemente te conduzas por onde quer que andares.' },
        { number: 8, text: 'Não se aparte da tua boca o livro desta lei; antes medita nele dia e noite, para que tenhas cuidado de fazer conforme a tudo quanto nele está escrito; porque então farás prosperar o teu caminho, e serás bem-sucedido.' },
        { number: 9, text: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.' }
      ]
    }
  },
  {
    id: 'efesios',
    name: 'Efésios',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 6,
    chapters: {
      6: [
        { number: 10, text: 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder.' },
        { number: 11, text: 'Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.' },
        { number: 13, text: 'Portanto, tomai toda a armadura de Deus, para que possais resistir no dia mau e, havendo feito tudo, ficar firmes.' },
        { number: 14, text: 'Estai, pois, firmes, tendo cingidos os vossos lombos com a verdade, e vestida a couraça da justiça;' },
        { number: 16, text: 'Tomando sobretudo o escudo da fé, com o qual podereis apagar todos os dardos inflamados do maligno.' },
        { number: 17, text: 'Tomai também o capacete da salvação, e a espada do Espírito, que é a palavra de Deus;' },
        { number: 18, text: 'Orando em todo o tempo com toda a oração e súplica no Espírito, e vigiando nisto com toda a perseverança e súplica por todos os santos.' }
      ]
    }
  },
  {
    id: 'hebreus',
    name: 'Hebreus',
    testament: 'NT',
    category: 'Cartas',
    chaptersCount: 13,
    chapters: {
      11: [
        { number: 1, text: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.' },
        { number: 2, text: 'Porque por ela os antigos alcançaram testemunho.' },
        { number: 3, text: 'Pela fé entendemos que os mundos pela palavra de Deus foram criados; de maneira que aquilo que se vê não foi feito do que é aparente.' },
        { number: 6, text: 'Ora, sem fé é impossível agradar-lhe; porque é necessário que aquele que se aproxima de Deus creia que ele existe, e que é galardoador dos que o buscam.' }
      ],
      12: [
        { number: 1, text: 'Portanto nós também, pois que estamos rodeados de uma tão grande nuvem de testemunhas, deixemos todo o embaraço, e o pecado que tão de perto nos rodeia, e corramos com paciência a carreira que nos está proposta,' },
        { number: 2, text: 'Olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a afronta, e assentou-se à destra do trono de Deus.' }
      ]
    }
  },
  {
    id: 'apocalipse',
    name: 'Apocalipse',
    testament: 'NT',
    category: 'Revelação',
    chaptersCount: 22,
    chapters: {
      21: [
        { number: 1, text: 'E vi um novo céu, e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.' },
        { number: 3, text: 'E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles, e será o seu Deus.' },
        { number: 4, text: 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.' },
        { number: 5, text: 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas. E disse-me: Escreve; porque estas palavras são verdadeiras e fiéis.' }
      ]
    }
  }
];
