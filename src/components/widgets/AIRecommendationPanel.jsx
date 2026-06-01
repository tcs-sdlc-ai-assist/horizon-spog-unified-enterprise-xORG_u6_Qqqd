import React, { useState, useMemo } from 'react';
import { aiRecommendationService } from '../../services/aiRecommendationService.js';
import { useFilters } from '../../contexts/FilterContext.jsx';
import { dataService } from '../../services/dataService.js';
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Cpu, LineChart } from 'lucide-react';

export default function AIRecommendationPanel() {
  const { filters } = useFilters();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load filtered data dynamically
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const recommendations = useMemo(() => {
    return aiRecommendationService.getRecommendations(filteredData);
  }, [filteredData]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-critical-50 text-critical-700 border-critical-200 dark:bg-critical-950/20 dark:text-critical-400 dark:border-critical-900/50';
      case 'high':
        return 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/20 dark:text-warning-400 dark:border-warning-900/50';
      case 'medium':
        return 'bg-horizon-50 text-horizon-700 border-horizon-200 dark:bg-horizon-950/20 dark:text-horizon-400 dark:border-horizon-900/50';
      default:
        return 'bg-dark-50 text-dark-700 border-dark-200 dark:bg-dark-950/20 dark:text-dark-400 dark:border-dark-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-horizon-600/5 to-transparent hover:bg-horizon-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-horizon-500 animate-pulse-slow" />
          <h3 className="text-sm font-extrabold text-dark-900 dark:text-dark-100 uppercase tracking-wider">
            Horizon GenAI Command Insights
          </h3>
          <span className="px-2 py-0.5 bg-horizon-500 text-white rounded-full text-[9px] font-bold">
            {recommendations.length} Active
          </span>
        </div>
        <button className="text-dark-400">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {/* Recommendations list */}
      {!isCollapsed && (
        <div className="border-t border-dark-100 dark:border-dark-800 p-5 divide-y divide-dark-100 dark:divide-dark-850 space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={rec.id} className={`pt-4 first:pt-0 space-y-2`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wide">
                    {rec.category}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-healthy-600 dark:text-healthy-400">
                  Confidence: {rec.confidence}%
                </span>
              </div>

              <h4 className="text-xs font-bold text-dark-850 dark:text-dark-200">
                {rec.title}
              </h4>
              <p className="text-[11px] text-dark-500 dark:text-dark-400 leading-relaxed font-medium">
                {rec.description}
              </p>
              
              <div className="bg-dark-50 dark:bg-dark-950 p-2.5 rounded-lg border border-dark-100/50 dark:border-dark-800 text-[10px] font-medium text-dark-500 dark:text-dark-450 leading-relaxed">
                <span className="font-bold text-dark-700 dark:text-dark-350 block mb-0.5">Underlying reason:</span>
                {rec.reason}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
