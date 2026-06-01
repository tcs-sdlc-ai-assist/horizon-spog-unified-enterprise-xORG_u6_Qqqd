import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../contexts/PersonaContext.jsx';
import { useFilters } from '../contexts/FilterContext.jsx';
import { dataService } from '../services/dataService.js';
import { PERSONAS } from '../constants/constants.js';
import { getWidgetDefinitionsForPersona } from '../constants/personaWidgetMap.js';
import GlobalFilterBar from '../components/filters/GlobalFilterBar.jsx';
import StatCard from '../components/shared/StatCard.jsx';
import KpiTile from '../components/widgets/KpiTile.jsx';
import AIRecommendationPanel from '../components/widgets/AIRecommendationPanel.jsx';
import { 
  AppWindow, 
  FileWarning, 
  Clock, 
  Rocket, 
  Sparkles,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

const ROUTE_MAPPING = {
  'portfolio-health': '/domains',
  'risk-summary': '/security',
  'compliance-overview': '/security',
  'kpi-scorecard': '/value-realization',
  'budget-tracker': '/value-realization',
  'incident-summary': '/incidents',
  'deployment-pipeline': '/releases',
  'infrastructure-health': '/observability',
  'security-posture': '/security',
  'vulnerability-tracker': '/security',
  'tech-debt': '/qe',
  'sprint-metrics': '/releases',
  'team-health': '/value-realization',
  'slo-dashboard': '/observability',
  'error-budget': '/observability',
  'monitoring-alerts': '/observability',
  'capacity-planning': '/observability',
  'sla-tracker': '/observability',
  'vendor-management': '/value-realization',
  'access-management': '/security',
  'test-coverage': '/qe',
  'defect-tracker': '/qe',
  'quality-gates': '/qe',
  'architecture-overview': '/domains',
};

const getPersonaKpis = (personaId, allKpis) => {
  switch (personaId) {
    case 'ciso':
      return allKpis.filter(k => k.category === 'security');
    case 'qe_lead':
      return allKpis.filter(k => k.category === 'qe');
    case 'devsecops_lead':
      return allKpis.filter(k => k.category === 'security' || k.category === 'devsecops');
    case 'cto':
    case 'vp_engineering':
      return allKpis.filter(k => k.category === 'devsecops' || k.id === 'availability-pct' || k.id === 'mttr');
    case 'ops_lead':
    case 'sre':
      return allKpis.filter(k => k.id === 'availability-pct' || k.id === 'sla-compliance-pct' || k.id === 'mttr' || k.id === 'mttd');
    case 'executive':
    case 'cio':
      return allKpis.filter(k => k.category === 'enterprise' || k.category === 'transformation');
    case 'admin':
    default:
      return allKpis.slice(0, 8);
  }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const { filters } = useFilters();

  const personaDef = PERSONAS[persona] || PERSONAS.executive;

  // Filtered data based on global filters
  const filteredData = useMemo(() => {
    return dataService.getFilteredData(filters);
  }, [filters]);

  const { applications, incidents, journeys, releases, kpis } = filteredData;

  // Active KPIs for this persona
  const activeKpis = useMemo(() => {
    return getPersonaKpis(persona, kpis);
  }, [persona, kpis]);

  // Modules assigned to this persona
  const widgets = useMemo(() => {
    return getWidgetDefinitionsForPersona(persona);
  }, [persona]);

  // Aggregate stats
  const appCount = applications.length;
  const activeIncidentsCount = incidents.filter(inc => inc.status !== 'Resolved').length;
  
  const avgMttr = useMemo(() => {
    if (incidents.length === 0) return 0;
    const total = incidents.reduce((acc, inc) => acc + (inc.mttrMinutes || 0), 0);
    return Math.round(total / incidents.length);
  }, [incidents]);

  const deployCount = releases.length;

  return (
    <div className="space-y-6">
      {/* Welcome header & custom greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight flex items-center gap-2">
            <span>Welcome, {personaDef.label}</span>
            <Sparkles className="h-5 w-5 text-horizon-500 animate-pulse-slow" />
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            {personaDef.description}
          </p>
        </div>
      </div>

      {/* Global filter bar */}
      <GlobalFilterBar />

      {/* Aggregate stats ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Applications"
          value={appCount}
          description="Active applications in scope"
          icon={AppWindow}
        />
        <StatCard
          title="Active Incidents"
          value={activeIncidentsCount}
          description="Open ServiceNow / Dynatrace alerts"
          trendDirection={activeIncidentsCount > 2 ? 'down' : 'up'}
          trendValue={activeIncidentsCount > 2 ? '+15%' : 'stable'}
          icon={FileWarning}
        />
        <StatCard
          title="Mean Time To Resolve"
          value={`${avgMttr}m`}
          description="Average incident MTTR"
          icon={Clock}
        />
        <StatCard
          title="Successful Deployments"
          value={deployCount}
          description="Releases deployed last 30 days"
          icon={Rocket}
        />
      </div>

      {/* AI Recommendation Insights */}
      <AIRecommendationPanel />

      {/* Dynamic Persona-based KPI Tiles */}
      {activeKpis.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-dark-800 dark:text-dark-200 uppercase tracking-wider">
            Key Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeKpis.map((kpi) => (
              <KpiTile key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      {/* Persona Module cards grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-dark-800 dark:text-dark-200 uppercase tracking-wider">
          Module Directory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {widgets.map((module) => {
            const mappedRoute = ROUTE_MAPPING[module.id] || `/`;
            return (
              <div 
                key={module.id}
                onClick={() => navigate(mappedRoute)}
                className="card group p-5 border border-dark-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-dark-800 dark:text-dark-100 flex items-center justify-between">
                    <span>{module.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-dark-400 group-hover:text-horizon-500 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-dark-400 dark:text-dark-500 mt-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-dark-400">
                    {module.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {widgets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-dark-400 dark:text-dark-500 border border-dashed border-dark-200 dark:border-dark-800 rounded-xl">
            <LayoutDashboard className="h-10 w-10 mb-2" />
            <p className="text-xs font-semibold">No modules configured</p>
          </div>
        )}
      </div>
    </div>
  );
}
