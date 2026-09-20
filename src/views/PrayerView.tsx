import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Sparkles, 
  Clock, 
  Check, 
  CheckCircle2, 
  BookmarkCheck, 
  Filter,
  Play,
  Share2,
  Calendar
} from 'lucide-react';
import { PrayerRequest, PrayerCategory } from '../types';

interface PrayerViewProps {
  prayers: PrayerRequest[];
  onAddPrayer: (prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'answered' | 'timesPrayed'>) => void;
  onToggleAnswered: (id: string, testimony?: string) => void;
  onOpenTimer: () => void;
}

export const PrayerView: React.FC<PrayerViewProps> = ({
  prayers,
  onAddPrayer,
  onToggleAnswered,
  onOpenTimer
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'answered'>('active');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // New Prayer form state
  const [showNewPrayerForm, setShowNewPrayerForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PrayerCategory>('spiritual');
  const [newDescription, setNewDescription] = useState('');
  const [newVerses, setNewVerses] = useState('');

  // Testimony modal state
  const [answeringPrayerId, setAnsweringPrayerId] = useState<string | null>(null);
  const [testimonyText, setTestimonyText] = useState('');

  const activePrayers = prayers.filter(p => !p.answered);
  const answeredPrayers = prayers.filter(p => p.answered);

  const displayedPrayers = (activeTab === 'active' ? activePrayers : answeredPrayers)
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddPrayer({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      scriptureReferences: newVerses ? newVerses.split(',').map(s => s.trim()) : undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewVerses('');
    setShowNewPrayerForm(false);
  };

  const handleConfirmAnswered = () => {
    if (answeringPrayerId) {
      onToggleAnswered(answeringPrayerId, testimonyText.trim() || undefined);
      setAnsweringPrayerId(null);
      setTestimonyText('');
    }
  };

  const getCategoryLabel = (cat: PrayerCategory) => {
    switch (cat) {
      case 'family': return 'Família';
      case 'health': return 'Saúde & Cura';
      case 'spiritual': return 'Vida Espiritual';
      case 'gratitude': return 'Gratidão';
      case 'calling': return 'Vocação & Trabalho';
      case 'intercession': return 'Intercessão';
      default: return 'Geral';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Caderno de Oração & Intercessão
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
            Comunhão com o Pai
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            "A oração feita por um justo pode muito em seus efeitos." — Tiago 5:16
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-[#C59B3F] hover:bg-amber-100/60 text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-[#C59B3F]" />
            <span>Orar Agora (Timer)</span>
          </button>

          <button
            onClick={() => setShowNewPrayerForm(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pedido</span>
          </button>
        </div>
      </div>

      {/* Tabs and Categories Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-[#162E23] dark:bg-[#224535] text-white shadow-xs'
                : 'bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]'
            }`}
          >
            Ativas ({activePrayers.length})
          </button>

          <button
            onClick={() => setActiveTab('answered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'answered'
                ? 'bg-[#162E23] dark:bg-[#224535] text-white shadow-xs'
                : 'bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]'
            }`}
          >
            Respondidas • Testemunhos ({answeredPrayers.length})
          </button>
        </div>

        {/* Filter by Category */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#7D8882] shrink-0">Filtrar:</span>
          {['all', 'spiritual', 'family', 'health', 'calling'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#E6F0EA] dark:bg-[#192D23] font-bold text-[#162E23] dark:text-[#4F8E71]'
                  : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521]'
              }`}
            >
              {cat === 'all' ? 'Todas' : getCategoryLabel(cat as PrayerCategory)}
            </button>
          ))}
        </div>
      </div>

      {/* New Prayer Form Modal/Accordion */}
      {showNewPrayerForm && (
        <form onSubmit={handleCreatePrayer} className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#29523F]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Registrar Novo Pedido de Oração
            </h3>
            <button
              type="button"
              onClick={() => setShowNewPrayerForm(false)}
              className="text-xs text-[#7D8882] hover:underline"
            >
              Cancelar
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Motivo do Pedido *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Direção para o novo trabalho ou Paz no lar"
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as PrayerCategory)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="spiritual">Vida Espiritual</option>
                <option value="family">Família</option>
                <option value="health">Saúde & Cura</option>
                <option value="calling">Vocação & Trabalho</option>
                <option value="intercession">Intercessão por Amigos</option>
                <option value="gratitude">Ação de Graças</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Versículos de Base (Opcional)
              </label>
              <input
                type="text"
                value={newVerses}
                onChange={(e) => setNewVerses(e.target.value)}
                placeholder="Ex: Filipenses 4:6, Salmos 91:1"
                className="w-full px-3 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Detalhes ou Contexto da Oração
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descreva a causa pela qual você está intercedendo diante de Deus..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#162E23] text-white text-xs font-semibold"
            >
              Salvar Oração
            </button>
          </div>
        </form>
      )}

      {/* Prayers List */}
      <div className="space-y-3">
        {displayedPrayers.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
            Nenhum pedido de oração nesta categoria.
          </div>
        ) : (
          displayedPrayers.map((prayer) => (
            <div
              key={prayer.id}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#C59B3F]">
                      {getCategoryLabel(prayer.category)}
                    </span>
                    {prayer.answered && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Oração Respondida!</span>
                      </span>
                    )}
                    <span className="text-[11px] text-[#7D8882]">
                      Apresentada {prayer.timesPrayed}x diante de Deus
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                    {prayer.title}
                  </h3>

                  {prayer.description && (
                    <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                      {prayer.description}
                    </p>
                  )}

                  {/* Biblical references attached */}
                  {prayer.scriptureReferences && prayer.scriptureReferences.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs text-[#29523F] dark:text-[#4F8E71]">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>{prayer.scriptureReferences.join(' • ')}</span>
                    </div>
                  )}

                  {/* Testemunho se respondida */}
                  {prayer.answered && prayer.answeredTestimony && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200">
                      <strong className="block font-semibold mb-0.5">Testemunho de Resposta:</strong>
                      "{prayer.answeredTestimony}"
                    </div>
                  )}
                </div>

                {/* Mark Answered Button */}
                <div className="shrink-0">
                  {prayer.answered ? (
                    <button
                      onClick={() => onToggleAnswered(prayer.id)}
                      className="p-1.5 rounded-lg text-xs text-[#7D8882] hover:text-[#19211D]"
                      title="Voltar para ativas"
                    >
                      Editar
                    </button>
                  ) : (
                    <button
                      onClick={() => setAnsweringPrayerId(prayer.id)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Foi Respondida!</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para Registrar Testemunho de Resposta */}
      {answeringPrayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FBFBFA] dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B3F]" />
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Glória a Deus! Oração Respondida
              </h3>
            </div>
            <p className="text-xs text-[#7D8882]">
              Registre o testemunho de como Deus agiu nesta causa para recordar Sua fidelidade no futuro:
            </p>
            <textarea
              rows={3}
              value={testimonyText}
              onChange={(e) => setTestimonyText(e.target.value)}
              placeholder="Conte brevemente o testemunho ou resposta concedida..."
              className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAnsweringPrayerId(null)}
                className="px-3 py-1.5 text-xs text-[#7D8882]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAnswered}
                className="px-4 py-2 rounded-xl bg-[#162E23] text-white text-xs font-semibold"
              >
                Salvar Testemunho
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
