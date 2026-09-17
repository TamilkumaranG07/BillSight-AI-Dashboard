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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-101',
    name: 'Organic Whole Milk 1L',
    category: 'Dairy',
    price: 68.00,
    unitsSold: 1420,
    revenue: 96560.00,
    transactionsCount: 1150,
    currentStock: 45,
    minStockThreshold: 60,
    maxStockCapacity: 200,
    expiryDate: '2026-09-08',
    status: 'Low Stock',
    turnoverRate: 18.2
  },
  {
    id: 'PRD-102',
    name: 'Artisan Sliced Wheat Bread',
    category: 'Bakery',
    price: 45.00,
    unitsSold: 1280,
    revenue: 57600.00,
    transactionsCount: 1020,
    currentStock: 30,
    minStockThreshold: 40,
    maxStockCapacity: 150,
    expiryDate: '2026-09-07',
    status: 'Expiring Soon',
    turnoverRate: 16.5
  },
  {
    id: 'PRD-103',
    name: 'Fresh Farm Eggs 12pk',
    category: 'Dairy',
    price: 95.00,
    unitsSold: 980,
    revenue: 93100.00,
    transactionsCount: 910,
    currentStock: 110,
    minStockThreshold: 50,
    maxStockCapacity: 250,
    expiryDate: '2026-09-20',
    status: 'In Stock',
    turnoverRate: 14.1
  },
  {
    id: 'PRD-104',
    name: 'Sparkling Citrus Soda 500ml',
    category: 'Beverages',
    price: 40.00,
    unitsSold: 2150,
    revenue: 86000.00,
    transactionsCount: 1850,
    currentStock: 280,
    minStockThreshold: 80,
    maxStockCapacity: 400,
    expiryDate: '2027-02-15',
    status: 'In Stock',
    turnoverRate: 22.4
  },
  {
    id: 'PRD-105',
    name: 'Cold Brewed Iced Coffee 330ml',
    category: 'Beverages',
    price: 120.00,
    unitsSold: 1650,
    revenue: 198000.00,
    transactionsCount: 1480,
    currentStock: 18,
    minStockThreshold: 50,
    maxStockCapacity: 180,
    expiryDate: '2026-09-12',
    status: 'Low Stock',
    turnoverRate: 19.8
  },
  {
    id: 'PRD-106',
    name: 'Crispy Sea Salt Potato Chips 150g',
    category: 'Snacks',
    price: 35.00,
    unitsSold: 1890,
    revenue: 66150.00,
    transactionsCount: 1620,
    currentStock: 210,
    minStockThreshold: 70,
    maxStockCapacity: 350,
    expiryDate: '2026-11-30',
    status: 'In Stock',
    turnoverRate: 15.6
  },
  {
    id: 'PRD-107',
    name: 'Red Delicious Apples 1kg',
    category: 'Fruits & Vegetables',
    price: 180.00,
    unitsSold: 1120,
    revenue: 201600.00,
    transactionsCount: 940,
    currentStock: 140,
    minStockThreshold: 60,
    maxStockCapacity: 200,
    expiryDate: '2026-09-10',
    status: 'In Stock',
    turnoverRate: 12.8
  },
  {
    id: 'PRD-108',
    name: 'Organic Bananas Bunch 1kg',
    category: 'Fruits & Vegetables',
    price: 60.00,
    unitsSold: 2450,
    revenue: 147000.00,
    transactionsCount: 2100,
    currentStock: 22,
    minStockThreshold: 50,
    maxStockCapacity: 200,
    expiryDate: '2026-09-06',
    status: 'Expiring Soon',
    turnoverRate: 25.1
  },
  {
    id: 'PRD-109',
    name: 'Greek Vanilla Yogurt 500g',
    category: 'Dairy',
    price: 110.00,
    unitsSold: 860,
    revenue: 94600.00,
    transactionsCount: 780,
    currentStock: 12,
    minStockThreshold: 35,
    maxStockCapacity: 120,
    expiryDate: '2026-09-05',
    status: 'Expiring Soon',
    turnoverRate: 11.2
  },
  {
    id: 'PRD-110',
    name: 'Hydrating Body Wash 400ml',
    category: 'Personal Care',
    price: 240.00,
    unitsSold: 540,
    revenue: 129600.00,
    transactionsCount: 490,
    currentStock: 95,
    minStockThreshold: 30,
    maxStockCapacity: 150,
    expiryDate: '2027-10-01',
    status: 'In Stock',
    turnoverRate: 6.4
  },
  {
    id: 'PRD-111',
    name: 'Eco Dishwashing Liquid 750ml',
    category: 'Household',
    price: 125.00,
    unitsSold: 720,
    revenue: 90000.00,
    transactionsCount: 680,
    currentStock: 160,
    minStockThreshold: 40,
    maxStockCapacity: 200,
    expiryDate: '2028-05-15',
    status: 'Overstocked',
    turnoverRate: 5.2
  },
  {
    id: 'PRD-112',
    name: 'Fresh Butter Croissant 4pk',
    category: 'Bakery',
    price: 160.00,
    unitsSold: 1340,
    revenue: 214400.00,
    transactionsCount: 1180,
    currentStock: 25,
    minStockThreshold: 30,
    maxStockCapacity: 100,
    expiryDate: '2026-09-06',
    status: 'Low Stock',
    turnoverRate: 20.3
  },
  {
    id: 'PRD-113',
    name: 'Multi-Surface Cleaner Spray 500ml',
    category: 'Household',
    price: 195.00,
    unitsSold: 610,
    revenue: 118950.00,
    transactionsCount: 570,
    currentStock: 185,
    minStockThreshold: 45,
    maxStockCapacity: 180,
    expiryDate: '2028-01-20',
    status: 'Overstocked',
    turnoverRate: 4.8
  },
  {
    id: 'PRD-114',
    name: 'Cheddar Cheese Block 250g',
    category: 'Dairy',
    price: 220.00,
    unitsSold: 790,
    revenue: 173800.00,
    transactionsCount: 710,
    currentStock: 65,
    minStockThreshold: 35,
    maxStockCapacity: 140,
    expiryDate: '2026-09-04',
    status: 'Expired',
    turnoverRate: 9.8
  },
  {
    id: 'PRD-115',
    name: 'Dark Chocolate Almond Bar 90g',
    category: 'Snacks',
    price: 85.00,
    unitsSold: 1460,
    revenue: 124100.00,
    transactionsCount: 1310,
    currentStock: 140,
    minStockThreshold: 50,
    maxStockCapacity: 250,
    expiryDate: '2027-01-10',
    status: 'In Stock',
    turnoverRate: 13.9
  }
];

export const INITIAL_ASSOCIATIONS: AssociationRule[] = [
  {
    id: 'RULE-01',
    productA: 'Organic Whole Milk 1L',
    productB: 'Artisan Sliced Wheat Bread',
    purchaseFrequency: 412,
    support: 0.38,
    confidence: 0.82,
    lift: 2.45,
    suggestedAction: 'Place Wheat Bread near Dairy Aisle 2 to increase morning bundle sales.'
  },
  {
    id: 'RULE-02',
    productA: 'Cold Brewed Iced Coffee 330ml',
    productB: 'Fresh Butter Croissant 4pk',
    purchaseFrequency: 368,
    support: 0.34,
    confidence: 0.79,
    lift: 2.68,
    suggestedAction: 'Create 15% off Breakfast Combo: Iced Coffee + Croissant during 7 AM - 10 AM.'
  },
  {
    id: 'RULE-03',
    productA: 'Crispy Sea Salt Potato Chips',
    productB: 'Sparkling Citrus Soda 500ml',
    purchaseFrequency: 520,
    support: 0.45,
    confidence: 0.86,
    lift: 2.12,
    suggestedAction: 'Cross-promote Soda at Snack Checkout Endcap.'
  },
  {
    id: 'RULE-04',
    productA: 'Red Delicious Apples 1kg',
    productB: 'Organic Bananas Bunch 1kg',
    purchaseFrequency: 295,
    support: 0.28,
    confidence: 0.71,
    lift: 1.85,
    suggestedAction: 'Offer Fruit Basket Discount for purchasing 2+ fruit varieties.'
  },
  {
    id: 'RULE-05',
    productA: 'Cheddar Cheese Block 250g',
    productB: 'Artisan Sliced Wheat Bread',
    purchaseFrequency: 210,
    support: 0.19,
    confidence: 0.68,
    lift: 1.94,
    suggestedAction: 'Feature Grilled Cheese Recipe Display near Bakery.'
  },
  {
    id: 'RULE-06',
    productA: 'Hydrating Body Wash 400ml',
    productB: 'Eco Dishwashing Liquid 750ml',
    purchaseFrequency: 145,
    support: 0.13,
    confidence: 0.54,
    lift: 1.62,
    suggestedAction: 'Include in monthly Household Essentials bundle.'
  }
];

export const INITIAL_INSIGHTS: HiddenInsight[] = [
  {
    id: 'INS-01',
    title: 'High Association Pair Detected',
    description: 'Milk and Wheat Bread are frequently purchased together in 38% of morning transactions (7 AM - 11 AM).',
    type: 'frequently_paired',
    impact: 'High',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    productsInvolved: ['Organic Whole Milk 1L', 'Artisan Sliced Wheat Bread'],
    metricsDetail: 'Support: 38% | Confidence: 82% | Lift: 2.45x'
  },
  {
    id: 'INS-02',
    title: 'Evening Beverage Sales Surge',
    description: 'Cold Brew & Citrus Soda sales increase by +42% during peak evening hours (4 PM - 7 PM).',
    type: 'surge',
    impact: 'Positive',
    badgeColor: 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 border-yellow-500/30',
    productsInvolved: ['Cold Brewed Iced Coffee', 'Sparkling Citrus Soda'],
    metricsDetail: 'Demand spike +42% vs daily average'
  },
  {
    id: 'INS-03',
    title: 'Rapid Stock Depletion Risk',
    description: 'Organic Bananas stock (22 units remaining) will be depleted within 1.2 days based on velocity.',
    type: 'stock_risk',
    impact: 'Critical',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    productsInvolved: ['Organic Bananas Bunch 1kg'],
    metricsDetail: 'Current velocity: 20 units/day | Remaining: 22 units'
  },
  {
    id: 'INS-04',
    title: 'Declining Demand Category',
    description: 'Multi-Surface Cleaning Spray sales declined -18% compared to last week.',
    type: 'decline',
    impact: 'Medium',
    badgeColor: 'bg-amber-600/10 text-amber-800 dark:text-amber-200 border-amber-600/30',
    productsInvolved: ['Multi-Surface Cleaner Spray'],
    metricsDetail: 'Stock turnover slowed from 8.2x to 4.8x'
  },
  {
    id: 'INS-05',
    title: 'Weekend Morning Shopping Peak',
    description: 'Saturday and Sunday between 9 AM and 1 PM account for 31% of total weekly revenue.',
    type: 'peak_hour',
    impact: 'High',
    badgeColor: 'bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border-yellow-500/40',
    productsInvolved: ['Bakery', 'Dairy', 'Beverages'],
    metricsDetail: 'Peak foot traffic: 145 transactions/hr'
  },
  {
    id: 'INS-06',
    title: 'Unusual Sales Spike Detected',
    description: 'Butter Croissants experienced an unexpected 65% spike in sales today following a morning promo.',
    type: 'unusual_spike',
    impact: 'Positive',
    badgeColor: 'bg-amber-400/20 text-amber-900 dark:text-amber-200 border-amber-500/40',
    productsInvolved: ['Fresh Butter Croissant 4pk'],
    metricsDetail: '180 units sold today vs 105 daily avg'
  }
];

export const INITIAL_EXPIRY_ITEMS: ExpiryItem[] = [
  {
    id: 'EXP-101',
    productId: 'PRD-109',
    productName: 'Greek Vanilla Yogurt 500g',
    category: 'Dairy',
    batchNumber: 'BATCH-202608-A9',
    stockQty: 12,
    expiryDate: '2026-09-06',
    daysRemaining: 1,
    status: 'Expiring Soon',
    discountApplied: 30
  },
  {
    id: 'EXP-102',
    productId: 'PRD-102',
    productName: 'Artisan Sliced Wheat Bread',
    category: 'Bakery',
    batchNumber: 'BATCH-202608-B2',
    stockQty: 30,
    expiryDate: '2026-09-07',
    daysRemaining: 2,
    status: 'Expiring Soon',
    discountApplied: 25
  },
  {
    id: 'EXP-103',
    productId: 'PRD-108',
    productName: 'Organic Bananas Bunch 1kg',
    category: 'Fruits & Vegetables',
    batchNumber: 'BATCH-202609-F1',
    stockQty: 22,
    expiryDate: '2026-09-07',
    daysRemaining: 2,
    status: 'Expiring Soon',
    discountApplied: 40
  },
  {
    id: 'EXP-104',
    productId: 'PRD-114',
    productName: 'Cheddar Cheese Block 250g',
    category: 'Dairy',
    batchNumber: 'BATCH-202607-D4',
    stockQty: 8,
    expiryDate: '2026-09-04',
    daysRemaining: -1,
    status: 'Expired',
    discountApplied: 0
  },
  {
    id: 'EXP-105',
    productId: 'PRD-112',
    productName: 'Fresh Butter Croissant 4pk',
    category: 'Bakery',
    batchNumber: 'BATCH-202609-C3',
    stockQty: 25,
    expiryDate: '2026-09-09',
    daysRemaining: 4,
    status: 'Expiring Soon',
    discountApplied: 15
  },
  {
    id: 'EXP-106',
    productId: 'PRD-101',
    productName: 'Organic Whole Milk 1L',
    category: 'Dairy',
    batchNumber: 'BATCH-202609-M1',
    stockQty: 15,
    expiryDate: '2026-09-10',
    daysRemaining: 5,
    status: 'Expiring Soon',
    discountApplied: 10
  },
  {
    id: 'EXP-107',
    productId: 'PRD-114',
    productName: 'Cheddar Cheese Block (Batch 2)',
    category: 'Dairy',
    batchNumber: 'BATCH-202607-D3',
    stockQty: 4,
    expiryDate: '2026-09-03',
    daysRemaining: -2,
    status: 'Rejected at Billing',
    discountApplied: 0
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'REC-01',
    title: 'Reorder High Velocity Beverages',
    category: 'Inventory Restock',
    description: 'Cold Brewed Iced Coffee (18 left) and Organic Milk (45 left) are below safe buffer stock levels.',
    productName: 'Cold Brewed Iced Coffee',
    suggestedAction: 'Trigger purchase order for 150 units of Iced Coffee and 200 units of Milk.',
    urgency: 'Immediate',
    applied: false
  },
  {
    id: 'REC-02',
    title: 'Create Morning Breakfast Bundle',
    category: 'Price & Promotion',
    description: 'AI detected 82% co-purchase rate between Milk and Wheat Bread.',
    productName: 'Milk + Bread Combo',
    suggestedAction: 'Set up automated smart bundle: 10% discount when bought together.',
    urgency: 'Recommended',
    applied: false
  },
  {
    id: 'REC-03',
    title: 'Apply Expiry Clearance Discount',
    category: 'Expiry Clearance',
    description: '12 units of Greek Yogurt expiring tomorrow. Auto-apply 30% discount at billing counter.',
    productName: 'Greek Vanilla Yogurt',
    suggestedAction: 'Apply 30% yellow-tag clearance discount immediately.',
    urgency: 'Immediate',
    applied: false
  },
  {
    id: 'REC-04',
    title: 'Adjust Overstocked Cleaning Spray',
    category: 'Purchasing Qty',
    description: 'Multi-Surface Cleaner inventory turnover rate has dropped to 4.8x (overstocked with 185 units).',
    productName: 'Multi-Surface Cleaner Spray',
    suggestedAction: 'Reduce upcoming monthly purchase order quantity by 50%.',
    urgency: 'Strategic',
    applied: false
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-89021',
    timestamp: '2026-09-05 08:42:15',
    customerName: 'Aarav Sharma',
    itemsCount: 4,
    productNames: ['Organic Whole Milk 1L', 'Artisan Sliced Wheat Bread', 'Fresh Farm Eggs 12pk', 'Organic Bananas'],
    totalAmount: 268.00,
    paymentMethod: 'UPI / QR',
    status: 'Completed',
    counterId: 'Counter #02'
  },
  {
    id: 'TXN-89022',
    timestamp: '2026-09-05 08:39:10',
    customerName: 'Priya Patel',
    itemsCount: 2,
    productNames: ['Cold Brewed Iced Coffee', 'Fresh Butter Croissant 4pk'],
    totalAmount: 280.00,
    paymentMethod: 'Smart Wallet',
    status: 'Completed',
    counterId: 'Counter #01 (Self-Checkout)'
  },
  {
    id: 'TXN-89023',
    timestamp: '2026-09-05 08:35:44',
    customerName: 'Rohan Verma',
    itemsCount: 3,
    productNames: ['Crispy Sea Salt Potato Chips', 'Sparkling Citrus Soda', 'Dark Chocolate Almond Bar'],
    totalAmount: 160.00,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    counterId: 'Counter #03'
  },
  {
    id: 'TXN-89024',
    timestamp: '2026-09-05 08:28:02',
    customerName: 'Ananya Iyer',
    itemsCount: 1,
    productNames: ['Cheddar Cheese Block 250g'],
    totalAmount: 220.00,
    paymentMethod: 'Cash',
    status: 'Rejected (Expired)',
    counterId: 'Counter #04 (AI Vision Guard)'
  },
  {
    id: 'TXN-89025',
    timestamp: '2026-09-05 08:20:19',
    customerName: 'Vikram Malhotra',
    itemsCount: 5,
    productNames: ['Red Delicious Apples', 'Organic Bananas', 'Greek Vanilla Yogurt', 'Hydrating Body Wash', 'Eco Dishwashing Liquid'],
    totalAmount: 715.00,
    paymentMethod: 'UPI / QR',
    status: 'Completed',
    counterId: 'Counter #02'
  },
  {
    id: 'TXN-89026',
    timestamp: '2026-09-05 08:14:50',
    customerName: 'Kavita Menon',
    itemsCount: 2,
    productNames: ['Sparkling Citrus Soda', 'Crispy Sea Salt Chips'],
    totalAmount: 75.00,
    paymentMethod: 'Cash',
    status: 'Completed',
    counterId: 'Counter #01 (Self-Checkout)'
  },
  {
    id: 'TXN-89027',
    timestamp: '2026-09-05 08:05:30',
    customerName: 'Siddharth Rao',
    itemsCount: 6,
    productNames: ['Organic Whole Milk', 'Fresh Farm Eggs', 'Artisan Sliced Bread', 'Fresh Butter Croissant', 'Cold Brew Coffee', 'Organic Bananas'],
    totalAmount: 648.00,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    counterId: 'Counter #03'
  },
  {
    id: 'TXN-89028',
    timestamp: '2026-09-05 07:52:11',
    customerName: 'Meera Deshmukh',
    itemsCount: 3,
    productNames: ['Multi-Surface Cleaner Spray', 'Eco Dishwashing Liquid', 'Hydrating Body Wash'],
    totalAmount: 560.00,
    paymentMethod: 'Smart Wallet',
    status: 'Completed',
    counterId: 'Counter #02'
  },
  {
    id: 'TXN-89029',
    timestamp: '2026-09-05 07:44:00',
    customerName: 'Karan Gupta',
    itemsCount: 1,
    productNames: ['Organic Bananas Bunch 1kg'],
    totalAmount: 60.00,
    paymentMethod: 'Cash',
    status: 'Completed',
    counterId: 'Counter #01 (Self-Checkout)'
  },
  {
    id: 'TXN-89030',
    timestamp: '2026-09-05 07:30:15',
    customerName: 'Neha Joshi',
    itemsCount: 4,
    productNames: ['Dark Chocolate Almond Bar', 'Crispy Sea Salt Chips', 'Sparkling Citrus Soda', 'Cold Brew Coffee'],
    totalAmount: 280.00,
    paymentMethod: 'UPI / QR',
    status: 'Completed',
    counterId: 'Counter #04'
  }
];

// 7 Days x 24 Hours Heatmap Generator
export const generatePeakHeatmapData = (): HeatmapCell[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cells: HeatmapCell[] = [];

  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      let baseIntensity = 10;
      if (hour >= 7 && hour <= 10) baseIntensity = 65;
      if (hour >= 17 && hour <= 20) baseIntensity = 85;
      if (hour >= 11 && hour <= 16) baseIntensity = 45;
      if (hour < 6 || hour > 22) baseIntensity = 5;

      if (dayIndex >= 5) {
        baseIntensity = Math.min(100, Math.round(baseIntensity * 1.35));
      }

      const finalIntensity = Math.min(100, Math.max(2, baseIntensity + (hour % 3) * 4 - 5));
      const transactions = Math.round((finalIntensity / 100) * 85);
      const revenue = Math.round(transactions * 480); // INR transaction average

      cells.push({
        day,
        dayIndex,
        hour,
        hourLabel: `${hour.toString().padStart(2, '0')}:00`,
        intensity: finalIntensity,
        revenue,
        transactions
      });
    }
  });

  return cells;
};

// Historical & Forecast Generator (30 days historical + 14 days predicted in INR)
export const generateForecastData = (): ForecastPoint[] => {
  const points: ForecastPoint[] = [];
  const baseRevenue = 285000; // INR daily base

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const factor = isWeekend ? 1.35 : 1.0;
    const wave = Math.sin(i / 3) * 35000;
    const rev = Math.round((baseRevenue + wave + (Math.random() * 20000 - 10000)) * factor);

    points.push({
      date: dateStr,
      historicalRevenue: rev,
      predictedRevenue: rev,
      lowerBound: rev,
      upperBound: rev,
      confidence: 100,
      expectedDemandUnits: Math.round(rev / 110),
      isFuture: false
    });
  }

  const lastRev = points[points.length - 1].historicalRevenue || baseRevenue;
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const factor = isWeekend ? 1.38 : 1.05;
    const growthTrend = 1 + (i * 0.008);
    const predicted = Math.round(lastRev * growthTrend * factor + Math.sin(i / 2) * 15000);
    const margin = Math.round(predicted * 0.08);

    points.push({
      date: dateStr,
      predictedRevenue: predicted,
      lowerBound: predicted - margin,
      upperBound: predicted + margin,
      confidence: 94 - i * 0.5,
      expectedDemandUnits: Math.round(predicted / 108),
      isFuture: true
    });
  }

  return points;
};
