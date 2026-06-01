import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({ title, value, unit = '', trendValue = null, trendDirection = 'neutral', description = '', icon: Icon }) {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';

  let trendColor = 'text-dark-500 dark:text-dark-400';
  let TrendIcon = Minus;

  if (isUp) {
    trendColor = 'text-healthy-600 dark:text-healthy-400 bg-healthy-50 dark:bg-healthy-950/20';
    TrendIcon = ArrowUpRight;
  } else if (isDown) {
    trendColor = 'text-critical-600 dark:text-critical-400 bg-critical-50 dark:bg-critical-950/20';
    TrendIcon = ArrowDownRight;
  }

  return (
    <div className="card p-5 border border-dark-100 dark:border-dark-800 flex flex-col justify-between relative overflow-hidden group hover:border-horizon-300 dark:hover:border-horizon-700 transition-all duration-300">
      {/* Icon overlay background */}
      {Icon && (
        <Icon className="absolute right-4 top-4 h-12 w-12 text-dark-100/50 dark:text-dark-800/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 pointer-events-none" />
      )}

      <div>
        <p className="text-2xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 leading-none">
          {title}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-dark-400 dark:text-dark-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trendValue !== null && (
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </span>
        )}
        <span className="text-[10px] font-medium text-dark-500 dark:text-dark-400 line-clamp-1">
          {description}
        </span>
      </div>
    </div>
  );
}
