import React, { useState } from 'react';
import type { Product, ProductCategory } from '../types';
import { Tag, Edit3, Search, Percent, IndianRupee, Boxes, CheckCircle2, RefreshCw, Sparkles, Filter, AlertTriangle } from 'lucide-react';

interface StockPricingManagerProps {
  products: Product[];
  onUpdatePriceDiscount: (productId: string, newPrice: number, discountPercent: number) => void;
  onBatchDiscount: (category: ProductCategory, discountPercent: number) => void;
}

export const StockPricingManager: React.FC<StockPricingManagerProps> = ({
  products,
  onUpdatePriceDiscount,
  onBatchDiscount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Low Stock' | 'In Stock' | 'Overstocked'>('All');
  
  // Modal / Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);

  // Batch Discount state
  const [batchCategory, setBatchCategory] = useState<ProductCategory>('Dairy');
  const [batchDiscountPercent, setBatchDiscountPercent] = useState<number>(10);
  const [showBatchModal, setShowBatchModal] = useState(false);

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

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = stockStatusFilter === 'All' || p.status === stockStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenEdit = (prd: Product) => {
    setEditingProduct(prd);
    setEditPrice(prd.price);
    setEditDiscount((prd as any).discountPercent || 0);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    onUpdatePriceDiscount(editingProduct.id, editPrice, editDiscount);
    setEditingProduct(null);
  };

  const handleApplyBatchDiscount = () => {
    onBatchDiscount(batchCategory, batchDiscountPercent);
    setShowBatchModal(false);
  };

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Available Stock, Pricing & Discount Manager
              <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                Admin Control
              </span>
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monitor real-time inventory on-hand stock and manually modify retail prices and promotional discounts
          </p>
        </div>

        {/* Action Button for Batch Discounts */}
        <button
          onClick={() => setShowBatchModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm shadow-amber-500/20"
        >
          <Percent className="w-3.5 h-3.5" /> Apply Category Festival Discount
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-amber-50/50 dark:bg-gray-800/50 border border-amber-200/40 dark:border-gray-700 text-xs">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
            className="w-full p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium shrink-0">Stock Status:</span>
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value as any)}
            className="w-full p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (Healthy)</option>
            <option value="Low Stock">Low Stock Alert</option>
            <option value="Overstocked">Overstocked</option>
          </select>
        </div>

      </div>

      {/* Stock & Pricing Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-amber-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase font-bold">
              <th className="py-3 px-3">SKU ID</th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-right">Available Stock</th>
              <th className="py-3 px-3">Stock Status</th>
              <th className="py-3 px-3 text-right">Base Price (₹)</th>
              <th className="py-3 px-3 text-center">Active Discount</th>
              <th className="py-3 px-3 text-right">Final Price (₹)</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50 dark:divide-gray-800">
            {filteredProducts.map(prd => {
              const discount = (prd as any).discountPercent || 0;
              const finalPrice = prd.price * (1 - discount / 100);
              const isLow = prd.status === 'Low Stock';

              return (
                <tr key={prd.id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-amber-700 dark:text-amber-400">{prd.id}</td>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                    {prd.name}
                  </td>
                  <td className="py-3 px-3 text-gray-500">{prd.category}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-gray-900 dark:text-white">
                    {prd.currentStock} units
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isLow
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        : prd.status === 'Overstocked'
                        ? 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}>
                      {prd.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-800 dark:text-gray-200">
                    ₹{prd.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {discount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full font-black bg-amber-500 text-white shadow-xs">
                        -{discount}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">No Discount</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                    ₹{finalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleOpenEdit(prd)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-extrabold text-[11px] hover:bg-amber-600 transition-all flex items-center gap-1 mx-auto shadow-xs"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Price / Discount
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Price & Discount Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-amber-200/60 dark:border-gray-700">
            
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Modify Price & Discount
                </h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <p className="font-extrabold text-sm text-gray-900">{editingProduct.name}</p>
                <p className="text-gray-500">Category: {editingProduct.category} • Current Stock: {editingProduct.currentStock} units</p>
              </div>

              {/* Modify Base Price */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Base Unit Price (₹ INR):
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="number"
                    step="0.5"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 font-extrabold text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modify Discount Percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">
                    Discount Percentage (%):
                  </label>
                  <span className="font-black text-amber-600 text-sm">{editDiscount}% OFF</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={editDiscount}
                  onChange={(e) => setEditDiscount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Real-Time Price Preview */}
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-between font-bold">
                <span>Calculated Billing Price:</span>
                <span className="text-lg font-black text-amber-600">
                  ₹{(editPrice * (1 - editDiscount / 100)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-amber-100">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Price & Discount
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Batch Category Discount Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-amber-200/60">
            
            <div className="flex items-center justify-between pb-4 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Apply Batch Festival Discount
                </h3>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="p-1 rounded-lg text-gray-400">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Department / Category:</label>
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value as ProductCategory)}
                  className="w-full p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 font-bold text-gray-900"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Flat Festival Discount (%):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={batchDiscountPercent}
                  onChange={(e) => setBatchDiscountPercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 font-extrabold text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-amber-100">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBatchDiscount}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 shadow-md shadow-amber-500/20"
              >
                Apply Discount to All {batchCategory} Products
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
