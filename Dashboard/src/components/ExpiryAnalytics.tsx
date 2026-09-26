import React from 'react';
import type { ExpiryItem } from '../types';
import { ShieldAlert, Clock, CheckCircle2, AlertOctagon, Tag, ArrowRight } from 'lucide-react';

interface ExpiryAnalyticsProps {
  expiryItems: ExpiryItem[];
  onApplyClearanceDiscount: (item: ExpiryItem) => void;
}

export const ExpiryAnalytics: React.FC<ExpiryAnalyticsProps> = ({
  expiryItems,
  onApplyClearanceDiscount
}) => {
  const expiringSoon = expiryItems.filter(e => e.status === 'Expiring Soon');
  const expired = expiryItems.filter(e => e.status === 'Expired');
  const rejectedAtBilling = expiryItems.filter(e => e.status === 'Rejected at Billing');

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 shadow-sm border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Expiry Analytics & Smart Billing Counter Guard
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            AI Barcode Guard prevents expired inventory checkout; automated markdown clearance engine
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/20">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Guard Active: 0 Expired Items Sold
        </div>
      </div>

      {/* KPI Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Valid Stock Ratio</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">96.2%</p>
          <p className="text-[10px] text-gray-400">Fresh shelf life guaranteed</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase">Expiring Soon (&lt;7D)</p>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{expiringSoon.length} Batches</p>
          <p className="text-[10px] text-amber-600">Needs clearance discount</p>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase">Quarantined Expired</p>
          <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{expired.length} Batches</p>
          <p className="text-[10px] text-rose-600">Moved to disposal bin</p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">Billing Rejections</p>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{rejectedAtBilling.length} Blocked</p>
          <p className="text-[10px] text-indigo-600">Blocked at cash counter</p>
        </div>
      </div>

      {/* Upcoming Expiry Timeline & Markdown Table */}
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4 text-emerald-500" /> Upcoming Expiry Batches & Clearance Pricing Schedule
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase font-bold">
              <th className="py-2.5 px-3">Batch Code</th>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Units Remaining</th>
              <th className="py-2.5 px-3">Expiry Date</th>
              <th className="py-2.5 px-3">Days Left</th>
              <th className="py-2.5 px-3 text-center">Clearance Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {expiryItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="w-8 h-8 text-amber-300 animate-pulse" />
                    <p className="font-bold text-gray-600 dark:text-gray-300 text-xs">No Expiry Data Found</p>
                    <p className="text-[11px] text-gray-400">Connect your database API to populate batch expiry dates and clearance schedules.</p>
                  </div>
                </td>
              </tr>
            ) : (
              expiryItems.map(item => {
                const isDanger = item.daysRemaining <= 0;
                const isWarning = item.daysRemaining > 0 && item.daysRemaining <= 3;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="py-2.5 px-3 font-bold text-gray-400">{item.batchNumber}</td>
                    <td className="py-2.5 px-3 font-extrabold text-gray-900 dark:text-white">{item.productName}</td>
                    <td className="py-2.5 px-3 text-gray-500">{item.category}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800 dark:text-gray-200">{item.stockQty}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-700 dark:text-gray-300">{item.expiryDate}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-extrabold ${isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.daysRemaining < 0 ? `Expired (${Math.abs(item.daysRemaining)}d ago)` : `${item.daysRemaining} days remaining`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.discountApplied > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                          {item.discountApplied}% Clearance Tag
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">Standard Price</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.daysRemaining > 0 ? (
                        <button
                          onClick={() => onApplyClearanceDiscount(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-all flex items-center gap-1 mx-auto shadow-xs"
                        >
                          <Tag className="w-3 h-3" /> Apply Markdown
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Quarantined
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
