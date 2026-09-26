import React from 'react';
import type { FilterState, DateRangePreset, ProductCategory, PaymentMethod } from '../types';
import { Calendar, RefreshCw, CreditCard, Tag } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const dateRanges: { id: DateRangePreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const categories: ProductCategory[] = [
    'All',
    'Beverages',
    'Snacks',
    'Dairy',
    'Bakery',
    'Fruits & Vegetables',
    'Personal Care',
    'Household'
  ];

  const paymentMethods: PaymentMethod[] = [
    'All',
    'Cash',
    'Credit Card',
    'UPI / QR',
    'Smart Wallet'
  ];

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-4 my-6 shadow-sm border border-amber-200/50 dark:border-gray-800 transition-all">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Date Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Date:
          </div>
          {dateRanges.map(range => (
            <button
              key={range.id}
              onClick={() => onFilterChange({ dateRange: range.id })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filters.dateRange === range.id
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-500/20'
                  : 'bg-amber-50/60 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Reset */}
        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-amber-50/60 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-gray-700 text-xs">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Category:</span>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value as ProductCategory })}
              className="bg-transparent font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="flex items-center gap-1.5 bg-amber-50/60 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-gray-700 text-xs">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Payment:</span>
            <select
              value={filters.paymentMethod}
              onChange={(e) => onFilterChange({ paymentMethod: e.target.value as PaymentMethod })}
              className="bg-transparent font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
            >
              {paymentMethods.map(pm => (
                <option key={pm} value={pm} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-gray-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all ml-auto lg:ml-0"
            title="Reset to Default Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>

        </div>

      </div>
    </div>
  );
};
