import { BibleVersion } from '../types';

/**
 * Catálogo de Versões Bíblicas do FAITHION
 * 
 * IMPORTANTE SOBRE DIREITOS AUTORAIS:
 * Apenas traduções em Domínio Público ou de Licença Aberta/Creative Commons
 * sem restrições proprietárias foram incluídas.
 * 
 * Arquitetura flexível: permite adicionar, remover ou desabilitar versões dinamicamente.
 */
export const DEFAULT_BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: 'arc',
    name: 'Almeida Revista e Corrigida',
    abbreviation: 'ARC',
    language: 'Português',
    origin: 'Tradução histórica de João Ferreira de Almeida (edição em domínio público tradicional)',
    license: 'Domínio Público',
    available: true,
    order: 1,
    description: 'Tradução clássica e reverente, amplamente utilizada nas igrejas de tradição protestante em língua portuguesa.'
  },
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'Inglês',
    origin: 'Tradução monumental autorizada em 1611 para a língua inglesa',
    license: 'Domínio Público',
    available: true,
    order: 2,
    description: 'A versão mais influente da língua inglesa, conhecida pela nobreza poética e fidelidade ao Texto Receptus.'
  },
  {
    id: 'web',
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'Inglês',
    origin: 'Revisão moderna contemporânea baseada na American Standard Version e Texto Majoritário',
    license: 'Domínio Público (100% Livre de Direitos)',
    available: true,
    order: 3,
    description: 'Texto moderno, de fácil compreensão e em domínio público global sem qualquer restrição de copyright.'
  },
  {
    id: 'jfa',
    name: 'Almeida Clássica Tradicional',
    abbreviation: 'JFA',
    language: 'Português',
    origin: 'Edição clássica de João Ferreira de Almeida (século XVIII/XIX em domínio público)',
    license: 'Domínio Público',
    available: true,
    order: 4,
    description: 'Expressão literária original e sóbria de Almeida para estudo comparativo profundo.'
  },
  {
    id: 'vul',
    name: 'Biblia Sacra Vulgata',
    abbreviation: 'VUL',
    language: 'Latim',
    origin: 'Tradução clássica da Igreja Cristã primitiva por São Jerônimo (século IV)',
    license: 'Domínio Público',
    available: true,
    order: 5,
    description: 'Texto canônico em latim para estudo histórico, exegese comparada e raízes teológicas.'
  },
  {
    id: 'rvr',
    name: 'Reina-Valera 1909',
    abbreviation: 'RVR',
    language: 'Espanhol',
    origin: 'Tradução clássica castelhana em domínio público de Casiodoro de Reina e Cipriano de Valera',
    license: 'Domínio Público',
    available: true,
    order: 6,
    description: 'A tradução mais tradicional e venerada em países de língua hispânica.'
  }
];

/**
 * Registro de versões bíblicas em memória e extensível
 */
class BibleVersionRegistry {
  private versions: BibleVersion[] = [...DEFAULT_BIBLE_VERSIONS];

  public getAllVersions(): BibleVersion[] {
    return [...this.versions].sort((a, b) => a.order - b.order);
  }

  public getAvailableVersions(): BibleVersion[] {
    return this.versions
      .filter(v => v.available)
      .sort((a, b) => a.order - b.order);
  }

  public getVersionById(id: string): BibleVersion | undefined {
    return this.versions.find(v => v.id.toLowerCase() === id.toLowerCase());
  }

  public addOrUpdateVersion(version: BibleVersion): void {
    const index = this.versions.findIndex(v => v.id === version.id);
    if (index >= 0) {
      this.versions[index] = version;
    } else {
      this.versions.push(version);
    }
  }

  public removeVersion(id: string): boolean {
    const initialLen = this.versions.length;
    this.versions = this.versions.filter(v => v.id !== id);
    return this.versions.length < initialLen;
  }

  public setVersionAvailability(id: string, available: boolean): void {
    const version = this.getVersionById(id);
    if (version) {
      version.available = available;
    }
  }
}

export const bibleVersionRegistry = new BibleVersionRegistry();
