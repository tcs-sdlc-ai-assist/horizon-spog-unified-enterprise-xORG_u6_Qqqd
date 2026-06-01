import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import JourneyFlowDiagram from '../components/widgets/JourneyFlowDiagram.jsx';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { 
  Milestone, 
  HelpCircle, 
  Activity, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  Play, 
  ChevronRight,
  AppWindow,
  Cpu
} from 'lucide-react';

export default function JourneyDetailPage() {
  const { journeyId } = useParams();
  const rawJourneys = dataService.getJourneys();
  
  // Find matching journey
  const baseJourney = useMemo(() => {
    return rawJourneys.find(j => j.id === journeyId) || rawJourneys[0];
  }, [journeyId, rawJourneys]);

  const [activeScenario, setActiveScenario] = useState('normal'); // 'normal', 'spike', 'outage'
  const [steps, setSteps] = useState([]);

  // Sync step values when journey or active scenario changes
  useEffect(() => {
    if (!baseJourney) return;
    
    // Copy base steps
    let currentSteps = JSON.parse(JSON.stringify(baseJourney.steps || []));

    if (activeScenario === 'spike') {
      // Simulate Enrollment / Load Spike
      currentSteps = currentSteps.map(step => {
        if (step.name.includes('Submission') || step.name.includes('Process') || step.name.includes('Calculation')) {
          return {
            ...step,
            latencyMs: Math.round(step.latencyMs * 4.5),
            status: 'warning'
          };
        }
        return step;
      });
    } else if (activeScenario === 'outage') {
      // Simulate database outage / backend outage on step 4 or step 3
      currentSteps = currentSteps.map((step, idx) => {
        if (idx === 3 || step.name.includes('Process') || step.name.includes('Adjudication')) {
          return {
            ...step,
            latencyMs: Math.round(step.latencyMs * 25),
            status: 'critical'
          };
        }
        return step;
      });
    }

    setSteps(currentSteps);
  }, [baseJourney, activeScenario]);

  if (!baseJourney) {
    return (
      <div className="py-12 text-center text-dark-500">
        <HelpCircle className="h-10 w-10 mx-auto" />
        <p className="mt-2 text-sm font-semibold">Journey not found</p>
      </div>
    );
  }

  // Calculate overall metrics
  const totalLatency = steps.reduce((sum, s) => sum + (s.latencyMs || 0), 0);
  const isHealthy = steps.every(s => s.status === 'healthy' || s.status === 'green');
  const isCritical = steps.some(s => s.status === 'critical' || s.status === 'red');
  
  let overallRAG = 'green';
  if (isCritical) overallRAG = 'red';
  else if (!isHealthy) overallRAG = 'amber';

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
              Journey Profile: {baseJourney.name}
            </h1>
            <RAGBadge status={overallRAG} />
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1 max-w-3xl">
            {baseJourney.description}
          </p>
        </div>
      </div>

      {/* Steps Flow Diagram */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Transaction Flow Diagram
        </h3>
        <JourneyFlowDiagram steps={steps} />
      </div>

      {/* Info Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Controls Panel */}
        <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-dark-900 dark:text-dark-100 flex items-center gap-1.5">
              <Play className="h-4.5 w-4.5 text-horizon-600" />
              <span>Simulation Controls</span>
            </h3>
            <p className="text-[11px] text-dark-400 dark:text-dark-500 mt-1">
              Select transaction scenarios to simulate load conditions and observe cascading impacts.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveScenario('normal')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-left text-xs font-bold transition-all ${
                activeScenario === 'normal'
                  ? 'bg-healthy-500/10 text-healthy-700 dark:text-healthy-400 border-healthy-500/30'
                  : 'bg-white dark:bg-dark-850 hover:bg-dark-50 dark:hover:bg-dark-800 border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-300'
              }`}
            >
              <span>Normal State</span>
              <span className="text-[10px] opacity-75">All healthy</span>
            </button>

            <button
              onClick={() => setActiveScenario('spike')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-left text-xs font-bold transition-all ${
                activeScenario === 'spike'
                  ? 'bg-warning-500/10 text-warning-700 dark:text-warning-400 border-warning-500/30'
                  : 'bg-white dark:bg-dark-850 hover:bg-dark-50 dark:hover:bg-dark-800 border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-300'
              }`}
            >
              <span>Simulate Enrollment Spike</span>
              <span className="text-[10px] opacity-75">Elevated latency</span>
            </button>

            <button
              onClick={() => setActiveScenario('outage')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-left text-xs font-bold transition-all ${
                activeScenario === 'outage'
                  ? 'bg-critical-500/10 text-critical-700 dark:text-critical-400 border-critical-500/30'
                  : 'bg-white dark:bg-dark-850 hover:bg-dark-50 dark:hover:bg-dark-800 border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-300'
              }`}
            >
              <span>Simulate DB Connection Leak</span>
              <span className="text-[10px] opacity-75">Service failure</span>
            </button>
          </div>
        </div>

        {/* Business Impact Metrics */}
        <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-dark-900 dark:text-dark-100 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-healthy-500" />
              <span>Business Impact Metrics</span>
            </h3>
            <p className="text-[11px] text-dark-400 dark:text-dark-500 mt-1">
              Transaction volumes and financial metrics linked to this journey.
            </p>
          </div>

          <div className="space-y-3 font-semibold text-xs text-dark-600 dark:text-dark-400">
            <div className="flex justify-between border-b border-dark-100 dark:border-dark-800 pb-2">
              <span>Total Pipeline Latency:</span>
              <span className="text-dark-900 dark:text-dark-200">{totalLatency} ms</span>
            </div>
            <div className="flex justify-between border-b border-dark-100 dark:border-dark-800 pb-2">
              <span>Hourly Volume:</span>
              <span className="text-dark-900 dark:text-dark-200">14,250 runs/hr</span>
            </div>
            <div className="flex justify-between border-b border-dark-100 dark:border-dark-800 pb-2">
              <span>Revenue Dependency:</span>
              <span className="text-healthy-600 dark:text-healthy-400 font-bold">$125K / hr</span>
            </div>
            <div className="flex justify-between">
              <span>Member Impact Tier:</span>
              <span className="text-critical-600 dark:text-critical-400 font-bold uppercase">Tier-1 Critical</span>
            </div>
          </div>
        </div>

        {/* Journey Dependencies (Applications) */}
        <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-dark-900 dark:text-dark-100 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-horizon-600" />
              <span>App Dependencies</span>
            </h3>
            <p className="text-[11px] text-dark-400 dark:text-dark-500 mt-1">
              Underlying apps driving individual steps in this transaction.
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-40 scrollbar-thin pr-1">
            {steps.map((step) => (
              <div 
                key={step.id}
                className="flex items-center justify-between p-2 rounded-lg border border-dark-100 dark:border-dark-800/80 bg-dark-50/20 dark:bg-dark-950/20"
              >
                <div className="flex items-center gap-2">
                  <AppWindow className="h-4 w-4 text-dark-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-dark-800 dark:text-dark-200">
                      {step.application}
                    </span>
                    <span className="text-[9px] text-dark-400">{step.name}</span>
                  </div>
                </div>

                <Link
                  to={`/applications/${step.application}`}
                  className="text-[9px] font-bold text-horizon-600 dark:text-horizon-400 flex items-center gap-0.5 hover:underline"
                >
                  <span>App 360</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
