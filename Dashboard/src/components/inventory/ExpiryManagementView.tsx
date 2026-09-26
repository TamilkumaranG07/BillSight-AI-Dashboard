import React, { useState } from 'react';
import type { ExpiryItem } from '../../types';
import { StatusBadge } from './StatusBadge';
import { ShieldAlert, Calendar, Tag, AlertCircle, RefreshCw } from 'lucide-react';

interface ExpiryManagementViewProps {
  expiryItems: ExpiryItem[];
  onApplyClearance: (item: ExpiryItem) => void;
}

export const ExpiryManagementView: React.FC<ExpiryManagementViewProps> = ({
  expiryItems,
  onApplyClearance
}) => {
  const [tab, setTab] = useState<'all' | 'near_expiry' | 'expired'>('all');

  const filteredItems = expiryItems.filter(item => {
    if (tab === 'near_expiry') return item.daysRemaining >= 0 && item.daysRemaining <= 7;
    if (tab === 'expired') return item.daysRemaining < 0;
    return true;
  });

  return (
    <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-gray-900 border border-amber-200/50 dark:border-gray-800 shadow-xl space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" /> Expiry Guard & Batch Tracker
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Automated monitoring of batch expiry dates, days remaining, and markdown clearance triggers
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1 p-1 bg-amber-50 dark:bg-gray-800 rounded-xl border border-amber-200/60 dark:border-gray-700 text-xs font-bold">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${tab === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400'}`}
          >
            All Batches ({expiryItems.length})
          </button>
          <button
            onClick={() => setTab('near_expiry')}
            className={`px-3 py-1.5 rounded-lg transition-all ${tab === 'near_expiry' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Near Expiry (≤7 days)
          </button>
          <button
            onClick={() => setTab('expired')}
            className={`px-3 py-1.5 rounded-lg transition-all ${tab === 'expired' ? 'bg-rose-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-amber-100 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-100/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider border-b border-amber-200/60 dark:border-gray-700">
            <tr>
              <th className="py-3 px-3">Product</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Batch Number</th>
              <th className="py-3 px-3">Available Qty</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3">Days Left</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 dark:divide-gray-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-400">
                  No batch records found for this category.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">{item.productName}</td>
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{item.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-gray-600 dark:text-gray-400">{item.batchNumber}</td>
                  <td className="py-3 px-3 font-extrabold text-gray-800 dark:text-gray-200">{item.stockQty} units</td>
                  <td className="py-3 px-3 font-mono">{item.expiryDate}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${item.daysRemaining < 0 ? 'text-rose-600' : item.daysRemaining <= 7 ? 'text-orange-500' : 'text-emerald-600'}`}>
                      {item.daysRemaining < 0 ? `${Math.abs(item.daysRemaining)} days ago` : `${item.daysRemaining} days`}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.daysRemaining < 0 ? 'EXPIRED' : item.daysRemaining <= 7 ? 'NEAR_EXPIRY' : 'VALID'} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.daysRemaining <= 7 && item.daysRemaining >= 0 ? (
                      <button
                        onClick={() => onApplyClearance(item)}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-700 dark:text-orange-300 font-bold hover:bg-orange-500/25 transition-all flex items-center gap-1 ml-auto text-[11px]"
                      >
                        <Tag className="w-3 h-3" /> Apply 30% Tag
                      </button>
                    ) : item.daysRemaining < 0 ? (
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200">
                        Blocked from Sale
                      </span>
                    ) : (
                      <span className="text-gray-400">Normal</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
