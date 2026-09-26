import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { X, Barcode, Camera, Sparkles, AlertCircle } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (productData: any) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave
}) => {
  const [productCode, setProductCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [barcode, setBarcode] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [minStock, setMinStock] = useState(15);
  const [initialBatch, setInitialBatch] = useState('BATCH-001');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [initialQty, setInitialQty] = useState(20);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setProductCode(productToEdit.id);
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setBarcode(productToEdit.id);
      setSellingPrice(productToEdit.price);
      setPurchasePrice(Math.round(productToEdit.price * 0.8));
      setMinStock(productToEdit.minStockThreshold || 15);
      setExpiryDate(productToEdit.expiryDate || '2026-12-31');
    } else {
      const randCode = `PRD-${Math.floor(100000 + Math.random() * 900000)}`;
      setProductCode(randCode);
      setName('');
      setCategory('Dairy');
      setBarcode('8901234567890');
      setSellingPrice(50);
      setPurchasePrice(40);
      setMinStock(15);
      setInitialBatch(`BATCH-${Math.floor(100 + Math.random() * 900)}`);
      setExpiryDate('2026-12-31');
      setInitialQty(20);
    }
    setErrorMsg(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product Name is required.');
      return;
    }
    if (!barcode.trim()) {
      setErrorMsg('Barcode is required.');
      return;
    }
    if (sellingPrice < 0 || purchasePrice < 0) {
      setErrorMsg('Prices must be greater than or equal to 0.');
      return;
    }

    onSave({
      product_code: productCode,
      name,
      category_id: 1,
      barcode,
      supplier_id: 1,
      selling_price: Number(sellingPrice),
      purchase_price: Number(purchasePrice),
      minimum_stock_level: Number(minStock),
      initial_batch_number: initialBatch,
      initial_expiry_date: expiryDate,
      initial_quantity: Number(initialQty)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-200/60 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5" />
            <h3 className="font-extrabold text-base">
              {productToEdit ? 'Edit Product Details' : 'Add New Supermarket Product'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Product Code</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-mono bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Snacks & Confectionery">Snacks & Confectionery</option>
                <option value="Beverages">Beverages</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Amul Fresh Toned Milk 500ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Barcode (EAN-13)</label>
              <div className="relative">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full p-2 pr-8 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setBarcode('8901234567890')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-600"
                  title="Generate valid barcode"
                >
                  <Barcode className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Min Stock Threshold</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.5"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-emerald-600 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                step="0.5"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Initial Batch & AI Expiry Capture Slot */}
          {!productToEdit && (
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-gray-800/60 border border-amber-200/60 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Initial Stock & Batch Details
                </span>
                
                {/* Expiry Capture Component Plug-in Placeholder */}
                <button
                  type="button"
                  onClick={() => alert("AI Camera OCR Expiry Date Detector extension point triggered. (See docs/expiry-detection-roadmap.md)")}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold hover:bg-amber-500/30 flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> Scan Expiry Date
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={initialBatch}
                    onChange={(e) => setInitialBatch(e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={initialQty}
                    onChange={(e) => setInitialQty(Number(e.target.value))}
                    className="w-full p-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 font-bold bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-md hover:from-amber-600 hover:to-yellow-600"
            >
              Save Product SKU
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
