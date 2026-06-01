import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import { useFilters } from '../contexts/FilterContext.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { Activity, ArrowRight, Milestone, Clock, CheckCircle } from 'lucide-react';

export default function JourneysPage() {
  const { filters } = useFilters();
  
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { journeys } = filteredData;

  // Let's compute mock health stats for each journey based on steps
  const journeyStats = useMemo(() => {
    return journeys.map(journey => {
      const steps = journey.steps || [];
      const hasCriticalStep = steps.some(s => s.status === 'critical' || s.status === 'red');
      const hasWarningStep = steps.some(s => s.status === 'warning' || s.status === 'amber');
      
      let overallStatus = 'green';
      if (hasCriticalStep) overallStatus = 'red';
      else if (hasWarningStep) overallStatus = 'amber';

      const totalLatency = steps.reduce((sum, s) => sum + (s.latencyMs || 0), 0);
      const avgLatency = steps.length ? Math.round(totalLatency / steps.length) : 0;

      // Mock business impact based on journey ID
      let impactScore = 'Medium';
      if (journey.id.includes('enrollment') || journey.id.includes('claims')) {
        impactScore = 'High';
      }

      return {
        ...journey,
        overallStatus,
        avgLatency,
        impactScore,
      };
    });
  }, [journeys]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Business Journey Health Mapping
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Monitor critical, multi-step customer transaction pathways and their underlying system dependencies.
        </p>
      </div>

      {/* Journeys List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {journeyStats.map((journey) => (
          <div 
            key={journey.id}
            className="group card p-6 border border-dark-100 dark:border-dark-800 hover:border-horizon-300 dark:hover:border-horizon-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-warning-100 dark:bg-warning-950 text-warning-600 dark:text-warning-400 rounded-lg">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-bold text-dark-900 dark:text-dark-100 group-hover:text-horizon-600 dark:group-hover:text-horizon-400 transition-colors">
                    {journey.name}
                  </h2>
                </div>
                <RAGBadge status={journey.overallStatus} />
              </div>

              <p className="text-xs text-dark-500 dark:text-dark-400 mt-3 leading-relaxed">
                {journey.description}
              </p>

              {/* Journey Steps Summary */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider block">
                  Pipeline Steps ({journey.steps?.length || 0})
                </span>
                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                  {journey.steps?.map((step, idx) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          step.status === 'healthy' || step.status === 'green'
                            ? 'bg-healthy-500'
                            : step.status === 'warning' || step.status === 'amber'
                            ? 'bg-warning-500'
                            : 'bg-critical-500'
                        }`} />
                        <span className="text-[8px] font-semibold text-dark-400 dark:text-dark-500 mt-1 truncate max-w-[60px]">
                          {step.name}
                        </span>
                      </div>
                      {idx < journey.steps.length - 1 && (
                        <div className="h-0.5 w-6 bg-dark-200 dark:bg-dark-800 -mt-3 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Journey Stats Ribbon */}
            <div className="mt-6 pt-4 border-t border-dark-100 dark:border-dark-800 flex justify-between items-center text-[10px] font-bold">
              <div className="flex gap-4 text-dark-500 dark:text-dark-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {journey.avgLatency}ms avg latency
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Impact: {journey.impactScore}
                </span>
              </div>
              
              <Link 
                to={`/journeys/${journey.id}`}
                className="inline-flex items-center gap-1 text-horizon-600 dark:text-horizon-400 hover:underline"
              >
                <span>Drill down</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
