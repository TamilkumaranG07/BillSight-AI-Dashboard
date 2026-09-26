import React from 'react';
import {
  ShoppingBag,
  Bell,
  Sun,
  Moon,
  Search,
  Sparkles,
  UserCheck,
  ShieldCheck,
  IndianRupee,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  adminName: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  activeSection,
  onSelectSection,
  unreadNotifications,
  onOpenNotifications,
  searchQuery,
  onSearchChange,
  adminName,
  onLogout
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'sales-analytics', label: 'Sales Trends' },
    { id: 'top-products', label: 'Top Products' },
    { id: 'categories', label: 'Category Shares' },
    { id: 'stock-pricing', label: 'Stock & Pricing' },
    { id: 'peak-sales', label: 'Peak Heatmap' },
    { id: 'sales-forecast', label: 'Demand Forecast' },
    { id: 'expiry', label: 'Expiry Guard' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel bg-white/90 dark:bg-gray-900/90 border-b border-amber-200/50 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectSection('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25 transform transition hover:scale-105">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-clip-text text-transparent">
                  BillSightAI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" /> AI Billing
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Smart Supermarket Billing & Inventory System
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, SKUs, categories..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-amber-50/50 dark:bg-gray-800/80 border border-amber-200/60 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Clock / Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <ShieldCheck className="w-3.5 h-3.5" /> System Live
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-amber-100/50 dark:hover:bg-gray-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Notification Icon */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-amber-100/50 dark:hover:bg-gray-800 transition-colors"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile Avatar & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-amber-200/60 dark:border-gray-700">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                TG
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">{adminName}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <UserCheck className="w-2.5 h-2.5 text-amber-500" /> Store Admin
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 ml-1 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                title="Sign Out of BillSightAI"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Sub-Navigation Links Horizontal Scroll Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-amber-100 dark:border-gray-800/60 text-xs">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-amber-50/80 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
