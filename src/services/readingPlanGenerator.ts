import { ReadingPlan, PlanDay, PlanMethod, PlanFrequency, PlanStatus } from '../types';
import { BIBLE_CANON, findCanonBook, CanonBook } from '../data/bibleCanon';

export interface PlanGenerationInput {
  title: string;
  description: string;
  objective?: string;
  startDate: string; // YYYY-MM-DD
  durationDays: number;
  frequency: PlanFrequency;
  selectedDaysOfWeek: number[]; // 0=Dom, 1=Seg, ... 6=Sab
  dailyEstimatedMinutes: number;
  preferredVersion: string;
  method: PlanMethod;
  selectedBooks?: string[];
  selectedChaptersRange?: { bookId: string; startChapter: number; endChapter: number };
  specificPassages?: string[];
  selectedTheme?: string;
  canonicalScope?: 'all' | 'nt' | 'at' | 'gospels' | 'pentateuch';
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD local
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adiciona dias a uma string YYYY-MM-DD
 */
export function addDaysToDateString(dateStr: string, daysToAdd: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + daysToAdd);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna o dia da semana (0=Dom, 1=Seg... 6=Sab) de uma data YYYY-MM-DD
 */
export function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

/**
 * Gera uma lista de datas de leitura de acordo com a frequência configurada
 */
export function generateScheduleDates(
  startDateStr: string, 
  totalReadingDays: number, 
  frequency: PlanFrequency, 
  selectedDaysOfWeek: number[]
): string[] {
  const dates: string[] = [];
  let currentDate = startDateStr;
  let safetyCounter = 0;
  const maxIterations = totalReadingDays * 14; // Prevenção de loop infinito

  const validDays = frequency === 'dias_uteis' 
    ? [1, 2, 3, 4, 5] 
    : frequency === 'dias_especificos' && selectedDaysOfWeek.length > 0
    ? selectedDaysOfWeek
    : [0, 1, 2, 3, 4, 5, 6]; // Diária

  while (dates.length < totalReadingDays && safetyCounter < maxIterations) {
    safetyCounter++;
    const dayOfWeek = getDayOfWeek(currentDate);
    if (validDays.includes(dayOfWeek)) {
      dates.push(currentDate);
    }
    currentDate = addDaysToDateString(currentDate, 1);
  }

  return dates;
}

/**
 * Calcula o status de um dia com base na data atual e na conclusão
 */
export function evaluateDayStatus(
  day: { completed: boolean; date?: string }, 
  todayStr: string = getTodayDateString()
): 'pendente' | 'em_andamento' | 'concluida' | 'atrasada' {
  if (day.completed) return 'concluida';
  if (!day.date) return 'pendente';
  if (day.date < todayStr) return 'atrasada';
  if (day.date === todayStr) return 'em_andamento';
  return 'pendente';
}

/**
 * Temas pré-curados com passagens e prompts devocionais
 */
export const PRESET_THEMES: Record<string, {
  title: string;
  category: ReadingPlan['category'];
  description: string;
  readings: { title: string; ref: string; bookId: string; chapter: number; prompt: string }[];
}> = {
  ansiedade_paz: {
    title: 'Paz que Excede Todo Entendimento',
    category: 'peace',
    description: 'Vencendo as tempestades da ansiedade através do descanso diário nas promessas do Pai.',
    readings: [
      { title: 'O Pastor da Minha Alma', ref: 'Salmo 23', bookId: 'salmos', chapter: 23, prompt: 'O que você precisa entregar nas mãos do Bom Pastor hoje?' },
      { title: 'Descanso no Abrigo do Altíssimo', ref: 'Salmo 91', bookId: 'salmos', chapter: 91, prompt: 'Qual medo tem tentado tirar sua paz?' },
      { title: 'Não Vos Preocupeis com o Amanhã', ref: 'Mateus 6', bookId: 'mateus', chapter: 6, prompt: 'Se Deus cuida das aves e das flores, como Ele cuidará de você?' },
      { title: 'A Paz que Eu Vos Deixo', ref: 'João 14', bookId: 'joao', chapter: 14, prompt: 'Como a paz de Cristo difere da paz passageira do mundo?' },
      { title: 'O Deus que Renova as Forças', ref: 'Isaías 40', bookId: 'isaias', chapter: 40, prompt: 'Onde você se sente exausto e precisa que Deus renove seu vigor?' },
      { title: 'A Oração que Dissipa a Ansiedade', ref: 'Filipenses 4', bookId: 'filipenses', chapter: 4, prompt: 'Apresente suas súplicas com ações de graças pelo que Deus já fez.' },
      { title: 'O Socorro que Vem do Alto', ref: 'Salmo 121', bookId: 'salmos', chapter: 121, prompt: 'O Senhor guardará a sua saída e a sua chegada para todo o sempre.' }
    ]
  },
  fundamentos_fe: {
    title: 'Fundamentos Inabaláveis da Fé',
    category: 'foundations',
    description: 'Um retorno às verdades essenciais da salvação, graça, justificação e nova vida em Cristo.',
    readings: [
      { title: 'O Criador Soberano', ref: 'Gênesis 1', bookId: 'genesis', chapter: 1, prompt: 'Reconhecendo a grandeza de Deus em toda a criação.' },
      { title: 'A Chamada da Aliança', ref: 'Josué 1', bookId: 'josue', chapter: 1, prompt: 'Como manter a coragem e a firmeza na Palavra de Deus?' },
      { title: 'O Verbo Feito Carne', ref: 'João 1', bookId: 'joao', chapter: 1, prompt: 'A luz que resplandece nas trevas e nos concede a filiação divina.' },
      { title: 'O Sermão do Monte e o Reino', ref: 'Mateus 5', bookId: 'mateus', chapter: 5, prompt: 'Como viver como sal e luz na prática diária?' },
      { title: 'Nenhuma Condenação em Cristo', ref: 'Romanos 8', bookId: 'romanos', chapter: 8, prompt: 'Quem poderá nos separar do amor soberano de Deus?' },
      { title: 'O Maior dos Dons: O Amor', ref: '1 Coríntios 13', bookId: '1corintios', chapter: 13, prompt: 'Como demonstrar paciência e bondade hoje com quem é difícil?' },
      { title: 'A Armadura Espiritual do Cristão', ref: 'Efésios 6', bookId: 'efesios', chapter: 6, prompt: 'Qual peça da armadura de Deus você precisa vestir com mais atenção?' },
      { title: 'A Fé Viva que Transforma Atitudes', ref: 'Tiago 1', bookId: 'tiago', chapter: 1, prompt: 'Ser praticante da Palavra e não apenas ouvinte.' },
      { title: 'A Nuvem de Testemunhas da Fé', ref: 'Hebreus 11', bookId: 'hebreus', chapter: 11, prompt: 'Confiar naquilo que ainda não vemos, com perseverança inabalável.' },
      { title: 'A Nova Jerusalém e a Esperança Eterna', ref: 'Apocalipse 21', bookId: 'apocalipse', chapter: 21, prompt: 'Deus enxugará toda lágrima: o futuro está seguro no Senhor.' }
    ]
  },
  sabedoria_diaria: {
    title: 'Sabedoria e Discernimento Prático',
    category: 'wisdom',
    description: 'Conselhos divinos para integridade no trabalho, relacionamentos e saúde emocional.',
    readings: [
      { title: 'O Princípio da Verdadeira Sabedoria', ref: 'Provérbios 3', bookId: 'proverbios', chapter: 3, prompt: 'Em qual área você tem confiado no próprio entendimento em vez de orar?' },
      { title: 'Guarda o Teu Coração Acima de Tudo', ref: 'Provérbios 4', bookId: 'proverbios', chapter: 4, prompt: 'O que tem entrado pelos seus olhos e ouvidos no dia a dia?' },
      { title: 'A Árvore Plantada Junto às Águas', ref: 'Salmo 1', bookId: 'salmos', chapter: 1, prompt: 'Quais conselhos você tem ouvido? Onde está o seu deleite?' },
      { title: 'Pedindo Sabedoria com Fé Pura', ref: 'Tiago 1', bookId: 'tiago', chapter: 1, prompt: 'Peça discernimento para as decisões desta semana.' },
      { title: 'A Renovação da Mente Diante de Deus', ref: 'Romanos 12', bookId: 'romanos', chapter: 8, prompt: 'Não se amolde aos padrões deste século; renove seus pensamentos.' }
    ]
  }
};

/**
 * Construtor Principal: Gera o plano completo e suas atividades diárias
 */
export function generateReadingPlan(input: PlanGenerationInput): ReadingPlan {
  const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const days: PlanDay[] = [];
  const todayStr = getTodayDateString();

  // 1. Gera as leituras de acordo com o método
  if (input.method === 'sequencia_biblica') {
    let booksToInclude: CanonBook[] = [];
    if (input.canonicalScope === 'nt') {
      booksToInclude = BIBLE_CANON.filter(b => b.testament === 'NT');
    } else if (input.canonicalScope === 'at') {
      booksToInclude = BIBLE_CANON.filter(b => b.testament === 'AT');
    } else if (input.canonicalScope === 'gospels') {
      booksToInclude = BIBLE_CANON.filter(b => b.category === 'Evangelhos');
    } else if (input.canonicalScope === 'pentateuch') {
      booksToInclude = BIBLE_CANON.filter(b => b.category === 'Pentateuco');
    } else {
      // Toda a Bíblia
      booksToInclude = BIBLE_CANON;
    }

    // Cria lista sequencial de todos os capítulos
    const allChapters: { book: CanonBook; chapter: number }[] = [];
    for (const b of booksToInclude) {
      for (let c = 1; c <= b.chaptersCount; c++) {
        allChapters.push({ book: b, chapter: c });
      }
    }

    const duration = Math.max(1, input.durationDays || allChapters.length);
    const chaptersPerDay = Math.max(1, Math.ceil(allChapters.length / duration));

    let currentChapterIndex = 0;
    for (let dayNum = 1; dayNum <= duration && currentChapterIndex < allChapters.length; dayNum++) {
      const slice = allChapters.slice(currentChapterIndex, currentChapterIndex + chaptersPerDay);
      if (slice.length === 0) break;

      const first = slice[0];
      const last = slice[slice.length - 1];
      const passageRef = slice.length === 1
        ? `${first.book.name} ${first.chapter}`
        : first.book.id === last.book.id
        ? `${first.book.name} ${first.chapter} - ${last.chapter}`
        : `${first.book.name} ${first.chapter} — ${last.book.name} ${last.chapter}`;

      days.push({
        dayNumber: dayNum,
        title: `Leitura do Dia: ${passageRef}`,
        passageRef,
        bookId: first.book.id,
        chapter: first.chapter,
        devotionalPrompt: `Medite nos ensinos de ${passageRef} e reflita em como aplicar essa verdade no seu dia.`,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });

      currentChapterIndex += chaptersPerDay;
    }

  } else if (input.method === 'livros_especificos') {
    const selectedBookIds = input.selectedBooks || ['mateus'];
    const chosenBooks = selectedBookIds
      .map(id => findCanonBook(id))
      .filter((b): b is CanonBook => !!b);

    const allChapters: { book: CanonBook; chapter: number }[] = [];
    for (const b of chosenBooks) {
      for (let c = 1; c <= b.chaptersCount; c++) {
        allChapters.push({ book: b, chapter: c });
      }
    }

    const duration = input.durationDays > 0 ? input.durationDays : allChapters.length;
    const chaptersPerDay = Math.max(1, Math.ceil(allChapters.length / duration));

    let currentChapterIndex = 0;
    for (let dayNum = 1; dayNum <= duration && currentChapterIndex < allChapters.length; dayNum++) {
      const slice = allChapters.slice(currentChapterIndex, currentChapterIndex + chaptersPerDay);
      if (slice.length === 0) break;
      const first = slice[0];
      const last = slice[slice.length - 1];
      const passageRef = slice.length === 1
        ? `${first.book.name} ${first.chapter}`
        : first.book.id === last.book.id
        ? `${first.book.name} ${first.chapter} - ${last.chapter}`
        : `${first.book.name} ${first.chapter} — ${last.book.name} ${last.chapter}`;

      days.push({
        dayNumber: dayNum,
        title: `${first.book.name} ${first.chapter}`,
        passageRef,
        bookId: first.book.id,
        chapter: first.chapter,
        devotionalPrompt: `O que Deus revela sobre Seu caráter através de ${passageRef}?`,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });

      currentChapterIndex += chaptersPerDay;
    }

  } else if (input.method === 'capitulos_especificos') {
    const range = input.selectedChaptersRange || { bookId: 'proverbios', startChapter: 1, endChapter: 31 };
    const book = findCanonBook(range.bookId) || BIBLE_CANON.find(b => b.id === 'proverbios')!;
    const start = Math.max(1, range.startChapter);
    const end = Math.min(book.chaptersCount, Math.max(start, range.endChapter));

    let dayNum = 1;
    for (let ch = start; ch <= end; ch++) {
      const ref = `${book.name} ${ch}`;
      days.push({
        dayNumber: dayNum++,
        title: `${book.name} ${ch}`,
        passageRef: ref,
        bookId: book.id,
        chapter: ch,
        devotionalPrompt: `Guarde no coração um princípio prático de ${ref} para praticar hoje.`,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });
    }

  } else if (input.method === 'passagens_especificas') {
    const passages = input.specificPassages && input.specificPassages.length > 0 
      ? input.specificPassages 
      : ['Salmo 23', 'Mateus 6', 'Romanos 8', 'Filipenses 4', 'Tiago 1'];

    passages.forEach((p, idx) => {
      // Tenta inferir livro e capítulo
      const parts = p.trim().split(' ');
      const chNumber = parseInt(parts[parts.length - 1], 10) || 1;
      const bookName = parts.slice(0, parts.length - 1).join(' ') || p;
      const foundBook = findCanonBook(bookName) || findCanonBook(p) || BIBLE_CANON[0];

      days.push({
        dayNumber: idx + 1,
        title: p,
        passageRef: p,
        bookId: foundBook.id,
        chapter: chNumber,
        devotionalPrompt: `O que a passagem de ${p} ensina a respeito do amor e cuidado de Deus?`,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });
    });

  } else if (input.method === 'temas') {
    const themeKey = input.selectedTheme && PRESET_THEMES[input.selectedTheme] 
      ? input.selectedTheme 
      : 'ansiedade_paz';
    const themeData = PRESET_THEMES[themeKey];

    themeData.readings.forEach((r, idx) => {
      days.push({
        dayNumber: idx + 1,
        title: r.title,
        passageRef: r.ref,
        bookId: r.bookId,
        chapter: r.chapter,
        devotionalPrompt: r.prompt,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });
    });

  } else {
    // Personalizado
    const duration = Math.max(1, input.durationDays || 7);
    for (let i = 1; i <= duration; i++) {
      days.push({
        dayNumber: i,
        title: `Dia ${i} — Leitura Pessoal`,
        passageRef: `Mateus ${i}`,
        bookId: 'mateus',
        chapter: i,
        devotionalPrompt: `Anote suas reflexões, orações e o que o Espírito Santo ministrou ao seu coração hoje.`,
        completed: false,
        estimatedMinutes: input.dailyEstimatedMinutes
      });
    }
  }

  // 2. Gera o calendário de datas reais de acordo com a frequência e dias da semana
  const dates = generateScheduleDates(
    input.startDate, 
    days.length, 
    input.frequency, 
    input.selectedDaysOfWeek
  );

  // 3. Aplica as datas e calcula o status inicial de cada dia
  days.forEach((day, index) => {
    day.date = dates[index] || addDaysToDateString(input.startDate, index);
    day.status = evaluateDayStatus(day, todayStr);
  });

  return {
    id: planId,
    title: input.title,
    description: input.description,
    objective: input.objective,
    category: input.method === 'temas' && input.selectedTheme && PRESET_THEMES[input.selectedTheme]
      ? PRESET_THEMES[input.selectedTheme].category
      : 'custom',
    durationDays: days.length,
    currentDay: 1,
    isActive: false,
    status: 'active',
    startDate: input.startDate,
    startedAt: input.startDate,
    frequency: input.frequency,
    selectedDaysOfWeek: input.selectedDaysOfWeek,
    dailyEstimatedMinutes: input.dailyEstimatedMinutes,
    preferredVersion: input.preferredVersion,
    method: input.method,
    selectedBooks: input.selectedBooks,
    selectedChaptersRange: input.selectedChaptersRange,
    specificPassages: input.specificPassages,
    selectedTheme: input.selectedTheme,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Recalcula o status de todos os dias de um plano (identificando dias atrasados)
 */
export function refreshPlanDaysStatus(plan: ReadingPlan): ReadingPlan {
  const todayStr = getTodayDateString();
  const updatedDays = plan.days.map(day => ({
    ...day,
    status: evaluateDayStatus(day, todayStr)
  }));

  const completedCount = updatedDays.filter(d => d.completed).length;
  const nextCurrentDay = Math.min(completedCount + 1, updatedDays.length || 1);

  return {
    ...plan,
    days: updatedDays,
    currentDay: nextCurrentDay
  };
}

/**
 * ATRASOS: "Continuar de onde parou"
 * Move o próximo dia não concluído para HOJE e desloca os dias subsequentes
 * mantendo dias concluídos com suas datas originais intactas.
 */
export function continueFromWhereYouLeftOff(plan: ReadingPlan): ReadingPlan {
  const todayStr = getTodayDateString();
  const uncompletedDays = plan.days.filter(d => !d.completed);
  
  if (uncompletedDays.length === 0) return plan;

  const validDays = plan.frequency === 'dias_uteis' 
    ? [1, 2, 3, 4, 5] 
    : plan.frequency === 'dias_especificos' && plan.selectedDaysOfWeek && plan.selectedDaysOfWeek.length > 0
    ? plan.selectedDaysOfWeek
    : [0, 1, 2, 3, 4, 5, 6];

  const newDates = generateScheduleDates(todayStr, uncompletedDays.length, plan.frequency || 'diaria', validDays);

  let uncompletedIndex = 0;
  const updatedDays = plan.days.map(day => {
    if (day.completed) {
      return day;
    }
    const newDate = newDates[uncompletedIndex++] || todayStr;
    return {
      ...day,
      date: newDate,
      status: evaluateDayStatus({ ...day, date: newDate }, todayStr)
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString()
  };
}

/**
 * ATRASOS: "Reorganizar plano"
 * Redistribui todas as leituras restantes de forma suave a partir de hoje
 * ou de uma nova data inicial, recalculando a frequência e retirando status 'atrasada'.
 */
export function reorganizeRemainingPlan(
  plan: ReadingPlan, 
  newStartDate: string = getTodayDateString(),
  updatedFrequency?: PlanFrequency,
  updatedDaysOfWeek?: number[]
): ReadingPlan {
  const freq = updatedFrequency || plan.frequency || 'diaria';
  const daysOfWeek = updatedDaysOfWeek || plan.selectedDaysOfWeek || [0, 1, 2, 3, 4, 5, 6];
  
  const uncompletedDays = plan.days.filter(d => !d.completed);
  if (uncompletedDays.length === 0) return plan;

  const newDates = generateScheduleDates(newStartDate, uncompletedDays.length, freq, daysOfWeek);

  let uncompletedIdx = 0;
  const updatedDays = plan.days.map(day => {
    if (day.completed) return day;
    const assignedDate = newDates[uncompletedIdx++];
    return {
      ...day,
      date: assignedDate,
      status: evaluateDayStatus({ ...day, date: assignedDate }, getTodayDateString())
    };
  });

  return {
    ...plan,
    frequency: freq,
    selectedDaysOfWeek: daysOfWeek,
    days: updatedDays,
    updatedAt: new Date().toISOString()
  };
}
