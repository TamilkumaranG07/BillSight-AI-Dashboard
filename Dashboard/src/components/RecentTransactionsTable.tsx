import React, { useState } from 'react';
import type { Transaction } from '../types';
import { ShoppingCart, Search, Download, CheckCircle2, XCircle } from 'lucide-react';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onSelectTransaction?: (txn: Transaction) => void;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onSelectTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Rejected (Expired)' | 'Refunded'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  let filtered = transactions.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.productNames.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Transaction ID,Timestamp,Customer,Items,Total Amount,Payment Method,Status']
        .concat(
          filtered.map(
            t =>
              `${t.id},"${t.timestamp}","${t.customerName}",${t.itemsCount},"₹${t.totalAmount.toFixed(2)}","${t.paymentMethod}","${t.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supermarket_transactions_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Real-Time Checkout Transactions Ledger
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Detailed ledger of scanned item carts, checkout counter IDs, payment gateways, and verification status
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-50/60 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Rejected (Expired)">Rejected (Expired)</option>
            <option value="Refunded">Refunded</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search TXN ID / Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-amber-50/60 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 transition-all shadow-sm shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" /> CSV Report
          </button>

        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-amber-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase font-bold">
              <th className="py-3 px-3">Transaction ID</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Cart Contents</th>
              <th className="py-3 px-3 text-right">Total Amount (₹)</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Counter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50 dark:divide-gray-800">
            {paginated.map(txn => {
              const isCompleted = txn.status === 'Completed';
              const isRejected = txn.status.includes('Rejected');

              return (
                <tr
                  key={txn.id}
                  onClick={() => onSelectTransaction?.(txn)}
                  className="hover:bg-amber-50/40 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-extrabold text-amber-700 dark:text-amber-400">{txn.id}</td>
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400 font-mono text-[11px]">{txn.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">{txn.customerName}</td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    <span className="font-bold text-gray-900 dark:text-white">({txn.itemsCount} items):</span>{' '}
                    {txn.productNames.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-gray-900 dark:text-white text-sm">
                    ₹{txn.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-300">{txn.paymentMethod}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : isRejected
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-400 text-[11px] font-semibold">{txn.counterId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-100 dark:border-gray-800 text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filtered.length} transactions)
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-gray-800 disabled:opacity-40 font-bold"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-gray-800 disabled:opacity-40 font-bold"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};
