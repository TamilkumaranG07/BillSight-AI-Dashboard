import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategoryData } from '../types';
import { PieChart, IndianRupee, Package, ShoppingBag } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryAnalyticsProps {
  categoryData: CategoryData[];
  darkMode: boolean;
}

export const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({
  categoryData,
  darkMode
}) => {
  const [metricMode, setMetricMode] = useState<'revenue' | 'unitsSold' | 'transactions'>('revenue');

  const totalValue = categoryData.reduce((acc, c) => acc + c[metricMode], 0);

  const doughnutData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c[metricMode]),
        backgroundColor: categoryData.map(c => c.color),
        borderColor: darkMode ? '#1E293B' : '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: {
            family: 'Plus Jakarta Sans',
            weight: '600',
            size: 11
          },
          usePointStyle: true,
          padding: 14
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed;
            const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : 0;
            if (metricMode === 'revenue') {
              return ` ${context.label}: ₹${val.toLocaleString('en-IN')} (${pct}%)`;
            }
            return ` ${context.label}: ${val.toLocaleString('en-IN')} units (${pct}%)`;
          }
        }
      }
    },
    cutout: '68%'
  };

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header & Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Category Sales Distribution
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Revenue (₹) and volume share breakdown across supermarket departments
          </p>
        </div>

        {/* Metric Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-amber-50/70 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              metricMode === 'revenue'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" /> Revenue (₹)
          </button>
          <button
            onClick={() => setMetricMode('unitsSold')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              metricMode === 'unitsSold'
                ? 'bg-yellow-600 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Units Sold
          </button>
          <button
            onClick={() => setMetricMode('transactions')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              metricMode === 'transactions'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Orders
          </button>
        </div>
      </div>

      {/* Grid layout: Chart on Left, Breakdown Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Donut Canvas */}
        <div className="lg:col-span-6 h-64 relative flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          
          {/* Inner Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-28">
            <span className="text-[11px] text-gray-400 font-medium uppercase">Total {metricMode}</span>
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              {metricMode === 'revenue' ? `₹${totalValue.toLocaleString('en-IN')}` : totalValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="lg:col-span-6 space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {categoryData.map((cat) => {
            const val = cat[metricMode];
            const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : '0';

            return (
              <div
                key={cat.category}
                className="p-2.5 rounded-xl bg-amber-50/40 dark:bg-gray-800/40 border border-amber-100 dark:border-gray-800 flex items-center justify-between text-xs hover:bg-amber-100/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-gray-800 dark:text-gray-200">{cat.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    {pct}%
                  </span>
                  <span className="font-extrabold text-gray-900 dark:text-white min-w-[70px] text-right">
                    {metricMode === 'revenue' ? `₹${val.toLocaleString('en-IN')}` : val.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
