import React from 'react';
import { 
  Sun, 
  BookOpen, 
  Layers, 
  Compass, 
  MoreHorizontal 
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface MobileBottomNavProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenMore: () => void;
  isMoreOpen: boolean;
  pendingTasksCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMore,
  isMoreOpen,
  pendingTasksCount
}) => {
  const isMainTab = ['today', 'bible', 'plans', 'journey'].includes(activeTab);
  const isMoreActive = isMoreOpen || (!isMainTab);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBFBFA]/95 dark:bg-[#0C1210]/95 backdrop-blur-lg border-t border-[#E6E6DF] dark:border-[#24322C] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        
        {/* 1. Hoje */}
        <button
          id="mobile-tab-today"
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'today' && !isMoreOpen
              ? 'text-[#162E23] dark:text-[#4F8E71] font-semibold'
              : 'text-[#7D8882] dark:text-[#788780]'
          }`}
        >
          <div className="relative">
            <Sun className="w-5 h-5" />
            {pendingTasksCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#162E23] dark:bg-[#224535] text-white text-[9px] font-bold flex items-center justify-center">
                {pendingTasksCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Hoje</span>
          {activeTab === 'today' && !isMoreOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mt-0.5" />
          )}
        </button>

        {/* 2. Bíblia */}
        <button
          id="mobile-tab-bible"
          onClick={() => onSelectTab('bible')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'bible' && !isMoreOpen
              ? 'text-[#162E23] dark:text-[#4F8E71] font-semibold'
              : 'text-[#7D8882] dark:text-[#788780]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">Bíblia</span>
          {activeTab === 'bible' && !isMoreOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mt-0.5" />
          )}
        </button>

        {/* 3. Planos */}
        <button
          id="mobile-tab-plans"
          onClick={() => onSelectTab('plans')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'plans' && !isMoreOpen
              ? 'text-[#162E23] dark:text-[#4F8E71] font-semibold'
              : 'text-[#7D8882] dark:text-[#788780]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">Planos</span>
          {activeTab === 'plans' && !isMoreOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mt-0.5" />
          )}
        </button>

        {/* 4. Jornada */}
        <button
          id="mobile-tab-journey"
          onClick={() => onSelectTab('journey')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'journey' && !isMoreOpen
              ? 'text-[#162E23] dark:text-[#4F8E71] font-semibold'
              : 'text-[#7D8882] dark:text-[#788780]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">Jornada</span>
          {activeTab === 'journey' && !isMoreOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mt-0.5" />
          )}
        </button>

        {/* 5. Mais */}
        <button
          id="mobile-tab-more"
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isMoreActive
              ? 'text-[#162E23] dark:text-[#4F8E71] font-semibold'
              : 'text-[#7D8882] dark:text-[#788780]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">Mais</span>
          {isMoreActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mt-0.5" />
          )}
        </button>

      </div>
    </nav>
  );
};
