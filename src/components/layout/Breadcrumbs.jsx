import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PATH_MAP = {
  'modules': 'Modules',
  'portfolio-health': 'Portfolio Health',
  'risk-summary': 'Risk Summary',
  'compliance-overview': 'Compliance Overview',
  'kpi-scorecard': 'KPI Scorecard',
  'budget-tracker': 'Budget Tracker',
  'incident-summary': 'Incident Summary',
  'deployment-pipeline': 'Deployment Pipeline',
  'infrastructure-health': 'Infrastructure Health',
  'security-posture': 'Security Posture',
  'vulnerability-tracker': 'Vulnerability Tracker',
  'tech-debt': 'Tech Debt',
  'sprint-metrics': 'Sprint Metrics',
  'team-health': 'Team Health',
  'slo-dashboard': 'SLO Dashboard',
  'error-budget': 'Error Budget',
  'monitoring-alerts': 'Monitoring & Alerts',
  'capacity-planning': 'Capacity Planning',
  'sla-tracker': 'SLA Tracker',
  'vendor-management': 'Vendor Management',
  'access-management': 'Access Management',
  'test-coverage': 'Test Coverage',
  'defect-tracker': 'Defect Tracker',
  'quality-gates': 'Quality Gates',
  'architecture-overview': 'Architecture Overview',
  'domains': 'Domains',
  'applications': 'Applications',
  'journeys': 'Business Journeys',
  'admin': 'Admin',
  'upload': 'Data Upload',
  'config': 'Configuration',
  'audit': 'Audit Log',
};

function formatSegment(segment) {
  if (!segment) return '';
  if (PATH_MAP[segment]) return PATH_MAP[segment];
  
  // Try to capitalize and clean up
  return segment
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') {
    return (
      <nav className="flex items-center space-x-2 text-sm text-dark-500 dark:text-dark-400">
        <Home className="h-4 w-4" />
        <span>Executive Command Center</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-1 md:space-x-2 text-sm text-dark-500 dark:text-dark-400">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-horizon-600 dark:hover:text-horizon-400 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden md:inline">Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = formatSegment(value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-dark-400 dark:text-dark-600" />
            {isLast ? (
              <span className="font-semibold text-dark-800 dark:text-dark-200 truncate max-w-[150px] md:max-w-xs">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-horizon-600 dark:hover:text-horizon-400 transition-colors truncate max-w-[120px] md:max-w-[200px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
