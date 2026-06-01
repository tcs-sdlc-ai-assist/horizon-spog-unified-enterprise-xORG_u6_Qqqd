import React, { useState, useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import DetailDrawer from '../components/shared/DetailDrawer.jsx';
import { 
  GitBranch, 
  HelpCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  FileCheck,
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';

export default function ReleaseGovernancePage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { releases } = filteredData;

  const [selectedReleaseId, setSelectedReleaseId] = useState(null);

  const activeRelease = useMemo(() => {
    return releases.find(r => r.id === selectedReleaseId);
  }, [selectedReleaseId, releases]);

  // Rollbacks count
  const rollbackCount = useMemo(() => {
    return releases.filter(r => r.rollbackFlag).length;
  }, [releases]);

  // Average readiness
  const avgReadiness = useMemo(() => {
    if (releases.length === 0) return 0;
    const sum = releases.reduce((acc, r) => acc + (r.readinessScore || 0), 0);
    return Math.round(sum / releases.length);
  }, [releases]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Release Governance Console
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Evaluate deployment pipeline metrics, track environment readiness, and verify release signoffs.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border border-dark-100 dark:border-dark-800">
          <span className="text-2xs font-bold text-dark-400 block uppercase">Total Pipelines tracked</span>
          <span className="text-2xl font-extrabold text-dark-900 dark:text-dark-100 mt-2 block">
            {releases.length}
          </span>
          <span className="text-[10px] text-dark-400 font-semibold mt-1 block">Active across environment slots</span>
        </div>

        <div className="card p-5 border border-dark-105 dark:border-dark-800">
          <span className="text-2xs font-bold text-dark-400 block uppercase">Avg Readiness Score</span>
          <span className="text-2xl font-extrabold text-healthy-600 dark:text-healthy-400 mt-2 block">
            {avgReadiness}%
          </span>
          <span className="text-[10px] text-dark-400 font-semibold mt-1 block">Deploy standard target: &gt; 90%</span>
        </div>

        <div className="card p-5 border border-dark-105 dark:border-dark-800">
          <span className="text-2xs font-bold text-dark-400 block uppercase">Rollback events flagged</span>
          <span className={`text-2xl font-extrabold mt-2 block ${rollbackCount > 0 ? 'text-critical-650 animate-pulse' : 'text-dark-900 dark:text-dark-100'}`}>
            {rollbackCount}
          </span>
          <span className="text-[10px] text-dark-400 font-semibold mt-1 block">Requires root cause audit</span>
        </div>
      </div>

      {/* Releases Table */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Enterprise Release Schedule
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Release ID</th>
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Readiness</th>
                <th className="py-2.5 px-3">Environment</th>
                <th className="py-2.5 px-3">Flagged</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {releases.map((rel) => (
                <tr key={rel.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-horizon-600 dark:text-horizon-400">{rel.id}</td>
                  <td className="py-3.5 px-3 font-bold text-dark-900 dark:text-dark-100">{rel.application}</td>
                  <td className="py-3.5 px-3 font-mono">{rel.version}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rel.readinessScore > 90 ? 'bg-healthy-50 text-healthy-700' : 'bg-warning-50 text-warning-700'
                    }`}>
                      {rel.readinessScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 uppercase tracking-wider text-[10px] font-bold text-dark-500">{rel.environment}</td>
                  <td className="py-3.5 px-3">
                    {rel.rollbackFlag ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-critical-50 text-critical-700 border border-critical-200 dark:bg-critical-950/20 dark:text-critical-400 dark:border-critical-900/50 animate-pulse">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Rollback
                      </span>
                    ) : (
                      <span className="text-[10px] text-dark-400 font-semibold">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedReleaseId(rel.id)}
                      className="p-1 rounded bg-dark-50 hover:bg-horizon-50 hover:text-horizon-600 dark:bg-dark-800 dark:hover:bg-horizon-950/30 text-dark-400 transition-colors"
                      title="Inspect Pipeline details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {releases.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-dark-400 italic">No releases matching filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out drawer details */}
      <DetailDrawer
        isOpen={!!activeRelease}
        onClose={() => setSelectedReleaseId(null)}
        title={activeRelease ? `Release Governance Analysis: ${activeRelease.id}` : ''}
      >
        {activeRelease && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wide">Target Asset</span>
              <h4 className="text-sm font-bold text-dark-900 dark:text-dark-100 mt-0.5">{activeRelease.application}</h4>
              <p className="text-[11px] text-dark-500 mt-1">Version tag: {activeRelease.version} • Environment: {activeRelease.environment}</p>
            </div>

            {/* Quality gate checks status list */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Quality Gate Signals</h5>
              <div className="space-y-2 text-xs font-semibold text-dark-600 dark:text-dark-300">
                <div className="flex justify-between items-center p-2 rounded bg-dark-50 dark:bg-dark-950">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-dark-400" /> Build Output</span>
                  <RAGBadge status={activeRelease.buildStatus} />
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-dark-50 dark:bg-dark-950">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-dark-400" /> Test Executions</span>
                  <RAGBadge status={activeRelease.testStatus} />
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-dark-50 dark:bg-dark-950">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-dark-400" /> Security Posture</span>
                  <RAGBadge status={activeRelease.securityStatus} />
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-dark-50 dark:bg-dark-950">
                  <span className="flex items-center gap-1.5"><FileCheck className="h-4 w-4 text-dark-400" /> Change Approval</span>
                  <RAGBadge status={activeRelease.changeStatus} />
                </div>
              </div>
            </div>

            {/* Pipeline detailed metrics */}
            {activeRelease.pipelineMetrics && (
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Pipeline Performance</h5>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="p-3 border border-dark-100 dark:border-dark-850 rounded-lg">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Build Time</span>
                    <span className="text-dark-900 dark:text-dark-100">{activeRelease.pipelineMetrics.buildDurationMinutes} min</span>
                  </div>
                  <div className="p-3 border border-dark-100 dark:border-dark-850 rounded-lg">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Test Run Time</span>
                    <span className="text-dark-900 dark:text-dark-100">{activeRelease.pipelineMetrics.testDurationMinutes} min</span>
                  </div>
                  <div className="p-3 border border-dark-100 dark:border-dark-850 rounded-lg">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Deployment Time</span>
                    <span className="text-dark-900 dark:text-dark-100">{activeRelease.pipelineMetrics.deployDurationMinutes} min</span>
                  </div>
                  <div className="p-3 border border-dark-100 dark:border-dark-850 rounded-lg">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Code Coverage</span>
                    <span className="text-dark-900 dark:text-dark-100">{activeRelease.pipelineMetrics.testCoveragePct}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
