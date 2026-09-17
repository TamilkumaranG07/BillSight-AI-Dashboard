import React from 'react';
import type { KpiItem } from '../types';
import {
  IndianRupee,
  ShoppingBag,
  PackageCheck,
  TrendingUp,
  Boxes,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface KpiCardsProps {
  kpis: KpiItem[];
  onCardClick?: (kpiId: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, onCardClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <IndianRupee className="w-5 h-5 text-amber-500" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-amber-700" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />;
      default:
        return <IndianRupee className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi) => {
        const isWarning = kpi.alertLevel === 'warning';
        const isDanger = kpi.alertLevel === 'danger';

        return (
          <div
            key={kpi.id}
            onClick={() => onCardClick?.(kpi.id)}
            className={`glass-card rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden group ${
              isDanger
                ? 'border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/20'
                : isWarning
                ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-950/20'
                : 'border-amber-200/50 dark:border-gray-800'
            }`}
          >
            {/* Header Icon + Trend Pill */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${
                isDanger
                  ? 'bg-rose-500/10 dark:bg-rose-500/20'
                  : isWarning
                  ? 'bg-amber-500/10 dark:bg-amber-500/20'
                  : 'bg-amber-50 dark:bg-gray-800'
              }`}>
                {getIcon(kpi.iconName)}
              </div>

              <div
                className={`flex items-center gap-0.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  kpi.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{kpi.changePercent > 0 ? `+${kpi.changePercent}%` : `${kpi.changePercent}%`}</span>
              </div>
            </div>

            {/* KPI Title & Subtitle */}
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              {kpi.title}
            </p>
            
            {/* Large Value */}
            <h3 className="text-2xl font-black text-gray-900 dark:text-white my-1 tracking-tight">
              {kpi.value}
            </h3>

            {/* Subtitle & Sparkline mini bar */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-100 dark:border-gray-800/80 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="truncate">{kpi.subtitle || kpi.periodLabel}</span>
              
              {/* Mini Sparkline Bar Chart */}
              <div className="flex items-end gap-0.5 h-4 w-14">
                {kpi.sparklineData.map((val, idx) => {
                  const maxVal = Math.max(...kpi.sparklineData);
                  const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 20;
                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xs transition-all ${
                        isDanger
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-amber-500 group-hover:bg-yellow-400'
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Subtle glow accent bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${
              isDanger
                ? 'bg-rose-500'
                : isWarning
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity'
            }`} />
          </div>
        );
      })}
    </div>
  );
};
