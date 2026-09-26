import React, { useState, useMemo, useEffect } from 'react';
import type { FilterState, Product, ExpiryItem, ProductCategory, Transaction } from './types';
import { computeAnalytics } from './services/analyticsEngine';
import { INITIAL_PRODUCTS, INITIAL_RECOMMENDATIONS, INITIAL_TRANSACTIONS } from './data/mockData';
import { dbService, API_BASE_URL } from './services/apiService';
import { useInventorySocket } from './hooks/useInventorySocket';

// Components
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { SalesAnalyticsChart } from './components/SalesAnalyticsChart';
import { MostDemandedProducts } from './components/MostDemandedProducts';
import { CategoryAnalytics } from './components/CategoryAnalytics';
import { PeakSalesHeatmap } from './components/PeakSalesHeatmap';
import { SalesForecast } from './components/SalesForecast';
import { ExpiryAnalytics } from './components/ExpiryAnalytics';
import { StockPricingManager } from './components/StockPricingManager';
import { ReorderModal } from './components/ReorderModal';
import { NotificationDrawer } from './components/NotificationDrawer';

// New Inventory Management Components
import { ProductTable } from './components/inventory/ProductTable';
import { AddProductModal } from './components/inventory/AddProductModal';
import { StockManagementModal } from './components/inventory/StockManagementModal';
import { ExpiryManagementView } from './components/inventory/ExpiryManagementView';
import { InventoryTransactionsLog } from './components/inventory/InventoryTransactionsLog';
import { BarcodeScannerModal } from './components/inventory/BarcodeScannerModal';

import { CheckCircle2, ShieldCheck, Barcode, PackageCheck, History, Plus } from 'lucide-react';

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('Tamilkumaran G');
  const [adminRole, setAdminRole] = useState<string>('Store Administrator');

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Navigation state
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Interactive state
  const [productsState, setProductsState] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [stockManageProduct, setStockManageProduct] = useState<Product | null>(null);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState<boolean>(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reorderProduct, setReorderProduct] = useState<Product | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Toast Trigger Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time WebSocket connection
  const { status: socketStatus } = useInventorySocket((msg) => {
    if (msg.type === 'inventory_updated' || msg.type === 'sale_completed' || msg.type === 'product_created') {
      showToast(`Real-time update: ${msg.type.replace('_', ' ')} received!`);
      loadBackendData();
    }
  });

  // Fetch data from FastAPI / SQLite Web_app backend on load
  const loadBackendData = async () => {
    try {
      const [dbProducts, dbTransactions] = await Promise.all([
        dbService.fetchProducts(),
        dbService.fetchTransactions()
      ]);
      if (dbProducts && dbProducts.length > 0) {
        setProductsState(dbProducts);
        setIsBackendConnected(true);
      }
      if (dbTransactions && dbTransactions.length > 0) {
        setTransactionsState(dbTransactions);
      }
    } catch (err) {
      console.warn('Could not fetch from inventory backend:', err);
    }
  };

  useEffect(() => {
    loadBackendData();
    const interval = setInterval(loadBackendData, 15000); // 15s fallback polling
    return () => clearInterval(interval);
  }, []);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    category: 'All',
    paymentMethod: 'All',
    searchQuery: ''
  });

  // Dynamic Analytics Calculation
  const analytics = useMemo(() => {
    return computeAnalytics(filters, INITIAL_RECOMMENDATIONS, productsState, transactionsState);
  }, [filters, productsState, transactionsState]);

  // Handlers
  const handleLoginSuccess = (name: string, role: string) => {
    setAdminName(name || 'Tamilkumaran G');
    setAdminRole(role || 'Store Administrator');
    setIsAuthenticated(true);
    showToast(`Welcome back, ${name || 'Tamilkumaran G'}! BillSightAI ready.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Logged out of BillSightAI session.');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'today',
      category: 'All',
      paymentMethod: 'All',
      searchQuery: ''
    });
    showToast('Global filters reset to default');
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast(`Product '${productData.name}' saved successfully!`);
        loadBackendData();
      } else {
        const err = await res.json();
        showToast(`Error saving product: ${err.detail || 'Validation error'}`);
      }
    } catch (e) {
      showToast('Could not save product to backend');
    }
  };

  const handleConfirmStockAction = async (productId: string, actionData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
      if (res.ok) {
        showToast(`Stock updated for Product SKU ${productId}`);
        loadBackendData();
      } else {
        const err = await res.json();
        showToast(`Stock action error: ${err.detail || 'Failed'}`);
      }
    } catch (e) {
      showToast('Could not reach backend server');
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (window.confirm(`Are you sure you want to deactivate/delete product ${p.name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/products/${p.id}`, { method: 'DELETE' });
        showToast(`Product ${p.name} removed/deactivated.`);
        loadBackendData();
      } catch (e) {
        showToast('Error deleting product');
      }
    }
  };

  const handleApplyClearanceDiscount = (item: ExpiryItem) => {
    showToast(`Applied 30% yellow-tag clearance markdown to ${item.productName}!`);
  };

  const handleUpdatePriceDiscount = (productId: string, newPrice: number, discountPercent: number) => {
    setProductsState(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedRevenue = Math.round(p.unitsSold * newPrice * (1 - discountPercent / 100));
          return {
            ...p,
            price: newPrice,
            revenue: updatedRevenue,
            discountPercent
          } as Product;
        }
        return p;
      })
    );
    dbService.updatePriceAndDiscount(productId, newPrice, discountPercent).then(() => loadBackendData());
    showToast(`Updated price (₹${newPrice.toFixed(2)}) & discount (${discountPercent}%) for SKU ${productId}!`);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-[#FAF8F5] text-slate-800'}`}>
      
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeSection={activeSection}
        onSelectSection={scrollToSection}
        unreadNotifications={4}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        adminName={adminName}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Module Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-600/10 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Inventory Management & FEFO Billing Control
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time stock deduction • Barcode lookup • FEFO batch allocation • Expiry alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBarcodeScannerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-all flex items-center gap-1.5"
            >
              <Barcode className="w-4 h-4" /> Barcode Scanner
            </button>
            <button
              onClick={() => { setProductToEdit(null); setIsAddProductOpen(true); }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
        
        {/* Global Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Section 1: Overview KPI Cards */}
        <section id="overview" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Real-Time Overview & Inventory Metrics
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live statistics • Socket connection: <span className="font-bold uppercase text-emerald-600">{socketStatus}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Authenticated: {adminName}
            </div>
          </div>
          
          <KpiCards kpis={analytics.kpis} />
        </section>

        {/* Section: Inventory Products Table */}
        <section id="stock-pricing" className="scroll-mt-24">
          <ProductTable
            products={productsState}
            onAddProduct={() => { setProductToEdit(null); setIsAddProductOpen(true); }}
            onEditProduct={(p) => { setProductToEdit(p); setIsAddProductOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            onManageStock={(p) => setStockManageProduct(p)}
          />
        </section>

        {/* Section 2: Sales Analytics Chart */}
        <section id="sales-analytics" className="scroll-mt-24">
          <SalesAnalyticsChart
            timeSeriesData={analytics.salesTimeSeries}
            darkMode={darkMode}
            totalRevenue={analytics.totals.revenue}
            totalOrders={analytics.totals.orders}
          />
        </section>

        {/* Section 3 & 4: Top Demanded Products + Category Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section id="top-products" className="lg:col-span-7 scroll-mt-24">
            <MostDemandedProducts
              products={analytics.topProducts}
              onSelectProduct={(p) => setStockManageProduct(p)}
            />
          </section>

          <section id="categories" className="lg:col-span-5 scroll-mt-24">
            <CategoryAnalytics
              categoryData={analytics.categoryDistribution}
              darkMode={darkMode}
            />
          </section>
        </div>

        {/* Section: Expiry Guard Analytics & Batch Management */}
        <section id="expiry" className="scroll-mt-24">
          <ExpiryManagementView
            expiryItems={analytics.expiryItems}
            onApplyClearance={handleApplyClearanceDiscount}
          />
        </section>

        {/* Section: Inventory Audit Transaction Logs */}
        <section id="audit-log" className="scroll-mt-24">
          <InventoryTransactionsLog />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-200/60 dark:border-gray-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400 bg-white/50">
        <p className="font-bold text-gray-800 dark:text-gray-200">
          BillSightAI - Smart Supermarket Billing & Inventory System
        </p>
        <p className="text-[11px] mt-1 text-gray-400">
          Logged in Administrator: {adminName} ({adminRole}) • Real-time FEFO Stock Management Enabled
        </p>
      </footer>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gray-900 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-amber-500/50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        productToEdit={productToEdit}
        onClose={() => setIsAddProductOpen(false)}
        onSave={handleSaveProduct}
      />

      <StockManagementModal
        product={stockManageProduct}
        onClose={() => setStockManageProduct(null)}
        onConfirmAction={handleConfirmStockAction}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onAddNewProduct={(barcode) => {
          setProductToEdit(null);
          setIsAddProductOpen(true);
        }}
      />

      <ReorderModal
        product={reorderProduct}
        onClose={() => setReorderProduct(null)}
        onConfirmReorder={(productId, qty) => {
          handleConfirmStockAction(productId, {
            transaction_type: 'STOCK_IN',
            quantity: qty,
            reason: 'Purchase reorder'
          });
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

    </div>
  );
}

export default App;
