import React, { useState } from 'react';
import { X, Layers, Copy, Check, Info } from 'lucide-react';
import { BibleVersion } from '../../types';
import { getVerseComparison } from '../../data/multiVersionBible';

interface BibleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  versions: BibleVersion[];
  baseVersion: BibleVersion;
}

export const BibleComparisonModal: React.FC<BibleComparisonModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookName,
  chapter,
  verseNumber,
  versions,
  baseVersion
}) => {
  const [copiedVersionId, setCopiedVersionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const comparisonMap = getVerseComparison(bookId, chapter, verseNumber);

  const handleCopy = (versionAbbr: string, text: string) => {
    navigator.clipboard?.writeText(`"${text}" — ${bookName} ${chapter}:${verseNumber} (${versionAbbr})`);
    setCopiedVersionId(versionAbbr);
    setTimeout(() => setCopiedVersionId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71]" />
            <div>
              <h3 className="text-base font-bold text-[#162E23] dark:text-[#F1F4F2]">
                Comparar Versões das Escrituras
              </h3>
              <p className="text-xs text-[#7D8882]">
                {bookName} {chapter}:{verseNumber} • Traduções em Domínio Público & Licença Livre
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-4 py-2.5 bg-[#F2F7F4] dark:bg-[#1B2521] border-b border-[#29523F]/20 flex items-center gap-2 text-[11px] text-[#29523F] dark:text-[#4F8E71]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            A comparação multiversões enriquece a meditação bíblica ao evidenciar nuances idiomáticas históricas e contemporâneas.
          </span>
        </div>

        {/* Versions Stack */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FBFBFA] dark:bg-[#111715]">
          {versions.map(ver => {
            const verKey = ver.id.toLowerCase();
            const text = comparisonMap ? comparisonMap[verKey] : null;
            const isBase = ver.id === baseVersion.id;

            return (
              <div
                key={ver.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBase
                    ? 'bg-white dark:bg-[#141C19] border-[#29523F] dark:border-[#4F8E71] shadow-xs'
                    : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isBase 
                        ? 'bg-[#162E23] text-white dark:bg-[#2A4C3D]' 
                        : 'bg-neutral-100 dark:bg-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                    }`}>
                      {ver.abbreviation}
                    </span>
                    <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                      {ver.name}
                    </span>
                    {isBase && (
                      <span className="text-[10px] text-[#29523F] dark:text-[#4F8E71] font-semibold">
                        (Versão Atual)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#7D8882]">
                      {ver.language} • {ver.license}
                    </span>
                    {text && (
                      <button
                        onClick={() => handleCopy(ver.abbreviation, text)}
                        className="p-1 rounded text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
                        title="Copiar texto desta versão"
                      >
                        {copiedVersionId === ver.abbreviation ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {text ? (
                  <p className="font-serif-scripture text-sm sm:text-base leading-relaxed text-[#19211D] dark:text-[#F1F4F2]">
                    "{text}"
                  </p>
                ) : (
                  <p className="text-xs italic text-[#7D8882]">
                    Texto em preparação nesta versão para o capítulo selecionado.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] dark:bg-[#2A4C3D]"
          >
            Fechar Comparação
          </button>
        </div>

      </div>
    </div>
  );
};
