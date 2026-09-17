import React from 'react';
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
import type { ForecastPoint } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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

interface SalesForecastProps {
  forecastPoints: ForecastPoint[];
  darkMode: boolean;
}

export const SalesForecast: React.FC<SalesForecastProps> = ({
  forecastPoints,
  darkMode
}) => {
  const labels = forecastPoints.map(p => p.date.substring(5));
  const historicalVals = forecastPoints.map(p => (p.isFuture ? null : p.historicalRevenue));
  const predictedVals = forecastPoints.map(p => (p.isFuture ? p.predictedRevenue : null));
  const upperBoundVals = forecastPoints.map(p => (p.isFuture ? p.upperBound : null));
  const lowerBoundVals = forecastPoints.map(p => (p.isFuture ? p.lowerBound : null));

  const lastHistIdx = forecastPoints.findIndex(p => p.isFuture) - 1;
  if (lastHistIdx >= 0) {
    predictedVals[lastHistIdx] = forecastPoints[lastHistIdx].historicalRevenue;
    upperBoundVals[lastHistIdx] = forecastPoints[lastHistIdx].historicalRevenue;
    lowerBoundVals[lastHistIdx] = forecastPoints[lastHistIdx].historicalRevenue;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Historical Actual Sales',
        data: historicalVals,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: '#F59E0B',
        pointRadius: 3
      },
      {
        label: 'AI Predicted Demand',
        data: predictedVals,
        borderColor: '#D97706',
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderDash: [6, 4],
        tension: 0.3,
        pointBackgroundColor: '#D97706',
        pointRadius: 4
      },
      {
        label: '95% Confidence Upper Band',
        data: upperBoundVals,
        borderColor: 'transparent',
        backgroundColor: darkMode ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.12)',
        fill: '+1',
        pointRadius: 0
      },
      {
        label: '95% Confidence Lower Band',
        data: lowerBoundVals,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: { family: 'Plus Jakarta Sans', weight: '600', size: 11 },
          usePointStyle: true,
          filter: (item: any) => !item.text.includes('Band')
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            if (val === null) return '';
            return ` ${context.dataset.label}: ₹${val.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.05)' },
        ticks: { color: darkMode ? '#9CA3AF' : '#6B7280', font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.05)' },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          font: { family: 'Plus Jakarta Sans', size: 10 },
          callback: (val: any) => `₹${val.toLocaleString('en-IN')}`
        }
      }
    }
  };

  const futurePoints = forecastPoints.filter(p => p.isFuture);
  const totalPredicted14Days = futurePoints.reduce((acc, p) => acc + p.predictedRevenue, 0);
  const totalUnitsDemand = futurePoints.reduce((acc, p) => acc + p.expectedDemandUnits, 0);

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Sales & Demand Forecasting Model (14-Day Horizon)
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Predictive time-series demand forecasting model analyzing historical supermarket velocity
          </p>
        </div>
      </div>

      {/* Forecast Line Canvas */}
      <div className="h-80 w-full relative">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Forecast Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-amber-100 dark:border-gray-800 text-xs">
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40">
          <p className="text-gray-500 dark:text-gray-400">14-Day Projected Revenue</p>
          <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
            ₹{totalPredicted14Days.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40">
          <p className="text-gray-500 dark:text-gray-400">Expected Inventory Demand</p>
          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalUnitsDemand.toLocaleString('en-IN')} total units
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-gray-800/40 border border-amber-200/40">
          <p className="text-gray-500 dark:text-gray-400">AI Purchasing Recommendation</p>
          <p className="font-bold text-gray-900 dark:text-white">
            Pre-order +15% Dairy & Beverages before upcoming weekend peak.
          </p>
        </div>
      </div>

    </div>
  );
};
