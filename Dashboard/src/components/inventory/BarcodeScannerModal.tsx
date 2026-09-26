import React, { useState } from 'react';
import type { Product } from '../../types';
import { X, Barcode, Search, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiService';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onAddNewProduct?: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onAddNewProduct
}) => {
  const [barcodeInput, setBarcodeInput] = useState('8901234567890');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleScanLookup = async (codeToLookup: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/barcode/${codeToLookup.strip ? codeToLookup.strip() : codeToLookup}`);
      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      } else {
        setScanResult({ found: false, message: 'Product Not Found', barcode: codeToLookup });
      }
    } catch (e) {
      setScanResult({ found: false, message: 'Server connection offline', barcode: codeToLookup });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-200/60 dark:border-gray-800 overflow-hidden">
        
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5" />
            <h3 className="font-extrabold text-base">POS Barcode Scanner & Lookup</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Enter or Scan Barcode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="e.g. 8901234567890"
                className="flex-1 p-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 font-mono bg-white dark:bg-gray-800"
              />
              <button
                onClick={() => handleScanLookup(barcodeInput)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 flex items-center gap-1"
              >
                <Search className="w-4 h-4" /> Scan
              </button>
            </div>
          </div>

          {/* Preset Barcode Quick Buttons for Demo */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-gray-400 font-bold self-center mr-1">Presets:</span>
            {['8901234567890', '8901396151005', '8901542001253', '9999999999999'].map(bc => (
              <button
                key={bc}
                onClick={() => { setBarcodeInput(bc); handleScanLookup(bc); }}
                className="px-2 py-0.5 rounded-lg bg-amber-50/80 dark:bg-gray-800 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-200"
              >
                {bc}
              </button>
            ))}
          </div>

          {/* Scan Result Container */}
          {scanResult && (
            <div className="mt-4 p-4 rounded-xl border border-amber-200 dark:border-gray-700 bg-amber-50/30 dark:bg-gray-800/40">
              {scanResult.found && scanResult.product ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Product Found in Inventory
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{scanResult.product.name}</h4>
                    <p className="text-xs text-gray-500">Category: {scanResult.product.category?.name || scanResult.product.category}</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">Price: ₹{scanResult.product.selling_price || scanResult.product.price}</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">Current Stock: {scanResult.product.current_quantity || scanResult.product.currentStock} units</p>
                  </div>
                  {onAddToCart && (
                    <button
                      onClick={() => { onAddToCart(scanResult.product); onClose(); }}
                      className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      Add to Billing Cart
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-center py-2">
                  <div className="flex items-center justify-center gap-1.5 text-rose-600 font-extrabold text-xs">
                    <AlertCircle className="w-4 h-4" /> Product Not Found
                  </div>
                  <p className="text-xs text-gray-500">Barcode '{scanResult.barcode || barcodeInput}' is not registered in DB.</p>
                  {onAddNewProduct && (
                    <button
                      onClick={() => { onAddNewProduct(scanResult.barcode || barcodeInput); onClose(); }}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-md flex items-center gap-1.5 mx-auto"
                    >
                      <Plus className="w-4 h-4" /> Add New Product Form
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
