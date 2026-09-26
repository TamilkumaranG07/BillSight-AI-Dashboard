import React, { useState, useMemo } from 'react';
import type { Product } from '../../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit,
  Eye,
  PackageCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (p: Product) => void;
  onManageStock: (p: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onManageStock
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'price' | 'currentStock' | 'expiryDate'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [products, search, selectedCategory, selectedStatus, sortField, sortAsc]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const handleSort = (field: 'name' | 'price' | 'currentStock' | 'expiryDate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-gray-900 border border-amber-200/50 dark:border-gray-800 shadow-xl">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-500" /> Supermarket Product Inventory
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total {filtered.length} active SKUs available across categories
          </p>
        </div>

        <button
          onClick={onAddProduct}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xs shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search product name or barcode..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full py-2 px-3 text-xs rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            {categories.map(c => <option key={c} value={c}>Category: {c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full py-2 px-3 text-xs rounded-xl bg-amber-50/50 dark:bg-gray-800 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Near Expiry">Near Expiry</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-amber-100 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-100/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider border-b border-amber-200/60 dark:border-gray-700">
            <tr>
              <th className="py-3 px-3">SKU / Barcode</th>
              <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Product Name <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
              </th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">Price (₹) <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort('currentStock')}>
                <div className="flex items-center gap-1">Stock Qty <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort('expiryDate')}>
                <div className="flex items-center gap-1">Expiry Date <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
              </th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 dark:divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  No products matched your search filter criteria.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-gray-600 dark:text-gray-400">{p.id}</td>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">{p.name}</td>
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{p.category}</td>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">₹{p.price.toFixed(2)}</td>
                  <td className="py-3 px-3 font-extrabold text-gray-800 dark:text-gray-200">{p.currentStock} units</td>
                  <td className="py-3 px-3 font-mono text-gray-600 dark:text-gray-400">{p.expiryDate}</td>
                  <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onManageStock(p)}
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-bold text-[11px]"
                        title="Stock Actions (Stock-In / Adjust)"
                      >
                        Stock-In
                      </button>
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div>
          Showing page {currentPage} of {totalPages} ({filtered.length} total SKUs)
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-amber-200 dark:border-gray-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-lg border border-amber-200 dark:border-gray-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
