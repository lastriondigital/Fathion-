import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsMetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: {
    label: string;
    variant?: 'neutral' | 'emerald' | 'amber' | 'sky';
  };
  highlight?: boolean;
}

export const StatsMetricCard: React.FC<StatsMetricCardProps> = ({
  id,
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  iconColor = 'text-[#29523F] dark:text-[#4F8E71]',
  iconBg = 'bg-[#F2F7F4] dark:bg-[#1B2521]',
  badge,
  highlight = false
}) => {
  return (
    <div 
      id={id}
      className={`p-4 rounded-xl border transition-all duration-200 ${
        highlight 
          ? 'bg-[#F4F8F5] dark:bg-[#16231D] border-[#C2D8CD] dark:border-[#2C4236] shadow-xs' 
          : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] shadow-2xs hover:border-[#D1D9D4] dark:hover:border-[#33443C]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[#617068] dark:text-[#9AA8A1] truncate">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#19211D] dark:text-[#F1F4F2]">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-[#7D8882] dark:text-[#8B9891]">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-[#F0F2EF] dark:border-[#1E2924]">
        {subtext ? (
          <span className="text-[11px] text-[#7D8882] dark:text-[#8B9891] truncate">
            {subtext}
          </span>
        ) : <span />}

        {badge && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shrink-0 ${
            badge.variant === 'emerald'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : badge.variant === 'amber'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              : badge.variant === 'sky'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
              : 'bg-[#F2F7F4] dark:bg-[#1C2822] text-[#4B554F] dark:text-[#A7B3AC] border border-[#E6E6DF] dark:border-[#2A3B33]'
          }`}>
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );
};
