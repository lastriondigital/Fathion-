import React from 'react';
import { 
  HeartHandshake, 
  Flame, 
  BarChart3, 
  Settings, 
  X, 
  Target, 
  Download, 
  BookMarked,
  ShieldAlert,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface MoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTabId) => void;
  activeTab: NavTabId;
  activePrayersCount: number;
  isFastingActive: boolean;
  pendingAdaptationsCount?: number;
}

export const MoreSheet: React.FC<MoreSheetProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  activeTab,
  activePrayersCount,
  isFastingActive,
  pendingAdaptationsCount = 0
}) => {
  if (!isOpen) return null;

  const handleSelect = (tab: NavTabId) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FBFBFA] dark:bg-[#141C19] rounded-t-2xl border-t border-[#E6E6DF] dark:border-[#24322C] max-h-[85vh] overflow-y-auto p-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div>
            <h2 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Mais Recursos
            </h2>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Ferramentas de aprofundamento e acompanhamento
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links Grid */}
        <div className="py-4 space-y-2">
          
          {/* Rotina & Objetivos */}
          <button
            id="more-item-routine"
            onClick={() => handleSelect('routine')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              activeTab === 'routine'
                ? 'bg-[#162E23] text-white border-[#162E23]'
                : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#29523F] dark:text-[#4F8E71]">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Rotina Pessoal & Objetivos</div>
                <div className={`text-xs ${activeTab === 'routine' ? 'text-emerald-200' : 'text-[#7D8882] dark:text-[#788780]'}`}>
                  Manhã, Dia, Noite, Objetivos e Adaptações
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingAdaptationsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {pendingAdaptationsCount}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-[#7D8882]" />
            </div>
          </button>

          {/* Oração */}
          <button
            id="more-item-prayer"
            onClick={() => handleSelect('prayer')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              activeTab === 'prayer'
                ? 'bg-[#162E23] text-white border-[#162E23]'
                : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-[#C59B3F]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Caderno de Oração</div>
                <div className={`text-xs ${activeTab === 'prayer' ? 'text-amber-200' : 'text-[#7D8882] dark:text-[#788780]'}`}>
                  Intercessões, pedidos e respostas divinas
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activePrayersCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  {activePrayersCount}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-[#7D8882]" />
            </div>
          </button>

          {/* Jejum */}
          <button
            id="more-item-fasting"
            onClick={() => handleSelect('fasting')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              activeTab === 'fasting'
                ? 'bg-[#162E23] text-white border-[#162E23]'
                : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#29523F] dark:text-[#4F8E71]">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Consagração e Jejum</div>
                <div className={`text-xs ${activeTab === 'fasting' ? 'text-emerald-200' : 'text-[#7D8882] dark:text-[#788780]'}`}>
                  Propósitos bíblicos e contador ativo
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isFastingActive && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Ativo
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-[#7D8882]" />
            </div>
          </button>

          {/* Estatísticas */}
          <button
            id="more-item-stats"
            onClick={() => handleSelect('stats')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              activeTab === 'stats'
                ? 'bg-[#162E23] text-white border-[#162E23]'
                : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#4B554F] dark:text-[#B0BBB5]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Estatísticas & Fidelidade</div>
                <div className={`text-xs ${activeTab === 'stats' ? 'text-stone-200' : 'text-[#7D8882] dark:text-[#788780]'}`}>
                  Tempo em oração, leitura e consistência
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7D8882]" />
          </button>

          {/* Configurações & Perfil */}
          <button
            id="more-item-settings"
            onClick={() => handleSelect('settings')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              activeTab === 'settings'
                ? 'bg-[#162E23] text-white border-[#162E23]'
                : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#4B554F] dark:text-[#B0BBB5]">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Configurações & Perfil</div>
                <div className={`text-xs ${activeTab === 'settings' ? 'text-stone-200' : 'text-[#7D8882] dark:text-[#788780]'}`}>
                  Foco espiritual, backup e preferências
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7D8882]" />
          </button>

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#E6E6DF] dark:border-[#24322C] text-center text-xs text-[#7D8882] dark:text-[#788780]">
          FAITHION v1.0 • Teu guia pessoal na caminhada cristã
        </div>
      </div>
    </div>
  );
};
