import React, { useState } from 'react';
import type { Product } from '../types';
import { Zap, X, CheckCircle2, IndianRupee } from 'lucide-react';

interface ReorderModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirmReorder: (productId: string, qty: number) => void;
}

export const ReorderModal: React.FC<ReorderModalProps> = ({
  product,
  onClose,
  onConfirmReorder
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(150);
  const [supplier, setSupplier] = useState('Apex Supermarket Wholesale Logistics');

  const estimatedCost = (product.price * 0.70 * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-amber-200/60 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Trigger AI Automated Restock
            </h3>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-4 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/50 border border-amber-100">
            <p className="font-extrabold text-sm text-gray-900 dark:text-white">{product.name}</p>
            <p className="text-gray-500">Category: {product.category} • SKU: {product.id} • Unit Price: ₹{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-4 mt-2 font-semibold">
              <span className="text-rose-600">Current Stock: {product.currentStock} units</span>
              <span className="text-gray-400">Min Buffer: {product.minStockThreshold} units</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Supplier Logistics Network:
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 font-semibold text-gray-900 dark:text-white"
            >
              <option>Apex Supermarket Wholesale Logistics</option>
              <option>Fresh Produce Direct Distributors</option>
              <option>Global Dairy & Beverages Supply</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Reorder Quantity (Units):
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 font-extrabold text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span className="font-bold">Estimated PO Wholesale Cost:</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400">₹{estimatedCost}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-amber-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReorder(product.id, quantity);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Send Purchase Order
          </button>
        </div>

      </div>
    </div>
  );
};
