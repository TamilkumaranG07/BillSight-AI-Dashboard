import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let bgClass = 'bg-gray-100 text-gray-800 border-gray-300';
  let dotClass = 'bg-gray-500';
  let label = status;

  if (normalized === 'IN_STOCK' || normalized === 'VALID') {
    bgClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    dotClass = 'bg-emerald-500';
    label = normalized === 'IN_STOCK' ? 'In Stock' : 'Valid';
  } else if (normalized === 'LOW_STOCK' || normalized === 'REORDER_SOON') {
    bgClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    dotClass = 'bg-amber-500';
    label = 'Low Stock';
  } else if (normalized === 'OUT_OF_STOCK' || normalized === 'REORDER_NOW') {
    bgClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    dotClass = 'bg-rose-500 animate-pulse';
    label = 'Out of Stock';
  } else if (normalized === 'NEAR_EXPIRY' || normalized === 'EXPIRING_SOON') {
    bgClass = 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    dotClass = 'bg-orange-500';
    label = 'Near Expiry';
  } else if (normalized === 'EXPIRED') {
    bgClass = 'bg-red-900/10 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-800/40';
    dotClass = 'bg-red-700';
    label = 'Expired';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      {label}
    </span>
  );
};
