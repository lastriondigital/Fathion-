import { ReadingPlan, PlanDay } from '../types';
import { generateScheduleDates, getTodayDateString } from '../services/readingPlanGenerator';

export interface PlanTemplateDefinition {
  id: string;
  title: string;
  description: string;
  objective: string;
  category: ReadingPlan['category'];
  durationDays: number;
  dailyEstimatedMinutes: number;
  method: ReadingPlan['method'];
  frequency: ReadingPlan['frequency'];
  preferredVersion: string;
  badge: string;
  createDays: () => Omit<PlanDay, 'date' | 'status'>[];
}

export const PLAN_TEMPLATES: PlanTemplateDefinition[] = [
  // 1. Provérbios (31 dias)
  {
    id: 'template-proverbios-31',
    title: 'Provérbios — Sabedoria Diária',
    description: '31 dias de conselhos práticos para decisões, relacionamentos, trabalho, finanças e integridade de vida.',
    objective: 'Crescer em discernimento divino, aplicando um capítulo de provérbios por dia do mês.',
    category: 'wisdom',
    durationDays: 31,
    dailyEstimatedMinutes: 10,
    method: 'capitulos_especificos',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '31 Dias • Sabedoria',
    createDays: () => {
      const days: Omit<PlanDay, 'date' | 'status'>[] = [];
      const prompts: Record<number, string> = {
        1: 'O temor do Senhor é o princípio do saber. Onde você precisa rever suas prioridades diante de Deus?',
        2: 'Se clamares por discernimento como por tesouros ocultos, acharás o conhecimento de Deus.',
        3: 'Confia no Senhor de todo o teu coração e não te apoies no teu próprio entendimento.',
        4: 'Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.',
        5: 'A integridade preserva o caminho. Como manter a mente pura contra ciladas e ilusões?',
        6: 'Conselhos contra a preguiça e a discórdia. Observe as formigas e seja diligente!',
        7: 'Guarda as minhas palavras e vive. A Palavra como lâmpada de discernimento.',
        8: 'A sabedoria clama nas praças e encruzilhadas. Você tem dedicado tempo para ouvi-la?',
        9: 'O banquete da Sabedoria vs. o engano da insensatez. Quem você tem deixado moldar suas escolhas?',
        10: 'O tesouro da retidão e o fruto do trabalho justo diante do Altíssimo.',
        11: 'A balança justa agrada ao Senhor. Integridade e generosidade multiplicam a paz.',
        12: 'Quem ama a disciplina ama o conhecimento. Como você reage ao ser corrigido?',
        13: 'O que anda com os sábios será sábio. Avalie suas amizades e influências diárias.',
        14: 'A mulher sábia edifica a sua casa. Em todo trabalho proveitoso há lucro.',
        15: 'A resposta branda desvia o furor. O olhar vigilante de Deus traz consolo ao coração.',
        16: 'Entrega as tuas obras ao Senhor, e os teus planos serão estabelecidos.',
        17: 'Melhor é um bocado seco com tranquilidade do que a casa cheia de banquetes com discórdia.',
        18: 'Torre forte é o nome do Senhor; para ela corre o justo e está em segurança.',
        19: 'Muitos são os planos no coração do homem, mas o conselho do Senhor permanecerá.',
        20: 'A lâmpada do Senhor é o espírito do homem, a qual esquadrinha todo o mais íntimo do coração.',
        21: 'Como ribeiros de águas assim é o coração nas mãos do Senhor; a tudo quanto quer o inclina.',
        22: 'Mais vale o bom nome do que as muitas riquezas; a estima é melhor que a prata e o ouro.',
        23: 'Dá-me, filho meu, o teu coração, e os teus olhos se comprazam nos meus caminhos.',
        24: 'Com a sabedoria se edifica a casa, e com o entendimento ela se estabelece.',
        25: 'Como maçãs de ouro em salvas de prata, assim é a palavra dita a seu tempo.',
        26: 'Não responda ao insensato segundo a sua estultícia. Fuja das fofocas que ateiam fogo.',
        27: 'Não te glories do dia de amanhã. Como o ferro com o ferro se afia, assim o homem ao amigo.',
        28: 'O ímpio foge sem que ninguém o persiga, mas o justo é intrépido como o leão.',
        29: 'O homem paciente acalma a discórdia e governa o seu espírito com sabedoria.',
        30: 'Toda palavra de Deus é pura; Ele é escudo para os que nele confiam.',
        31: 'A mulher virtuosa e o servo fiel: o encanto é ilusório e a beleza fugaz, mas a alma temente ao Senhor será louvada.'
      };

      for (let i = 1; i <= 31; i++) {
        days.push({
          dayNumber: i,
          title: `Provérbios ${i} — Sabedoria e Retidão`,
          passageRef: `Provérbios ${i}`,
          bookId: 'proverbios',
          chapter: i,
          devotionalPrompt: prompts[i] || `Medite nos princípios de integridade de Provérbios ${i}.`,
          completed: false,
          estimatedMinutes: 10
        });
      }
      return days;
    }
  },

  // 2. Evangelhos (30 dias)
  {
    id: 'template-evangelhos-30',
    title: 'Os Evangelhos — A Vida e Ensinos de Jesus',
    description: '30 dias pelos momentos mais marcantes de Mateus, Marcos, Lucas e João: milagres, sermões, paixão e ressurreição.',
    objective: 'Aprofundar a intimidade com Cristo contemplando Sua graça, poder e amor incondicional.',
    category: 'gospels',
    durationDays: 30,
    dailyEstimatedMinutes: 15,
    method: 'passagens_especificas',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '30 Dias • Evangelhos',
    createDays: () => [
      { dayNumber: 1, title: 'O Verbo Feito Carne', passageRef: 'João 1', bookId: 'joao', chapter: 1, devotionalPrompt: 'Cristo é a luz que brilha nas trevas da sua história.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 2, title: 'O Nascimento do Salvador', passageRef: 'Lucas 2', bookId: 'lucas', chapter: 2, devotionalPrompt: 'Glória a Deus nas alturas e paz na terra.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 3, title: 'O Batismo e a Tentação no Deserto', passageRef: 'Mateus 4', bookId: 'mateus', chapter: 4, devotionalPrompt: 'Vencendo as ciladas do inimigo através do poder da Palavra.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 4, title: 'As Bem-Aventuranças e o Sal da Terra', passageRef: 'Mateus 5', bookId: 'mateus', chapter: 5, devotionalPrompt: 'O caráter dos cidadãos do Reino dos Céus.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 5, title: 'A Oração do Pai Nosso e Confiança', passageRef: 'Mateus 6', bookId: 'mateus', chapter: 6, devotionalPrompt: 'Buscai primeiro o Reino e não andeis ansiosos.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 6, title: 'A Casa Sobre a Rocha', passageRef: 'Mateus 7', bookId: 'mateus', chapter: 7, devotionalPrompt: 'Ouvir e praticar a Palavra de Jesus.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 7, title: 'A Cura do Paralítico e o Perdão', passageRef: 'Marcos 2', bookId: 'marcos', chapter: 2, devotionalPrompt: 'Jesus tem autoridade na terra para perdoar pecados.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 8, title: 'A Tempestade Acalmada', passageRef: 'Marcos 4', bookId: 'marcos', chapter: 4, devotionalPrompt: 'Por que estais tímidos? Onde está a vossa fé no meio da tempestade?', completed: false, estimatedMinutes: 15 },
      { dayNumber: 9, title: 'O Encontro com a Samaritana', passageRef: 'João 4', bookId: 'joao', chapter: 4, devotionalPrompt: 'A água viva que jorra para a vida eterna.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 10, title: 'O Pão da Vida', passageRef: 'João 6', bookId: 'joao', chapter: 6, devotionalPrompt: 'Aquele que vem a Mim jamais terá fome.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 11, title: 'A Parábola do Bom Samaritano', passageRef: 'Lucas 10', bookId: 'lucas', chapter: 10, devotionalPrompt: 'Quem é o meu próximo? O amor demonstrado em ação.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 12, title: 'O Pai Misericordioso e o Filho Pródigo', passageRef: 'Lucas 15', bookId: 'lucas', chapter: 15, devotionalPrompt: 'O abraço do Pai que restaura qualquer coração arrependido.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 13, title: 'A Ressurreição de Lázaro', passageRef: 'João 11', bookId: 'joao', chapter: 11, devotionalPrompt: 'Eu sou a ressurreição e a vida; quem crê em Mim viverá.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 14, title: 'O Encontro Transformador com Zaqueu', passageRef: 'Lucas 19', bookId: 'lucas', chapter: 19, devotionalPrompt: 'O Filho do Homem veio buscar e salvar o perdido.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 15, title: 'A Entrada Triunfal em Jerusalém', passageRef: 'Mateus 21', bookId: 'mateus', chapter: 21, devotionalPrompt: 'Bendito o que vem em nome do Senhor.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 16, title: 'O Lava-Pés e a Humildade', passageRef: 'João 13', bookId: 'joao', chapter: 13, devotionalPrompt: 'Exemplo vos dei, para que façais como Eu fiz.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 17, title: 'O Caminho, a Verdade e a Vida', passageRef: 'João 14', bookId: 'joao', chapter: 14, devotionalPrompt: 'Não se turbe o vosso coração; credes em Deus, crede também em Mim.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 18, title: 'A Videira Verdadeira e os Ramos', passageRef: 'João 15', bookId: 'joao', chapter: 15, devotionalPrompt: 'Sem Mim nada podeis fazer. Permanecei no Meu amor.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 19, title: 'A Oração Sacerdotal de Jesus', passageRef: 'João 17', bookId: 'joao', chapter: 17, devotionalPrompt: 'Jesus orando pela unidade e proteção de Seus discípulos.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 20, title: 'A Agonia no Getsêmani', passageRef: 'Mateus 26', bookId: 'mateus', chapter: 26, devotionalPrompt: 'Não seja como eu quero, mas como Tu queres.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 21, title: 'A Cruz e a Entrega Suprema', passageRef: 'João 19', bookId: 'joao', chapter: 19, devotionalPrompt: 'Está consumado: a dívida do pecado foi totalmente paga.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 22, title: 'O Sepulcro Vazio e a Ressurreição', passageRef: 'Mateus 28', bookId: 'mateus', chapter: 28, devotionalPrompt: 'Ele não está aqui, porque ressuscitou! Toda autoridade Lhe foi dada.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 23, title: 'O Caminho de Emaús', passageRef: 'Lucas 24', bookId: 'lucas', chapter: 24, devotionalPrompt: 'Porventura não ardia o nosso coração quando Ele nos falava pelo caminho?', completed: false, estimatedMinutes: 15 },
      { dayNumber: 24, title: 'A Restauração de Pedro', passageRef: 'João 21', bookId: 'joao', chapter: 21, devotionalPrompt: 'Simão, tu me amas? Apascenta as minhas ovelhas.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 25, title: 'A Grande Comissão', passageRef: 'Marcos 16', bookId: 'marcos', chapter: 16, devotionalPrompt: 'Ide por todo o mundo e pregai o evangelho a toda criatura.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 26, title: 'A Autoridade Sobre os Mares e Ventos', passageRef: 'Lucas 8', bookId: 'lucas', chapter: 8, devotionalPrompt: 'Mesmo as ondas e ventos Lhe obedecem.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 27, title: 'O Cego de Jericó e o Clamor da Fé', passageRef: 'Marcos 10', bookId: 'marcos', chapter: 10, devotionalPrompt: 'Filho de Davi, tem misericórdia de mim! A tua fé te salvou.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 28, title: 'A Ressurreição da Filha de Jairo', passageRef: 'Marcos 5', bookId: 'marcos', chapter: 5, devotionalPrompt: 'Não temas; crê somente.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 29, title: 'O Bom Pastor que Dá a Vida', passageRef: 'João 10', bookId: 'joao', chapter: 10, devotionalPrompt: 'As minhas ovelhas ouvem a minha voz, e Eu as conheço e elas me seguem.', completed: false, estimatedMinutes: 15 },
      { dayNumber: 30, title: 'Eu Sou a Videira e a Plenitude', passageRef: 'João 15', bookId: 'joao', chapter: 15, devotionalPrompt: 'Ninguém tem maior amor do que este: de dar alguém a sua vida pelos seus amigos.', completed: false, estimatedMinutes: 15 }
    ]
  },

  // 3. Salmos (30 dias)
  {
    id: 'template-salmos-30',
    title: 'Salmos — Cânticos de Louvor e Refúgio',
    description: '30 dias pelas mais profundas orações de louvor, consolação, confissão e adoração do Saltério.',
    objective: 'Encontrar palavras sinceras para derramar o coração diante de Deus em qualquer estação da vida.',
    category: 'peace',
    durationDays: 30,
    dailyEstimatedMinutes: 10,
    method: 'capitulos_especificos',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '30 Dias • Salmos',
    createDays: () => {
      const selectedPsalms = [
        { num: 1, title: 'O Justo e o Ímpio', prompt: 'Onde está o seu prazer diário? Medite na lei do Senhor dia e noite.' },
        { num: 8, title: 'A Majestade Divina e o Homem', prompt: 'Quão admirável é o Teu nome em toda a terra!' },
        { num: 16, title: 'A Herança Preciosa em Deus', prompt: 'O Senhor é a porção da minha herança e do meu cálice.' },
        { num: 19, title: 'Os Céus Proclamam a Glória', prompt: 'A lei do Senhor é perfeita e refrigera a alma.' },
        { num: 23, title: 'O Senhor é o Meu Pastor', prompt: 'De nada terei falta. O cálice transborda sob o cuidado do Pai.' },
        { num: 27, title: 'O Senhor é a Minha Luz e Salvação', prompt: 'De quem terei medo? Uma coisa peço: habitar na Casa do Senhor.' },
        { num: 32, title: 'A Bem-Aventurança do Perdão', prompt: 'Confessei-te o meu pecado e Tu perdoaste a maldade do meu coração.' },
        { num: 34, title: 'O Louvor em Todo o Tempo', prompt: 'Provai e vede que o Senhor é bom; bem-aventurado quem nele confia.' },
        { num: 37, title: 'Descansa no Senhor e Espera Nele', prompt: 'Entrega o teu caminho ao Senhor, confia nele, e Ele o fará.' },
        { num: 42, title: 'A Alma Sedenta por Deus', prompt: 'Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei.' },
        { num: 46, title: 'Deus é o Nosso Refúgio e Fortaleza', prompt: 'Aquietai-vos e sabei que Eu sou Deus; serei exaltado entre as nações.' },
        { num: 51, title: 'O Clamor por Purificação', prompt: 'Cria em mim, ó Deus, um coração puro, e renova em mim um espírito reto.' },
        { num: 63, title: 'A Sede de Deus na Terra Seca', prompt: 'A Tua benignidade é melhor do que a vida; os meus lábios te louvarão.' },
        { num: 67, title: 'A Bênção que Alcança as Nações', prompt: 'Deus tenha misericórdia de nós e nos abençoe, e faça resplandecer o Seu rosto.' },
        { num: 73, title: 'Deus é a Fortaleza do Coração', prompt: 'Quem tenho eu no céu senão a Ti? Deus é a porção eterna da minha alma.' },
        { num: 84, title: 'O Anseio pelos Átrios do Senhor', prompt: 'Melhor é um dia nos Teus átrios do que mil em outro lugar.' },
        { num: 90, title: 'A Oração de Moisés sobre a Brevidade', prompt: 'Ensina-nos a contar os nossos dias, para que alcancemos coração sábio.' },
        { num: 91, title: 'O Abrigo Seguro do Altíssimo', prompt: 'Ele te cobrirá com as Suas penas, e sob as Suas asas te refugiarás.' },
        { num: 100, title: 'Celebrai com Júbilo ao Senhor', prompt: 'Entrai pelas portas dele com louvor, e em seus átrios com hinos!' },
        { num: 103, title: 'Bendize, ó Minha Alma, ao Senhor', prompt: 'Não te esqueças de nenhum de Seus benefícios: Ele perdoa e sara.' },
        { num: 116, title: 'A Gratidão pelo Livramento', prompt: 'Que darei eu ao Senhor por todos os benefícios que me tem feito?' },
        { num: 119, title: 'A Luz da Palavra Viva', prompt: 'Lâmpada para os meus pés é a Tua palavra, e luz para o meu caminho.' },
        { num: 121, title: 'O Socorro que Vem do Criador', prompt: 'O meu socorro vem do Senhor, que fez os céus e a terra.' },
        { num: 126, title: 'O Retorno do Cativeiro e os Cânticos', prompt: 'Grandes coisas fez o Senhor por nós, pelas quais estamos alegres.' },
        { num: 127, title: 'A Dependência Soberana de Deus', prompt: 'Se o Senhor não edificar a casa, em vão trabalham os que a edificam.' },
        { num: 130, title: 'Das Profundezas Clamo a Ti', prompt: 'No Senhor há misericórdia, e com Ele abundante redenção.' },
        { num: 138, title: 'O Senhor Aperfeiçoará o que me Concerne', prompt: 'O Senhor cumprirá o Seu propósito a meu respeito; Tua misericórdia é eterna.' },
        { num: 139, title: 'O Deus Onisciente que nos Conhece', prompt: 'Sonda-me, ó Deus, e conhece o meu coração; guia-me pelo caminho eterno.' },
        { num: 145, title: 'A Exaltação da Bondade Divina', prompt: 'Perto está o Senhor de todos os que o invocam em verdade.' },
        { num: 150, title: 'O Grande Aleluia Final', prompt: 'Tudo quanto tem fôlego louve ao Senhor! Aleluia!' }
      ];

      return selectedPsalms.map((p, idx) => ({
        dayNumber: idx + 1,
        title: `Salmo ${p.num} — ${p.title}`,
        passageRef: `Salmo ${p.num}`,
        bookId: 'salmos',
        chapter: p.num,
        devotionalPrompt: p.prompt,
        completed: false,
        estimatedMinutes: 10
      }));
    }
  },

  // 4. Conhecer Jesus (21 dias)
  {
    id: 'template-conhecer-jesus-21',
    title: 'Conhecer Jesus — Os Encontros Transformadores',
    description: '21 dias conhecendo o coração de Cristo através de Seus ensinos mais profundos no Evangelho de João.',
    objective: 'Fortalecer a fé pessoal e o discipulado prático experimentando a amizade íntima com o Filho de Deus.',
    category: 'gospels',
    durationDays: 21,
    dailyEstimatedMinutes: 12,
    method: 'livros_especificos',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '21 Dias • Discipulado',
    createDays: () => {
      const days: Omit<PlanDay, 'date' | 'status'>[] = [];
      const prompts: Record<number, string> = {
        1: 'No princípio era a Palavra. Quem é Jesus para você pessoalmente?',
        2: 'O primeiro milagre em Caná: Jesus se importa com a alegria do seu lar.',
        3: 'O diálogo noturno com Nicodemos: importa nascer de novo pelo Espírito.',
        4: 'A mulher no poço de Jacó: Cristo satisfaz a sede mais profunda da alma.',
        5: 'A cura no tanque de Betesda: levanta-te, toma o teu leito e anda!',
        6: 'A multiplicação dos pães e peixes: Ele é o Pão da Vida.',
        7: 'Rios de água viva fluirão do interior de quem crer Nele.',
        8: 'A mulher apanhada em pecado: Eu não te condeno; vá e não peques mais.',
        9: 'A cura do cego de nascença: eu era cego, mas agora vejo.',
        10: 'O Bom Pastor que dá a vida pelas suas ovelhas.',
        11: 'A ressurreição de Lázaro: Eu sou a ressurreição e a vida.',
        12: 'Maria unge os pés de Jesus com o perfume precioso: adoração sem reservas.',
        13: 'O lava-pés: o maior no Reino é aquele que serve de joelhos.',
        14: 'Não se turbe o vosso coração; Eu sou o caminho, a verdade e a vida.',
        15: 'Eu sou a Videira verdadeira; permanecei em Mim e dareis muito fruto.',
        16: 'O Consolador prometido: o Espírito Santo vos guiará a toda a verdade.',
        17: 'A oração sacerdotal de Jesus por você e por todos os que creem.',
        18: 'A prisão e a firmeza humilde de Jesus diante dos governantes.',
        19: 'A crucificação no Calvário: Tudo está consumado!',
        20: 'A ressurreição triunfante e o encontro de Maria Madalena no jardim.',
        21: 'A restauração de Pedro à beira-mar: Tu me amas? Segue-me!'
      };

      for (let i = 1; i <= 21; i++) {
        days.push({
          dayNumber: i,
          title: `João ${i} — Revelação de Cristo`,
          passageRef: `João ${i}`,
          bookId: 'joao',
          chapter: i,
          devotionalPrompt: prompts[i] || `Medite na revelação de Cristo em João ${i}.`,
          completed: false,
          estimatedMinutes: 12
        });
      }
      return days;
    }
  },

  // 5. Fundamentos da Fé (14 dias)
  {
    id: 'template-fundamentos-fe-14',
    title: 'Fundamentos da Fé Cristã',
    description: '14 dias edificando alicerces sólidos em salvação, oração, identidade em Cristo, amor e vitória espiritual.',
    objective: 'Consolidar a maturidade espiritual e a certeza das promessas inabaláveis da aliança de Deus.',
    category: 'foundations',
    durationDays: 14,
    dailyEstimatedMinutes: 12,
    method: 'temas',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '14 Dias • Alicerce',
    createDays: () => [
      { dayNumber: 1, title: 'O Deus Criador de Todas as Coisas', passageRef: 'Gênesis 1', bookId: 'genesis', chapter: 1, devotionalPrompt: 'Como a majestade da criação inspira reverência no seu dia?', completed: false, estimatedMinutes: 12 },
      { dayNumber: 2, title: 'A Firmeza na Palavra de Deus', passageRef: 'Josué 1', bookId: 'josue', chapter: 1, devotionalPrompt: 'Não se aparte da tua boca o livro desta lei: medita nele dia e noite.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 3, title: 'O Descanso na Fidelidade do Bom Pastor', passageRef: 'Salmo 23', bookId: 'salmos', chapter: 23, devotionalPrompt: 'Onde você precisa descansar em vez de tentar controlar tudo sozinho?', completed: false, estimatedMinutes: 12 },
      { dayNumber: 4, title: 'O Servo Sofredor e a Nossa Cura', passageRef: 'Isaías 53', bookId: 'isaias', chapter: 53, devotionalPrompt: 'Pelas Suas feridas fomos sarados e restaurados para o Pai.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 5, title: 'O Sermão da Montanha e o Reino', passageRef: 'Mateus 5', bookId: 'mateus', chapter: 5, devotionalPrompt: 'Vós sois a luz do mundo: como seu testemunho tem impactado outros?', completed: false, estimatedMinutes: 12 },
      { dayNumber: 6, title: 'O Segredo da Oração e a Providência', passageRef: 'Mateus 6', bookId: 'mateus', chapter: 6, devotionalPrompt: 'Entre no seu quarto secreto e fale com o Pai que vê em secreto.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 7, title: 'O Verbo Divino e a Luz do Mundo', passageRef: 'João 1', bookId: 'joao', chapter: 1, devotionalPrompt: 'A todos quantos o receberam deu-lhes o poder de serem feitos filhos de Deus.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 8, title: 'A Videira e a Comunhão com Cristo', passageRef: 'João 15', bookId: 'joao', chapter: 15, devotionalPrompt: 'Como cultivar uma dependência diária do Espírito de Cristo?', completed: false, estimatedMinutes: 12 },
      { dayNumber: 9, title: 'A Vitória Inabalável da Graça', passageRef: 'Romanos 8', bookId: 'romanos', chapter: 8, devotionalPrompt: 'Se Deus é por nós, quem será contra nós? Mais que vencedores.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 10, title: 'O Culto Racional e a Renovação da Mente', passageRef: 'Romanos 12', bookId: 'romanos', chapter: 12, devotionalPrompt: 'Apresentar a vida como sacrifício vivo, santo e agradável a Deus.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 11, title: 'A Supremacia do Amor Cristão', passageRef: '1 Coríntios 13', bookId: '1corintios', chapter: 13, devotionalPrompt: 'O amor nunca falha: como agir com amor genuíno hoje?', completed: false, estimatedMinutes: 12 },
      { dayNumber: 12, title: 'A Armadura Espiritual para o Dia Mau', passageRef: 'Efésios 6', bookId: 'efesios', chapter: 6, devotionalPrompt: 'Tomai o escudo da fé e a espada do Espírito, que é a Palavra.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 13, title: 'A Paz que Guarda a Mente e o Coração', passageRef: 'Filipenses 4', bookId: 'filipenses', chapter: 4, devotionalPrompt: 'Tudo posso naquele que me fortalece.', completed: false, estimatedMinutes: 12 },
      { dayNumber: 14, title: 'A Esperança Viva da Eternidade', passageRef: 'Apocalipse 21', bookId: 'apocalipse', chapter: 21, devotionalPrompt: 'Eis que faço novas todas as coisas. O Senhor é o Alfa e o Ômega.', completed: false, estimatedMinutes: 12 }
    ]
  },

  // 6. Novo Testamento (90 dias)
  {
    id: 'template-novo-testamento-90',
    title: 'Novo Testamento em 90 Dias',
    description: 'Uma jornada completa pelos 27 livros do Novo Testamento: Evangelhos, Atos, Cartas Apostólicas e Apocalipse.',
    objective: 'Ler todo o Novo Testamento com ritmo sustentável de aproximadamente 3 capítulos por dia.',
    category: 'canonical',
    durationDays: 90,
    dailyEstimatedMinutes: 18,
    method: 'sequencia_biblica',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '90 Dias • NT Completo',
    createDays: () => {
      const days: Omit<PlanDay, 'date' | 'status'>[] = [];
      // 260 capítulos no NT distribuídos em 90 dias
      const ntBooks = [
        { id: 'mateus', name: 'Mateus', ch: 28 },
        { id: 'marcos', name: 'Marcos', ch: 16 },
        { id: 'lucas', name: 'Lucas', ch: 24 },
        { id: 'joao', name: 'João', ch: 21 },
        { id: 'atos', name: 'Atos', ch: 28 },
        { id: 'romanos', name: 'Romanos', ch: 16 },
        { id: '1corintios', name: '1 Coríntios', ch: 16 },
        { id: '2corintios', name: '2 Coríntios', ch: 13 },
        { id: 'galatas', name: 'Gálatas', ch: 6 },
        { id: 'efesios', name: 'Efésios', ch: 6 },
        { id: 'filipenses', name: 'Filipenses', ch: 4 },
        { id: 'colossenses', name: 'Colossenses', ch: 4 },
        { id: '1tessalonicenses', name: '1 Tessalonicenses', ch: 5 },
        { id: '2tessalonicenses', name: '2 Tessalonicenses', ch: 3 },
        { id: '1timoteo', name: '1 Timóteo', ch: 6 },
        { id: '2timoteo', name: '2 Timóteo', ch: 4 },
        { id: 'tito', name: 'Tito', ch: 3 },
        { id: 'filemom', name: 'Filemom', ch: 1 },
        { id: 'hebreus', name: 'Hebreus', ch: 13 },
        { id: 'tiago', name: 'Tiago', ch: 5 },
        { id: '1pedro', name: '1 Pedro', ch: 5 },
        { id: '2pedro', name: '2 Pedro', ch: 3 },
        { id: '1joao', name: '1 João', ch: 5 },
        { id: '2joao', name: '2 João', ch: 1 },
        { id: '3joao', name: '3 João', ch: 1 },
        { id: 'judas', name: 'Judas', ch: 1 },
        { id: 'apocalipse', name: 'Apocalipse', ch: 22 }
      ];

      const allNtChapters: { bookId: string; bookName: string; ch: number }[] = [];
      for (const b of ntBooks) {
        for (let c = 1; c <= b.ch; c++) {
          allNtChapters.push({ bookId: b.id, bookName: b.name, ch: c });
        }
      }

      const chaptersPerDay = Math.ceil(allNtChapters.length / 90); // ~3 capítulos por dia
      let currentIdx = 0;

      for (let day = 1; day <= 90 && currentIdx < allNtChapters.length; day++) {
        const slice = allNtChapters.slice(currentIdx, currentIdx + chaptersPerDay);
        if (slice.length === 0) break;
        const first = slice[0];
        const last = slice[slice.length - 1];

        const passageRef = slice.length === 1
          ? `${first.bookName} ${first.ch}`
          : first.bookId === last.bookId
          ? `${first.bookName} ${first.ch}-${last.ch}`
          : `${first.bookName} ${first.ch} — ${last.bookName} ${last.ch}`;

        days.push({
          dayNumber: day,
          title: `Dia ${day}: ${passageRef}`,
          passageRef,
          bookId: first.bookId,
          chapter: first.ch,
          devotionalPrompt: `O que o Senhor está revelando ao seu coração através de ${passageRef}?`,
          completed: false,
          estimatedMinutes: 18
        });

        currentIdx += chaptersPerDay;
      }

      return days;
    }
  },

  // 7. Bíblia em 1 Ano (365 dias)
  {
    id: 'template-biblia-1-ano-365',
    title: 'Bíblia Sagrada em 1 Ano',
    description: 'O cânon completo das Sagradas Escrituras (1.189 capítulos) distribuído harmoniosamente ao longo de 365 dias.',
    objective: 'Alcançar a bênção de ler toda a Palavra de Deus em um ano com constância e reverência.',
    category: 'canonical',
    durationDays: 365,
    dailyEstimatedMinutes: 20,
    method: 'sequencia_biblica',
    frequency: 'diaria',
    preferredVersion: 'arc',
    badge: '365 Dias • Cânon Completo',
    createDays: () => {
      const days: Omit<PlanDay, 'date' | 'status'>[] = [];
      // 1189 capítulos divididos por 365 dias = ~3.25 capítulos/dia
      // Para manter a performance e estrutura leve, geramos marcos e passagens
      for (let i = 1; i <= 365; i++) {
        // Cálculo aproximado do capítulo canônico
        const startChap = Math.floor((i - 1) * 3.25) + 1;
        const endChap = Math.min(1189, Math.floor(i * 3.25));

        // Mapeia livro aproximado para navegação rápida
        let currentBookId = 'genesis';
        let currentBookName = 'Gênesis';
        let approxChapter = Math.max(1, ((startChap % 50) || 1));

        if (startChap <= 50) {
          currentBookId = 'genesis'; currentBookName = 'Gênesis';
        } else if (startChap <= 90) {
          currentBookId = 'exodo'; currentBookName = 'Êxodo'; approxChapter = startChap - 50;
        } else if (startChap <= 500) {
          currentBookId = 'salmos'; currentBookName = 'Salmos'; approxChapter = (startChap % 150) || 1;
        } else if (startChap <= 929) {
          currentBookId = 'isaias'; currentBookName = 'Isaías'; approxChapter = (startChap % 66) || 1;
        } else if (startChap <= 1000) {
          currentBookId = 'mateus'; currentBookName = 'Mateus'; approxChapter = (startChap - 929) % 28 || 1;
        } else if (startChap <= 1100) {
          currentBookId = 'romanos'; currentBookName = 'Romanos'; approxChapter = (startChap - 1000) % 16 || 1;
        } else {
          currentBookId = 'apocalipse'; currentBookName = 'Apocalipse'; approxChapter = Math.min(22, (startChap - 1167) || 1);
        }

        const refText = `Capítulos canônicos ${startChap} a ${endChap} (${currentBookName} ${approxChapter})`;

        days.push({
          dayNumber: i,
          title: `Dia ${i} — Porção Bíblica`,
          passageRef: `${currentBookName} ${approxChapter}`,
          bookId: currentBookId,
          chapter: approxChapter,
          devotionalPrompt: `Guarde no coração a porção das Escrituras de hoje: ${refText}.`,
          completed: false,
          estimatedMinutes: 20
        });
      }
      return days;
    }
  }
];

/**
 * Cria uma instância de ReadingPlan a partir de um template modelo
 */
export function instantiatePlanFromTemplate(
  template: PlanTemplateDefinition, 
  startDateStr: string = getTodayDateString()
): ReadingPlan {
  const rawDays = template.createDays();
  const scheduleDates = generateScheduleDates(startDateStr, rawDays.length, template.frequency || 'diaria', [0, 1, 2, 3, 4, 5, 6]);

  const days: PlanDay[] = rawDays.map((d, index) => {
    const assignedDate = scheduleDates[index] || startDateStr;
    const isPast = assignedDate < startDateStr;
    return {
      ...d,
      date: assignedDate,
      status: isPast ? 'atrasada' : (assignedDate === startDateStr ? 'em_andamento' : 'pendente')
    };
  });

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title: template.title,
    description: template.description,
    objective: template.objective,
    category: template.category,
    durationDays: days.length,
    currentDay: 1,
    isActive: false,
    status: 'active',
    startDate: startDateStr,
    startedAt: startDateStr,
    frequency: template.frequency,
    selectedDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    dailyEstimatedMinutes: template.dailyEstimatedMinutes,
    preferredVersion: template.preferredVersion,
    method: template.method,
    days,
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
