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

// Database API Base Endpoint (Configure your backend URL here, e.g. http://localhost:5000/api)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service to connect BillSightAI Dashboard to the Python/Flask SQLite Database API
 */
export const dbService = {
  // Check Backend Server Health
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'online';
    } catch {
      return false;
    }
  },

  // Fetch All Products from Database
  async fetchProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error('DB fetch failed');
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.products)) return data.products;
      return [];
    } catch (err) {
      console.warn('Backend API connection unavailable, falling back to local state:', err);
      return [];
    }
  },

  // Fetch Transactions Log from Database
  async fetchTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`);
      if (!res.ok) throw new Error('DB fetch failed');
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.transactions)) return data.transactions;
      return [];
    } catch (err) {
      console.warn('Backend API transactions fetch failed:', err);
      return [];
    }
  },

  // Update Price & Discount in Database
  async updatePriceAndDiscount(productId: string, price: number, discountPercent: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, discountPercent })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Trigger Restock Order in Database
  async createPurchaseOrder(productId: string, quantity: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
