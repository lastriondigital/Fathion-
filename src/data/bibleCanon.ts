export interface CanonBook {
  id: string;
  name: string;
  abbreviation: string;
  testament: 'AT' | 'NT';
  category: 'Pentateuco' | 'Históricos' | 'Poéticos' | 'Profetas Maiores' | 'Profetas Menores' | 'Evangelhos' | 'Histórico NT' | 'Cartas Paulinas' | 'Cartas Gerais' | 'Revelação';
  chaptersCount: number;
}

export const BIBLE_CANON: CanonBook[] = [
  // Antigo Testamento - Pentateuco
  { id: 'genesis', name: 'Gênesis', abbreviation: 'Gn', testament: 'AT', category: 'Pentateuco', chaptersCount: 50 },
  { id: 'exodo', name: 'Êxodo', abbreviation: 'Êx', testament: 'AT', category: 'Pentateuco', chaptersCount: 40 },
  { id: 'levitico', name: 'Levítico', abbreviation: 'Lv', testament: 'AT', category: 'Pentateuco', chaptersCount: 27 },
  { id: 'numeros', name: 'Números', abbreviation: 'Nm', testament: 'AT', category: 'Pentateuco', chaptersCount: 36 },
  { id: 'deuteronomio', name: 'Deuteronômio', abbreviation: 'Dt', testament: 'AT', category: 'Pentateuco', chaptersCount: 34 },

  // Antigo Testamento - Históricos
  { id: 'josue', name: 'Josué', abbreviation: 'Js', testament: 'AT', category: 'Históricos', chaptersCount: 24 },
  { id: 'juizes', name: 'Juízes', abbreviation: 'Jz', testament: 'AT', category: 'Históricos', chaptersCount: 21 },
  { id: 'rute', name: 'Rute', abbreviation: 'Rt', testament: 'AT', category: 'Históricos', chaptersCount: 4 },
  { id: '1samuel', name: '1 Samuel', abbreviation: '1Sm', testament: 'AT', category: 'Históricos', chaptersCount: 31 },
  { id: '2samuel', name: '2 Samuel', abbreviation: '2Sm', testament: 'AT', category: 'Históricos', chaptersCount: 24 },
  { id: '1reis', name: '1 Reis', abbreviation: '1Rs', testament: 'AT', category: 'Históricos', chaptersCount: 22 },
  { id: '2reis', name: '2 Reis', abbreviation: '2Rs', testament: 'AT', category: 'Históricos', chaptersCount: 25 },
  { id: '1cronicas', name: '1 Crônicas', abbreviation: '1Cr', testament: 'AT', category: 'Históricos', chaptersCount: 29 },
  { id: '2cronicas', name: '2 Crônicas', abbreviation: '2Cr', testament: 'AT', category: 'Históricos', chaptersCount: 36 },
  { id: 'esdras', name: 'Esdras', abbreviation: 'Ed', testament: 'AT', category: 'Históricos', chaptersCount: 10 },
  { id: 'neemias', name: 'Neemias', abbreviation: 'Ne', testament: 'AT', category: 'Históricos', chaptersCount: 13 },
  { id: 'ester', name: 'Ester', abbreviation: 'Et', testament: 'AT', category: 'Históricos', chaptersCount: 10 },

  // Antigo Testamento - Poéticos
  { id: 'jo', name: 'Jó', abbreviation: 'Jó', testament: 'AT', category: 'Poéticos', chaptersCount: 42 },
  { id: 'salmos', name: 'Salmos', abbreviation: 'Sl', testament: 'AT', category: 'Poéticos', chaptersCount: 150 },
  { id: 'proverbios', name: 'Provérbios', abbreviation: 'Pv', testament: 'AT', category: 'Poéticos', chaptersCount: 31 },
  { id: 'eclesiastes', name: 'Eclesiastes', abbreviation: 'Ec', testament: 'AT', category: 'Poéticos', chaptersCount: 12 },
  { id: 'cantares', name: 'Cânticos', abbreviation: 'Ct', testament: 'AT', category: 'Poéticos', chaptersCount: 8 },

  // Antigo Testamento - Profetas Maiores
  { id: 'isaias', name: 'Isaías', abbreviation: 'Is', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 66 },
  { id: 'jeremias', name: 'Jeremias', abbreviation: 'Jr', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 52 },
  { id: 'lamentacoes', name: 'Lamentações', abbreviation: 'Lm', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 5 },
  { id: 'ezequiel', name: 'Ezequiel', abbreviation: 'Ez', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 48 },
  { id: 'daniel', name: 'Daniel', abbreviation: 'Dn', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 12 },

  // Antigo Testamento - Profetas Menores
  { id: 'oseias', name: 'Oséias', abbreviation: 'Os', testament: 'AT', category: 'Profetas Menores', chaptersCount: 14 },
  { id: 'joel', name: 'Joel', abbreviation: 'Jl', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'amos', name: 'Amós', abbreviation: 'Am', testament: 'AT', category: 'Profetas Menores', chaptersCount: 9 },
  { id: 'obadias', name: 'Obadias', abbreviation: 'Ob', testament: 'AT', category: 'Profetas Menores', chaptersCount: 1 },
  { id: 'jonas', name: 'Jonas', abbreviation: 'Jn', testament: 'AT', category: 'Profetas Menores', chaptersCount: 4 },
  { id: 'miqueias', name: 'Miquéias', abbreviation: 'Mq', testament: 'AT', category: 'Profetas Menores', chaptersCount: 7 },
  { id: 'naum', name: 'Naum', abbreviation: 'Na', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'habacuque', name: 'Habacuque', abbreviation: 'Hc', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'sofonias', name: 'Sofonias', abbreviation: 'Sf', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'ageu', name: 'Ageu', abbreviation: 'Ag', testament: 'AT', category: 'Profetas Menores', chaptersCount: 2 },
  { id: 'zacarias', name: 'Zacarias', abbreviation: 'Zc', testament: 'AT', category: 'Profetas Menores', chaptersCount: 14 },
  { id: 'malaquias', name: 'Malaquias', abbreviation: 'Ml', testament: 'AT', category: 'Profetas Menores', chaptersCount: 4 },

  // Novo Testamento - Evangelhos
  { id: 'mateus', name: 'Mateus', abbreviation: 'Mt', testament: 'NT', category: 'Evangelhos', chaptersCount: 28 },
  { id: 'marcos', name: 'Marcos', abbreviation: 'Mc', testament: 'NT', category: 'Evangelhos', chaptersCount: 16 },
  { id: 'lucas', name: 'Lucas', abbreviation: 'Lc', testament: 'NT', category: 'Evangelhos', chaptersCount: 24 },
  { id: 'joao', name: 'João', abbreviation: 'Jo', testament: 'NT', category: 'Evangelhos', chaptersCount: 21 },

  // Novo Testamento - Histórico
  { id: 'atos', name: 'Atos', abbreviation: 'At', testament: 'NT', category: 'Histórico NT', chaptersCount: 28 },

  // Novo Testamento - Cartas Paulinas
  { id: 'romanos', name: 'Romanos', abbreviation: 'Rm', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 16 },
  { id: '1corintios', name: '1 Coríntios', abbreviation: '1Co', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 16 },
  { id: '2corintios', name: '2 Coríntios', abbreviation: '2Co', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 13 },
  { id: 'galatas', name: 'Gálatas', abbreviation: 'Gl', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 6 },
  { id: 'efesios', name: 'Efésios', abbreviation: 'Ef', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 6 },
  { id: 'filipenses', name: 'Filipenses', abbreviation: 'Fp', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 4 },
  { id: 'colossenses', name: 'Colossenses', abbreviation: 'Cl', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 4 },
  { id: '1tessalonicenses', name: '1 Tessalonicenses', abbreviation: '1Ts', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 5 },
  { id: '2tessalonicenses', name: '2 Tessalonicenses', abbreviation: '2Ts', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 3 },
  { id: '1timoteo', name: '1 Timóteo', abbreviation: '1Tm', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 6 },
  { id: '2timoteo', name: '2 Timóteo', abbreviation: '2Tm', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 4 },
  { id: 'tito', name: 'Tito', abbreviation: 'Tt', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 3 },
  { id: 'filemom', name: 'Filemom', abbreviation: 'Fm', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 1 },

  // Novo Testamento - Cartas Gerais
  { id: 'hebreus', name: 'Hebreus', abbreviation: 'Hb', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 13 },
  { id: 'tiago', name: 'Tiago', abbreviation: 'Tg', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 5 },
  { id: '1pedro', name: '1 Pedro', abbreviation: '1Pe', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 5 },
  { id: '2pedro', name: '2 Pedro', abbreviation: '2Pe', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 3 },
  { id: '1joao', name: '1 João', abbreviation: '1Jo', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 5 },
  { id: '2joao', name: '2 João', abbreviation: '2Jo', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 1 },
  { id: '3joao', name: '3 João', abbreviation: '3Jo', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 1 },
  { id: 'judas', name: 'Judas', abbreviation: 'Jd', testament: 'NT', category: 'Cartas Gerais', chaptersCount: 1 },

  // Novo Testamento - Revelação
  { id: 'apocalipse', name: 'Apocalipse', abbreviation: 'Ap', testament: 'NT', category: 'Revelação', chaptersCount: 22 }
];

export const TOTAL_BIBLE_CHAPTERS = BIBLE_CANON.reduce((acc, book) => acc + book.chaptersCount, 0); // 1189
export const TOTAL_NT_CHAPTERS = BIBLE_CANON.filter(b => b.testament === 'NT').reduce((acc, b) => acc + b.chaptersCount, 0); // 260
export const TOTAL_AT_CHAPTERS = BIBLE_CANON.filter(b => b.testament === 'AT').reduce((acc, b) => acc + b.chaptersCount, 0); // 929

export function findCanonBook(bookIdOrName: string): CanonBook | undefined {
  const norm = bookIdOrName.trim().toLowerCase();
  return BIBLE_CANON.find(b => 
    b.id.toLowerCase() === norm || 
    b.name.toLowerCase() === norm || 
    b.abbreviation.toLowerCase() === norm
  );
}
