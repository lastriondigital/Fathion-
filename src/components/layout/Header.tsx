import React from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Flame, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { SpiritualProfile } from '../../types';

interface HeaderProps {
  profile: SpiritualProfile;
  streakDays: number;
  onOpenWhatNow: () => void;
  onContinueJourney: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTabTitle: string;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  streakDays,
  onOpenWhatNow,
  onContinueJourney,
  isDarkMode,
  onToggleDarkMode,
  activeTabTitle,
  unreadNotificationsCount = 0,
  onOpenNotifications
}) => {
  // Obter saudação com base na hora
  const now = new Date();
  const hours = now.getHours();
  let greeting = 'Bom dia';
  if (hours >= 12 && hours < 18) greeting = 'Boa tarde';
  else if (hours >= 18 || hours < 5) greeting = 'Boa noite';

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(now);

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/90 dark:bg-[#0C1210]/90 backdrop-blur-md border-b border-[#E6E6DF] dark:border-[#24322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: Mobile App Title & Desktop Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#162E23] dark:bg-[#224535] flex items-center justify-center text-amber-300 shadow-xs">
              <span className="font-serif-scripture font-bold text-lg tracking-tight">F</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#7D8882] dark:text-[#788780] hidden sm:inline">
                  {formattedDate}
                </span>
                <span className="text-xs text-[#C59B3F] font-medium hidden sm:inline">•</span>
                <span className="text-xs font-medium text-[#29523F] dark:text-[#428264] hidden sm:inline">
                  {profile.spiritualFocus}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] tracking-tight">
                {greeting}, {profile.name.split(' ')[0]}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Consistency Streak Badge */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs font-semibold"
            title="Consistência na caminhada cristã"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/30" />
            <span>{streakDays} dias</span>
          </div>

          {/* Botão Principal: O QUE FAÇO AGORA? */}
          <button
            id="btn-o-que-faco-agora"
            onClick={onOpenWhatNow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#D5E6DC] dark:hover:bg-[#224535] border border-[#29523F]/20 transition-all shadow-2xs"
            title="Identificar a próxima atividade relevante"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span className="hidden xs:inline">O QUE FAÇO AGORA?</span>
            <span className="xs:hidden">Agora?</span>
          </button>

          {/* Botão Principal: CONTINUAR JORNADA */}
          <button
            id="btn-continuar-jornada"
            onClick={onContinueJourney}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#162E23] dark:bg-[#224535] text-white hover:bg-[#1F3F30] dark:hover:bg-[#2B5743] transition-all shadow-xs"
          >
            <span>CONTINUAR JORNADA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Internal Notifications Bell */}
          <button
            id="btn-open-notifications"
            onClick={onOpenNotifications}
            aria-label="Notificações e lembretes"
            className="p-2 rounded-lg text-[#7D8882] dark:text-[#788780] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] border border-transparent hover:border-[#E6E6DF] dark:hover:border-[#24322C] transition-colors relative"
            title="Lembretes e avisos da caminhada"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C59B3F] ring-2 ring-white dark:ring-[#0C1210]" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-toggle-dark-mode"
            onClick={onToggleDarkMode}
            aria-label="Alternar tema"
            className="p-2 rounded-lg text-[#7D8882] dark:text-[#788780] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] border border-transparent hover:border-[#E6E6DF] dark:hover:border-[#24322C] transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
