import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TimeSeriesPoint } from '../types';
import { TrendingUp, IndianRupee, ShoppingBag, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesAnalyticsChartProps {
  timeSeriesData: TimeSeriesPoint[];
  darkMode: boolean;
  totalRevenue: number;
  totalOrders: number;
}

export const SalesAnalyticsChart: React.FC<SalesAnalyticsChartProps> = ({
  timeSeriesData,
  darkMode,
  totalRevenue,
  totalOrders
}) => {
  const [metricMode, setMetricMode] = useState<'both' | 'revenue' | 'transactions'>('both');
  const [timeGranularity, setTimeGranularity] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');

  let labels = timeSeriesData.map(d => d.label);
  let revenuePoints = timeSeriesData.map(d => d.revenue);
  let transactionPoints = timeSeriesData.map(d => d.transactions);

  if (timeGranularity === 'daily') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    revenuePoints = [182000, 194000, 188000, 219000, 268000, 315000, 294000];
    transactionPoints = [390, 420, 410, 480, 590, 740, 680];
  } else if (timeGranularity === 'weekly') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    revenuePoints = [1242000, 1289500, 1392100, 1498400];
    transactionPoints = [2850, 3020, 3110, 3350];
  } else if (timeGranularity === 'monthly') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    revenuePoints = [4310000, 4525000, 4840000, 5155000, 5370000, 5695000, 5910000, 6235000, 6560000];
    transactionPoints = [10500, 11200, 11800, 12400, 12900, 13800, 14200, 15100, 15900];
  }

  const chartData = {
    labels,
    datasets: [
      ...(metricMode === 'both' || metricMode === 'revenue'
        ? [
            {
              fill: true,
              label: 'Revenue (₹)',
              data: revenuePoints,
              borderColor: '#F59E0B',
              backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.12)',
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: '#F59E0B',
              pointRadius: 4,
              pointHoverRadius: 7,
              yAxisID: 'y'
            }
          ]
        : []),
      ...(metricMode === 'both' || metricMode === 'transactions'
        ? [
            {
              fill: true,
              label: 'Transactions (Orders)',
              data: transactionPoints,
              borderColor: '#D97706',
              backgroundColor: darkMode ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.08)',
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: '#D97706',
              pointRadius: 4,
              pointHoverRadius: 7,
              yAxisID: metricMode === 'both' ? 'y1' : 'y'
            }
          ]
        : [])
    ]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: {
            family: 'Plus Jakarta Sans',
            weight: '600',
            size: 12
          },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#374151',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const val = context.parsed.y;
            if (label.includes('Revenue')) {
              return ` ${label}: ₹${val.toLocaleString('en-IN')}`;
            }
            return ` ${label}: ${val.toLocaleString('en-IN')} orders`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 158, 11, 0.05)'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 158, 11, 0.05)'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (value: any) => (metricMode === 'transactions' ? value : `₹${value.toLocaleString('en-IN')}`)
        }
      },
      ...(metricMode === 'both'
        ? {
            y1: {
              type: 'linear' as const,
              display: true,
              position: 'right' as const,
              grid: {
                drawOnChartArea: false
              },
              ticks: {
                color: darkMode ? '#9CA3AF' : '#6B7280',
                font: { family: 'Plus Jakarta Sans', size: 11 }
              }
            }
          }
        : {})
    }
  };

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Sales Revenue & Transaction Trends
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time interactive revenue curve and shopping volume across supermarket checkout counters
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Granularity Switcher */}
          <div className="flex items-center gap-1 bg-amber-50/70 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
            {(['hourly', 'daily', 'weekly', 'monthly'] as const).map(g => (
              <button
                key={g}
                onClick={() => setTimeGranularity(g)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  timeGranularity === g
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Metric View Toggle */}
          <div className="flex items-center gap-1 bg-amber-50/70 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMetricMode('both')}
              className={`px-2 py-1 rounded-lg transition-all ${
                metricMode === 'both'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setMetricMode('revenue')}
              className={`px-2 py-1 rounded-lg transition-all ${
                metricMode === 'revenue'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setMetricMode('transactions')}
              className={`px-2 py-1 rounded-lg transition-all ${
                metricMode === 'transactions'
                  ? 'bg-yellow-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
          </div>

        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-80 w-full relative">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Footer Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-amber-100 dark:border-gray-800 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Period Gross Revenue</p>
            <p className="font-extrabold text-sm text-gray-900 dark:text-white">
              ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Baskets Processed</p>
            <p className="font-extrabold text-sm text-gray-900 dark:text-white">
              {totalOrders.toLocaleString('en-IN')} orders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Peak Volume Window</p>
            <p className="font-extrabold text-sm text-gray-900 dark:text-white">
              06:00 PM – 08:00 PM (Fri/Sat)
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
