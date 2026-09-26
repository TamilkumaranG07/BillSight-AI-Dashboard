import type {
  FilterState,
  KpiItem,
  Product,
  CategoryData,
  TimeSeriesPoint,
  Transaction,
  ExpiryItem,
  Recommendation,
  HiddenInsight,
  AssociationRule
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ASSOCIATIONS,
  INITIAL_INSIGHTS,
  INITIAL_EXPIRY_ITEMS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_TRANSACTIONS,
  generatePeakHeatmapData,
  generateForecastData
} from '../data/mockData';

export interface CalculatedAnalytics {
  kpis: KpiItem[];
  filteredProducts: Product[];
  topProducts: Product[];
  categoryDistribution: CategoryData[];
  salesTimeSeries: TimeSeriesPoint[];
  insights: HiddenInsight[];
  associations: AssociationRule[];
  peakHeatmap: ReturnType<typeof generatePeakHeatmapData>;
  forecastData: ReturnType<typeof generateForecastData>;
  expiryItems: ExpiryItem[];
  recommendations: Recommendation[];
  transactions: Transaction[];
  totals: {
    revenue: number;
    orders: number;
    itemsSold: number;
    avgOrderValue: number;
  };
}

export const CATEGORY_COLORS: Record<string, string> = {
  Beverages: '#F59E0B',
  Snacks: '#EAB308',
  Dairy: '#10B981',
  Bakery: '#D97706',
  'Fruits & Vegetables': '#84CC16',
  'Personal Care': '#06B6D4',
  Household: '#64748B'
};

export const formatINR = (val: number): string => {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function isDateInPreset(timestampStr: string, preset: DateRangePreset): boolean {
  if (!timestampStr) return true;
  const cleanStr = timestampStr.includes('T') ? timestampStr : timestampStr.replace(' ', 'T');
  const txDate = new Date(cleanStr);
  if (isNaN(txDate.getTime())) return true;

  const txDateOnly = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
  const todayOnly = new Date(2026, 8, 24); // Reference local date 2026-09-24

  const diffDays = Math.floor((todayOnly.getTime() - txDateOnly.getTime()) / (1000 * 60 * 60 * 24));

  if (preset === 'today') {
    return diffDays === 0;
  } else if (preset === 'yesterday') {
    return diffDays === 1;
  } else if (preset === '7days') {
    return diffDays >= 0 && diffDays <= 7;
  } else if (preset === '30days') {
    return diffDays >= 0 && diffDays <= 30;
  } else if (preset === 'this_month') {
    return txDate.getMonth() === 8 && txDate.getFullYear() === 2026;
  }
  return true;
}

export function computeAnalytics(
  filters: FilterState,
  recommendationState: Recommendation[] = INITIAL_RECOMMENDATIONS,
  productState: Product[] = INITIAL_PRODUCTS,
  transactionsState: Transaction[] = INITIAL_TRANSACTIONS
): CalculatedAnalytics {
  let products = [...productState];
  if (filters.category !== 'All') {
    products = products.filter(p => p.category === filters.category);
  }
  if (filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  // Filter transactions by Date Range, Payment Method, and Search Query
  let transactions = [...transactionsState];
  
  transactions = transactions.filter(t => isDateInPreset(t.timestamp, filters.dateRange));

  if (filters.paymentMethod !== 'All') {
    transactions = transactions.filter(t => t.paymentMethod === filters.paymentMethod);
  }

  if (filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase();
    transactions = transactions.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        (t.productNames && t.productNames.some(pn => pn.toLowerCase().includes(q)))
    );
  }

  // Calculate real metrics from filtered backend transactions
  const totalRevenue = Math.round(transactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0) * 100) / 100;
  const totalOrders = transactions.length;
  const totalProductsSold = transactions.reduce((acc, t) => acc + (t.itemsCount || 1), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

  const activeProductsCount = products.length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const expiringSoonCount = INITIAL_EXPIRY_ITEMS.filter(e => e.status === 'Expiring Soon').length;
  const expiredCount = INITIAL_EXPIRY_ITEMS.filter(e => e.status === 'Expired' || e.status === 'Rejected at Billing').length;

  const kpis: KpiItem[] = [
    {
      id: 'kpi-sales',
      title: 'Total Period Revenue',
      value: formatINR(totalRevenue),
      rawNumeric: totalRevenue,
      changePercent: 12.4,
      isPositive: true,
      periodLabel: filters.dateRange.replace('_', ' ').toUpperCase(),
      iconName: 'DollarSign',
      sparklineData: [4200, 5100, 6800, 7200, 8900, 9400, totalRevenue || 10500],
      alertLevel: 'normal',
      subtitle: `Revenue for ${filters.dateRange}`
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: totalOrders.toLocaleString('en-IN'),
      rawNumeric: totalOrders,
      changePercent: 8.2,
      isPositive: true,
      periodLabel: filters.dateRange.replace('_', ' ').toUpperCase(),
      iconName: 'ShoppingBag',
      sparklineData: [12, 18, 24, 29, 35, 42, totalOrders || 50],
      alertLevel: 'normal',
      subtitle: `Completed checkout carts (${filters.dateRange})`
    },
    {
      id: 'kpi-units',
      title: 'Products Sold',
      value: totalProductsSold.toLocaleString('en-IN'),
      rawNumeric: totalProductsSold,
      changePercent: 15.1,
      isPositive: true,
      periodLabel: filters.dateRange.replace('_', ' ').toUpperCase(),
      iconName: 'PackageCheck',
      sparklineData: [30, 45, 60, 85, 110, 135, totalProductsSold || 160],
      alertLevel: 'normal',
      subtitle: `Scanned barcodes count (${filters.dateRange})`
    },
    {
      id: 'kpi-aov',
      title: 'Avg Order Value',
      value: `₹${avgOrderValue.toFixed(2)}`,
      rawNumeric: avgOrderValue,
      changePercent: 3.5,
      isPositive: true,
      periodLabel: filters.dateRange.replace('_', ' ').toUpperCase(),
      iconName: 'TrendingUp',
      sparklineData: [150, 165, 180, 175, 190, 205, avgOrderValue || 210],
      alertLevel: 'normal',
      subtitle: 'Basket size efficiency'
    },
    {
      id: 'kpi-active-prd',
      title: 'Active SKUs',
      value: activeProductsCount,
      rawNumeric: activeProductsCount,
      changePercent: 0,
      isPositive: true,
      periodLabel: 'Database Active',
      iconName: 'Boxes',
      sparklineData: [12, 12, 12, 12, 12, 12, 12],
      alertLevel: 'normal',
      subtitle: 'Available catalog'
    },
    {
      id: 'kpi-low-stock',
      title: 'Low Stock Alerts',
      value: lowStockCount,
      rawNumeric: lowStockCount,
      changePercent: 0,
      isPositive: true,
      periodLabel: 'Database Active',
      iconName: 'AlertTriangle',
      sparklineData: [1, 2, 2, 1, 3, 2, lowStockCount],
      alertLevel: lowStockCount > 0 ? 'warning' : 'normal',
      subtitle: 'Below safety threshold'
    },
    {
      id: 'kpi-expiring',
      title: 'Expiring Soon (<7D)',
      value: expiringSoonCount,
      rawNumeric: expiringSoonCount,
      changePercent: 0,
      isPositive: true,
      periodLabel: 'Database Active',
      iconName: 'Clock',
      sparklineData: [2, 2, 3, 2, 1, 2, expiringSoonCount],
      alertLevel: expiringSoonCount > 0 ? 'warning' : 'normal',
      subtitle: 'Apply clearance markdown'
    },
    {
      id: 'kpi-expired',
      title: 'Expired / Billing Blocked',
      value: expiredCount,
      rawNumeric: expiredCount,
      changePercent: 0,
      isPositive: true,
      periodLabel: 'Database Active',
      iconName: 'ShieldAlert',
      sparklineData: [1, 1, 0, 1, 1, 1, expiredCount],
      alertLevel: expiredCount > 0 ? 'danger' : 'normal',
      subtitle: 'AI vision auto-blocked'
    }
  ];

  const topProducts = [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10);

  const categoriesList: ProductCategory[] = [
    'Beverages',
    'Snacks',
    'Dairy',
    'Bakery',
    'Fruits & Vegetables',
    'Personal Care',
    'Household'
  ];

  const categoryDistribution: CategoryData[] = categoriesList.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const revenue = catProducts.reduce((acc, p) => acc + (p.revenue || 0), 0);
    const unitsSold = catProducts.reduce((acc, p) => acc + (p.unitsSold || 0), 0);
    const transactions = catProducts.reduce((acc, p) => acc + (p.transactionsCount || 0), 0);

    return {
      category: cat,
      revenue: Math.round(revenue * 100) / 100,
      unitsSold,
      transactions,
      color: CATEGORY_COLORS[cat] || '#94A3B8'
    };
  });

  // Group transactions into Sales Time Series Chart points
  const timeMap: Record<string, { revenue: number; transactions: number }> = {};

  transactions.forEach(t => {
    if (!t.timestamp) return;
    const dateObj = new Date(t.timestamp.replace(' ', 'T'));
    if (isNaN(dateObj.getTime())) return;

    let key = '';
    if (filters.dateRange === 'today' || filters.dateRange === 'yesterday') {
      const hour = dateObj.getHours();
      key = `${hour < 10 ? '0' : ''}${hour}:00`;
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      key = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
    }

    if (!timeMap[key]) {
      timeMap[key] = { revenue: 0, transactions: 0 };
    }
    timeMap[key].revenue += t.totalAmount || 0;
    timeMap[key].transactions += 1;
  });

  const salesTimeSeries: TimeSeriesPoint[] = Object.keys(timeMap).map(key => ({
    label: key,
    timestamp: key,
    revenue: Math.round(timeMap[key].revenue * 100) / 100,
    transactions: timeMap[key].transactions,
    avgOrderValue: Math.round((timeMap[key].revenue / (timeMap[key].transactions || 1)) * 100) / 100
  }));

  return {
    kpis,
    filteredProducts: products,
    topProducts,
    categoryDistribution,
    salesTimeSeries,
    insights: INITIAL_INSIGHTS,
    associations: INITIAL_ASSOCIATIONS,
    peakHeatmap: generatePeakHeatmapData(),
    forecastData: generateForecastData(),
    expiryItems: INITIAL_EXPIRY_ITEMS,
    recommendations: recommendationState,
    transactions,
    totals: {
      revenue: totalRevenue,
      orders: totalOrders,
      itemsSold: totalProductsSold,
      avgOrderValue
    }
  };
}

