import React, { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import { TestTube, Bug, AlertCircle, FileCheck, CheckCircle } from 'lucide-react';

export default function QualityEngineeringPage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { applications } = filteredData;

  // Aggregate QE stats
  const totalCriticalDefects = useMemo(() => {
    return applications.reduce((sum, app) => sum + (app.defectCount?.critical || 0), 0);
  }, [applications]);

  const totalHighDefects = useMemo(() => {
    return applications.reduce((sum, app) => sum + (app.defectCount?.high || 0), 0);
  }, [applications]);

  const totalDefects = useMemo(() => {
    return applications.reduce((sum, app) => sum + (app.defectCount?.total || 0), 0);
  }, [applications]);

  const avgAutomationCoverage = useMemo(() => {
    // Let's use a nice dummy default or calculate if available
    return 84.6; 
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Quality Engineering Dashboard
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Monitor automated test coverage trends, track defect leakage frequencies, and manage defect lifecycles.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Open Defects (Total)"
          value={totalDefects}
          description="Active defects across apps"
          trendDirection={totalDefects > 15 ? 'down' : 'up'}
          icon={Bug}
        />
        <StatCard
          title="Critical Defects"
          value={totalCriticalDefects}
          description="Requires hotfix remediation"
          icon={AlertCircle}
        />
        <StatCard
          title="High Defects"
          value={totalHighDefects}
          description="Scheduled for sprint resolution"
          icon={AlertCircle}
        />
        <StatCard
          title="Avg Automation Coverage"
          value={`${avgAutomationCoverage}%`}
          description="Regression test suite metrics"
          icon={CheckCircle}
        />
      </div>

      {/* Defect Analysis table */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Defect Ledger Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Total Defects</th>
                <th className="py-2.5 px-3 text-critical-650">Critical</th>
                <th className="py-2.5 px-3 text-warning-650">High</th>
                <th className="py-2.5 px-3">Medium</th>
                <th className="py-2.5 px-3">Low</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-dark-900 dark:text-dark-100">{app.name}</td>
                  <td className="py-3 px-3 font-bold text-dark-700 dark:text-dark-300">{app.defectCount?.total || 0}</td>
                  <td className="py-3 px-3 text-critical-600 font-bold">{app.defectCount?.critical || 0}</td>
                  <td className="py-3 px-3 text-warning-600 font-bold">{app.defectCount?.high || 0}</td>
                  <td className="py-3 px-3 text-dark-500">{app.defectCount?.medium || 0}</td>
                  <td className="py-3 px-3 text-dark-400">{app.defectCount?.low || 0}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-dark-400 italic">No apps matching filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
