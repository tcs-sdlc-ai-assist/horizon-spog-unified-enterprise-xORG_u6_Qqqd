import React, { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { Activity, Clock, Flame, Gauge } from 'lucide-react';

export default function ObservabilityPage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { applications } = filteredData;

  // Average Availability
  const avgAvailability = useMemo(() => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + (app.healthStatus?.availability || 99.9), 0);
    return (sum / applications.length).toFixed(3);
  }, [applications]);

  // Average Latency
  const avgLatency = useMemo(() => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + (app.healthStatus?.latencyP99Ms || 250), 0);
    return Math.round(sum / applications.length);
  }, [applications]);

  // Error budget consumption
  const avgErrorBudget = 84.15; // default mock value

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Observability & SLO Dashboard
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Verify service level objectives, monitor error budget depletion, and track system latencies.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Avg Availability"
          value={`${avgAvailability}%`}
          description="Consolidated app availability"
          icon={Gauge}
        />
        <StatCard
          title="Avg P99 Response Time"
          value={`${avgLatency}ms`}
          description="APM transaction latency average"
          icon={Clock}
        />
        <StatCard
          title="Error Budget Remaining"
          value={`${avgErrorBudget}%`}
          description="Average error budget safety margin"
          icon={Flame}
        />
      </div>

      {/* SLO Attainment Table */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Service Level Objective (SLO) Registry
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">SLO Target</th>
                <th className="py-2.5 px-3">Availability (30d)</th>
                <th className="py-2.5 px-3">Error Budget Remaining</th>
                <th className="py-2.5 px-3">SLO Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {applications.map((app) => {
                const avail = app.healthStatus?.availability || 99.9;
                const target = 99.9; // target default
                const isViolated = avail < target;
                const budgetLeft = isViolated ? 58.4 : 92.6; // mock remaining budget
                
                return (
                  <tr key={app.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-dark-900 dark:text-dark-100">{app.name}</td>
                    <td className="py-3.5 px-3 font-semibold text-dark-500">{target}%</td>
                    <td className="py-3.5 px-3 font-bold text-dark-800 dark:text-dark-250">{avail}%</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <div className="w-full bg-dark-200 dark:bg-dark-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isViolated ? 'bg-critical-500' : 'bg-healthy-500'}`} 
                            style={{ width: `${budgetLeft}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-dark-600 dark:text-dark-400">{budgetLeft}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <RAGBadge status={isViolated ? 'red' : 'green'} />
                    </td>
                  </tr>
                );
              })}
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
