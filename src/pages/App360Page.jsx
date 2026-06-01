import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { 
  AppWindow, 
  HelpCircle, 
  Layers, 
  Activity, 
  FileWarning, 
  GitBranch, 
  ShieldCheck, 
  TestTube, 
  Settings,
  Mail,
  Slack,
  Cpu,
  TrendingUp,
  Clock,
  Compass,
  AlertCircle
} from 'lucide-react';

export default function App360Page() {
  const { appId } = useParams();
  
  const allApps = dataService.getApplications();
  const allIncidents = dataService.getIncidents();
  const allReleases = dataService.getReleases();

  // Find app
  const app = useMemo(() => {
    return allApps.find(a => a.id === appId) || allApps[0];
  }, [appId, allApps]);

  const appIncidents = useMemo(() => {
    return allIncidents.filter(inc => inc.application === app?.id);
  }, [app, allIncidents]);

  const appReleases = useMemo(() => {
    return allReleases.filter(rel => rel.application === app?.id);
  }, [app, allReleases]);

  const [activeTab, setActiveTab] = useState('overview'); // overview, health, incidents, releases, security, qe

  if (!app) {
    return (
      <div className="py-12 text-center text-dark-500">
        <HelpCircle className="h-10 w-10 mx-auto" />
        <p className="mt-2 text-sm font-semibold">Application profile not found</p>
      </div>
    );
  }

  // Active status color
  const statusColor = app.ragStatus || 'green';

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'health', label: 'Health & SLOs', icon: Activity },
    { id: 'incidents', label: 'Incidents', icon: FileWarning },
    { id: 'releases', label: 'Releases & CI/CD', icon: GitBranch },
    { id: 'security', label: 'Security & Posture', icon: ShieldCheck },
    { id: 'qe', label: 'Quality & Defects', icon: TestTube },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-horizon-100 dark:bg-horizon-950 text-horizon-600 dark:text-horizon-400 rounded-xl">
            <AppWindow className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
                {app.name}
              </h1>
              <span className="px-2 py-0.5 bg-dark-100 dark:bg-dark-800 text-dark-500 rounded text-[10px] font-bold uppercase tracking-wider">
                ID: {app.id}
              </span>
              <RAGBadge status={statusColor} />
            </div>
            <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mt-1">
              Domain: <span className="text-dark-700 dark:text-dark-300 capitalize">{app.domain}</span> • 
              Portfolio: <span className="text-dark-700 dark:text-dark-300 capitalize">{app.portfolio}</span> • 
              Criticality: <span className="text-dark-700 dark:text-dark-300 capitalize font-bold">{app.criticality}</span>
            </p>
          </div>
        </div>

        {/* Quick Contact info */}
        <div className="flex items-center gap-3 text-xs font-medium text-dark-600 dark:text-dark-400 border-l border-dark-200 dark:border-dark-800 pl-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-dark-400" />
              <span>Owner: {app.owner || 'N/A'}</span>
            </div>
            {app.teamSlack && (
              <div className="flex items-center gap-1.5 text-horizon-600 dark:text-horizon-400">
                <Slack className="h-4 w-4" />
                <span>Slack: {app.teamSlack}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-dark-200 dark:border-dark-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabItems.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                isActive
                  ? 'border-horizon-500 text-horizon-600 dark:text-horizon-400'
                  : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-dark-300'
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-6 shadow-sm min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tech Stack & Environments */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Technology Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {app.techStack?.map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-xs font-semibold text-dark-700 dark:text-dark-300 rounded-lg">
                      {tech}
                    </span>
                  )) || <span className="text-xs text-dark-400 italic">No technologies defined</span>}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Active Deployments</h3>
                <div className="flex flex-wrap gap-1.5">
                  {app.environments?.map(env => (
                    <span key={env} className="px-2.5 py-1 bg-horizon-50 dark:bg-horizon-950/20 border border-horizon-200 dark:border-horizon-900 text-xs font-semibold text-horizon-700 dark:text-horizon-400 rounded-lg uppercase">
                      {env}
                    </span>
                  )) || <span className="text-xs text-dark-400 italic">No environments configured</span>}
                </div>
              </div>
            </div>

            {/* Toolchain configurations */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">DevOps Toolchain</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-dark-600 dark:text-dark-400">
                <div className="p-3 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">CI/CD Pipeline</span>
                  <span className="text-dark-900 dark:text-dark-100">{app.toolchain?.cicd || 'Jenkins'}</span>
                </div>
                <div className="p-3 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Monitoring</span>
                  <span className="text-dark-900 dark:text-dark-100">{app.toolchain?.monitoring || 'Datadog'}</span>
                </div>
                <div className="p-3 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Logging System</span>
                  <span className="text-dark-900 dark:text-dark-100">{app.toolchain?.logging || 'Splunk'}</span>
                </div>
                <div className="p-3 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Cloud Provider</span>
                  <span className="text-dark-900 dark:text-dark-100">{app.toolchain?.cloudProvider || 'AWS'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Reliability & SLA Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl">
                <span className="text-2xs font-bold text-dark-400 block uppercase">Availability</span>
                <span className="text-2xl font-extrabold text-dark-900 dark:text-dark-100 mt-2 block">
                  {app.healthStatus?.availability || 99.9}%
                </span>
                <span className="text-[10px] text-healthy-600 font-semibold mt-1 block">SLO Target: 99.95%</span>
              </div>
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl">
                <span className="text-2xs font-bold text-dark-400 block uppercase">P99 Latency</span>
                <span className="text-2xl font-extrabold text-dark-900 dark:text-dark-100 mt-2 block">
                  {app.healthStatus?.latencyP99Ms || 250} ms
                </span>
                <span className="text-[10px] text-dark-400 font-semibold mt-1 block">Within normal limits</span>
              </div>
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl">
                <span className="text-2xs font-bold text-dark-400 block uppercase">Error Rate</span>
                <span className="text-2xl font-extrabold text-dark-900 dark:text-dark-100 mt-2 block">
                  {app.healthStatus?.errorRate || 0.05}%
                </span>
                <span className="text-[10px] text-dark-400 font-semibold mt-1 block">Target threshold: &lt; 0.1%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Linked Incident Tickets ({appIncidents.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Ticket</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                  {appIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-horizon-600 dark:text-horizon-400">{inc.id}</td>
                      <td className="py-3 px-3 font-bold text-dark-900 dark:text-dark-100">{inc.title}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.severity === 'Sev1' ? 'bg-critical-50 text-critical-700' : 'bg-warning-50 text-warning-700'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <RAGBadge status={inc.status === 'Resolved' ? 'green' : 'amber'} />
                      </td>
                      <td className="py-3 px-3 text-dark-500">{new Date(inc.timestamps.created).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {appIncidents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-dark-400 italic">No incidents recorded for this application</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'releases' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Deployment History ({appReleases.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Release ID</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3">Readiness Score</th>
                    <th className="py-2.5 px-3">Deploy Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                  {appReleases.map(rel => (
                    <tr key={rel.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-horizon-600 dark:text-horizon-400">{rel.id}</td>
                      <td className="py-3 px-3 font-bold text-dark-900 dark:text-dark-100">{rel.version}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rel.readinessScore > 90 ? 'bg-healthy-50 text-healthy-700' : 'bg-warning-50 text-warning-700'
                        }`}>
                          {rel.readinessScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-dark-500">{new Date(rel.deployDate).toLocaleDateString()}</td>
                      <td className="py-3 px-3 capitalize font-bold text-healthy-600">{rel.status}</td>
                    </tr>
                  ))}
                  {appReleases.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-dark-400 italic">No releases recorded for this application</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Security Vulnerability Assessment</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                app.securityPosture?.complianceStatus === 'compliant' ? 'bg-healthy-50 text-healthy-700' : 'bg-critical-50 text-critical-700'
              }`}>
                Compliance: {app.securityPosture?.complianceStatus || 'Compliant'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl text-center">
                <span className="text-3xl font-extrabold text-dark-900 dark:text-dark-100 block">
                  {app.securityPosture?.score || 95}%
                </span>
                <span className="text-[10px] text-dark-400 font-bold block uppercase mt-2">Overall Score</span>
              </div>
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl text-center">
                <span className="text-3xl font-extrabold text-critical-600 dark:text-critical-400 block">
                  {app.securityPosture?.criticalVulnerabilities || 0}
                </span>
                <span className="text-[10px] text-dark-400 font-bold block uppercase mt-2">Critical Finding</span>
              </div>
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl text-center">
                <span className="text-3xl font-extrabold text-warning-600 dark:text-warning-400 block">
                  {app.securityPosture?.highVulnerabilities || 0}
                </span>
                <span className="text-[10px] text-dark-400 font-bold block uppercase mt-2">High Finding</span>
              </div>
              <div className="p-4 border border-dark-100 dark:border-dark-800 rounded-xl text-center">
                <span className="text-3xl font-extrabold text-dark-500 block">
                  {app.securityPosture?.mediumVulnerabilities || 0}
                </span>
                <span className="text-[10px] text-dark-400 font-bold block uppercase mt-2">Medium Finding</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qe' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">Quality Engineering Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Test statistics */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-dark-800 dark:text-dark-200">Test Execution Summary</h4>
                <div className="space-y-3 font-semibold text-xs text-dark-600 dark:text-dark-400">
                  <div className="flex justify-between border-b border-dark-100 dark:border-dark-800 pb-2">
                    <span>Automation Coverage:</span>
                    <span className="text-dark-900 dark:text-dark-100">84.5%</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-100 dark:border-dark-800 pb-2">
                    <span>Test Execution Success Rate:</span>
                    <span className="text-healthy-600 dark:text-healthy-400 font-bold">99.88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SonarQube Quality Gate:</span>
                    <span className="text-healthy-600 dark:text-healthy-400 font-bold uppercase">Passed</span>
                  </div>
                </div>
              </div>

              {/* Defect breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-dark-800 dark:text-dark-200">Defect Breakdown</h4>
                <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold text-dark-600">
                  <div className="p-2.5 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                    <span className="text-critical-650 block text-lg font-extrabold">{app.defectCount?.critical || 0}</span>
                    <span className="text-[10px] text-dark-400 block font-semibold uppercase mt-0.5">Critical</span>
                  </div>
                  <div className="p-2.5 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                    <span className="text-warning-650 block text-lg font-extrabold">{app.defectCount?.high || 0}</span>
                    <span className="text-[10px] text-dark-400 block font-semibold uppercase mt-0.5">High</span>
                  </div>
                  <div className="p-2.5 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                    <span className="text-dark-750 block text-lg font-extrabold">{app.defectCount?.medium || 0}</span>
                    <span className="text-[10px] text-dark-400 block font-semibold uppercase mt-0.5">Medium</span>
                  </div>
                  <div className="p-2.5 bg-dark-50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 rounded-lg">
                    <span className="text-dark-500 block text-lg font-extrabold">{app.defectCount?.low || 0}</span>
                    <span className="text-[10px] text-dark-400 block font-semibold uppercase mt-0.5">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
