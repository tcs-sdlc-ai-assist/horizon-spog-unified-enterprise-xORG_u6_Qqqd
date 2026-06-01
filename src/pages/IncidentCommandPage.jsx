import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import { 
  FileWarning, 
  Search, 
  HelpCircle, 
  Terminal, 
  Clock, 
  AlertTriangle, 
  Share2,
  Workflow,
  Cpu,
  Bookmark
} from 'lucide-react';

// Correlation event logs definitions
const EVENT_MOCKS = {
  'OBS-2001': { id: 'OBS-2001', type: 'Observability', title: 'Pod CPU Utilization > 95%', time: '2024-11-01T03:10:00Z', source: 'Dynatrace', desc: 'Container engine detected CPU limit breach on ep-enrollment-engine-v8-5g9q.' },
  'ITSM-3001': { id: 'ITSM-3001', type: 'Change Ticket', title: 'Patch Deployment: Enrollment Validator', time: '2024-11-01T03:05:00Z', source: 'ServiceNow', desc: 'Change request CR-8942 deployed successfully by Jenkins pipeline.' },
  'DYN-4001': { id: 'DYN-4001', type: 'Trace Anomaly', title: 'DB Pool Timeout Exception', time: '2024-11-01T03:14:00Z', source: 'Dynatrace', desc: 'Cascading timeouts detected on JDBC connection checkout. Queue size: 150.' },
  'OBS-2002': { id: 'OBS-2002', type: 'Observability', title: 'Heap Memory Allocation Breach', time: '2024-11-03T14:15:00Z', source: 'Splunk', desc: 'JVM Metaspace memory pool exceeded 92% capacity threshold.' },
  'DYN-4002': { id: 'DYN-4002', type: 'Trace Anomaly', title: 'Rule Engine Evaluation Slowdown', time: '2024-11-03T14:18:00Z', source: 'Dynatrace', desc: 'Garbage Collection pause exceeded 12 seconds, blocking claims runner thread pool.' },
  'SPL-5001': { id: 'SPL-5001', type: 'Log Exception', title: 'OutOfMemoryError: Metaspace', time: '2024-11-03T14:21:00Z', source: 'Splunk', desc: 'Severe exception logged in application runner log stream: java.lang.OutOfMemoryError.' },
};

function getMockEvent(id) {
  return EVENT_MOCKS[id] || {
    id,
    type: 'Generic Event',
    title: 'Anomalous event flagged',
    time: '2024-11-14T12:00:00Z',
    source: 'Splunk',
    desc: 'System health diagnostic alert flagged on application container stream.'
  };
}

export default function IncidentCommandPage() {
  const { filters } = useFilters();
  const [searchParams] = useSearchParams();
  const incidentQueryId = searchParams.get('id');

  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { incidents } = filteredData;

  // Selected incident ID state
  const [selectedIncId, setSelectedIncId] = useState(null);

  // Set default selection based on query param or first incident
  useEffect(() => {
    if (incidentQueryId) {
      setSelectedIncId(incidentQueryId);
    } else if (incidents.length > 0 && !selectedIncId) {
      setSelectedIncId(incidents[0].id);
    }
  }, [incidentQueryId, incidents]);

  // Find active selected incident
  const activeIncident = useMemo(() => {
    return incidents.find(inc => inc.id === selectedIncId) || incidents[0];
  }, [selectedIncId, incidents]);

  // Correlated logs parsed
  const correlatedLogs = useMemo(() => {
    if (!activeIncident || !activeIncident.correlatedEvents) return [];
    return activeIncident.correlatedEvents.map(getMockEvent);
  }, [activeIncident]);

  // Metrics calculations
  const openCount = incidents.filter(i => i.status !== 'Resolved').length;
  
  const avgMttd = useMemo(() => {
    if (incidents.length === 0) return 0;
    const sum = incidents.reduce((acc, i) => acc + (i.mttdMinutes || 0), 0);
    return Math.round(sum / incidents.length);
  }, [incidents]);

  const avgMttr = useMemo(() => {
    if (incidents.length === 0) return 0;
    const sum = incidents.reduce((acc, i) => acc + (i.mttrMinutes || 0), 0);
    return Math.round(sum / incidents.length);
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Incident Command Center
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Unify cross-platform incidents, correlate ITSM change logs with APM monitoring logs, and assess transaction impacts.
        </p>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Open Incidents"
          value={openCount}
          description="Awaiting resolution/analysis"
          trendDirection={openCount > 2 ? 'down' : 'up'}
          icon={AlertTriangle}
        />
        <StatCard
          title="Avg Time to Detect (MTTD)"
          value={`${avgMttd}m`}
          description="Average APM alert trigger delay"
          icon={Clock}
        />
        <StatCard
          title="Avg Time to Resolve (MTTR)"
          value={`${avgMttr}m`}
          description="Average ITSM ticket resolution span"
          icon={Bookmark}
        />
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Table Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Incident Log Streams
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                  <th className="py-2 px-3">Ticket</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Application</th>
                  <th className="py-2 px-3">Source</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
                {incidents.map((inc) => {
                  const isSelected = activeIncident && inc.id === activeIncident.id;
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncId(inc.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-horizon-500/10 hover:bg-horizon-500/15 text-dark-950 dark:text-white'
                          : 'hover:bg-dark-50/50 dark:hover:bg-dark-850/50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-horizon-600 dark:text-horizon-400">{inc.id}</span>
                          <span className="text-[10px] text-dark-400 line-clamp-1 max-w-[150px] font-normal">{inc.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.severity === 'Sev1' ? 'bg-critical-50 text-critical-700' : 'bg-warning-50 text-warning-700'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold">{inc.application}</td>
                      <td className="py-3 px-3 text-dark-500">{inc.source}</td>
                      <td className="py-3 px-3">
                        <RAGBadge status={inc.status === 'Resolved' ? 'green' : 'amber'} />
                      </td>
                    </tr>
                  );
                })}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-dark-400 italic">No incidents matching filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Incident Panel & Events Correlation */}
        <div className="space-y-6">
          {activeIncident ? (
            <>
              {/* Profile Card */}
              <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wide">Selected Ticket</span>
                    <h2 className="text-sm font-bold text-dark-900 dark:text-dark-100 flex items-center gap-1.5 mt-0.5">
                      <span>{activeIncident.id}</span>
                      <RAGBadge status={activeIncident.status === 'Resolved' ? 'green' : 'amber'} />
                    </h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-critical-50 text-critical-700`}>
                    {activeIncident.severity}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-dark-850 dark:text-dark-200 leading-snug">
                    {activeIncident.title}
                  </h3>
                  <p className="text-[11px] text-dark-450 leading-relaxed dark:text-dark-400">
                    {activeIncident.rcaSummary || 'Root cause analysis in progress.'}
                  </p>
                </div>

                {/* Scope items links */}
                <div className="border-t border-dark-100 dark:border-dark-800 pt-3 space-y-2 text-[11px] font-medium text-dark-500">
                  <div className="flex justify-between items-center">
                    <span>Scope App:</span>
                    <Link
                      to={`/applications/${activeIncident.application}`}
                      className="text-horizon-600 dark:text-horizon-400 flex items-center gap-0.5 hover:underline font-bold"
                    >
                      <Cpu className="h-3 w-3" />
                      <span>{activeIncident.application}</span>
                    </Link>
                  </div>

                  {activeIncident.impactedJourneys && activeIncident.impactedJourneys.length > 0 && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-[10px] text-dark-400 block font-bold uppercase tracking-wider">Impacted Transactions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeIncident.impactedJourneys.map(j => (
                          <span 
                            key={j} 
                            className="px-2 py-0.5 bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300 rounded border border-dark-200/50 dark:border-dark-700/50 text-[9px] font-semibold"
                          >
                            {j}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Correlated Logs timeline */}
              <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Workflow className="h-4 w-4 text-horizon-600" />
                    <span>Correlated APM Logs</span>
                  </h3>
                  <span className="text-[9px] bg-dark-100 dark:bg-dark-850 px-2 py-0.5 rounded font-bold text-dark-500 uppercase tracking-wider">
                    Timeline correlation
                  </span>
                </div>

                <div className="space-y-4 pl-3 border-l-2 border-dark-200 dark:border-dark-800">
                  {correlatedLogs.map((log, idx) => (
                    <div key={log.id} className="relative space-y-1">
                      {/* Timeline dot */}
                      <span className="h-3 w-3 rounded-full bg-horizon-500 border-2 border-white dark:border-dark-900 absolute -left-[19px] top-1 shadow-sm" />
                      
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[10px] font-bold text-horizon-600 dark:text-horizon-400 uppercase tracking-wide">
                          {log.type}
                        </span>
                        <span className="text-[9px] text-dark-400">
                          {new Date(log.time).toLocaleTimeString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-dark-850 dark:text-dark-250 leading-tight">
                        {log.title}
                      </h4>
                      <p className="text-[10px] text-dark-450 leading-relaxed dark:text-dark-400 font-medium">
                        {log.desc}
                      </p>
                    </div>
                  ))}
                  {correlatedLogs.length === 0 && (
                    <div className="text-center py-6 text-[10px] text-dark-450 italic">
                      No anomalies correlated during this ticket interval.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm text-center text-dark-400 py-12">
              <FileWarning className="h-8 w-8 mx-auto mb-2 text-dark-300" />
              <p className="text-xs font-semibold">Select an incident to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
