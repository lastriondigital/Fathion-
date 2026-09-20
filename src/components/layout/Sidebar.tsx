import React from 'react';
import { 
  Sun, 
  BookOpen, 
  Layers, 
  HeartHandshake, 
  Flame, 
  Compass, 
  BarChart3, 
  Settings,
  Calendar,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';

export type NavTabId = 'today' | 'routine' | 'bible' | 'plans' | 'prayer' | 'fasting' | 'journey' | 'stats' | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  pendingTasksCount: number;
  activePrayersCount: number;
  isFastingActive: boolean;
  pendingAdaptationsCount?: number;
}

interface NavItemDef {
  id: NavTabId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
  activePrayersCount,
  isFastingActive,
  pendingAdaptationsCount = 0
}) => {
  const navItems: NavItemDef[] = [
    { 
      id: 'today', 
      label: 'Hoje', 
      icon: Sun,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-[#29523F] text-white'
    },
    {
      id: 'routine',
      label: 'Rotina & Objetivos',
      icon: Sliders,
      badge: pendingAdaptationsCount > 0 ? `${pendingAdaptationsCount} adapt.` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    { 
      id: 'bible', 
      label: 'Bíblia', 
      icon: BookOpen 
    },
    { 
      id: 'plans', 
      label: 'Planos', 
      icon: Layers 
    },
    { 
      id: 'prayer', 
      label: 'Oração', 
      icon: HeartHandshake,
      badge: activePrayersCount > 0 ? activePrayersCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
    },
    { 
      id: 'fasting', 
      label: 'Jejum', 
      icon: Flame,
      badge: isFastingActive ? 'Ativo' : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
    },
    { 
      id: 'journey', 
      label: 'Jornada', 
      icon: Compass 
    },
    { 
      id: 'stats', 
      label: 'Estatísticas', 
      icon: BarChart3 
    },
    { 
      id: 'settings', 
      label: 'Configurações', 
      icon: Settings 
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] min-h-[calc(100vh-57px)]">
      
      {/* Brand Tagline */}
      <div className="px-5 py-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#7D8882] dark:text-[#788780]">
          Guia de Caminhada
        </div>
        <div className="text-xs text-[#4B554F] dark:text-[#B0BBB5] font-serif-scripture italic mt-0.5">
          "Planejar • Executar • Monitorar • Adaptar"
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#162E23] text-white shadow-2xs dark:bg-[#224535]'
                  : 'text-[#4B554F] dark:text-[#B0BBB5] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#7D8882] dark:text-[#788780]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-neutral-200 text-neutral-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Principle Footer Box */}
      <div className="p-4 m-3 rounded-xl bg-[#F2F7F4] dark:bg-[#141C19] border border-[#29523F]/15 dark:border-[#29523F]/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#162E23] dark:text-[#4F8E71]">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Foco do Momento</span>
        </div>
        <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] mt-1 line-clamp-2">
          "Aquietai-vos e sabei que Eu sou Deus."
        </p>
        <div className="mt-2 text-[10px] text-[#7D8882] dark:text-[#788780] font-medium">
          Salmos 46:10
        </div>
      </div>
    </aside>
  );
};
