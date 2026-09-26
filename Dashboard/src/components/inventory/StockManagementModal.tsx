import React, { useState } from 'react';
import type { Product } from '../../types';
import { X, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface StockManagementModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirmAction: (productId: string, actionData: any) => void;
}

export const StockManagementModal: React.FC<StockManagementModalProps> = ({
  product,
  onClose,
  onConfirmAction
}) => {
  const [transactionType, setTransactionType] = useState<'STOCK_IN' | 'ADJUSTMENT' | 'DAMAGED' | 'EXPIRED_REMOVAL'>('STOCK_IN');
  const [batchNumber, setBatchNumber] = useState('BATCH-001');
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Stock-in purchase order received');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('A valid reason is required for stock audit history.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than 0.');
      return;
    }

    onConfirmAction(product.id, {
      transaction_type: transactionType,
      batch_number: batchNumber,
      quantity: Number(quantity),
      reason,
      expiry_date: expiryDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-200/60 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5" />
            <div>
              <h3 className="font-extrabold text-base">Inventory Stock Action</h3>
              <p className="text-[11px] text-amber-100 font-medium">{product.name} (Code: {product.id})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current Stock Banner */}
          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400">Current On-Hand Stock:</span>
            <span className="font-extrabold text-sm text-amber-800 dark:text-amber-300">{product.currentStock} units</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Stock Action Type</label>
            <select
              value={transactionType}
              onChange={(e) => {
                const val = e.target.value as any;
                setTransactionType(val);
                if (val === 'STOCK_IN') setReason('Stock-in purchase order received');
                else if (val === 'DAMAGED') setReason('Damaged goods write-off');
                else if (val === 'EXPIRED_REMOVAL') setReason('Expired batch removal');
                else setReason('Inventory audit count adjustment');
              }}
              className="w-full p-2.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="STOCK_IN">+ STOCK_IN (Receiving / Purchase Order)</option>
              <option value="ADJUSTMENT">± ADJUSTMENT (Physical Inventory Count)</option>
              <option value="DAMAGED">- DAMAGED (Removal of Spoiled Stock)</option>
              <option value="EXPIRED_REMOVAL">- EXPIRED_REMOVAL (Clearance of Expired Batches)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Quantity Magnitude</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-bold bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {transactionType === 'STOCK_IN' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Batch Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Reason / Notes (Required)</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for stock change..."
              className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-md hover:from-amber-600 hover:to-yellow-600 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Commit Stock Change
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
