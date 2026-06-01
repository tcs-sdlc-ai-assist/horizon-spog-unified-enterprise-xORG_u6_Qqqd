import React, { useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { ShieldCheck, Bug, ClipboardCheck, AlertTriangle } from 'lucide-react';

export default function SecurityPosturePage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { applications } = filteredData;

  // Aggregate security stats
  const totalCritical = useMemo(() => {
    return applications.reduce((sum, app) => sum + (app.securityPosture?.criticalVulnerabilities || 0), 0);
  }, [applications]);

  const totalHigh = useMemo(() => {
    return applications.reduce((sum, app) => sum + (app.securityPosture?.highVulnerabilities || 0), 0);
  }, [applications]);

  const avgSecurityScore = useMemo(() => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + (app.securityPosture?.score || 0), 0);
    return Math.round(sum / applications.length);
  }, [applications]);

  const secureSdlcPct = useMemo(() => {
    if (applications.length === 0) return 0;
    const compliant = applications.filter(app => app.securityPosture?.secureSDLCCompliant).length;
    return Math.round((compliant / applications.length) * 100);
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Enterprise Security Posture
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Verify vulnerability remediation age limits, monitor secure SDLC gating status, and manage policy compliance.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Critical Findings"
          value={totalCritical}
          description="Open severe vulnerabilities"
          trendDirection={totalCritical > 0 ? 'down' : 'up'}
          icon={AlertTriangle}
        />
        <StatCard
          title="High Findings"
          value={totalHigh}
          description="Aged security findings"
          icon={Bug}
        />
        <StatCard
          title="Avg Security Score"
          value={`${avgSecurityScore}%`}
          description="Static Analysis baseline"
          icon={ShieldCheck}
        />
        <StatCard
          title="Secure SDLC compliance"
          value={`${secureSdlcPct}%`}
          description="Pipeline security gating compliance"
          icon={ClipboardCheck}
        />
      </div>

      {/* Application Security Heatmap */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Application Security Risk Ledger
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Security Score</th>
                <th className="py-2.5 px-3">Critical Vulns</th>
                <th className="py-2.5 px-3">High Vulns</th>
                <th className="py-2.5 px-3">Secure SDLC</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-dark-900 dark:text-dark-100">{app.name}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (app.securityPosture?.score || 0) > 90 
                        ? 'bg-healthy-50 text-healthy-700' 
                        : (app.securityPosture?.score || 0) > 75 
                        ? 'bg-warning-50 text-warning-700' 
                        : 'bg-critical-50 text-critical-700'
                    }`}>
                      {app.securityPosture?.score || 0}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-critical-650">{app.securityPosture?.criticalVulnerabilities || 0}</td>
                  <td className="py-3 px-3 font-semibold text-warning-650">{app.securityPosture?.highVulnerabilities || 0}</td>
                  <td className="py-3 px-3">
                    <RAGBadge status={app.securityPosture?.secureSDLCCompliant ? 'green' : 'red'} />
                  </td>
                  <td className="py-3 px-3 capitalize font-bold text-dark-500">{app.securityPosture?.complianceStatus}</td>
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
