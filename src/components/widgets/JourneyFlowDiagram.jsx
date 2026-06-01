import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Clock, AlertCircle } from 'lucide-react';
import RAGBadge from '../shared/RAGBadge.jsx';

export default function JourneyFlowDiagram({ steps = [] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
      <div className="flex items-center min-w-[700px] py-4">
        {steps.map((step, idx) => {
          let badgeColor = 'bg-healthy-500 shadow-healthy-500/20';
          let borderStyle = 'border-healthy-200 dark:border-healthy-800';

          if (step.status === 'warning' || step.status === 'amber') {
            badgeColor = 'bg-warning-500 shadow-warning-500/20';
            borderStyle = 'border-warning-200 dark:border-warning-800';
          } else if (step.status === 'critical' || step.status === 'red') {
            badgeColor = 'bg-critical-500 shadow-critical-500/20';
            borderStyle = 'border-critical-200 dark:border-critical-800';
          }

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex-1 max-w-[200px] flex flex-col items-center text-center relative group">
                {/* Node Status Dot */}
                <div className={`h-12 w-12 rounded-full border-4 ${borderStyle} bg-white dark:bg-dark-955 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10`}>
                  <div className={`h-4 w-4 rounded-full ${badgeColor}`} />
                </div>

                {/* Node Labels */}
                <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wide mt-3">
                  Step {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-dark-800 dark:text-dark-200 mt-1 line-clamp-1">
                  {step.name}
                </h4>

                {/* Underlying App Link */}
                <Link
                  to={`/applications/${step.application}`}
                  className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-dark-50 dark:bg-dark-800 hover:bg-horizon-50 dark:hover:bg-horizon-950/20 rounded-md border border-dark-200 dark:border-dark-700/80 text-[10px] font-semibold text-horizon-600 dark:text-horizon-400 transition-colors"
                >
                  <Cpu className="h-3 w-3" />
                  <span>{step.application}</span>
                </Link>

                {/* Latency metric */}
                <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-dark-500 dark:text-dark-400">
                  <Clock className="h-3 w-3" />
                  <span>{step.latencyMs} ms</span>
                </div>
              </div>

              {/* Connecting Connector */}
              {idx < steps.length - 1 && (
                <div className="flex-shrink-0 flex items-center justify-center px-2">
                  <div className="h-1 w-8 md:w-16 bg-dark-200 dark:bg-dark-800 rounded relative">
                    <ArrowRight className="h-4 w-4 text-dark-400 dark:text-dark-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
