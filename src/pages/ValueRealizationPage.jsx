import React, { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import { LineChart, DollarSign, Activity, Settings, TrendingUp } from 'lucide-react';

export default function ValueRealizationPage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { applications } = filteredData;

  const appCount = applications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Value Realization & Strategy
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Measure IT investment returns, trace digital transformation metrics, and verify modernization velocity.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Apps Modernized"
          value={appCount}
          description="Total active applications onboarded"
          icon={TrendingUp}
        />
        <StatCard
          title="IT Budget Utilized"
          value="$14.2M"
          description="Year-to-date IT budget spend"
          icon={DollarSign}
        />
        <StatCard
          title="Observability Coverage"
          value="94.5%"
          description="Applications with active APM coverage"
          icon={Activity}
        />
        <StatCard
          title="Automation Adoption"
          value="82.4%"
          description="Average deployment automation rate"
          icon={Settings}
        />
      </div>

      {/* Modernization Progress List */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Digital Transformation Trackers
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Tech Platform</th>
                <th className="py-2.5 px-3">Deployment Freq</th>
                <th className="py-2.5 px-3">Monitoring tool</th>
                <th className="py-2.5 px-3">Maturity Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-dark-900 dark:text-dark-100">{app.name}</td>
                  <td className="py-3 px-3 font-mono">{app.toolchain?.cloudProvider || 'AWS'}</td>
                  <td className="py-3 px-3 capitalize text-dark-500">{app.deploymentFrequency || 'Weekly'}</td>
                  <td className="py-3 px-3">{app.toolchain?.monitoring || 'Datadog'}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-horizon-50 text-horizon-700 dark:bg-horizon-950/25 dark:text-horizon-400">
                      Tier 3 Optimized
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-dark-400 italic">No apps matching filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
