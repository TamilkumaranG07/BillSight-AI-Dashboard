import React, { useState } from 'react';
import type { HeatmapCell } from '../types';
import { Clock, Sun, Moon, Sparkles } from 'lucide-react';

interface PeakSalesHeatmapProps {
  heatmapData: HeatmapCell[];
}

export const PeakSalesHeatmap: React.FC<PeakSalesHeatmapProps> = ({ heatmapData }) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getCellColor = (intensity: number) => {
    if (intensity < 15) return 'bg-amber-50/50 dark:bg-gray-800/40 text-gray-400';
    if (intensity < 35) return 'bg-amber-500/20 text-amber-800 dark:text-amber-300';
    if (intensity < 60) return 'bg-amber-500/40 text-amber-900 dark:text-amber-200';
    if (intensity < 80) return 'bg-amber-500 text-white font-bold';
    return 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-white font-black glow-amber';
  };

  return (
    <div className="glass-card bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-amber-200/50 dark:border-gray-800">
      
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Peak Shopping Hours Heatmap Activity
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            24-hour × 7-day supermarket checkout volume matrix to optimize cashier staffing
          </p>
        </div>

        {/* Color Intensity Scale Legend */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span>Low Traffic</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-50 dark:bg-gray-800 border" />
            <div className="w-4 h-4 rounded bg-amber-500/20" />
            <div className="w-4 h-4 rounded bg-amber-500/50" />
            <div className="w-4 h-4 rounded bg-amber-500" />
            <div className="w-4 h-4 rounded bg-yellow-500" />
          </div>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">Peak Busiest</span>
        </div>
      </div>

      {/* Hover Info Banner */}
      <div className="mb-4 min-h-[36px] p-2.5 rounded-xl bg-amber-50/60 dark:bg-gray-800/60 border border-amber-200/50 flex items-center justify-between text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-amber-700 dark:text-amber-400">
              {hoveredCell.day} at {hoveredCell.hourLabel}
            </span>
            <span>Intensity: <strong>{hoveredCell.intensity}%</strong></span>
            <span>Volume: <strong>{hoveredCell.transactions} transactions</strong></span>
            <span>Revenue: <strong>₹{hoveredCell.revenue.toLocaleString('en-IN')}</strong></span>
          </div>
        ) : (
          <span className="text-gray-400 italic">
            Hover over any hour cell below to inspect exact foot traffic volume and sales revenue.
          </span>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          
          {/* Hour Label Header Row */}
          <div className="grid grid-cols-25 gap-1 mb-2 text-[10px] text-center font-bold text-gray-400">
            <div className="col-span-1 text-left pl-1">Day</div>
            {hours.map(h => (
              <div key={h} className="col-span-1">
                {h % 3 === 0 ? `${h}h` : ''}
              </div>
            ))}
          </div>

          {/* Days Rows */}
          {days.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-25 gap-1 mb-1.5 items-center">
              {/* Day Label */}
              <div className="col-span-1 text-xs font-extrabold text-gray-700 dark:text-gray-300">
                {day}
              </div>

              {/* 24 Hours Cells */}
              {hours.map(h => {
                const cell = heatmapData.find(c => c.dayIndex === dIdx && c.hour === h);
                const intensity = cell ? cell.intensity : 0;

                return (
                  <div
                    key={h}
                    onMouseEnter={() => cell && setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`col-span-1 h-8 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center text-[9px] hover:scale-110 hover:z-10 hover:shadow-md ${getCellColor(
                      intensity
                    )}`}
                  >
                    {intensity > 70 ? `${intensity}%` : ''}
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-amber-100 dark:border-gray-800 text-xs">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20">
          <p className="font-extrabold">Busiest Time Window:</p>
          <p>Friday & Saturday from 5:00 PM – 8:00 PM (Avg 82 transactions/hr)</p>
        </div>

        <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-900 dark:text-yellow-200 border border-yellow-500/20">
          <p className="font-extrabold">Staffing Recommendation:</p>
          <p>Deploy +3 cashiers at Counters #01 - #04 during 17:00–20:00 weekend shifts.</p>
        </div>
      </div>

    </div>
  );
};
