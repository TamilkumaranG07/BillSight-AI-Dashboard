export type DateRangePreset = 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom';
export type ProductCategory = 'All' | 'Beverages' | 'Snacks' | 'Dairy' | 'Bakery' | 'Fruits & Vegetables' | 'Personal Care' | 'Household';
export type PaymentMethod = 'All' | 'Cash' | 'Credit Card' | 'UPI / QR' | 'Smart Wallet';

export interface FilterState {
  dateRange: DateRangePreset;
  category: ProductCategory;
  paymentMethod: PaymentMethod;
  searchQuery: string;
  startDate?: string;
  endDate?: string;
}

export interface KpiItem {
  id: string;
  title: string;
  value: string | number;
  rawNumeric: number;
  changePercent: number;
  isPositive: boolean;
  periodLabel: string;
  iconName: string;
  sparklineData: number[];
  alertLevel?: 'normal' | 'warning' | 'danger';
  subtitle?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unitsSold: number;
  revenue: number;
  transactionsCount: number;
  currentStock: number;
  minStockThreshold: number;
  maxStockCapacity: number;
  expiryDate: string; // YYYY-MM-DD
  status: 'In Stock' | 'Low Stock' | 'Overstocked' | 'Expiring Soon' | 'Expired';
  imagePlaceholder?: string;
  turnoverRate: number; // times per year
}

export interface CategoryData {
  category: ProductCategory;
  revenue: number;
  unitsSold: number;
  transactions: number;
  color: string;
}

export interface TimeSeriesPoint {
  label: string; // e.g. "08:00", "Mon", "Day 15"
  timestamp: string;
  revenue: number;
  transactions: number;
  avgOrderValue: number;
}

export interface HiddenInsight {
  id: string;
  title: string;
  description: string;
  type: 'frequently_paired' | 'surge' | 'decline' | 'peak_hour' | 'stock_risk' | 'unusual_spike';
  impact: 'High' | 'Medium' | 'Critical' | 'Positive';
  badgeColor: string;
  actionText?: string;
  productsInvolved: string[];
  metricsDetail: string;
}

export interface AssociationRule {
  id: string;
  productA: string;
  productB: string;
  purchaseFrequency: number;
  support: number; // % of total orders
  confidence: number; // % chance B bought when A bought
  lift: number; // strength (>1 means strong association)
  suggestedAction: string;
}

export interface HeatmapCell {
  day: string; // "Mon", "Tue", etc.
  dayIndex: number; // 0-6
  hour: number; // 0-23
  hourLabel: string; // "09:00", "18:00"
  intensity: number; // 0 to 100
  revenue: number;
  transactions: number;
}

export interface ForecastPoint {
  date: string;
  historicalRevenue?: number;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
  confidence: number; // e.g. 94%
  expectedDemandUnits: number;
  isFuture: boolean;
}

export interface ExpiryItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  batchNumber: string;
  stockQty: number;
  expiryDate: string;
  daysRemaining: number;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Rejected at Billing';
  discountApplied: number; // percentage, e.g. 30
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'Inventory Restock' | 'Price & Promotion' | 'Expiry Clearance' | 'Purchasing Qty';
  description: string;
  productName: string;
  suggestedAction: string;
  urgency: 'Immediate' | 'Recommended' | 'Strategic';
  applied: boolean;
}

export interface Transaction {
  id: string;
  timestamp: string;
  customerName: string;
  itemsCount: number;
  productNames: string[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'Completed' | 'Rejected (Expired)' | 'Refunded';
  counterId: string;
}
