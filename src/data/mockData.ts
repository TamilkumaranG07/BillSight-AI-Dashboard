import type {
  Product,
  Transaction,
  AssociationRule,
  HeatmapCell,
  ForecastPoint,
  ExpiryItem,
  Recommendation,
  HiddenInsight
} from '../types';

// Empty dataset structure ready for database connection
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ASSOCIATIONS: AssociationRule[] = [];

export const INITIAL_INSIGHTS: HiddenInsight[] = [];

export const INITIAL_EXPIRY_ITEMS: ExpiryItem[] = [];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

// Empty Heatmap Generator (returns empty 7x24 grid or empty array if no DB data)
export const generatePeakHeatmapData = (): HeatmapCell[] => {
  return [];
};

// Empty Forecast Generator (returns empty array if no DB data)
export const generateForecastData = (): ForecastPoint[] => {
  return [];
};
