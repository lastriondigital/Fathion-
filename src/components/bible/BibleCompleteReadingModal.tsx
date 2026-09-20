import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Layers, 
  Calendar, 
  Sparkles, 
  HeartHandshake, 
  FileText,
  X,
  ArrowRight
} from 'lucide-react';
import { ReadingPlan, BibleVersion } from '../../types';

interface BibleCompleteReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  passageRef: string;
  bookId: string;
  chapter: number;
  version: BibleVersion;
  durationMinutes: number;
  activePlan?: ReadingPlan | null;
  onConfirmComplete: (relatedPlanId?: string, planDayNumber?: number) => void;
  onCreateReflection: (passageRef: string) => void;
  onOpenPrayer: (passageRef: string) => void;
  onOpenFasting?: (passageRef: string) => void;
  onSetWordOfDay?: (passageRef: string) => void;
}

export const BibleCompleteReadingModal: React.FC<BibleCompleteReadingModalProps> = ({
  isOpen,
  onClose,
  passageRef,
  bookId,
  chapter,
  version,
  durationMinutes,
  activePlan,
  onConfirmComplete,
  onCreateReflection,
  onOpenPrayer,
  onOpenFasting,
  onSetWordOfDay
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(activePlan?.id);
  const [completedRegistered, setCompletedRegistered] = useState(false);

  if (!isOpen) return null;

  const handleFinalize = () => {
    onConfirmComplete(selectedPlanId, activePlan?.currentDay);
    setCompletedRegistered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header with peaceful success icon */}
        <div className="p-6 text-center border-b border-[#E6E6DF] dark:border-[#24322C] bg-[#F2F7F4] dark:bg-[#1B2521]/60">
          <div className="w-12 h-12 rounded-full bg-[#29523F] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-[#162E23] dark:text-[#F1F4F2]">
            Leitura Bíblica Concluída
          </h3>
          <p className="text-xs text-[#7D8882] mt-1">
            "A tua palavra é lâmpada para os meus pés e luz para o meu caminho." (Salmos 119:105)
          </p>
        </div>

        {/* Reading Summary Details */}
        <div className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
              <span className="text-[#7D8882] text-[10px] uppercase font-bold block mb-0.5">
                Passagem
              </span>
              <span className="font-bold text-[#162E23] dark:text-[#F1F4F2] text-sm">
                {passageRef}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
              <span className="text-[#7D8882] text-[10px] uppercase font-bold block mb-0.5">
                Versão
              </span>
              <span className="font-bold text-[#29523F] dark:text-[#4F8E71] text-sm">
                {version.abbreviation} ({version.language})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
              <span className="text-[#7D8882] text-[10px] uppercase font-bold block mb-0.5">
                Tempo Dedicado
              </span>
              <span className="font-bold text-[#162E23] dark:text-[#F1F4F2] text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                {durationMinutes} {durationMinutes === 1 ? 'minuto' : 'minutos'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
              <span className="text-[#7D8882] text-[10px] uppercase font-bold block mb-0.5">
                Data do Registro
              </span>
              <span className="font-bold text-[#162E23] dark:text-[#F1F4F2] text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Plano de Leitura Relacionado */}
          {activePlan && (
            <div className="p-3 rounded-xl border border-[#29523F]/30 bg-[#F2F7F4]/60 dark:bg-[#1B2521]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#29523F] dark:text-[#4F8E71] block">
                  Alimentar Plano de Leitura
                </span>
                <span className="text-xs font-bold text-[#162E23] dark:text-[#F1F4F2]">
                  {activePlan.title} (Dia {activePlan.currentDay})
                </span>
              </div>
              <input
                type="checkbox"
                checked={selectedPlanId === activePlan.id}
                onChange={e => setSelectedPlanId(e.target.checked ? activePlan.id : undefined)}
                className="w-4 h-4 text-[#29523F] rounded focus:ring-0 cursor-pointer"
              />
            </div>
          )}

          {/* Ações imediatas pós-leitura */}
          <div className="space-y-2 pt-2 border-t border-[#E6E6DF] dark:border-[#24322C]">
            <span className="text-xs font-bold text-[#7D8882] uppercase tracking-wider block">
              Próximos Passos Devocionais
            </span>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  handleFinalize();
                  onClose();
                  onCreateReflection(passageRef);
                }}
                className="w-full p-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C59B3F]" />
                  <span>Escrever Reflexão sobre {passageRef}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7D8882]" />
              </button>

              <button
                onClick={() => {
                  handleFinalize();
                  onClose();
                  onOpenPrayer(passageRef);
                }}
                className="w-full p-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
                  <span>Orar em resposta a esta Palavra</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7D8882]" />
              </button>

              {onOpenFasting && (
                <button
                  onClick={() => {
                    handleFinalize();
                    onClose();
                    onOpenFasting(passageRef);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C59B3F]" />
                    <span>Consagrar Jejum baseado nesta Palavra</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7D8882]" />
                </button>
              )}

              {onSetWordOfDay && (
                <button
                  onClick={() => {
                    handleFinalize();
                    onSetWordOfDay(passageRef);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Fixar como Meditação do Dia</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7D8882]" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Confirm Footer */}
        <div className="p-4 border-t border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#111715] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              handleFinalize();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#162E23] dark:bg-[#2A4C3D] text-white hover:bg-[#1F3F30] flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar e Registrar Leitura</span>
          </button>
        </div>

      </div>
    </div>
  );
};
