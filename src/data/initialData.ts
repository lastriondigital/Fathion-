import { 
  SpiritualProfile, 
  DailyTask, 
  PrayerRequest, 
  PrayerPlan,
  FastingPlan, 
  ReadingPlan, 
  Reflection, 
  DailyConsistency,
  SpiritualGoal,
  SpiritualObjective,
  RoutineActivity,
  ActivityExecutionLog,
  RoutineAdaptationSuggestion,
  PracticeRecord
} from '../types';

export const INITIAL_SPIRITUAL_PROFILE: SpiritualProfile = {
  name: 'Mateus Ribeiro',
  spiritualFocus: 'Intimidade com Deus e Firmeza Diária',
  lifeSeason: 'Discernimento nas decisões e fortalecimento da fé',
  dailyPrayerGoalMinutes: 20,
  dailyBibleChaptersGoal: 1,
  weeklyFastingGoalDays: 1,
  remindersEnabled: true,
  preferredBibleVersion: 'NVI',
  wakeUpTime: '06:30',
  bedTime: '23:00',
  availableTimeSlots: [
    'Manhã cedo (06:00 - 07:30)',
    'Almoço (12:00 - 13:00)',
    'Noite (21:30 - 22:30)'
  ],
  availableDays: [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo'
  ],
  preferredPracticeDurationMinutes: 15,
  bibleExperienceLevel: 'intermediario',
  readingFrequency: 'diaria',
  prayerFrequency: 'uma_dia',
  topicsOfInterest: [
    'Paz e Ansiedade',
    'Sabedoria e Decisões',
    'Graça e Identidade',
    'Evangelhos e Vida de Jesus',
    'Oração e Jejum'
  ],
  readingPreference: 'capitulo_a_capitulo',
  prayerPreference: 'caderno_guiado',
  routinePreference: 'manha_focada',
};

export const INITIAL_OBJECTIVES: SpiritualObjective[] = [
  {
    id: 'obj-1',
    title: 'Cultivar Paz Interior e Reduzir Ansiedade',
    category: 'peace',
    priority: 'alta',
    deadline: '2026-12-31',
    frequency: 'diaria',
    status: 'ativo',
    currentProgress: 65,
    targetDescription: 'Prática diária de silêncio e entrega das preocupações',
    why: 'Substituir a agitação mental pela paz que excede todo o entendimento (Filipenses 4:6-7).',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'obj-2',
    title: 'Estudar a Carta aos Romanos',
    category: 'study',
    priority: 'alta',
    deadline: '2026-10-15',
    frequency: 'diaria',
    status: 'ativo',
    currentProgress: 50,
    targetDescription: 'Ler e meditar nos 16 capítulos com notas de estudo',
    why: 'Fundamentar o coração na doutrina da Graça, justificação e santificação pelo Espírito.',
    createdAt: '2026-09-05T08:30:00Z'
  },
  {
    id: 'obj-3',
    title: 'Melhorar a Consistência de Oração',
    category: 'prayer',
    priority: 'alta',
    deadline: '2026-11-30',
    frequency: 'diaria',
    status: 'ativo',
    currentProgress: 80,
    targetDescription: '20 minutos diários de conversa sincera e escuta de Deus',
    why: 'Não apenas pedir bênçãos, mas desfrutar da amizade e da presença viva do Pai.',
    createdAt: '2026-09-02T14:00:00Z'
  },
  {
    id: 'obj-4',
    title: 'Memorizar Versículos Essenciais de Segurança',
    category: 'memorization',
    priority: 'media',
    deadline: '2026-10-31',
    frequency: 'semanal',
    status: 'ativo',
    currentProgress: 40,
    targetDescription: 'Memorizar 1 versículo por semana sobre confiança',
    why: 'Ter a Palavra guardada no coração nos momentos de tentação e desânimo.',
    createdAt: '2026-09-10T18:00:00Z'
  },
  {
    id: 'obj-5',
    title: 'Jejum com Propósito de Discernimento',
    category: 'fasting',
    priority: 'media',
    frequency: 'semanal',
    status: 'ativo',
    currentProgress: 75,
    targetDescription: '1 período semanal consagrado para clareza em decisões',
    why: 'Silenciar a carne para ouvir com maior sensibilidade a direção de Deus.',
    createdAt: '2026-09-08T09:15:00Z'
  }
];

export const INITIAL_ROUTINE_ACTIVITIES: RoutineActivity[] = [
  // Manhã
  {
    id: 'act-m1',
    name: 'Oração de Entrega e Consagração',
    type: 'prayer',
    block: 'morning',
    suggestedTime: '06:30',
    estimatedMinutes: 15,
    priority: 'alta',
    why: 'Consagrar o dia ao Senhor antes que o ruído das demandas e notificações comece.',
    isActive: true,
    order: 1,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  },
  {
    id: 'act-m2',
    name: 'Leitura Bíblica Meditativa',
    type: 'reading',
    block: 'morning',
    suggestedTime: '06:50',
    estimatedMinutes: 15,
    priority: 'alta',
    why: 'Alimentar o espírito com a verdade eterna e direcionar a mente para a vontade de Deus.',
    isActive: true,
    order: 2,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    passageRef: 'Romanos 8'
  },
  // Dia
  {
    id: 'act-d1',
    name: 'Pausa do Meio-Dia & Salmo de Confiança',
    type: 'reflection',
    block: 'day',
    suggestedTime: '12:30',
    estimatedMinutes: 10,
    priority: 'media',
    why: 'Quebrar o ritmo acelerado de trabalho para reencontrar a serenidade e orar pela família.',
    isActive: true,
    order: 1,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
  },
  {
    id: 'act-d2',
    name: 'Momento de Gratidão Breve',
    type: 'gratitude',
    block: 'day',
    suggestedTime: '15:00',
    estimatedMinutes: 5,
    priority: 'baixa',
    why: 'Reconhecer 3 bênçãos concretas recebidas durante a tarde.',
    isActive: true,
    order: 2,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
  },
  // Noite
  {
    id: 'act-n1',
    name: 'Exame de Consciência & Perdão',
    type: 'reflection',
    block: 'night',
    suggestedTime: '21:45',
    estimatedMinutes: 10,
    priority: 'alta',
    why: 'Despejar o peso do dia, pedir perdão onde errou e liberar perdão a quem ofendeu.',
    isActive: true,
    order: 1,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  },
  {
    id: 'act-n2',
    name: 'Oração Noturna & Descanso em Deus',
    type: 'prayer',
    block: 'night',
    suggestedTime: '22:00',
    estimatedMinutes: 10,
    priority: 'alta',
    why: 'Entregar o controle das preocupações de amanhã nas mãos de Quem cuida de tudo.',
    isActive: true,
    order: 2,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  },
  // Flexível
  {
    id: 'act-f1',
    name: 'Memorização do Versículo da Semana',
    type: 'memorization',
    block: 'flexible',
    suggestedTime: 'Qualquer hora',
    estimatedMinutes: 5,
    priority: 'media',
    why: 'Repetir o versículo-chave no trânsito ou intervalos para fixar a verdade.',
    isActive: true,
    order: 1,
    applicableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  }
];

export const INITIAL_EXECUTION_LOGS: ActivityExecutionLog[] = [
  {
    id: 'log-1',
    date: '2026-09-19',
    activityId: 'act-m1',
    activityName: 'Oração de Entrega e Consagração',
    block: 'morning',
    plannedMinutes: 15,
    actualMinutes: 15,
    status: 'concluido',
    quickReflection: 'Tempo revigorante de paz ao amanhecer.',
    loggedAt: '2026-09-19T06:48:00Z'
  },
  {
    id: 'log-2',
    date: '2026-09-19',
    activityId: 'act-m2',
    activityName: 'Leitura Bíblica Meditativa',
    block: 'morning',
    plannedMinutes: 15,
    actualMinutes: 15,
    status: 'concluido',
    quickReflection: 'Romanos 8:28 trouxe muito consolo sobre decisões pendentes.',
    loggedAt: '2026-09-19T07:12:00Z'
  },
  {
    id: 'log-3',
    date: '2026-09-19',
    activityId: 'act-d1',
    activityName: 'Pausa do Meio-Dia & Salmo de Confiança',
    block: 'day',
    plannedMinutes: 10,
    actualMinutes: 5,
    status: 'parcial',
    reason: 'falta_tempo',
    reasonNotes: 'Reunião do trabalho se estendeu.',
    quickReflection: 'Mesmo rápido, ajudou a respirar em oração.',
    loggedAt: '2026-09-19T13:05:00Z'
  },
  {
    id: 'log-4',
    date: '2026-09-19',
    activityId: 'act-n2',
    activityName: 'Oração Noturna & Descanso em Deus',
    block: 'night',
    plannedMinutes: 10,
    actualMinutes: 0,
    status: 'pulado',
    reason: 'cansaco',
    reasonNotes: 'Adormeci muito cansado logo ao deitar.',
    loggedAt: '2026-09-19T23:10:00Z'
  },
  {
    id: 'log-5',
    date: '2026-09-20',
    activityId: 'act-m1',
    activityName: 'Oração de Entrega e Consagração',
    block: 'morning',
    plannedMinutes: 15,
    actualMinutes: 15,
    status: 'concluido',
    quickReflection: 'Coração calmo e alinhado aos propósitos do Pai.',
    loggedAt: '2026-09-20T06:45:00Z'
  },
  {
    id: 'log-6',
    date: '2026-09-20',
    activityId: 'act-m2',
    activityName: 'Leitura Bíblica Meditativa',
    block: 'morning',
    plannedMinutes: 15,
    actualMinutes: 15,
    status: 'concluido',
    quickReflection: 'Versículos 31 a 39: Nada nos separará do amor de Deus.',
    loggedAt: '2026-09-20T07:18:00Z'
  }
];

export const INITIAL_ADAPTATION_SUGGESTIONS: RoutineAdaptationSuggestion[] = [
  {
    id: 'adapt-1',
    activityId: 'act-n2',
    activityName: 'Oração Noturna & Descanso em Deus',
    detectedPattern: 'Notamos que esta prática noturna foi pulada 3 vezes nos últimos 5 dias devido ao cansaço acumulado.',
    gentleTone: 'É perfeitamente natural sentir cansaço ao final de dias intensos. Em vez de se cobrar por um tempo longo na cama, que tal uma oração mais curta e suave de 5 minutos ainda na poltrona antes de se deitar?',
    suggestedAction: {
      type: 'reduce_duration',
      title: 'Ajustar duração de 10 min para 5 min de descanso',
      newDuration: 5
    },
    status: 'pending',
    createdAt: '2026-09-20T07:30:00Z'
  }
];

export const INITIAL_GOALS: SpiritualGoal[] = [
  {
    id: 'goal-1',
    title: 'Consistência de Oração Diária',
    category: 'prayer',
    targetValue: 20,
    currentValue: 18,
    unit: 'minutos/dia',
    why: 'Desenvolver uma vida contínua de comunhão com o Pai e sensibilidade ao Espírito.',
    completed: false,
  },
  {
    id: 'goal-2',
    title: 'Terminar a Carta aos Romanos',
    category: 'bible',
    targetValue: 16,
    currentValue: 8,
    unit: 'capítulos',
    why: 'Compreender com clareza a teologia da Graça, justificação e santificação.',
    completed: false,
  },
  {
    id: 'goal-3',
    title: 'Jejum Semanal de Intercessão',
    category: 'fasting',
    targetValue: 4,
    currentValue: 3,
    unit: 'vezes no mês',
    why: 'Exercitar a renúncia da carne e a concentração espiritual em causas vitais.',
    completed: false,
  }
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Oração Matinal de Consagração',
    category: 'prayer',
    timeOfDay: 'morning',
    scheduledTime: '06:30',
    estimatedMinutes: 15,
    why: 'Consagrar as primeiras horas ao Senhor, silenciando ruídos antes que as cobranças do mundo comecem.',
    status: 'concluida',
    priority: 'alta',
    completed: true,
    completedAt: '2026-09-20T06:45:00',
    order: 1,
    notes: 'Momento de profunda paz e entrega das decisões.'
  },
  {
    id: 'task-2',
    title: 'Leitura Bíblica: Romanos 8',
    category: 'bible',
    timeOfDay: 'morning',
    scheduledTime: '07:00',
    estimatedMinutes: 15,
    why: 'Ancorar o coração na verdade inabalável de que nenhuma condenação há para os que estão em Cristo.',
    passageReference: 'Romanos 8',
    status: 'concluida',
    priority: 'alta',
    dependencies: ['task-1'],
    completed: true,
    completedAt: '2026-09-20T07:18:00',
    order: 2,
    notes: 'Versículo 28 destacou-se com grande consolo.',
    planId: 'plan-romanos'
  },
  {
    id: 'task-3',
    title: 'Pausa do Meio-Dia & Intercessão',
    category: 'prayer',
    timeOfDay: 'afternoon',
    scheduledTime: '12:30',
    estimatedMinutes: 10,
    why: 'Quebrar o ritmo acelerado do trabalho, orar pela família e reencontrar a serenidade em Deus.',
    status: 'proxima',
    priority: 'alta',
    completed: false,
    order: 3,
  },
  {
    id: 'task-4',
    title: 'Jejum de Discernimento (12h às 18h)',
    category: 'fasting',
    timeOfDay: 'afternoon',
    scheduledTime: '13:00',
    estimatedMinutes: 0,
    why: 'Acalmar os apetites naturais para ouvir com mais clareza a voz de Deus em um momento de decisão.',
    status: 'planejada',
    priority: 'media',
    completed: false,
    order: 4,
  },
  {
    id: 'task-5',
    title: 'Exame Noturno & Diário de Gratidão',
    category: 'reflection',
    timeOfDay: 'evening',
    scheduledTime: '21:30',
    estimatedMinutes: 15,
    why: 'Avaliar os pensamentos e ações do dia, pedir perdão pelo que não agradou a Deus e agradecer por Suas misericórdias.',
    status: 'planejada',
    priority: 'alta',
    completed: false,
    order: 5,
  }
];

export const INITIAL_READING_PLANS: ReadingPlan[] = [
  {
    id: 'plan-romanos',
    title: 'O Caminho da Graça — Romanos',
    description: 'Um estudo profundo de 16 dias pelos fundamentos da salvação, justificação e nova vida no Espírito.',
    category: 'epistles',
    durationDays: 16,
    currentDay: 8,
    isActive: true,
    startedAt: '2026-09-12',
    days: [
      { dayNumber: 1, title: 'A Justiça Revelada', passageRef: 'Romanos 1', bookId: 'romanos', chapter: 1, devotionalPrompt: 'Como a criação declara a glória de Deus ao seu redor?', completed: true },
      { dayNumber: 2, title: 'O Juízo Justo de Deus', passageRef: 'Romanos 2', bookId: 'romanos', chapter: 2, devotionalPrompt: 'Onde você tem sido tentado a julgar outros?', completed: true },
      { dayNumber: 3, title: 'Nenhum Justo, Exceto pela Fé', passageRef: 'Romanos 3', bookId: 'romanos', chapter: 3, devotionalPrompt: 'O que significa para você ser justificado gratuitamente?', completed: true },
      { dayNumber: 4, title: 'O Exemplo de Abraão', passageRef: 'Romanos 4', bookId: 'romanos', chapter: 4, devotionalPrompt: 'Você confia nas promessas mesmo quando as circunstâncias parecem contrárias?', completed: true },
      { dayNumber: 5, title: 'Paz com Deus e Esperança', passageRef: 'Romanos 5', bookId: 'romanos', chapter: 5, devotionalPrompt: 'A tribulação tem produzido perseverança na sua caminhada?', completed: true },
      { dayNumber: 6, title: 'Mortos para o Pecado, Vivos para Deus', passageRef: 'Romanos 6', bookId: 'romanos', chapter: 6, devotionalPrompt: 'A quem você tem oferecido os membros do seu corpo como instrumentos?', completed: true },
      { dayNumber: 7, title: 'A Luta Interior e a Lei', passageRef: 'Romanos 7', bookId: 'romanos', chapter: 7, devotionalPrompt: 'Como lidar com as próprias limitações sem cair no desespero?', completed: true },
      { dayNumber: 8, title: 'Vida no Espírito e Mais que Vencedores', passageRef: 'Romanos 8', bookId: 'romanos', chapter: 8, devotionalPrompt: 'Como a certeza de que Deus é por você transforma suas batalhas de hoje?', completed: true },
      { dayNumber: 9, title: 'A Fidelidade Soberana', passageRef: 'Romanos 9', bookId: 'romanos', chapter: 9, devotionalPrompt: 'Reconhecendo a soberania amorosa de Deus.', completed: false },
      { dayNumber: 10, title: 'A Mensagem da Salvação', passageRef: 'Romanos 10', bookId: 'romanos', chapter: 10, devotionalPrompt: 'A fé vem pelo ouvir a Palavra de Deus.', completed: false },
      { dayNumber: 11, title: 'O Enxerto da Graça', passageRef: 'Romanos 11', bookId: 'romanos', chapter: 11, devotionalPrompt: 'Humildade diante do chamado divino.', completed: false },
      { dayNumber: 12, title: 'Culto Racional e Serviço', passageRef: 'Romanos 12', bookId: 'romanos', chapter: 12, devotionalPrompt: 'Não vos conformeis com este século.', completed: false },
      { dayNumber: 13, title: 'Cidadania e Amor ao Próximo', passageRef: 'Romanos 13', bookId: 'romanos', chapter: 13, devotionalPrompt: 'O cumprimento da lei é o amor.', completed: false },
      { dayNumber: 14, title: 'Acolhimento aos Fracos na Fé', passageRef: 'Romanos 14', bookId: 'romanos', chapter: 14, devotionalPrompt: 'Evitando tropeços e edificando a comunidade.', completed: false },
      { dayNumber: 15, title: 'Esperança aos Gentios', passageRef: 'Romanos 15', bookId: 'romanos', chapter: 15, devotionalPrompt: 'O Deus da esperança vos encha de todo o gozo e paz.', completed: false },
      { dayNumber: 16, title: 'Saudações e Firmeza na Doutrina', passageRef: 'Romanos 16', bookId: 'romanos', chapter: 16, devotionalPrompt: 'Ao único Deus sábio seja dada glória para todo o sempre.', completed: false }
    ]
  },
  {
    id: 'plan-proverbios',
    title: 'Sabedoria Diária — Provérbios',
    description: '31 dias de discernimento prático para relacionamentos, trabalho, finanças e integridade de caráter.',
    category: 'wisdom',
    durationDays: 31,
    currentDay: 3,
    isActive: false,
    days: [
      { dayNumber: 1, title: 'O Temor do Senhor', passageRef: 'Provérbios 1', bookId: 'proverbios', chapter: 1, devotionalPrompt: 'O início da verdadeira sabedoria.', completed: true },
      { dayNumber: 2, title: 'O Valor da Sabedoria', passageRef: 'Provérbios 2', bookId: 'proverbios', chapter: 2, devotionalPrompt: 'Buscando conselho como a prata oculta.', completed: true },
      { dayNumber: 3, title: 'Confiança Incondicional', passageRef: 'Provérbios 3', bookId: 'proverbios', chapter: 3, devotionalPrompt: 'Não te estribes no teu próprio entendimento.', completed: false },
      { dayNumber: 4, title: 'Guarda o Teu Coração', passageRef: 'Provérbios 4', bookId: 'proverbios', chapter: 4, devotionalPrompt: 'Porque dele procedem as fontes da vida.', completed: false }
    ]
  },
  {
    id: 'plan-salmos-paz',
    title: 'Refúgio na Tempestade — Salmos de Paz',
    description: '14 dias com orações e cânticos de restauração da alma, proteção e descanso em Deus.',
    category: 'peace',
    durationDays: 14,
    currentDay: 1,
    isActive: false,
    days: [
      { dayNumber: 1, title: 'O Pastor Fiel', passageRef: 'Salmo 23', bookId: 'salmos', chapter: 23, devotionalPrompt: 'De nada terei falta.', completed: false },
      { dayNumber: 2, title: 'O Abrigo do Altíssimo', passageRef: 'Salmo 91', bookId: 'salmos', chapter: 91, devotionalPrompt: 'Descansando sob Suas asas.', completed: false },
      { dayNumber: 3, title: 'O Guarda de Israel', passageRef: 'Salmo 121', bookId: 'salmos', chapter: 121, devotionalPrompt: 'O meu socorro vem do Senhor.', completed: false }
    ]
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'prayer-1',
    title: 'Sabedoria e discernimento nas decisões profissionais',
    person: 'Própria vida e carreira',
    category: 'calling',
    priority: 'alta',
    date: '2026-09-01',
    status: 'em_oracao',
    description: 'Orando para que cada passo na carreira reflita integridade e honre a Deus, com clareza de prioridades.',
    notes: 'Apresentando em oração matinal e jejuando por clareza espiritual.',
    scriptureReferences: ['Tiago 1:5', 'Provérbios 3:5-6'],
    createdAt: '2026-09-01T08:00:00',
    answered: false,
    timesPrayed: 14,
    lastPrayedAt: '2026-09-20T06:40:00',
    isUrgent: true
  },
  {
    id: 'prayer-2',
    title: 'Saúde e união de toda a família',
    person: 'Pais e irmãos',
    category: 'family',
    priority: 'alta',
    date: '2026-08-20',
    status: 'ativo',
    description: 'Pela paz no lar, proteção sobre a saúde dos meus pais e fortalecimento espiritual de todos.',
    notes: 'Manter intercessão contínua durante os cultos domésticos.',
    scriptureReferences: ['Josué 24:15', 'Salmos 128:1-3'],
    createdAt: '2026-08-20T10:00:00',
    answered: false,
    timesPrayed: 22,
    lastPrayedAt: '2026-09-19T21:00:00'
  },
  {
    id: 'prayer-3',
    title: 'Cura e reabilitação da tia Marta',
    person: 'Tia Marta',
    category: 'health',
    priority: 'alta',
    date: '2026-07-15',
    status: 'agradecimento',
    description: 'Ela passou pela cirurgia delicada e os médicos trouxeram o laudo positivo!',
    answer: 'A cirurgia foi um sucesso completo e ela já está caminhando sem dores. Deus cuidou de cada detalhe da equipe médica.',
    notes: 'Motivo de louvor e gratidão na igreja no domingo passado.',
    scriptureReferences: ['Salmos 103:2-3'],
    createdAt: '2026-07-15T14:00:00',
    answered: true,
    answeredAt: '2026-09-10T11:30:00',
    answeredTestimony: 'A cirurgia foi um sucesso completo e ela já está caminhando sem dores. Deus cuidou de cada detalhe da equipe médica.',
    timesPrayed: 35
  },
  {
    id: 'prayer-4',
    title: 'Coração manso e libertação de ansiedade',
    person: 'Vida pessoal',
    category: 'spiritual',
    priority: 'media',
    date: '2026-09-05',
    status: 'em_oracao',
    description: 'Substituir a pressa mental pela confiança na provisão e no tempo oportuno do Senhor.',
    notes: 'Meditar em Filipenses 4 e praticar oração de respiração ao meio-dia.',
    scriptureReferences: ['Filipenses 4:6-7', 'Mateus 6:33-34'],
    createdAt: '2026-09-05T09:00:00',
    answered: false,
    timesPrayed: 11,
    lastPrayedAt: '2026-09-20T06:35:00'
  }
];

export const INITIAL_PRAYER_PLANS: PrayerPlan[] = [
  {
    id: 'plan-prayer-daily',
    title: 'Oração Diária — Manhã & Noite',
    description: 'Dois momentos consagrados para entrega do dia e ação de graças antes de dormir.',
    type: 'diario',
    scheduledTimes: ['06:30', '21:30'],
    recurrenceDays: [0, 1, 2, 3, 4, 5, 6],
    targetMinutes: 15,
    associatedPrayerIds: ['prayer-1', 'prayer-2', 'prayer-4'],
    isActive: true,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'plan-prayer-weekly',
    title: 'Intercessão da Família & Amigos',
    description: 'Clamor focado pelas famílias e pedidos de cura toda terça e sexta-feira.',
    type: 'semanal',
    scheduledTimes: ['12:30'],
    recurrenceDays: [2, 5], // Terça e Sexta
    targetMinutes: 20,
    associatedPrayerIds: ['prayer-2', 'prayer-3'],
    isActive: true,
    createdAt: '2026-09-05T09:00:00Z'
  }
];

export const INITIAL_FASTING_PLAN: FastingPlan = {
  id: 'fast-current',
  title: 'Jejum de Clareza e Humildade',
  type: 'water_only',
  date: '2026-09-20',
  startTime: '2026-09-20T07:00:00',
  endTime: '2026-09-20T19:00:00',
  targetHours: 12,
  purpose: 'Consagrar um período para discernir os próximos passos de vida e manter a sensibilidade espiritual aguçada.',
  relatedPrayerId: 'prayer-1',
  relatedPrayerTitle: 'Sabedoria e discernimento nas decisões profissionais',
  relatedPassage: 'Tiago 1:5',
  notes: 'Dedicar o horário do almoço para oração e leitura do livro de Provérbios.',
  status: 'em_andamento',
  scriptureVerse: 'Mateus 6:17-18 — "Tu, porém, quando jejuares, unge a cabeça e lava o rosto..."',
  active: true,
  completed: false,
  reflectionsDuringFast: 'Momento de oração ao meio-dia trouxe paz renovada e foco no essencial.',
  createdAt: '2026-09-20T07:00:00Z'
};

export const INITIAL_FASTING_RECORDS: FastingPlan[] = [
  INITIAL_FASTING_PLAN,
  {
    id: 'fast-past-1',
    title: 'Jejum de Gratidão e Quebra de Ansiedade',
    type: 'partial',
    date: '2026-09-13',
    startTime: '2026-09-13T06:00:00',
    endTime: '2026-09-13T14:00:00',
    targetHours: 8,
    purpose: 'Entrega das preocupações com trabalho e descanso na soberania de Deus.',
    relatedPrayerId: 'prayer-4',
    relatedPrayerTitle: 'Coração manso e libertação de ansiedade',
    relatedPassage: 'Filipenses 4:6-7',
    notes: 'Pulei o café da manhã e o almoço, consumindo água e chá.',
    status: 'concluido',
    active: false,
    completed: true,
    completedAt: '2026-09-13T14:10:00Z',
    reflectionsDuringFast: 'Deus ministrou grande calma ao meu coração durante a oração do meio-dia.',
    createdAt: '2026-09-13T06:00:00Z'
  }
];

export const INITIAL_REFLECTIONS: Reflection[] = [
  {
    id: 'refl-1',
    date: '2026-09-19',
    scriptureRef: 'Romanos 7:24-25',
    whatLearned: 'Minha força humana não é suficiente para vencer minhas falhas. A vitória vem unicamente por meio de Jesus Cristo nosso Senhor.',
    whatCaughtAttention: 'A expressão "Graças a Deus por Jesus Cristo, nosso Senhor!" no ápice da fraqueza.',
    howToApply: 'Em vez de me culpar quando falho, vou correr para a graça imediatamente e pedir auxílio ao Espírito Santo.',
    personalPrayer: 'Senhor Jesus, ajuda-me a não confiar nas minhas próprias forças, mas em Tua justiça que me liberta.',
    notes: 'Leitura feita durante a manhã, trouxe grande alívio de peso interior.',
    relatedActivityType: 'bible',
    relatedTitle: 'Leitura de Romanos 7',
    whatGodSpoke: 'Minha força humana não é suficiente para vencer minhas falhas. A vitória vem unicamente por meio de Jesus Cristo nosso Senhor.',
    practicalApplication: 'Em vez de me culpar quando falho, vou correr para a graça imediatamente e pedir auxílio ao Espírito Santo.',
    gratitudeNotes: [
      'Paz no trânsito e paciência restaurada',
      'Almoço em comunhão com colegas',
      'A noite calma para ler e descansar'
    ],
    moodRating: 4,
    createdAt: '2026-09-19T22:00:00'
  }
];

function generateInitialConsistencyHistory(): DailyConsistency[] {
  const list: DailyConsistency[] = [];
  const baseDate = new Date('2026-09-20T12:00:00Z');
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 = dom, 6 = sab
    
    const isSunday = dayOfWeek === 0;
    const isWednesday = dayOfWeek === 3;
    const isFriday = dayOfWeek === 5;
    
    let tasksCompleted = 4;
    let prayerMinutes = 20;
    let bibleRead = true;
    let fastingLogged = false;
    
    if (isSunday) {
      tasksCompleted = (i % 3 === 0) ? 5 : 4;
      prayerMinutes = 30;
      bibleRead = true;
    } else if (isWednesday) {
      tasksCompleted = 5;
      prayerMinutes = 25;
      bibleRead = true;
      fastingLogged = (i % 14 === 0);
    } else if (isFriday) {
      tasksCompleted = (i % 2 === 0) ? 4 : 5;
      prayerMinutes = 20;
      bibleRead = true;
      fastingLogged = (i % 7 === 0);
    } else if (dayOfWeek === 6) {
      tasksCompleted = (i % 4 === 0) ? 3 : 4;
      prayerMinutes = 15;
      bibleRead = (i % 5 !== 0);
    } else {
      tasksCompleted = (i % 5 === 0) ? 3 : ((i % 2 === 0) ? 5 : 4);
      prayerMinutes = 20;
      bibleRead = true;
    }

    if (dateStr === '2026-09-20') {
      tasksCompleted = 2;
      prayerMinutes = 15;
      fastingLogged = true;
    } else if (dateStr === '2026-09-19') {
      tasksCompleted = 4;
      prayerMinutes = 20;
    } else if (dateStr === '2026-09-18') {
      tasksCompleted = 3;
      prayerMinutes = 15;
    } else if (dateStr === '2026-09-17') {
      tasksCompleted = 5;
      prayerMinutes = 30;
      fastingLogged = true;
    }

    const totalTasks = 5;
    const score = Math.round((tasksCompleted / totalTasks) * 100);

    list.push({
      date: dateStr,
      tasksCompleted,
      totalTasks,
      prayerMinutes,
      bibleRead,
      fastingLogged,
      score
    });
  }
  return list;
}

export const INITIAL_CONSISTENCY_HISTORY: DailyConsistency[] = generateInitialConsistencyHistory();

export const INITIAL_PRACTICE_RECORDS: PracticeRecord[] = [
  {
    id: 'prac-event-1',
    date: '2026-09-17',
    time: '19:30',
    type: 'event',
    title: 'Culto de Oração & Doutrina',
    locationOrLeader: 'Comunidade da Graça — Pr. Daniel Carvalho',
    passageRef: 'Filipenses 2:1-11',
    prayerFocus: 'Clamor coletivo pela unidade da igreja e famílias',
    reflectionNotes: 'Mensagem sobre a mente de Cristo e esvaziamento do ego.',
    resultSummary: 'Comunhão preciosa e renovação do compromisso com o próximo.',
    durationMinutes: 90,
    status: 'concluido',
    createdAt: '2026-09-17T21:15:00Z'
  },
  {
    id: 'prac-study-1',
    date: '2026-09-18',
    time: '20:00',
    type: 'study',
    title: 'Estudo Indutivo das Epístolas Paulinas',
    passageRef: 'Romanos 8:1-17',
    reflectionNotes: 'Aprofundamento sobre a diferença entre a mentalidade da carne vs. a mente governada pelo Espírito Santo.',
    prayerFocus: 'Pedir sensibilidade diária à direção do Espírito.',
    resultSummary: 'Anotadas 4 aplicações práticas para a tomada de decisões no trabalho.',
    durationMinutes: 40,
    chaptersCount: 1,
    status: 'concluido',
    createdAt: '2026-09-18T20:45:00Z'
  },
  {
    id: 'prac-memo-1',
    date: '2026-09-19',
    time: '08:30',
    type: 'memorization',
    title: 'Memorização do Versículo da Semana',
    passageRef: 'Provérbios 3:5-6',
    reflectionNotes: '"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento..."',
    prayerFocus: 'Entrega voluntária do controle diário a Deus.',
    resultSummary: 'Versículo recitado e guardado no coração com facilidade.',
    durationMinutes: 10,
    status: 'concluido',
    createdAt: '2026-09-19T08:40:00Z'
  },
  {
    id: 'prac-custom-1',
    date: '2026-09-20',
    time: '12:45',
    type: 'custom',
    title: 'Caminhada de Oração & Silêncio',
    prayerFocus: 'Paz para tomada de decisões difíceis e discernimento prático',
    reflectionNotes: 'Desconectei do celular por 20 minutos caminhando na praça.',
    resultSummary: 'Clareza mental restabelecida e descanso emocional.',
    durationMinutes: 20,
    status: 'concluido',
    createdAt: '2026-09-20T13:10:00Z'
  }
];
