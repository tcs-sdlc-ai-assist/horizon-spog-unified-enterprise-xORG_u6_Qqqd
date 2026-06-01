import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import RAGBadge from '../shared/RAGBadge.jsx';

export default function KpiTile({ kpi }) {
  const [timeframe, setTimeframe] = useState('daily');

  if (!kpi) return null;

  const currentVal = kpi.value;
  const targetVal = kpi.target;
  const isPercentage = kpi.unit === '%';

  // Format value to 2 decimal places if number/percentage
  const formatVal = (v) => {
    if (typeof v !== 'number') return v;
    return v % 1 === 0 ? v : v.toFixed(2);
  };

  // Get trend data for chart
  const chartData = kpi.trend && kpi.trend[timeframe] ? kpi.trend[timeframe] : [];

  // Determine sparkline color based on RAG status
  let strokeColor = '#22c55e'; // Green
  let fillColor = 'rgba(34, 197, 94, 0.1)';

  if (kpi.status === 'warning' || kpi.status === 'amber') {
    strokeColor = '#f59e0b'; // Amber
    fillColor = 'rgba(245, 158, 11, 0.1)';
  } else if (kpi.status === 'critical' || kpi.status === 'red') {
    strokeColor = '#ef4444'; // Red
    fillColor = 'rgba(239, 68, 68, 0.1)';
  }

  return (
    <div className="card p-5 border border-dark-100 dark:border-dark-800 flex flex-col justify-between group hover:border-horizon-300 dark:hover:border-horizon-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider block">
            {kpi.category}
          </span>
          <h4 className="text-sm font-semibold text-dark-800 dark:text-dark-200 mt-0.5 line-clamp-1">
            {kpi.label}
          </h4>
        </div>

        {/* Timeframe Selector */}
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="text-[10px] font-bold text-dark-500 dark:text-dark-400 border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      {/* Main KPI Figures */}
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-dark-950 dark:text-dark-50 tracking-tight">
            {formatVal(currentVal)}
            {kpi.unit}
          </span>
          {targetVal !== undefined && (
            <span className="text-[10px] text-dark-400 dark:text-dark-500 block font-medium mt-0.5">
              Target: {formatVal(targetVal)}
              {kpi.unit}
            </span>
          )}
        </div>

        <RAGBadge status={kpi.status} />
      </div>

      {/* Sparkline Graph */}
      <div className="h-10 mt-4 w-full opacity-80 group-hover:opacity-100 transition-opacity">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={`color-${kpi.id}-${timeframe}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#color-${kpi.id}-${timeframe})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[10px] text-dark-400 italic">
            No history available
          </div>
        )}
      </div>
    </div>
  );
}
