import React, { useState, useMemo } from 'react';
import type { FilterState, Product, ExpiryItem, ProductCategory } from './types';
import { computeAnalytics } from './services/analyticsEngine';
import { INITIAL_PRODUCTS, INITIAL_RECOMMENDATIONS } from './data/mockData';

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

import { CheckCircle2, ShieldCheck } from 'lucide-react';

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('Tamilkumaran G');
  const [adminRole, setAdminRole] = useState<string>('Store Administrator');

  // Theme state: Clean Yellow & White theme by default
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Navigation state
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Interactive state for SKUs and Price/Discounts
  const [productsState, setProductsState] = useState<Product[]>(INITIAL_PRODUCTS);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    category: 'All',
    paymentMethod: 'All',
    searchQuery: ''
  });

  // Toast / Modals state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reorderProduct, setReorderProduct] = useState<Product | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Dynamic Analytics Calculation
  const analytics = useMemo(() => {
    return computeAnalytics(filters, INITIAL_RECOMMENDATIONS, productsState);
  }, [filters, productsState]);

  // Toast Trigger Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login Success Handler
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

  const handleTriggerReorder = (product: Product) => {
    setReorderProduct(product);
  };

  const handleConfirmReorder = (productId: string, qty: number) => {
    setProductsState(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              currentStock: p.currentStock + qty,
              status: p.currentStock + qty > p.minStockThreshold ? 'In Stock' : p.status
            }
          : p
      )
    );
    showToast(`Purchase order for ${qty} units dispatched to Wholesale Logistics!`);
  };

  const handleApplyClearanceDiscount = (item: ExpiryItem) => {
    showToast(`Applied 30% yellow-tag clearance markdown to ${item.productName}!`);
  };

  // Price & Discount Update Handler
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
    showToast(`Updated price (₹${newPrice.toFixed(2)}) & discount (${discountPercent}%) for SKU ${productId}!`);
  };

  // Batch Category Discount Handler
  const handleBatchDiscount = (category: ProductCategory, discountPercent: number) => {
    setProductsState(prev =>
      prev.map(p => {
        if (p.category === category) {
          return {
            ...p,
            discountPercent
          } as Product;
        }
        return p;
      })
    );
    showToast(`Applied flat ${discountPercent}% festival discount to all ${category} items!`);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render Login Page if not authenticated
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
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
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                BillSightAI Real-Time Overview & Metrics
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Displaying live statistics filtered by {filters.dateRange.replace('_', ' ')} • {filters.category} Category
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Authenticated Session: {adminName}
            </div>
          </div>
          
          <KpiCards kpis={analytics.kpis} />
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
              onSelectProduct={handleTriggerReorder}
            />
          </section>

          <section id="categories" className="lg:col-span-5 scroll-mt-24">
            <CategoryAnalytics
              categoryData={analytics.categoryDistribution}
              darkMode={darkMode}
            />
          </section>
        </div>

        {/* Section 5: Stock & Pricing Manager Tab */}
        <section id="stock-pricing" className="scroll-mt-24">
          <StockPricingManager
            products={productsState}
            onUpdatePriceDiscount={handleUpdatePriceDiscount}
            onBatchDiscount={handleBatchDiscount}
          />
        </section>

        {/* Section 6 & 7: Peak Heatmap & Demand Sales Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section id="peak-sales" className="lg:col-span-6 scroll-mt-24">
            <PeakSalesHeatmap heatmapData={analytics.peakHeatmap} />
          </section>

          <section id="sales-forecast" className="lg:col-span-6 scroll-mt-24">
            <SalesForecast
              forecastPoints={analytics.forecastData}
              darkMode={darkMode}
            />
          </section>
        </div>

        {/* Section 8: Expiry Guard Analytics */}
        <section id="expiry" className="scroll-mt-24">
          <ExpiryAnalytics
            expiryItems={analytics.expiryItems}
            onApplyClearanceDiscount={handleApplyClearanceDiscount}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-200/60 dark:border-gray-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400 bg-white/50">
        <p className="font-bold text-gray-800 dark:text-gray-200">
          BillSightAI - Smart Supermarket Billing & Inventory System
        </p>
        <p className="text-[11px] mt-1 text-gray-400">
          Logged in Administrator: {adminName} ({adminRole}) • Clean Yellow & White SaaS Interface
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
      <ReorderModal
        product={reorderProduct}
        onClose={() => setReorderProduct(null)}
        onConfirmReorder={handleConfirmReorder}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

    </div>
  );
}

export default App;
