import React, { useState } from 'react';
import type { Product } from '../types';
import { Award, ArrowUpDown, Package, IndianRupee, Layers } from 'lucide-react';

interface MostDemandedProductsProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const MostDemandedProducts: React.FC<MostDemandedProductsProps> = ({
  products,
  onSelectProduct
}) => {
  const [sortBy, setSortBy] = useState<'unitsSold' | 'revenue' | 'transactionsCount'>('unitsSold');

  const sortedProducts = [...products].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 10);
  const totalCategoryRevenue = products.reduce((acc, p) => acc + p.revenue, 0);

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Top 10 Most Demanded Products
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ranked product sales velocity, revenue contribution, and volume breakdown
          </p>
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-1.5 bg-amber-50/70 dark:bg-gray-800 p-1.5 rounded-xl text-xs font-semibold">
          <span className="text-gray-500 dark:text-gray-400 px-2 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort by:
          </span>
          <button
            onClick={() => setSortBy('unitsSold')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortBy === 'unitsSold'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <Package className="w-3 h-3" /> Quantity
          </button>
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortBy === 'revenue'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <IndianRupee className="w-3 h-3" /> Revenue (₹)
          </button>
          <button
            onClick={() => setSortBy('transactionsCount')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortBy === 'transactionsCount'
                ? 'bg-yellow-600 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3 h-3" /> Orders
          </button>
        </div>
      </div>

      {/* Horizontal Bar Chart List */}
      <div className="space-y-4">
        {sortedProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium">
            <Package className="w-8 h-8 text-amber-300 mx-auto mb-2 animate-pulse" />
            <p className="font-bold text-gray-600 dark:text-gray-300 text-xs">No Products Available</p>
            <p className="text-[11px] text-gray-400">Connect your database endpoint to display top demanded product rankings.</p>
          </div>
        ) : (
          sortedProducts.map((prd, index) => {
            const maxVal = Math.max(...sortedProducts.map(p => p[sortBy]));
            const currentVal = prd[sortBy];
            const barWidthPercent = maxVal > 0 ? (currentVal / maxVal) * 100 : 0;
            const sharePercent = totalCategoryRevenue > 0 ? ((prd.revenue / totalCategoryRevenue) * 100).toFixed(1) : '0';

            return (
              <div
                key={prd.id}
                onClick={() => onSelectProduct?.(prd)}
                className="p-3 rounded-xl hover:bg-amber-50/50 dark:hover:bg-gray-800/60 transition-all cursor-pointer border border-transparent hover:border-amber-200/50 dark:hover:border-gray-700/60 group"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  
                  {/* Rank & Product Name */}
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                      index === 0
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/40 ring-2 ring-amber-500/20'
                        : index === 1
                        ? 'bg-amber-400 text-white font-bold'
                        : index === 2
                        ? 'bg-yellow-500 text-white font-bold'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                        {prd.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {prd.category} • SKU: {prd.id} • Unit Price: ₹{prd.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-extrabold text-gray-900 dark:text-white">
                        {sortBy === 'revenue' ? `₹${prd.revenue.toLocaleString('en-IN')}` : prd.unitsSold.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-400 ml-1">
                        {sortBy === 'revenue' ? 'rev' : 'units'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-gray-500 dark:text-gray-400 text-[11px]">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{sharePercent}%</span> share
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prd.status === 'Low Stock' || prd.status === 'Expiring Soon'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        : prd.status === 'Expired'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {prd.status}
                    </span>
                  </div>

                </div>

                {/* Progress Fill Bar */}
                <div className="w-full bg-amber-100/50 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${barWidthPercent}%` }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 group-hover:from-amber-600 group-hover:to-yellow-500"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
