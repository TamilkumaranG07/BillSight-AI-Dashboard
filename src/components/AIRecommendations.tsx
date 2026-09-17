import React from 'react';
import type { Recommendation } from '../types';
import { Sparkles, CheckCircle2, Zap, ArrowRight, XCircle } from 'lucide-react';

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onApplyRecommendation
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 mb-8 shadow-sm border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Automated Recommendation Panel
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Prescriptive decision support engine converting inventory, sales velocity, and basket affinity into 1-click admin actions
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isImmediate = rec.urgency === 'Immediate';
          const isRecommended = rec.urgency === 'Recommended';

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                rec.applied
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                  : isImmediate
                  ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30'
                  : 'glass-panel border-gray-200 dark:border-gray-700/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isImmediate
                      ? 'bg-amber-500 text-white shadow-xs'
                      : isRecommended
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {rec.category} • {rec.urgency}
                  </span>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mt-2">
                    {rec.title}
                  </h3>
                </div>

                {rec.applied && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Action Applied
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 my-2 leading-relaxed">
                {rec.description}
              </p>

              <div className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-xs font-bold text-gray-800 dark:text-gray-200 my-3 border border-gray-200/60 dark:border-gray-700/60 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Strategy: "{rec.suggestedAction}"</span>
              </div>

              {!rec.applied && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => onApplyRecommendation(rec.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Apply AI Recommendation
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
