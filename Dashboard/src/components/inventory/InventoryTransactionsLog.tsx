import React, { useState, useEffect } from 'react';
import { History, Download, Filter, Search } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiService';

export const InventoryTransactionsLog: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = typeFilter !== 'All'
        ? `${API_BASE_URL}/inventory/transactions?type=${typeFilter}`
        : `${API_BASE_URL}/inventory/transactions`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e) {
      console.warn('Could not fetch inventory transactions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [typeFilter]);

  const handleExportCSV = () => {
    window.open(`${API_BASE_URL}/reports/inventory?format=csv`, '_blank');
  };

  return (
    <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-gray-900 border border-amber-200/50 dark:border-gray-800 shadow-xl space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" /> Inventory Transaction Audit Log
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Immutable audit record of all stock-in, billing deductions, adjustments, and damaged write-offs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="All">Type: All Transactions</option>
            <option value="STOCK_IN">STOCK_IN</option>
            <option value="SALE">SALE</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
            <option value="DAMAGED">DAMAGED</option>
            <option value="EXPIRED_REMOVAL">EXPIRED_REMOVAL</option>
            <option value="RETURN">RETURN</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-amber-100 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-100/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider border-b border-amber-200/60 dark:border-gray-700">
            <tr>
              <th className="py-3 px-3">Tx ID</th>
              <th className="py-3 px-3">Product ID</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Qty Changed</th>
              <th className="py-3 px-3">Prev → New Qty</th>
              <th className="py-3 px-3">Reason / Reference</th>
              <th className="py-3 px-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">Loading audit log...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">No transaction logs available.</td>
              </tr>
            ) : (
              transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-gray-600 dark:text-gray-400">TX-{tx.id}</td>
                  <td className="py-3 px-3 font-mono">PRD-{tx.product_id}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      tx.transaction_type === 'STOCK_IN' ? 'bg-emerald-100 text-emerald-800' :
                      tx.transaction_type === 'SALE' ? 'bg-blue-100 text-blue-800' :
                      tx.transaction_type === 'DAMAGED' || tx.transaction_type === 'EXPIRED_REMOVAL' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold">
                    <span className={tx.quantity_changed > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.quantity_changed > 0 ? `+${tx.quantity_changed}` : tx.quantity_changed}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{tx.previous_quantity} → {tx.new_quantity}</td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{tx.reason || tx.reference_id || 'N/A'}</td>
                  <td className="py-3 px-3 font-mono text-gray-500">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
