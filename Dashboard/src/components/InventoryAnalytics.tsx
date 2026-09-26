import React from 'react';
import type { Product } from '../types';
import { Boxes, AlertTriangle, RefreshCcw, PackageCheck, Zap, ArrowRight } from 'lucide-react';

interface InventoryAnalyticsProps {
  products: Product[];
  onTriggerReorder: (product: Product) => void;
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
  products,
  onTriggerReorder
}) => {
  const lowStockItems = products.filter(p => p.status === 'Low Stock' || p.currentStock <= p.minStockThreshold);
  const overstockedItems = products.filter(p => p.status === 'Overstocked' || p.currentStock >= p.maxStockCapacity * 0.85);
  const fastMovingItems = [...products].sort((a, b) => b.turnoverRate - a.turnoverRate).slice(0, 4);
  const slowMovingItems = [...products].sort((a, b) => a.turnoverRate - b.turnoverRate).slice(0, 4);

  const totalStockCount = products.reduce((acc, p) => acc + p.currentStock, 0);

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 shadow-sm border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Boxes className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Inventory Health & Stock Velocity Analytics
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time stock turnover rates, days of inventory remaining (DIR), and automated replenishment triggers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
          Total On-Hand Inventory: {totalStockCount.toLocaleString()} units
        </div>
      </div>

      {/* Stock Classification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Healthy Stock */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Optimal Stock</span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {products.filter(p => p.status === 'In Stock').length} SKUs
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
            Balanced turnover & demand
          </p>
        </div>

        {/* Low Stock */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock (Reorder)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {lowStockItems.length} SKUs
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
            Below safety buffer threshold
          </p>
        </div>

        {/* Overstocked */}
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Overstocked</span>
            <Boxes className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {overstockedItems.length} SKUs
          </p>
          <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">
            High holding capital cost
          </p>
        </div>

        {/* Stock Turnover */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Turnover Rate</span>
            <RefreshCcw className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            14.2x / yr
          </p>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">
            Supermarket industry benchmark
          </p>
        </div>

      </div>

      {/* Fast vs Slow Moving Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Fast-Moving Items */}
        <div className="p-4 rounded-xl glass-panel border border-emerald-500/20">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" /> Fast-Moving High Turnover Items
          </h3>
          <div className="space-y-2">
            {fastMovingItems.map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.category}</p>
                </div>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {item.turnoverRate}x turnover
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Slow-Moving Items */}
        <div className="p-4 rounded-xl glass-panel border border-rose-500/20">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Slow-Moving / Holding Cost Risk
          </h3>
          <div className="space-y-2">
            {slowMovingItems.map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.category}</p>
                </div>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  {item.turnoverRate}x turnover
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Low Stock Reorder Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Low Stock Items Needing Immediate Reorder
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase font-bold">
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Current Stock</th>
                <th className="py-2.5 px-3 text-right">Min Threshold</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {lowStockItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="py-2.5 px-3 font-bold text-gray-400">{item.id}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">{item.name}</td>
                  <td className="py-2.5 px-3 text-gray-500">{item.category}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-rose-600 dark:text-rose-400">
                    {item.currentStock} units
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-500">{item.minStockThreshold} units</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onTriggerReorder(item)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-all shadow-xs flex items-center gap-1 mx-auto"
                    >
                      <Zap className="w-3 h-3" /> Trigger AI Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
