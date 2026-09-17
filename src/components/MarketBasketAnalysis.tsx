import React from 'react';
import type { AssociationRule } from '../types';
import { Network, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface MarketBasketAnalysisProps {
  associations: AssociationRule[];
  onApplyAction?: (rule: AssociationRule) => void;
}

export const MarketBasketAnalysis: React.FC<MarketBasketAnalysisProps> = ({
  associations,
  onApplyAction
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 mb-8 shadow-sm border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Market Basket & Product Relationship Analysis
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Apriori data mining algorithm results identifying co-purchasing affinity, support %, confidence %, and lift ratios
          </p>
        </div>
      </div>

      {/* Visual Association Pair Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {associations.slice(0, 3).map((rule) => (
          <div
            key={rule.id}
            className="p-4 rounded-xl glass-panel border border-teal-500/20 dark:border-teal-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  {rule.id}
                </span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs">
                  Lift: {rule.lift}x Strong
                </span>
              </div>

              {/* Product A -> Product B Flow */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 mb-3 border border-gray-100 dark:border-gray-700">
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Trigger Item A</p>
                  <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {rule.productA}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-500 shrink-0" />
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Co-Bought Item B</p>
                  <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {rule.productB}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-3">
                "{rule.suggestedAction}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px]">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">
                Freq: <strong>{rule.purchaseFrequency} orders</strong>
              </span>
              <button
                onClick={() => onApplyAction?.(rule)}
                className="px-2.5 py-1 rounded-lg bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3 h-3" /> Apply Merchandising
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Frequently Bought Together Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-3">Rule ID</th>
              <th className="py-3 px-3">Primary Product (A)</th>
              <th className="py-3 px-3">Associated Product (B)</th>
              <th className="py-3 px-3 text-right">Frequency</th>
              <th className="py-3 px-3 text-right">Support</th>
              <th className="py-3 px-3 text-right">Confidence</th>
              <th className="py-3 px-3 text-right">Lift Ratio</th>
              <th className="py-3 px-3">AI Merchandising Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {associations.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-gray-400">{rule.id}</td>
                <td className="py-3 px-3 font-extrabold text-gray-900 dark:text-white">{rule.productA}</td>
                <td className="py-3 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">{rule.productB}</td>
                <td className="py-3 px-3 text-right font-bold text-gray-700 dark:text-gray-300">{rule.purchaseFrequency}</td>
                <td className="py-3 px-3 text-right text-gray-600 dark:text-gray-400">{(rule.support * 100).toFixed(0)}%</td>
                <td className="py-3 px-3 text-right font-extrabold text-indigo-600 dark:text-indigo-400">{(rule.confidence * 100).toFixed(0)}%</td>
                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    {rule.lift}x
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-600 dark:text-gray-300 font-medium max-w-xs truncate">
                  {rule.suggestedAction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
