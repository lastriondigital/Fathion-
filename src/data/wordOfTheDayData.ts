import { WordOfTheDay } from '../types';

export interface CuratedWordEntry {
  id: string;
  reference: string;
  passage: string;
  version: string;
  theme: string;
  tags: string[]; // Usado para matching com objetivos, interesses e rotina
  bookId: string;
  chapter: number;
  context: string;
  reflection: string;
  questions: string[];
  practicalApplication: string;
  optionalPrayer: string;
  bibleSource: string;
}

export const CURATED_WORDS_OF_THE_DAY: CuratedWordEntry[] = [
  // 1. DISCIPLINA & PERSEVERANÇA (Exemplo do prompt do usuário)
  {
    id: 'wotd-disciplina-1',
    reference: 'Hebreus 12:1-2',
    passage: 'Portanto, nós também, pois que estamos rodeados de uma tão grande nuvem de testemunhas, deixemos todo o embaraço, e o pecado que tão de perto nos rodeia, e corramos com perseverança a carreira que nos está proposta, olhando firmemente para Jesus, autor e consumador da fé.',
    version: 'NVI',
    theme: 'Disciplina, Foco e Constância',
    tags: ['disciplina', 'perseverança', 'constância', 'foco', 'rotina', 'diligência', 'hábitos'],
    bookId: 'hebreus',
    chapter: 12,
    context: 'A carta aos Hebreus foi escrita a cristãos que enfrentavam cansaço e tentação de retroceder. O autor utiliza a metáfora de uma corrida atlética da antiguidade greco-romana para enfatizar a constância espiritual.',
    reflection: 'A vida de fé é comparada não a uma corrida de velocidade rápida, mas a uma maratona que exige remoção de pesos desnecessários e foco ininterrupto na meta: a pessoa de Jesus Cristo. A disciplina bíblica não é autoflagelação, mas a decisão diária de desvencilhar-se do que distrai para correr com perseverança.',
    questions: [
      'Que hábito, preocupação ou distração tem atuado como peso desnecessário na minha rotina espiritual?',
      'Onde tenho buscado forças: no esforço puramente humano ou mantendo os olhos fitos em Cristo?'
    ],
    practicalApplication: 'Identifique uma distração habitual que rouba seu tempo hoje e substitua-a deliberadamente por 10 minutos de leitura ou oração silenciosa.',
    optionalPrayer: 'Senhor Jesus, ajuda-me a desvencilhar-me das distrações que embaraçam minha caminhada. Dá-me firmeza e perseverança para manter meus olhos em Ti ao longo deste dia.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-disciplina-2',
    reference: 'Filipenses 3:13-14',
    passage: 'Irmãos, não penso que eu mesmo já o tenha alcançado, mas uma coisa faço: esquecendo-me das coisas que ficaram para trás e avançando para as que estão adiante, prossigo para o alvo, a fim de ganhar o prêmio do chamado celestial de Deus em Cristo Jesus.',
    version: 'NVI',
    theme: 'Progresso Constante e Superação',
    tags: ['disciplina', 'perseverança', 'progresso', 'constância', 'foco', 'futuro'],
    bookId: 'filipenses',
    chapter: 3,
    context: 'Paulo escreve esta epístola encarcerado em Roma. Em vez de lamentar as limitações do cárcere ou apoiar-se em conquistas passadas, ele reforça a atitude de contínuo avanço em direção ao propósito eterno.',
    reflection: 'O apóstolo reconhece com humildade que a maturidade cristã é um processo em andamento contínuo. Esquecer o que ficou para trás não significa apagar a memória, mas não permitir que sucessos ou falhas do passado ditem a fidelidade do presente.',
    questions: [
      'Há alguma falha recente que ainda me paralisa com sentimentos de culpa em vez de buscar a graça?',
      'Qual é o próximo passo prático que preciso dar hoje, sem tentar resolver tudo de uma só vez?'
    ],
    practicalApplication: 'Em vez de tentar recuperar todas as práticas espirituais atrasadas de uma só vez, concentre-se com excelência apenas na próxima atividade programada.',
    optionalPrayer: 'Pai celestial, ensina-me a não ficar preso a erros do passado nem acomodado com o que já vivi. Concede-me graça para avançar com fidelidade no dia de hoje.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-disciplina-3',
    reference: 'Provérbios 12:24',
    passage: 'As mãos diligentes governarão, mas os preguiçosos acabarão escravos.',
    version: 'NVI',
    theme: 'Diligência e Mordomia Diária',
    tags: ['disciplina', 'diligência', 'trabalho', 'mordomia', 'rotina', 'constância'],
    bookId: 'proverbios',
    chapter: 12,
    context: 'A literatura sapiencial de Provérbios observa o funcionamento prático da vida sob o temor do Senhor, contrastando as consequências naturais entre o trabalho zeloso e a negligência continuada.',
    reflection: 'A tradição bíblica valoriza a diligência como expressão de honra a Deus e cuidado com o próximo. A constância nas pequenas tarefas diárias constrói autonomia, integridade e autoridade moral, enquanto a procrastinação gera dependência e frustração.',
    questions: [
      'Existe alguma responsabilidade que tenho adiado por desânimo ou falta de disposição?',
      'Como posso encarar minhas tarefas rotineiras de hoje como serviço oferecido a Deus?'
    ],
    practicalApplication: 'Escolha a tarefa mais desafiadora da sua rotina hoje e execute-a nas primeiras horas com atenção e capricho, dedicando-a em oração.',
    optionalPrayer: 'Senhor, afasta de mim a procrastinação e a tibieza. Dá-me disposição e diligência para cumprir com zelo cada encargo que colocaste em minhas mãos hoje.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-disciplina-4',
    reference: 'Gálatas 6:9',
    passage: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desfalecermos.',
    version: 'NVI',
    theme: 'Paciência na Semeadura Espiritual',
    tags: ['disciplina', 'perseverança', 'paciência', 'constância', 'esperança', 'serviço'],
    bookId: 'romanos', // Agrupado em cartas paulinas
    chapter: 8,
    context: 'Na conclusão da carta aos Gálatas, Paulo adverte a comunidade sobre a lei espiritual da semeadura e da colheita, encorajando os fiéis a não desanimarem quando os frutos da obediência demoram a aparecer.',
    reflection: 'Muitas vezes a constância espiritual parece não gerar resultados imediatos. O texto nos recorda que o ritmo do crescimento espiritual obedece a um tempo próprio de maturação estabelecido por Deus, exigindo perseverança e paciência perseverante.',
    questions: [
      'Em qual área da minha vida tenho me sentido tentado a desistir porque ainda não vejo os frutos esperados?',
      'Como a certeza de que Deus é fiel renova minha motivação hoje?'
    ],
    practicalApplication: 'Faça um ato concreto de bondade ou serviço hoje sem esperar reconhecimento ou retorno imediato.',
    optionalPrayer: 'Deus de toda esperança, quando o cansaço bater à minha porta, renova o meu ânimo. Ajuda-me a continuar semeando com fidelidade, confiando na Tua colheita no tempo oportuno.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-disciplina-5',
    reference: 'Josué 1:8-9',
    passage: 'Não se aparte da tua boca o livro desta lei; antes medita nele dia e noite, para que tenhas cuidado de fazer conforme a tudo quanto nele está escrito; porque então farás prosperar o teu caminho, e serás bem-sucedido. Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.',
    version: 'ARA',
    theme: 'Constância na Palavra e Coragem',
    tags: ['disciplina', 'estudo', 'meditação', 'coragem', 'bíblia', 'liderança', 'perseverança'],
    bookId: 'josue',
    chapter: 1,
    context: 'Após a morte de Moisés, Josué assume a responsabilidade de liderar a nação em território desconhecido e hostil. O segredo da vitória não residia em táticas militares humanas, mas no apego contínuo aos preceitos da Lei.',
    reflection: 'A coragem bíblica não é a ausência de temor, mas a obediência sustentada pela promessa da presença divina. A meditação regular na Palavra modela a mente e ancora as decisões no caráter de Deus, gerando discernimento seguro diante de transições e desafios.',
    questions: [
      'A Palavra de Deus tem sido meu guia ativo nas decisões ou apenas um recurso para momentos de crise?',
      'Que situação atual exige de mim esforço, bom ânimo e confiança na presença de Deus?'
    ],
    practicalApplication: 'Escreva um versículo-chave do dia num papel ou na tela do celular e recite-o em três momentos diferentes: pela manhã, à tarde e à noite.',
    optionalPrayer: 'Senhor Deus, fortalece meu coração para não me curvar diante do medo. Guarda meus pensamentos na Tua verdade e dá-me ânimo para obedecer com fidelidade.',
    bibleSource: 'Bíblia Sagrada — Almeida Revista e Atualizada (ARA)'
  },

  // 2. PAZ, ANSIEDADE & DESCANSO
  {
    id: 'wotd-paz-1',
    reference: 'Filipenses 4:6-7',
    passage: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará os seus corações e as suas mentes em Cristo Jesus.',
    version: 'NVI',
    theme: 'Paz Interior e Entrega Confiante',
    tags: ['paz', 'ansiedade', 'oração', 'gratidão', 'descanso', 'confiança'],
    bookId: 'filipenses',
    chapter: 4,
    context: 'Paulo escreve aos filipenses a partir de uma cela, cercado de incertezas externas sobre sua vida. Mesmo nessas condições, ele aponta a oração com gratidão como antídoto contra a inquietação interior.',
    reflection: 'A paz de Deus não depende de circunstâncias exteriores calmas; ela é descrita como uma guarda militar (termo grego *phroureo*) que protege o coração e os pensamentos contra o cerco da preocupação excessiva.',
    questions: [
      'O que mais tem ocupado meus pensamentos com ansiedade hoje?',
      'Como posso transformar essa apreensão em uma oração sincera acompanhada de gratidão?'
    ],
    practicalApplication: 'Escreva em uma folha ou no aplicativo as três maiores preocupações do seu dia e entregue-as formalmente a Deus em oração, recusando-se a repensá-las repetidamente.',
    optionalPrayer: 'Pai de amor, entrego a Ti cada fardo e incerteza que pesam sobre minha mente. Enche o meu coração com a Tua paz que vai além de qualquer compreensão humana.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-paz-2',
    reference: 'Salmos 23:1-3',
    passage: 'O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas; restaura-me o vigor. Guia-me pelas veredas da justiça por amor do seu nome.',
    version: 'NVI',
    theme: 'Cuidado Pastoral e Restauração da Alma',
    tags: ['paz', 'descanso', 'confiança', 'salmos', 'pastoreio', 'refrigério'],
    bookId: 'salmos',
    chapter: 23,
    context: 'Salmo poético atribuído a Davi, que conhecia intimamente a rotina de pastorear ovelhas sob calor, predadores e terrenos acidentados do deserto da Judeia.',
    reflection: 'A ovelha descansa unicamente quando confia na vigilância e na provisão do pastor. Afirmar que "de nada terei falta" é uma confissão madura de que a presença de Deus é suficiente para suprir as reais necessidades da alma, mesmo em meio à escassez material.',
    questions: [
      'Tenho permitido que o Bom Pastor conduza meus passos ou tenho insistido em guiar meu próprio caminho?',
      'Em qual área da minha vida preciso urgentemente de repouso e restauração de forças?'
    ],
    practicalApplication: 'Reserve 5 minutos de silêncio absoluto ao longo do dia, respirando com calma e repetindo mentalmente: "O Senhor é meu pastor, Ele restaura a minha alma".',
    optionalPrayer: 'Bom Pastor, eu descanso na Tua provisão. Conduz-me a lugares de refrigério e acalma os ruídos da minha mente, para que eu ande em retidão pelo Teu nome.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-paz-3',
    reference: 'Mateus 6:33-34',
    passage: 'Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas. Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações. Basta a cada dia o seu próprio mal.',
    version: 'NVI',
    theme: 'Prioridades Claras e Foco no Hoje',
    tags: ['paz', 'ansiedade', 'prioridades', 'reino', 'confiança', 'hoje'],
    bookId: 'mateus',
    chapter: 6,
    context: 'Parte do Sermão da Montanha, onde Jesus ensina sobre a providência do Pai através da contemplação das aves do céu e dos lírios do campo.',
    reflection: 'Jesus desmascara a ansiedade como uma tentativa ilusória de controlar o futuro. Ao redirecionar a atenção para a busca primeira do Reino e da retidão hoje, o discípulo encontra a liberdade de viver o presente com propósito e fé.',
    questions: [
      'Quais preocupações com o futuro estão me impedindo de viver com plenitude e fidelidade o dia de hoje?',
      'O que significa buscar o Reino de Deus concretamente na minha rotina de trabalho ou estudos?'
    ],
    practicalApplication: 'Ao notar que está antecipando problemas que só podem acontecer amanhã ou na próxima semana, declare em voz baixa: "Basta a este dia o seu mal; hoje busco o Teu Reino".',
    optionalPrayer: 'Senhor Jesus, ajuda-me a ordenar minhas prioridades. Livra-me da ilusão de tentar antecipar o amanhã e dá-me fidelidade para buscar o Teu Reino hoje.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },

  // 3. SABEDORIA & DISCERNIMENTO
  {
    id: 'wotd-sabedoria-1',
    reference: 'Provérbios 3:5-6',
    passage: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.',
    version: 'NVI',
    theme: 'Confiança Incondicional e Direção Divina',
    tags: ['sabedoria', 'discernimento', 'direção', 'decisões', 'confiança', 'humildade'],
    bookId: 'proverbios',
    chapter: 3,
    context: 'Exortação paterna clássica em Provérbios, chamando o leitor a renunciar à autossuficiência e a submeter todas as esferas da vida à soberania de Deus.',
    reflection: 'A verdadeira sabedoria não é o acúmulo de conhecimento técnico, mas uma postura do coração: a renúncia ao orgulho de achar que sabemos tudo e o reconhecimento contínuo de Deus em cada decisão, grande ou pequena.',
    questions: [
      'Em quais decisões recentes confiei exclusivamente no meu cálculo humano sem consultar a Deus em oração?',
      'Como posso reconhecer o Senhor nos meus compromissos profissionais e relacionais de hoje?'
    ],
    practicalApplication: 'Antes de tomar uma decisão importante hoje, faça uma pausa de um minuto para orar pedindo discernimento e clareza moral.',
    optionalPrayer: 'Senhor Deus de toda sabedoria, eu renuncio à soberba de confiar apenas em mim mesmo. Guia minhas palavras e decisões e endireita os meus passos.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-sabedoria-2',
    reference: 'Tiago 1:5',
    passage: 'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade; e lhe será concedida.',
    version: 'NVI',
    theme: 'Acesso à Sabedoria Graciosa',
    tags: ['sabedoria', 'discernimento', 'oração', 'graça', 'humildade', 'pedir'],
    bookId: 'tiago',
    chapter: 1,
    context: 'Tiago escreve às doze tribos dispersas, exortando os crentes a enfrentarem provações com discernimento espiritual e dependência filial.',
    reflection: 'Deus não humilha nem censura quem reconhece sua limitação e pede sabedoria. Ele tem prazer em conceder clareza e discernimento generoso àqueles que se achegam com humildade.',
    questions: [
      'Reconheço com franqueza diante de Deus onde me sinto despreparado ou confuso?',
      'Tenho pedido sabedoria para lidar com conflitos em vez de reagir na carne?'
    ],
    practicalApplication: 'Diante de qualquer impasse interpessoal ou dúvida hoje, peça sabedoria a Deus antes de responder imediatamente por mensagem ou voz.',
    optionalPrayer: 'Pai celeste, confesso minha falta de sabedoria em muitas circunstâncias. Concede-me Teu discernimento generoso para falar e agir com prudência e mansidão.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-sabedoria-3',
    reference: 'Salmos 119:105',
    passage: 'Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.',
    version: 'ARA',
    theme: 'Orientação Diária pela Verdade',
    tags: ['sabedoria', 'bíblia', 'estudo', 'direção', 'discernimento', 'luz'],
    bookId: 'salmos',
    chapter: 1, // Livro de Salmos
    context: 'Do mais extenso capítulo bíblico, um poema acróstico dedicado a louvar a beleza, integridade e eficácia da Palavra de Deus em todos os momentos da caminhada.',
    reflection: 'A metáfora da lâmpada nos tempos antigos indica luz suficiente para o próximo passo no caminho escuro, não um holofote que revela cem quilômetros adiante. A Palavra nos ilumina passo a passo, ensinando fidelidade no presente.',
    questions: [
      'Estou esperando ver todo o futuro de antemão ou estou disposto a obedecer ao próximo passo que a Escritura me revela?',
      'Como posso aplicar a luz da Bíblia às conversas e atitudes de hoje?'
    ],
    practicalApplication: 'Guarde no coração um mandamento prático (como perdoar, falar a verdade ou ser generoso) e pratique-o na primeira oportunidade de hoje.',
    optionalPrayer: 'Senhor, que a Tua verdade ilumine minhas escolhas diárias. Dá-me ouvidos atentos para não tropeçar no escuro do mundo nem nas minhas próprias opiniões.',
    bibleSource: 'Bíblia Sagrada — Almeida Revista e Atualizada (ARA)'
  },

  // 4. ORAÇÃO & INTIMIDADE
  {
    id: 'wotd-oracao-1',
    reference: 'Mateus 6:6',
    passage: 'Mas quando você orar, vá para seu quarto, feche a porta e ore a seu Pai, que está no secreto. Então seu Pai, que vê no secreto, o recompensará.',
    version: 'NVI',
    theme: 'Intimidade Pessoal no Secreto',
    tags: ['oração', 'intimidade', 'secreto', 'comunhão', 'silêncio', 'autenticidade'],
    bookId: 'mateus',
    chapter: 6,
    context: 'Jesus contrasta a devoção hipócrita, encenada nas esquinas para obter louvor dos homens, com a comunhão genuína com o Pai no lugar secreto.',
    reflection: 'A essência da vida espiritual é forjada quando ninguém está olhando. O "secreto" é o ambiente de desarmamento, onde deixamos de lado aparências e conversamos com sinceridade filial com o Deus que tudo vê e nos ama.',
    questions: [
      'Minha oração tem sido um momento íntimo e desarmado com o Pai ou apenas um cumprimento formal de dever?',
      'Qual é o meu "lugar secreto" hoje, mesmo que seja um momento de silêncio no quarto ou no carro?'
    ],
    practicalApplication: 'Reserve ao menos 10 minutos hoje inteiramente a sós, desconectado de notificações, para falar com Deus com transparência absoluta.',
    optionalPrayer: 'Pai amado, obrigado porque Tu me vês no secreto e me acolhes como filho. Livra-me da hipocrisia e atrai o meu coração para uma comunhão profunda Contigo.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-oracao-2',
    reference: 'João 15:5',
    passage: 'Eu sou a videira; vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dará muito fruto; pois sem mim vocês não podem fazer coisa alguma.',
    version: 'NVI',
    theme: 'Dependência Viva de Cristo',
    tags: ['oração', 'intimidade', 'comunhão', 'frutos', 'dependência', 'permanência'],
    bookId: 'joao',
    chapter: 15,
    context: 'Discurso de despedida de Jesus no Cenáculo na véspera da crucificação, instruindo os discípulos sobre a união vital necessária para perseverar na fé.',
    reflection: 'O ramo não faz força mecânica para produzir uvas; ele simplesmente permanece conectado ao tronco de onde flui a seiva da vida. A fecundidade espiritual brota da permanência relacional contínua em Jesus, não do ativismo desprovido de oração.',
    questions: [
      'Tenho tentado produzir frutos de amor e paciência pelas minhas próprias forças?',
      'O que significa "permanecer em Cristo" durante as horas normais de trabalho e estudo?'
    ],
    practicalApplication: 'Faça orações curtas (aspirações de dependência) ao longo do dia: "Senhor, dependo de Ti nesta conversa", "Espírito Santo, sopra Tua graça nesta tarefa".',
    optionalPrayer: 'Senhor Jesus, és a minha fonte de vida. Perdoa-me pelos momentos em que tento agir por conta própria. Ensina-me a permanecer em Ti e a frutificar para Tua glória.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-oracao-3',
    reference: 'Romanos 8:26',
    passage: 'Da mesma forma o Espírito nos ajuda em nossa fraqueza, pois não sabemos como orar, mas o próprio Espírito intercede por nós com gemidos inexprimíveis.',
    version: 'NVI',
    theme: 'O Socorro do Espírito na Oração',
    tags: ['oração', 'fraqueza', 'espírito santo', 'intercessão', 'graça', 'consolo'],
    bookId: 'romanos',
    chapter: 8,
    context: 'Paulo expõe a esperança da redenção final em meio aos sofrimentos presentes, assegurando que o Espírito Santo habita em nós e atua ativamente a nosso favor.',
    reflection: 'A incapacidade de encontrar palavras perfeitas em momentos de dor ou cansaço não impede a oração eficaz. O próprio Espírito Santo acolhe nossa fraqueza e leva ao Pai o clamor mais profundo da nossa alma.',
    questions: [
      'Já me senti culpado por não saber o que orar ou por sentir-me fraco?',
      'Como me conforta saber que o Espírito intercede por mim perante o Pai?'
    ],
    practicalApplication: 'Se hoje estiver cansado, apenas coloque-se de joelhos ou sentado em silêncio diante de Deus e diga: "Senhor, o Teu Espírito conhece o que minha alma precisa. Entrego-me a Ti".',
    optionalPrayer: 'Espírito de Deus, socorre minha fraqueza. Quando me faltarem palavras, traduz o silêncio e as dores da minha alma diante do trono da graça. Amém.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },

  // 5. AMOR, SERVIÇO & MANSIDÃO
  {
    id: 'wotd-amor-1',
    reference: '1 Coríntios 13:4-5',
    passage: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.',
    version: 'NVI',
    theme: 'O Caráter Prático do Amor Cristão',
    tags: ['amor', 'mansidão', 'paciência', 'relacionamentos', 'família', 'perdão'],
    bookId: '1corintios',
    chapter: 13,
    context: 'Paulo responde às divisões e competições espirituais na igreja de Corinto, mostrando que nenhum dom ou eloqüência tem valor se desprovido de amor sacrificial.',
    reflection: 'O amor bíblico (*ágape*) não é uma emoção passiva, mas uma série de verbos e atitudes ativas. Ele se manifesta em suportar a lentidão alheia com paciência, responder com bondade a quem ofende e recusar o acúmulo amargo de ressentimentos.',
    questions: [
      'Com quem tenho sido mais impaciente ultimamente?',
      'Há algum rancor antigo que continuo guardando e alimentando no meu coração?'
    ],
    practicalApplication: 'Demonstre paciência intencional com uma pessoa difícil hoje, ouvindo com atenção e respondendo com suavidade.',
    optionalPrayer: 'Senhor Jesus, derrama Teu amor paciente em meu coração. Perdoa meu orgulho e ensina-me a perdoar livremente, assim como fui perdoado na cruz.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-amor-2',
    reference: 'Miquéias 6:8',
    passage: 'Ele te declarou, ó homem, o que é bom; e que é o que o Senhor pede de ti, senão que pratiques a justiça, e ames a benevolência, e andes humildemente com o teu Deus?',
    version: 'ARA',
    theme: 'Justiça, Misericórdia e Humildade',
    tags: ['serviço', 'justiça', 'misericórdia', 'humildade', 'amor', 'estilo de vida'],
    bookId: 'mateus', // Agrupado
    chapter: 5,
    context: 'O profeta Miquéias confronta a religiosidade puramente ritualística de Israel, demonstrando que sacrifícios externos não substituem a integridade ética e o amor ao próximo.',
    reflection: 'O resumo da vontade de Deus é transparente e acessível: integridade com as pessoas (praticar a justiça), compaixão profunda com os frágeis (amar a misericórdia) e sobriedade de coração diante do Criador (andar humildemente com Deus).',
    questions: [
      'Como minhas ações cotidianas refletem justiça com quem convive comigo?',
      'Tenho agido com misericórdia para com as limitações dos outros?'
    ],
    practicalApplication: 'Pratique um ato de generosidade discreta hoje: auxilie alguém que precisa ou preste apoio a quem estiver sobrecarregado.',
    optionalPrayer: 'Senhor Deus, guarda-me da hipocrisia de ritos sem coração. Ajuda-me a agir com justiça, amar a misericórdia e caminhar com humildade diante de Ti todos os dias.',
    bibleSource: 'Bíblia Sagrada — Almeida Revista e Atualizada (ARA)'
  },

  // 6. CONSAGRAÇÃO, SANTIDADE & JEJUM
  {
    id: 'wotd-consagracao-1',
    reference: 'Romanos 12:1-2',
    passage: 'Portanto, irmãos, rogo-lhes pelas misericórdias de Deus que se ofereçam em sacrifício vivo, santo e agradável a Deus; este é o culto racional de vocês. Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente, para que sejam capazes de experimentar e comprovar a boa, agradável e perfeita vontade de Deus.',
    version: 'NVI',
    theme: 'Consagração Integral e Renovação da Mente',
    tags: ['consagração', 'jejum', 'santidade', 'mente', 'vontade de deus', 'disciplina'],
    bookId: 'romanos',
    chapter: 12,
    context: 'Após onze capítulos de teologia sobre a justificação pela fé, Paulo faz a virada prática de Romanos, convocando os crentes a viverem a salvação no corpo e na mente.',
    reflection: 'O verdadeiro culto não se encerra em um momento solene; ele acontece quando colocamos nosso tempo, nosso corpo e nossos desejos à disposição de Deus. A renovação da mente pela Palavra nos liberta das pressões e padrões efêmeros da cultura.',
    questions: [
      'Quais padrões ou modismos do mundo têm tentado moldar meus pensamentos e prioridades?',
      'Como posso oferecer meu corpo e minhas horas de hoje como um sacrifício vivo a Deus?'
    ],
    practicalApplication: 'Faça um "jejum digital" ou de consumo desnecessário de 2 horas hoje, usando esse tempo para alimentar sua mente com coisas puras e edificantes.',
    optionalPrayer: 'Senhor, entrego minha vida, meu corpo e minha mente a Ti como um sacrifício vivo. Renova meu entendimento pela Tua verdade e mostra-me Tua boa vontade.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-consagracao-2',
    reference: 'Isaías 58:6-8',
    passage: 'Não é este o jejum que escolhi: que soltes as ligaduras da impiedade, que desfaças as ataduras da servidão, e ponhas em liberdade os oprimidos, e despedaces todo jugo? Porventura não é também que repartas o teu pão com o faminto...? Então romperá a tua luz como a alva, e a tua cura apressadamente brotará.',
    version: 'ARA',
    theme: 'O Jejum que Agrada a Deus',
    tags: ['jejum', 'consagração', 'justiça', 'solidariedade', 'cura', 'quebrantamento'],
    bookId: 'isaias',
    chapter: 40,
    context: 'Isaías denuncia a prática do jejum como mero ritual externo acompanhado de brigas e exploração de trabalhadores, apontando o verdadeiro jejum de compaixão e justiça.',
    reflection: 'A abstinência física no jejum tem como objetivo quebrar a autossuficiência e abrir espaço para a compaixão e a generosidade. O jejum que Deus honra transforma a alma em um instrumento de libertação e cuidado com o próximo.',
    questions: [
      'Quando consagro um momento de jejum ou renúncia, meu coração se volta para o próximo ou apenas para minhas próprias necessidades?',
      'Como posso unir disciplina espiritual e amor concreto hoje?'
    ],
    practicalApplication: 'Ao jejuar ou economizar uma refeição, destine o valor ou o alimento a alguém em vulnerabilidade social ou necessitado.',
    optionalPrayer: 'Senhor Deus, livra-me do jejum frio e egoísta. Que minha renúncia física quebre meu orgulho e me torne sensível à dor do meu irmão. Amém.',
    bibleSource: 'Bíblia Sagrada — Almeida Revista e Atualizada (ARA)'
  },

  // 7. FÉ & ESPERANÇA
  {
    id: 'wotd-fe-1',
    reference: 'Isaías 40:29-31',
    passage: 'Ele fortalece o cansado e dá grande vigor ao que está sem forças. Até os jovens se cansam e ficam exaustos, e os moços tropeçam e caem; mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.',
    version: 'NVI',
    theme: 'Renovação de Forças na Esperança',
    tags: ['fé', 'esperança', 'cansaço', 'vigor', 'espera', 'força'],
    bookId: 'isaias',
    chapter: 40,
    context: 'Mensagem de consolo ao povo no cativeiro babilônico, quando tudo parecia perdido e o desânimo generalizado ameaçava a fé da comunidade.',
    reflection: 'A força humana, mesmo a mais jovem e vigorosa, possui limites intransponíveis. Contudo, "esperar no Senhor" não é passividade inerte; é uma confiança ativa que nos conecta à fonte inesgotável do Criador, renovando a capacidade de caminhar dia após dia.',
    questions: [
      'Em qual área sinto que minhas forças físicas ou emocionais estão esgotadas?',
      'Como a promessa de que Deus não se cansa nem se fatiga renova meu descanso hoje?'
    ],
    practicalApplication: 'Em vez de tentar resolver tudo na pressa ansiosa, faça uma pausa para respirar fundo e declarar: "Minha esperança está no Senhor que renova o meu vigor".',
    optionalPrayer: 'Senhor Todo-Poderoso, reconheço meu cansaço e minha fragilidade. Entrego a Ti minhas fraquezas e recebo a renovação de forças que só o Teu Espírito pode conceder.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  },
  {
    id: 'wotd-fe-2',
    reference: 'Hebreus 11:1',
    passage: 'Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.',
    version: 'NVI',
    theme: 'A Firmeza da Fé Bíblica',
    tags: ['fé', 'esperança', 'certeza', 'confiança', 'invisível', 'estudo'],
    bookId: 'hebreus',
    chapter: 11,
    context: 'Abertura do célebre memorial dos heróis da fé em Hebreus, demonstrando que a fidelidade histórica foi sustentada por convicções inabaláveis nas promessas divinas.',
    reflection: 'A fé bíblica não é um pensamento positivo cego ou um salto no escuro; ela é uma firme convicção fundamentada na fidelidade comprovada do caráter de Deus. Ela nos permite andar com estabilidade mesmo quando as circunstâncias visíveis parecem incertas.',
    questions: [
      'Minha fé tem dependido daquilo que meus olhos veem ou das promessas eternas de Deus?',
      'O que significa viver pela fé nas minhas decisões profissionais e familiares de hoje?'
    ],
    practicalApplication: 'Escolha uma promessa bíblica de segurança e repita-a com convicção quando surgirem pensamentos de dúvida ou pessimismo.',
    optionalPrayer: 'Senhor Deus, aumenta a minha fé. Ensina-me a não me abalar pelo que vejo temporariamente com meus olhos humanos, mas a descansar na Tua fidelidade eterna.',
    bibleSource: 'Bíblia Sagrada — Nova Versão Internacional (NVI)'
  }
];
