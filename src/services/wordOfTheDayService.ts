import { 
  WordOfTheDay, 
  WordOfTheDayHistoryItem, 
  SpiritualProfile, 
  SpiritualObjective, 
  ReadingPlan, 
  BibleFavorite, 
  BibleReadingSession, 
  RoutineActivity 
} from '../types';
import { CURATED_WORDS_OF_THE_DAY, CuratedWordEntry } from '../data/wordOfTheDayData';

const STORAGE_KEYS = {
  CURRENT_WORD: 'faithion_word_of_day_current_v2',
  HISTORY: 'faithion_word_of_day_history_v2',
  CACHE_DATE: 'faithion_word_of_day_date_v2'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`[WordOfTheDayService] Failed to load key "${key}"`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[WordOfTheDayService] Failed to save key "${key}"`, e);
  }
}

export interface PersonalizationContext {
  date?: string; // YYYY-MM-DD
  profile?: SpiritualProfile;
  objectives?: SpiritualObjective[];
  activePlans?: ReadingPlan[];
  favorites?: BibleFavorite[];
  recentReadings?: BibleReadingSession[];
  routineActivities?: RoutineActivity[];
  forceNew?: boolean;
}

export class WordOfTheDayService {
  /**
   * Obtém ou seleciona de forma inteligente a Palavra do Dia personalizada.
   * Não é um versículo aleatório: considera objetivos, planos, interesses e histórico.
   */
  static getWordOfTheDay(context: PersonalizationContext = {}): WordOfTheDay {
    const today = context.date || new Date().toISOString().split('T')[0];
    const cachedDate = safeGet<string | null>(STORAGE_KEYS.CACHE_DATE, null);
    const cachedWord = safeGet<WordOfTheDay | null>(STORAGE_KEYS.CURRENT_WORD, null);

    // Se já tivermos uma palavra calculada para hoje e não for forçado recálculo, retorna o cache
    if (!context.forceNew && cachedDate === today && cachedWord && cachedWord.date === today) {
      this.ensureHistoryEntry(cachedWord);
      return cachedWord;
    }

    // Caso contrário, executa o motor de personalização ponderada
    const selected = this.calculatePersonalizedWord(today, context);
    
    // Salva no cache do dia
    safeSet(STORAGE_KEYS.CACHE_DATE, today);
    safeSet(STORAGE_KEYS.CURRENT_WORD, selected);
    
    // Garante no histórico
    this.ensureHistoryEntry(selected);

    return selected;
  }

  /**
   * Motor de Seleção Ponderada & Personalização
   */
  private static calculatePersonalizedWord(date: string, context: PersonalizationContext): WordOfTheDay {
    const objectives = context.objectives || [];
    const profile = context.profile;
    const activePlans = context.activePlans || [];
    const favorites = context.favorites || [];
    const history = this.getHistory();

    // Palavras vistas nos últimos 7 dias recebem penalidade para evitar repetição excessiva
    const recentWordIds = new Set(
      history
        .filter(h => {
          const diffDays = Math.abs(new Date(date).getTime() - new Date(h.date).getTime()) / (1000 * 3600 * 24);
          return diffDays < 10;
        })
        .map(h => h.wordId)
    );

    // Extrai palavras-chave e intenções do usuário
    const activeObjectives = objectives.filter(o => o.status === 'ativo');
    const objectiveKeywords: string[] = [];
    activeObjectives.forEach(obj => {
      const text = `${obj.title} ${obj.category}`.toLowerCase();
      if (text.includes('disciplina') || text.includes('constância') || text.includes('hábito') || text.includes('rotina')) {
        objectiveKeywords.push('disciplina', 'perseverança', 'constância', 'diligência');
      }
      if (text.includes('oração') || text.includes('intercessão') || text.includes('clamor')) {
        objectiveKeywords.push('oração', 'intimidade', 'secreto', 'comunhão');
      }
      if (text.includes('paz') || text.includes('ansiedade') || text.includes('descanso')) {
        objectiveKeywords.push('paz', 'ansiedade', 'descanso', 'confiança');
      }
      if (text.includes('estudo') || text.includes('leitura') || text.includes('bíblia')) {
        objectiveKeywords.push('estudo', 'sabedoria', 'bíblia', 'discernimento');
      }
      if (text.includes('jejum') || text.includes('consagração')) {
        objectiveKeywords.push('jejum', 'consagração', 'santidade');
      }
    });

    const userTopics = (profile?.topicsOfInterest || []).map(t => t.toLowerCase());

    // Pontua cada candidato
    const scoredCandidates = CURATED_WORDS_OF_THE_DAY.map(candidate => {
      let score = 10; // pontuação base
      let matchedReason = '';

      // 1. Coincidência com Objetivos Espirituais Ativos (peso mais alto)
      for (const kw of objectiveKeywords) {
        if (candidate.tags.includes(kw)) {
          score += 35;
          const matchingObj = activeObjectives.find(o => 
            o.title.toLowerCase().includes(kw) || o.category.toLowerCase().includes(kw)
          );
          if (matchingObj) {
            matchedReason = `Baseada no seu objetivo ativo: "${matchingObj.title}" (Tema: ${candidate.theme})`;
          } else {
            matchedReason = `Sugerida para fortalecer seu objetivo de ${kw} e perseverança`;
          }
          break;
        }
      }

      // 2. Coincidência com Temas de Interesse do Perfil
      if (!matchedReason && userTopics.length > 0) {
        for (const topic of userTopics) {
          const matchingTag = candidate.tags.find(tag => topic.includes(tag) || tag.includes(topic));
          if (matchingTag) {
            score += 25;
            matchedReason = `Selecionada com base no seu interesse em "${topic}"`;
            break;
          }
        }
      }

      // 3. Coincidência com Planos Ativos
      const activePlan = activePlans.find(p => p.isActive);
      if (activePlan) {
        const planTitle = activePlan.title.toLowerCase();
        if (candidate.tags.some(t => planTitle.includes(t)) || candidate.bookId === 'salmos' && planTitle.includes('salmo')) {
          score += 20;
          if (!matchedReason) {
            matchedReason = `Em sintonia com o seu plano de leitura: "${activePlan.title}"`;
          }
        }
      }

      // 4. Coincidência com Livro de Versículos Favoritos
      if (favorites.some(f => f.bookId === candidate.bookId)) {
        score += 15;
      }

      // 5. Penalidade por repetição recente
      if (recentWordIds.has(candidate.id)) {
        score -= 40;
      }

      // Variação determinística leve por dia para rotação saudável quando múltiplos empatam
      const dateHash = (date.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0) + candidate.chapter) % 7;
      score += dateHash;

      return {
        candidate,
        score,
        reason: matchedReason || `Reflexão diária edificante sobre ${candidate.theme}`
      };
    });

    // Ordena pelo maior score
    scoredCandidates.sort((a, b) => b.score - a.score);
    const best = scoredCandidates[0] || {
      candidate: CURATED_WORDS_OF_THE_DAY[0],
      reason: 'Reflexão diária nas Sagradas Escrituras'
    };

    const chosen = best.candidate;

    // Constrói objeto completo respeitando a distinção estrita solicitada:
    // Texto bíblico autêntico -> Interpretação/Reflexão humana -> Sugestão prática
    const word: WordOfTheDay = {
      id: `${chosen.id}-${date}`,
      date,
      reference: chosen.reference,
      passage: chosen.passage,
      version: profile?.preferredBibleVersion || chosen.version,
      theme: chosen.theme,
      context: chosen.context,
      reflection: chosen.reflection,
      questions: chosen.questions,
      practicalApplication: chosen.practicalApplication,
      optionalPrayer: chosen.optionalPrayer,
      contentSource: {
        bibleSource: chosen.bibleSource,
        commentarySource: 'Exposição devocional FAITHION (interpretação temática humanamente elaborada)',
        isAiAssisted: false
      },
      matchingCriteria: {
        reason: best.reason,
        matchedTheme: chosen.theme
      },
      bookId: chosen.bookId,
      chapter: chosen.chapter,
      // Retrocompatibilidade com o modelo simples
      text: chosen.passage,
      whyMeditate: chosen.context
    };

    return word;
  }

  /**
   * Registra a palavra no histórico se ainda não existir para esta data.
   */
  private static ensureHistoryEntry(word: WordOfTheDay): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(h => h.date === word.date || h.wordId === word.id);

    if (existingIndex === -1) {
      const newEntry: WordOfTheDayHistoryItem = {
        id: `wotd-hist-${word.date}-${Date.now()}`,
        date: word.date,
        wordId: word.id,
        word,
        isFavorite: false,
        hasRead: true,
        hasPrayed: false,
        hasShared: false,
        hasFasted: false,
        viewedAt: new Date().toISOString()
      };
      safeSet(STORAGE_KEYS.HISTORY, [newEntry, ...history]);
    }
  }

  /**
   * Retorna todo o histórico de Palavras do Dia apresentadas
   */
  static getHistory(): WordOfTheDayHistoryItem[] {
    const raw = safeGet<WordOfTheDayHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
    return raw.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Alterna estado de favorita no histórico
   */
  static toggleFavorite(wordId: string): WordOfTheDayHistoryItem[] {
    const history = this.getHistory();
    const updated = history.map(item => {
      if (item.wordId === wordId || item.id === wordId || item.word.id === wordId) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    safeSet(STORAGE_KEYS.HISTORY, updated);
    return updated;
  }

  /**
   * Registra uma interação do usuário com a Palavra do Dia (oração, leitura, jejum, compartilhamento)
   */
  static recordInteraction(wordId: string, type: 'read' | 'prayed' | 'fasted' | 'shared'): void {
    const history = this.getHistory();
    const now = new Date().toISOString();
    const updated = history.map(item => {
      if (item.wordId === wordId || item.id === wordId || item.word.id === wordId) {
        return {
          ...item,
          hasRead: type === 'read' ? true : item.hasRead,
          hasPrayed: type === 'prayed' ? true : item.hasPrayed,
          hasFasted: type === 'fasted' ? true : item.hasFasted,
          hasShared: type === 'shared' ? true : item.hasShared,
          interactedAt: now
        };
      }
      return item;
    });
    safeSet(STORAGE_KEYS.HISTORY, updated);
  }

  /**
   * Salva uma reflexão pessoal associada à Palavra do Dia
   */
  static saveUserReflection(wordId: string, reflectionText: string, reflectionId?: string): void {
    const history = this.getHistory();
    const now = new Date().toISOString();
    const updated = history.map(item => {
      if (item.wordId === wordId || item.id === wordId || item.word.id === wordId) {
        return {
          ...item,
          userReflection: reflectionText,
          userReflectionId: reflectionId || item.userReflectionId,
          interactedAt: now
        };
      }
      return item;
    });
    safeSet(STORAGE_KEYS.HISTORY, updated);
  }

  /**
   * Define manualmente uma Palavra do Dia (por exemplo, a partir da Bíblia)
   */
  static setCustomWordOfTheDay(word: WordOfTheDay): void {
    safeSet(STORAGE_KEYS.CACHE_DATE, word.date);
    safeSet(STORAGE_KEYS.CURRENT_WORD, word);
    this.ensureHistoryEntry(word);
  }
}
