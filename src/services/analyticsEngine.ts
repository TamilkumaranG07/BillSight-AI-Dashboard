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
  Beverages: '#F59E0B', // Amber
  Snacks: '#EAB308', // Warm Yellow
  Dairy: '#10B981', // Emerald
  Bakery: '#D97706', // Gold/Bronze
  'Fruits & Vegetables': '#84CC16', // Lime
  'Personal Care': '#06B6D4', // Cyan
  Household: '#64748B' // Slate
};

export const formatINR = (val: number): string => {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function computeAnalytics(
  filters: FilterState,
  recommendationState: Recommendation[] = INITIAL_RECOMMENDATIONS,
  productState: Product[] = INITIAL_PRODUCTS
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

  let transactions = [...INITIAL_TRANSACTIONS];
  if (filters.paymentMethod !== 'All') {
    transactions = transactions.filter(t => t.paymentMethod === filters.paymentMethod);
  }
  if (filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase();
    transactions = transactions.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.productNames.some(pn => pn.toLowerCase().includes(q))
    );
  }

  let dateMultiplier = 1.0;
  let periodLabel = 'vs yesterday';
  switch (filters.dateRange) {
    case 'today':
      dateMultiplier = 1.0;
      periodLabel = 'vs yesterday';
      break;
    case 'yesterday':
      dateMultiplier = 0.92;
      periodLabel = 'vs prev day';
      break;
    case '7days':
      dateMultiplier = 6.4;
      periodLabel = 'vs prev 7 days';
      break;
    case '30days':
      dateMultiplier = 26.5;
      periodLabel = 'vs prev 30 days';
      break;
    case 'this_month':
      dateMultiplier = 22.1;
      periodLabel = 'vs last month';
      break;
    case 'custom':
      dateMultiplier = 3.5;
      periodLabel = 'vs selected period';
      break;
  }

  const baseRevenue = products.reduce((acc, p) => acc + p.revenue, 0);
  const totalRevenue = Math.round(baseRevenue * dateMultiplier * 100) / 100;
  const totalOrders = Math.round(482 * dateMultiplier);
  const totalProductsSold = Math.round(3420 * dateMultiplier);
  const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

  const activeProductsCount = products.length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const expiringSoonCount = INITIAL_EXPIRY_ITEMS.filter(e => e.status === 'Expiring Soon').length;
  const expiredCount = INITIAL_EXPIRY_ITEMS.filter(e => e.status === 'Expired' || e.status === 'Rejected at Billing').length;

  const kpis: KpiItem[] = [
    {
      id: 'kpi-sales',
      title: filters.dateRange === 'today' ? "Today's Sales" : 'Total Period Revenue',
      value: formatINR(totalRevenue),
      rawNumeric: totalRevenue,
      changePercent: 12.4,
      isPositive: true,
      periodLabel,
      iconName: 'DollarSign',
      sparklineData: [12000, 14500, 13200, 16800, 15900, 18200, 19500],
      alertLevel: 'normal',
      subtitle: 'Real-time checkout total'
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: totalOrders.toLocaleString('en-IN'),
      rawNumeric: totalOrders,
      changePercent: 8.1,
      isPositive: true,
      periodLabel,
      iconName: 'ShoppingBag',
      sparklineData: [42, 55, 61, 58, 72, 80, 89],
      alertLevel: 'normal',
      subtitle: 'Completed checkout carts'
    },
    {
      id: 'kpi-units',
      title: 'Products Sold',
      value: totalProductsSold.toLocaleString('en-IN'),
      rawNumeric: totalProductsSold,
      changePercent: 15.3,
      isPositive: true,
      periodLabel,
      iconName: 'PackageCheck',
      sparklineData: [310, 380, 420, 490, 530, 610, 670],
      alertLevel: 'normal',
      subtitle: 'Scanned barcodes count'
    },
    {
      id: 'kpi-aov',
      title: 'Avg Order Value',
      value: `₹${avgOrderValue.toFixed(2)}`,
      rawNumeric: avgOrderValue,
      changePercent: 4.2,
      isPositive: true,
      periodLabel,
      iconName: 'TrendingUp',
      sparklineData: [520, 550, 580, 610, 640, 660, 685],
      alertLevel: 'normal',
      subtitle: 'Basket size efficiency'
    },
    {
      id: 'kpi-active-prd',
      title: 'Active SKUs',
      value: activeProductsCount,
      rawNumeric: activeProductsCount,
      changePercent: 2.5,
      isPositive: true,
      periodLabel: 'catalog items',
      iconName: 'Boxes',
      sparklineData: [120, 122, 123, 125, 125, 128, 130],
      alertLevel: 'normal',
      subtitle: 'Available catalog'
    },
    {
      id: 'kpi-low-stock',
      title: 'Low Stock Alerts',
      value: lowStockCount,
      rawNumeric: lowStockCount,
      changePercent: -14.2,
      isPositive: true,
      periodLabel: 'needs reorder',
      iconName: 'AlertTriangle',
      sparklineData: [18, 16, 15, 12, 14, 13, lowStockCount],
      alertLevel: lowStockCount > 0 ? 'warning' : 'normal',
      subtitle: 'Below safety threshold'
    },
    {
      id: 'kpi-expiring',
      title: 'Expiring Soon (<7D)',
      value: expiringSoonCount,
      rawNumeric: expiringSoonCount,
      changePercent: -5.0,
      isPositive: true,
      periodLabel: 'quarantine risk',
      iconName: 'Clock',
      sparklineData: [12, 10, 9, 8, 8, 7, expiringSoonCount],
      alertLevel: expiringSoonCount > 0 ? 'warning' : 'normal',
      subtitle: 'Apply clearance markdown'
    },
    {
      id: 'kpi-expired',
      title: 'Expired / Billing Blocked',
      value: expiredCount,
      rawNumeric: expiredCount,
      changePercent: -33.3,
      isPositive: true,
      periodLabel: 'zero revenue loss',
      iconName: 'ShieldAlert',
      sparklineData: [8, 6, 5, 4, 3, 3, expiredCount],
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
    const catProducts = INITIAL_PRODUCTS.filter(p => p.category === cat);
    const revenue = catProducts.reduce((acc, p) => acc + p.revenue, 0) * dateMultiplier;
    const unitsSold = Math.round(catProducts.reduce((acc, p) => acc + p.unitsSold, 0) * dateMultiplier);
    const transactions = Math.round(catProducts.reduce((acc, p) => acc + p.transactionsCount, 0) * dateMultiplier);

    return {
      category: cat,
      revenue: Math.round(revenue * 100) / 100,
      unitsSold,
      transactions,
      color: CATEGORY_COLORS[cat] || '#94A3B8'
    };
  });

  const salesTimeSeries: TimeSeriesPoint[] = [];
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  hours.forEach((hr, idx) => {
    const mult = idx % 2 === 0 ? 1.2 : 0.85;
    const rev = Math.round((totalRevenue / 8) * mult);
    const tx = Math.round((totalOrders / 8) * mult);
    salesTimeSeries.push({
      label: hr,
      timestamp: hr,
      revenue: rev,
      transactions: tx,
      avgOrderValue: tx > 0 ? Math.round((rev / tx) * 10) / 10 : 0
    });
  });

  let associations = [...INITIAL_ASSOCIATIONS];
  if (filters.category !== 'All') {
    associations = associations.filter(rule => {
      const prdA = INITIAL_PRODUCTS.find(p => p.name === rule.productA);
      const prdB = INITIAL_PRODUCTS.find(p => p.name === rule.productB);
      return prdA?.category === filters.category || prdB?.category === filters.category;
    });
  }

  const insights = [...INITIAL_INSIGHTS];
  const peakHeatmap = generatePeakHeatmapData();
  const forecastData = generateForecastData();

  return {
    kpis,
    filteredProducts: products,
    topProducts,
    categoryDistribution,
    salesTimeSeries,
    insights,
    associations: associations.length > 0 ? associations : INITIAL_ASSOCIATIONS,
    peakHeatmap,
    forecastData,
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
