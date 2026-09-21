import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  colorScheme = 'indigo'
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50/50 border-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50/50 border-amber-100 text-amber-600',
    blue: 'bg-blue-50/50 border-blue-100 text-blue-600',
    rose: 'bg-rose-50/50 border-rose-100 text-rose-600',
  };

  const iconBgMap = {
    indigo: 'bg-indigo-100/80 text-indigo-700',
    emerald: 'bg-emerald-100/80 text-emerald-700',
    amber: 'bg-amber-100/80 text-amber-700',
    blue: 'bg-blue-100/80 text-blue-700',
    rose: 'bg-rose-100/80 text-rose-700',
  };

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 border ${colorMap[colorScheme]} relative overflow-hidden bg-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${iconBgMap[colorScheme]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span className={trendPositive ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
          <span className="text-slate-400">so với tháng trước</span>
        </div>
      )}
    </div>
  );
};
