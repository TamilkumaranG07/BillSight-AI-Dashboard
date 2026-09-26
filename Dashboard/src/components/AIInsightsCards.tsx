import React from 'react';
import type { HiddenInsight } from '../types';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface AIInsightsCardsProps {
  insights: HiddenInsight[];
  onSelectInsight?: (insight: HiddenInsight) => void;
}

export const AIInsightsCards: React.FC<AIInsightsCardsProps> = ({
  insights,
  onSelectInsight
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 mb-8 shadow-sm border">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Business Insights & Hidden Patterns
                <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Automated Engine
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time pattern recognition detecting co-purchases, demand surges, anomalies, and stock-out risks
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-Analyze Live Stream
        </button>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          return (
            <div
              key={insight.id}
              onClick={() => onSelectInsight?.(insight)}
              className="p-4 rounded-xl glass-panel border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Top Badge & Impact indicator */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${insight.badgeColor}`}>
                    {insight.type.replace('_', ' ')}
                  </span>

                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> {insight.impact} Impact
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors mb-1.5">
                  {insight.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  "{insight.description}"
                </p>
              </div>

              <div>
                {/* Metrics detail pill */}
                <div className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-3 border border-gray-200/50 dark:border-gray-700/50">
                  {insight.metricsDetail}
                </div>

                {/* Products involved pills */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="truncate max-w-[180px] font-medium">
                    {insight.productsInvolved.join(' + ')}
                  </span>

                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Action <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Accent side bar */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-emerald-500 opacity-80" />
            </div>
          );
        })}
      </div>

    </div>
  );
};
