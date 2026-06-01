import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePersona } from '../../contexts/PersonaContext.jsx';
import { PERSONAS } from '../../constants/constants.js';
import {
  LayoutDashboard,
  Network,
  Activity,
  Siren,
  GitBranch,
  ShieldCheck,
  TestTube,
  Flame,
  LineChart,
  Upload,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const CORE_ITEMS = [
  { id: 'dashboard', label: 'Command Center', route: '/', icon: LayoutDashboard },
  { id: 'domains', label: 'Domain Explorer', route: '/domains', icon: Network },
  { id: 'journeys', label: 'Business Journeys', route: '/journeys', icon: Activity },
];

const OPERATIONAL_ITEMS = [
  {
    id: 'incidents',
    label: 'Incident Command',
    route: '/incidents',
    icon: Siren,
    modules: ['incident-summary']
  },
  {
    id: 'observability',
    label: 'Observability & SLOs',
    route: '/observability',
    icon: Flame,
    modules: ['infrastructure-health', 'monitoring-alerts', 'slo-dashboard', 'error-budget', 'capacity-planning', 'sla-tracker']
  },
  {
    id: 'releases',
    label: 'Release Governance',
    route: '/releases',
    icon: GitBranch,
    modules: ['deployment-pipeline', 'sprint-metrics']
  },
  {
    id: 'qe',
    label: 'Quality Engineering',
    route: '/qe',
    icon: TestTube,
    modules: ['test-coverage', 'defect-tracker', 'quality-gates', 'tech-debt']
  },
];

const STRATEGIC_ITEMS = [
  {
    id: 'security',
    label: 'Security & Posture',
    route: '/security',
    icon: ShieldCheck,
    modules: ['security-posture', 'vulnerability-tracker', 'compliance-overview', 'risk-summary', 'access-management']
  },
  {
    id: 'value-realization',
    label: 'Value & Strategy',
    route: '/value-realization',
    icon: LineChart,
    modules: ['budget-tracker', 'vendor-management', 'team-health', 'kpi-scorecard']
  },
];

const ADMIN_ITEMS = [
  { id: 'admin-upload', label: 'Data Upload', route: '/admin/upload', icon: Upload },
  { id: 'admin-config', label: 'Module Config', route: '/admin/config', icon: Settings },
  { id: 'admin-audit', label: 'Audit Trail', route: '/admin/audit', icon: History },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { persona } = usePersona();
  const location = useLocation();

  // Get active persona modules
  const currentPersonaDef = PERSONAS[persona] || PERSONAS.executive;
  const userModules = currentPersonaDef.modules || [];

  // Filter items based on whether user persona has access to their underlying modules
  // For non-admin, filter them. For admin, show everything.
  const filterByModules = (items) => {
    if (persona === 'admin') return items;
    return items.filter(item => 
      item.modules ? item.modules.some(mod => userModules.includes(mod)) : true
    );
  };

  const visibleOps = filterByModules(OPERATIONAL_ITEMS);
  const visibleStrat = filterByModules(STRATEGIC_ITEMS);

  // Admin items visible if admin persona, or we can show them for everyone with a badge
  const showAdmin = persona === 'admin';

  const renderLink = (item) => {
    const IconComponent = item.icon;
    return (
      <NavLink
        key={item.route}
        to={item.route}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
            isActive
              ? 'bg-horizon-600 text-white shadow-md'
              : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-dark-100'
          }`
        }
      >
        <IconComponent className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110`} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-dark-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap shadow-xl">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`fixed top-20 bottom-0 left-0 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transition-all duration-300 z-30 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {/* Core Sections */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-2xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider mb-2">
              Core Console
            </p>
          )}
          {CORE_ITEMS.map(renderLink)}
        </div>

        {/* Operational Modules */}
        {visibleOps.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-2xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider mb-2">
                Operations & Delivery
              </p>
            )}
            {visibleOps.map(renderLink)}
          </div>
        )}

        {/* Strategic Modules */}
        {visibleStrat.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-2xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider mb-2">
                Strategy & Risk
              </p>
            )}
            {visibleStrat.map(renderLink)}
          </div>
        )}

        {/* Administration Section */}
        {showAdmin && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-2xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider mb-2">
                System Administration
              </p>
            )}
            {ADMIN_ITEMS.map(renderLink)}
          </div>
        )}
      </div>

      {/* Footer Toggle / Quick Info */}
      <div className="p-3 border-t border-dark-200 dark:border-dark-800 flex items-center justify-between bg-dark-50 dark:bg-dark-950/30">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-horizon-600 dark:text-horizon-400 animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Assist Active</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-dark-400 dark:text-dark-500 hover:bg-dark-200 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-colors mx-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
