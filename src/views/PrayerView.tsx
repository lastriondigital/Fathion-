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
  Calendar,
  User,
  AlertCircle,
  Repeat,
  Flame,
  FileText,
  Edit2,
  Trash2,
  Archive,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { PrayerRequest, PrayerCategory, PrayerStatus, PriorityLevel, PrayerPlan } from '../types';
import { PrayerRequestModal } from '../components/prayer/PrayerRequestModal';
import { PrayerPlanModal } from '../components/prayer/PrayerPlanModal';

interface PrayerViewProps {
  prayers: PrayerRequest[];
  onAddPrayer: (prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'answered' | 'timesPrayed'> & { id?: string }) => void;
  onUpdatePrayer?: (id: string, updates: Partial<PrayerRequest>) => void;
  onDeletePrayer?: (id: string) => void;
  onToggleAnswered: (id: string, testimony?: string) => void;
  onSetPrayerStatus?: (id: string, status: PrayerStatus, answer?: string, notes?: string) => void;
  prayerPlans?: PrayerPlan[];
  onAddPrayerPlan?: (plan: Omit<PrayerPlan, 'id' | 'createdAt'> & { id?: string }) => void;
  onUpdatePrayerPlan?: (id: string, updates: Partial<PrayerPlan>) => void;
  onDeletePrayerPlan?: (id: string) => void;
  onOpenTimer: () => void;
  onOpenFastingWithPrayer?: (prayerTitle: string, prayerId?: string) => void;
  onOpenReflection?: (contextTitle: string) => void;
}

const STATUS_FILTERS: { id: PrayerStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'ativo', label: 'Ativos' },
  { id: 'em_oracao', label: 'Em Oração' },
  { id: 'respondido', label: 'Respondidos' },
  { id: 'agradecimento', label: 'Agradecimentos' },
  { id: 'arquivado', label: 'Arquivados' },
];

export const PrayerView: React.FC<PrayerViewProps> = ({
  prayers,
  onAddPrayer,
  onUpdatePrayer,
  onDeletePrayer,
  onToggleAnswered,
  onSetPrayerStatus,
  prayerPlans = [],
  onAddPrayerPlan,
  onUpdatePrayerPlan,
  onDeletePrayerPlan,
  onOpenTimer,
  onOpenFastingWithPrayer,
  onOpenReflection
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'plans'>('requests');
  const [statusFilter, setStatusFilter] = useState<PrayerStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modais de Criação / Edição
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerRequest | null>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PrayerPlan | null>(null);

  // Modal rápido de testemunho
  const [answeringPrayerId, setAnsweringPrayerId] = useState<string | null>(null);
  const [testimonyText, setTestimonyText] = useState('');

  // Filtros aplicados aos pedidos
  const filteredPrayers = prayers.filter(p => {
    const currentStatus = p.status || (p.answered ? 'respondido' : 'ativo');
    if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && p.priority !== selectedPriority) return false;
    return true;
  });

  const getCategoryLabel = (cat: PrayerCategory) => {
    switch (cat) {
      case 'family': return 'Família';
      case 'health': return 'Saúde & Cura';
      case 'spiritual': return 'Vida Espiritual';
      case 'gratitude': return 'Ação de Graças';
      case 'calling': return 'Vocação & Trabalho';
      case 'church': return 'Igreja & Reino';
      case 'intercession': return 'Intercessão';
      default: return 'Geral';
    }
  };

  const getStatusBadge = (status?: PrayerStatus) => {
    switch (status) {
      case 'em_oracao':
        return { label: 'Em oração', bg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300' };
      case 'respondido':
        return { label: 'Respondido!', bg: 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300' };
      case 'agradecimento':
        return { label: 'Agradecimento', bg: 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300' };
      case 'arquivado':
        return { label: 'Arquivado', bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300' };
      case 'ativo':
      default:
        return { label: 'Ativo', bg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300' };
    }
  };

  const getPriorityBadge = (priority?: PriorityLevel) => {
    switch (priority) {
      case 'alta':
        return { label: 'Alta', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200' };
      case 'baixa':
        return { label: 'Baixa', bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200' };
      case 'media':
      default:
        return { label: 'Média', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200' };
    }
  };

  const handleConfirmAnswered = () => {
    if (answeringPrayerId) {
      if (onSetPrayerStatus) {
        onSetPrayerStatus(answeringPrayerId, 'respondido', testimonyText.trim() || undefined);
      } else {
        onToggleAnswered(answeringPrayerId, testimonyText.trim() || undefined);
      }
      setAnsweringPrayerId(null);
      setTestimonyText('');
    }
  };

  const handleSavePrayer = (data: any) => {
    if (data.id && onUpdatePrayer) {
      onUpdatePrayer(data.id, data);
    } else {
      onAddPrayer(data);
    }
    setEditingPrayer(null);
  };

  const handleSavePlan = (data: any) => {
    if (data.id && onUpdatePrayerPlan) {
      onUpdatePrayerPlan(data.id, data);
    } else if (onAddPrayerPlan) {
      onAddPrayerPlan(data);
    }
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Módulo de Oração & Intercessão
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
            Comunhão e Intercessão
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            "A oração feita por um justo pode muito em seus efeitos." — Tiago 5:16
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="open-prayer-timer-btn"
            onClick={onOpenTimer}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-[#C59B3F] hover:bg-amber-100/60 text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-[#C59B3F]" />
            <span>Orar Agora (Timer)</span>
          </button>

          <button
            id="new-prayer-plan-btn"
            onClick={() => {
              setEditingPlan(null);
              setIsPlanModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[#29523F]/30 bg-[#29523F]/5 dark:bg-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] hover:bg-[#29523F]/10 text-xs font-semibold transition-colors"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Criar Plano</span>
          </button>

          <button
            id="new-prayer-request-btn"
            onClick={() => {
              setEditingPrayer(null);
              setIsRequestModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#162E23] dark:bg-[#29523F] text-white hover:bg-[#1F3F30] text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pedido</span>
          </button>
        </div>
      </div>

      {/* Main Mode Tabs: Pedidos vs Planos de Oração */}
      <div className="flex items-center gap-2 border-b border-[#E6E6DF] dark:border-[#24322C] pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'requests'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Pedidos de Oração ({prayers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'plans'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Planos de Oração ({prayerPlans.length})</span>
        </button>
      </div>

      {/* VIEW: PLANOS DE ORAÇÃO */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#7D8882]">
              Planos organizados por frequência, horários do dia e pedidos associados.
            </p>
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsPlanModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Plano</span>
            </button>
          </div>

          {prayerPlans.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
              Nenhum plano de oração criado ainda. Clique em "Criar Plano" para definir horários e recorrência.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prayerPlans.map(plan => {
                const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const daysFormatted = (plan.recurrenceDays || [0,1,2,3,4,5,6])
                  .map(d => dayLabels[d])
                  .join(', ');

                return (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#29523F]/10 dark:bg-[#29523F]/30 text-[#29523F] dark:text-[#4F8E71]">
                            {plan.type === 'diario' ? 'Diário' : plan.type === 'semanal' ? 'Semanal' : 'Personalizado'}
                          </span>
                          <span className="text-xs text-[#7D8882]">
                            ~{plan.targetMinutes} min por sessão
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1">
                          {plan.title}
                        </h3>
                        {plan.description && (
                          <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] mt-0.5">
                            {plan.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsPlanModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
                          title="Editar Plano"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {onDeletePrayerPlan && (
                          <button
                            onClick={() => onDeletePrayerPlan(plan.id)}
                            className="p-1.5 rounded-lg text-[#7D8882] hover:text-rose-600 hover:bg-neutral-100 transition-colors"
                            title="Excluir Plano"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Horários e Recorrência */}
                    <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#19211D] dark:text-[#F1F4F2]">
                        <Clock className="w-3.5 h-3.5 text-[#7D8882]" />
                        <span className="font-semibold">Horários:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(plan.scheduledTimes || ['06:30']).map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[#7D8882]">
                        <Calendar className="w-3.5 h-3.5 text-[#7D8882]" />
                        <span>Recorrência: {daysFormatted}</span>
                      </div>
                    </div>

                    {/* Pedidos vinculados */}
                    {plan.associatedPrayerIds && plan.associatedPrayerIds.length > 0 && (
                      <div className="text-xs text-[#7D8882]">
                        <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                          {plan.associatedPrayerIds.length} pedidos vinculados
                        </span>{' '}
                        a este plano
                      </div>
                    )}

                    {/* Botão de Iniciar Sessão */}
                    <button
                      onClick={onOpenTimer}
                      className="w-full py-2 rounded-xl bg-[#162E23] dark:bg-[#29523F] text-white text-xs font-bold hover:bg-[#1F3F30] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Iniciar Momento de Oração</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: PEDIDOS DE ORAÇÃO */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Barra de Filtros: Estados */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#7D8882] shrink-0 font-semibold mr-1">Estados:</span>
            {STATUS_FILTERS.map(st => {
              const isSelected = statusFilter === st.id;
              const count = st.id === 'all' 
                ? prayers.length 
                : prayers.filter(p => (p.status || (p.answered ? 'respondido' : 'ativo')) === st.id).length;

              return (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#162E23] dark:bg-[#29523F] text-white shadow-xs'
                      : 'bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:bg-neutral-50 dark:hover:bg-[#1B2521]'
                  }`}
                >
                  {st.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Filtros secundários: Categoria & Prioridade */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#7D8882]">Categoria:</span>
              {['all', 'spiritual', 'family', 'health', 'calling', 'church', 'intercession', 'gratitude'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#E6F0EA] dark:bg-[#192D23] font-bold text-[#162E23] dark:text-[#4F8E71]'
                      : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521]'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : getCategoryLabel(cat as PrayerCategory)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[#7D8882]">Prioridade:</span>
              {['all', 'alta', 'media', 'baixa'].map(pri => (
                <button
                  key={pri}
                  onClick={() => setSelectedPriority(pri)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                    selectedPriority === pri
                      ? 'bg-[#162E23] text-white font-bold'
                      : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
                  }`}
                >
                  {pri === 'all' ? 'Todas' : pri}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="space-y-3">
            {filteredPrayers.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
                Nenhum pedido de oração encontrado com os filtros selecionados.
              </div>
            ) : (
              filteredPrayers.map((prayer) => {
                const currentStatus: PrayerStatus = prayer.status || (prayer.answered ? 'respondido' : 'ativo');
                const statusBadge = getStatusBadge(currentStatus);
                const priorityBadge = getPriorityBadge(prayer.priority);

                return (
                  <div
                    key={prayer.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-3 transition-all hover:border-[#29523F]/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        {/* Badges de Categoria, Status, Prioridade, Pessoa e Data */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#1B2521] text-[#4B554F] dark:text-[#B0BBB5] border border-[#E6E6DF] dark:border-[#24322C]">
                            {getCategoryLabel(prayer.category)}
                          </span>

                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>

                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityBadge.bg}`}>
                            {priorityBadge.label}
                          </span>

                          {prayer.person && (
                            <span className="text-[11px] font-medium text-[#162E23] dark:text-[#8E9B93] flex items-center gap-1">
                              <User className="w-3 h-3 text-[#7D8882]" />
                              <span>{prayer.person}</span>
                            </span>
                          )}

                          {prayer.date && (
                            <span className="text-[11px] text-[#7D8882] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#7D8882]" />
                              <span>{prayer.date}</span>
                            </span>
                          )}

                          <span className="text-[11px] text-[#7D8882]">
                            • Apresentada {prayer.timesPrayed}x
                          </span>
                        </div>

                        {/* Título */}
                        <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                          {prayer.title}
                        </h3>

                        {/* Descrição */}
                        {prayer.description && (
                          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                            {prayer.description}
                          </p>
                        )}

                        {/* Referências bíblicas */}
                        {prayer.scriptureReferences && prayer.scriptureReferences.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[#29523F] dark:text-[#4F8E71]">
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>{prayer.scriptureReferences.join(' • ')}</span>
                          </div>
                        )}

                        {/* Notas Devocionais */}
                        {prayer.notes && (
                          <div className="flex items-start gap-1.5 pt-1 text-xs text-[#7D8882]">
                            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7D8882]" />
                            <span><strong className="text-[#19211D] dark:text-[#F1F4F2]">Notas:</strong> {prayer.notes}</span>
                          </div>
                        )}

                        {/* Resposta Concedida / Testemunho */}
                        {(prayer.answer || prayer.answeredTestimony) && (
                          <div className="mt-2 p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 text-xs text-purple-950 dark:text-purple-200">
                            <strong className="flex items-center gap-1 font-bold text-purple-900 dark:text-purple-300 mb-0.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>Resposta & Testemunho do Senhor:</span>
                            </strong>
                            "{prayer.answer || prayer.answeredTestimony}"
                          </div>
                        )}
                      </div>

                      {/* Ações Rápidas */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                        {/* Botão de Marcar Respondida */}
                        {currentStatus !== 'respondido' && currentStatus !== 'agradecimento' ? (
                          <button
                            onClick={() => setAnsweringPrayerId(prayer.id)}
                            className="flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Foi Respondida!</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onSetPrayerStatus) onSetPrayerStatus(prayer.id, 'agradecimento');
                            }}
                            className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200"
                          >
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>Gratidão</span>
                          </button>
                        )}

                        {/* Ações de Estado Rápido: Em Oração / Ativo */}
                        {currentStatus === 'ativo' && onSetPrayerStatus && (
                          <button
                            onClick={() => onSetPrayerStatus(prayer.id, 'em_oracao')}
                            className="py-1 px-2 rounded-lg text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                            title="Mudar status para Em Oração"
                          >
                            Colocar em Clamor
                          </button>
                        )}

                        {/* Ação de Consagrar Jejum por este pedido */}
                        {onOpenFastingWithPrayer && (
                          <button
                            onClick={() => onOpenFastingWithPrayer(prayer.title, prayer.id)}
                            className="p-1.5 rounded-lg text-[#C59B3F] hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            title="Consagrar Jejum por este pedido"
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                        )}

                        {/* Ação de Escrever Reflexão sobre este pedido */}
                        {onOpenReflection && (
                          <button
                            onClick={() => onOpenReflection(`Oração: ${prayer.title}`)}
                            className="p-1.5 rounded-lg text-[#29523F] dark:text-[#4F8E71] hover:bg-emerald-50 dark:hover:bg-[#1B2521] transition-colors"
                            title="Registrar Reflexão Espiritual"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                        {/* Editar */}
                        <button
                          onClick={() => {
                            setEditingPrayer(prayer);
                            setIsRequestModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#7D8882] hover:text-[#19211D] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
                          title="Editar Detalhes"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Excluir */}
                        {onDeletePrayer && (
                          <button
                            onClick={() => onDeletePrayer(prayer.id)}
                            className="p-1.5 rounded-lg text-[#7D8882] hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
                            title="Excluir Pedido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal para Registrar Testemunho de Resposta */}
      {answeringPrayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
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
              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] resize-none"
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

      {/* Modal de Pedido de Oração */}
      <PrayerRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setEditingPrayer(null);
        }}
        onSave={handleSavePrayer}
        initialPrayer={editingPrayer}
        onOpenFastingWithPrayer={onOpenFastingWithPrayer}
      />

      {/* Modal de Plano de Oração */}
      <PrayerPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        initialPlan={editingPlan}
        availablePrayers={prayers}
      />

    </div>
  );
};
