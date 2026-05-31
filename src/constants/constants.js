/**
 * Application-wide constants for Horizon SPOG
 */

// ─── Persona Definitions ────────────────────────────────────────────────────

/**
 * @typedef {Object} PersonaDefinition
 * @property {string} id - Unique persona identifier
 * @property {string} label - Display label
 * @property {string} description - Short description of the persona
 * @property {string} icon - Icon name from lucide-react
 * @property {string[]} modules - Module IDs visible to this persona
 */

/** @type {Record<string, PersonaDefinition>} */
export const PERSONAS = {
  executive: {
    id: 'executive',
    label: 'Executive',
    description: 'High-level organizational health and strategic KPIs',
    icon: 'LayoutDashboard',
    modules: [
      'portfolio-health',
      'risk-summary',
      'compliance-overview',
      'kpi-scorecard',
      'budget-tracker',
      'incident-summary',
    ],
  },
  cio: {
    id: 'cio',
    label: 'CIO',
    description: 'IT strategy, portfolio alignment, and digital transformation',
    icon: 'Building2',
    modules: [
      'portfolio-health',
      'budget-tracker',
      'kpi-scorecard',
      'compliance-overview',
      'vendor-management',
      'risk-summary',
    ],
  },
  cto: {
    id: 'cto',
    label: 'CTO',
    description: 'Technology strategy, architecture, and engineering metrics',
    icon: 'Cpu',
    modules: [
      'architecture-overview',
      'tech-debt',
      'deployment-pipeline',
      'kpi-scorecard',
      'incident-summary',
      'portfolio-health',
    ],
  },
  ciso: {
    id: 'ciso',
    label: 'CISO',
    description: 'Security posture, vulnerabilities, and compliance',
    icon: 'ShieldCheck',
    modules: [
      'security-posture',
      'vulnerability-tracker',
      'compliance-overview',
      'incident-summary',
      'risk-summary',
      'access-management',
    ],
  },
  vp_engineering: {
    id: 'vp_engineering',
    label: 'VP Engineering',
    description: 'Engineering velocity, team health, and delivery metrics',
    icon: 'Code2',
    modules: [
      'deployment-pipeline',
      'sprint-metrics',
      'tech-debt',
      'team-health',
      'kpi-scorecard',
      'incident-summary',
    ],
  },
  ops_lead: {
    id: 'ops_lead',
    label: 'Ops Lead',
    description: 'Infrastructure operations, uptime, and incident management',
    icon: 'Server',
    modules: [
      'infrastructure-health',
      'incident-summary',
      'deployment-pipeline',
      'sla-tracker',
      'capacity-planning',
      'monitoring-alerts',
    ],
  },
  sre: {
    id: 'sre',
    label: 'SRE',
    description: 'Reliability engineering, SLOs, error budgets, and observability',
    icon: 'Activity',
    modules: [
      'slo-dashboard',
      'error-budget',
      'incident-summary',
      'infrastructure-health',
      'monitoring-alerts',
      'deployment-pipeline',
    ],
  },
  qe_lead: {
    id: 'qe_lead',
    label: 'QE Lead',
    description: 'Quality engineering, test coverage, and defect tracking',
    icon: 'TestTube2',
    modules: [
      'test-coverage',
      'defect-tracker',
      'sprint-metrics',
      'deployment-pipeline',
      'kpi-scorecard',
      'quality-gates',
    ],
  },
  devsecops_lead: {
    id: 'devsecops_lead',
    label: 'DevSecOps Lead',
    description: 'Security in CI/CD, supply chain security, and policy enforcement',
    icon: 'ShieldAlert',
    modules: [
      'security-posture',
      'deployment-pipeline',
      'vulnerability-tracker',
      'compliance-overview',
      'quality-gates',
      'access-management',
    ],
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Full access to all modules and system configuration',
    icon: 'Settings',
    modules: [
      'portfolio-health',
      'risk-summary',
      'compliance-overview',
      'kpi-scorecard',
      'budget-tracker',
      'incident-summary',
      'deployment-pipeline',
      'infrastructure-health',
      'security-posture',
      'vulnerability-tracker',
      'tech-debt',
      'sprint-metrics',
      'team-health',
      'slo-dashboard',
      'error-budget',
      'monitoring-alerts',
      'capacity-planning',
      'sla-tracker',
      'vendor-management',
      'access-management',
      'test-coverage',
      'defect-tracker',
      'quality-gates',
      'architecture-overview',
    ],
  },
};

/** @type {string[]} */
export const PERSONA_IDS = Object.keys(PERSONAS);

// ─── localStorage Keys ──────────────────────────────────────────────────────

export const LOCAL_STORAGE_KEYS = {
  SELECTED_PERSONA: 'horizon_selected_persona',
  DARK_MODE: 'horizon_dark_mode',
  SIDEBAR_COLLAPSED: 'horizon_sidebar_collapsed',
  SELECTED_FILTERS: 'horizon_selected_filters',
  DATE_RANGE: 'horizon_date_range',
  LAYOUT_PREFERENCES: 'horizon_layout_preferences',
  RECENT_VIEWS: 'horizon_recent_views',
  FAVORITES: 'horizon_favorites',
};

// ─── RAG Status Values ──────────────────────────────────────────────────────

export const RAG_STATUS = {
  RED: 'red',
  AMBER: 'amber',
  GREEN: 'green',
  UNKNOWN: 'unknown',
};

export const RAG_STATUS_LABELS = {
  [RAG_STATUS.RED]: 'Critical',
  [RAG_STATUS.AMBER]: 'Warning',
  [RAG_STATUS.GREEN]: 'Healthy',
  [RAG_STATUS.UNKNOWN]: 'Unknown',
};

export const RAG_STATUS_COLORS = {
  [RAG_STATUS.RED]: 'critical',
  [RAG_STATUS.AMBER]: 'warning',
  [RAG_STATUS.GREEN]: 'healthy',
  [RAG_STATUS.UNKNOWN]: 'dark',
};

// ─── Criticality Tiers ─────────────────────────────────────────────────────

export const CRITICALITY_TIERS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

export const CRITICALITY_TIER_LABELS = {
  [CRITICALITY_TIERS.CRITICAL]: 'Critical',
  [CRITICALITY_TIERS.HIGH]: 'High',
  [CRITICALITY_TIERS.MEDIUM]: 'Medium',
  [CRITICALITY_TIERS.LOW]: 'Low',
  [CRITICALITY_TIERS.INFO]: 'Informational',
};

export const CRITICALITY_TIER_ORDER = [
  CRITICALITY_TIERS.CRITICAL,
  CRITICALITY_TIERS.HIGH,
  CRITICALITY_TIERS.MEDIUM,
  CRITICALITY_TIERS.LOW,
  CRITICALITY_TIERS.INFO,
];

// ─── Environment Types ─────────────────────────────────────────────────────

export const ENVIRONMENTS = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  QA: 'qa',
  DEVELOPMENT: 'development',
  SANDBOX: 'sandbox',
};

export const ENVIRONMENT_LABELS = {
  [ENVIRONMENTS.PRODUCTION]: 'Production',
  [ENVIRONMENTS.STAGING]: 'Staging',
  [ENVIRONMENTS.QA]: 'QA',
  [ENVIRONMENTS.DEVELOPMENT]: 'Development',
  [ENVIRONMENTS.SANDBOX]: 'Sandbox',
};

export const ENVIRONMENT_ORDER = [
  ENVIRONMENTS.PRODUCTION,
  ENVIRONMENTS.STAGING,
  ENVIRONMENTS.QA,
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.SANDBOX,
];

// ─── KPI Categories ────────────────────────────────────────────────────────

export const KPI_CATEGORIES = {
  RELIABILITY: 'reliability',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  DELIVERY: 'delivery',
  QUALITY: 'quality',
  COST: 'cost',
  COMPLIANCE: 'compliance',
  CUSTOMER: 'customer',
};

export const KPI_CATEGORY_LABELS = {
  [KPI_CATEGORIES.RELIABILITY]: 'Reliability',
  [KPI_CATEGORIES.PERFORMANCE]: 'Performance',
  [KPI_CATEGORIES.SECURITY]: 'Security',
  [KPI_CATEGORIES.DELIVERY]: 'Delivery',
  [KPI_CATEGORIES.QUALITY]: 'Quality',
  [KPI_CATEGORIES.COST]: 'Cost',
  [KPI_CATEGORIES.COMPLIANCE]: 'Compliance',
  [KPI_CATEGORIES.CUSTOMER]: 'Customer',
};

// ─── Date Range Options ────────────────────────────────────────────────────

export const DATE_RANGES = {
  LAST_24H: 'last_24h',
  LAST_7D: 'last_7d',
  LAST_30D: 'last_30d',
  LAST_90D: 'last_90d',
  LAST_6M: 'last_6m',
  LAST_1Y: 'last_1y',
  CUSTOM: 'custom',
};

export const DATE_RANGE_LABELS = {
  [DATE_RANGES.LAST_24H]: 'Last 24 Hours',
  [DATE_RANGES.LAST_7D]: 'Last 7 Days',
  [DATE_RANGES.LAST_30D]: 'Last 30 Days',
  [DATE_RANGES.LAST_90D]: 'Last 90 Days',
  [DATE_RANGES.LAST_6M]: 'Last 6 Months',
  [DATE_RANGES.LAST_1Y]: 'Last 1 Year',
  [DATE_RANGES.CUSTOM]: 'Custom Range',
};

export const DATE_RANGE_OPTIONS = Object.entries(DATE_RANGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// ─── Default Filter Values ─────────────────────────────────────────────────

export const DEFAULT_FILTERS = {
  persona: import.meta.env.VITE_DEFAULT_PERSONA || 'executive',
  dateRange: DATE_RANGES.LAST_30D,
  environment: ENVIRONMENTS.PRODUCTION,
  criticality: [],
  ragStatus: [],
  searchQuery: '',
};

// ─── Module Card Definitions ───────────────────────────────────────────────

/**
 * @typedef {Object} ModuleCardDefinition
 * @property {string} id - Unique module identifier
 * @property {string} title - Display title
 * @property {string} description - Short description
 * @property {string} icon - Icon name from lucide-react
 * @property {string} category - Module category
 * @property {string} route - Route path for the module
 */

/** @type {ModuleCardDefinition[]} */
export const MODULE_CARDS = [
  {
    id: 'portfolio-health',
    title: 'Portfolio Health',
    description: 'Overall health and status of the application portfolio',
    icon: 'BarChart3',
    category: 'strategy',
    route: '/modules/portfolio-health',
  },
  {
    id: 'risk-summary',
    title: 'Risk Summary',
    description: 'Aggregated risk posture across all domains',
    icon: 'AlertTriangle',
    category: 'governance',
    route: '/modules/risk-summary',
  },
  {
    id: 'compliance-overview',
    title: 'Compliance Overview',
    description: 'Regulatory and policy compliance status',
    icon: 'ClipboardCheck',
    category: 'governance',
    route: '/modules/compliance-overview',
  },
  {
    id: 'kpi-scorecard',
    title: 'KPI Scorecard',
    description: 'Key performance indicators across all categories',
    icon: 'Target',
    category: 'strategy',
    route: '/modules/kpi-scorecard',
  },
  {
    id: 'budget-tracker',
    title: 'Budget Tracker',
    description: 'IT budget utilization and forecasting',
    icon: 'DollarSign',
    category: 'finance',
    route: '/modules/budget-tracker',
  },
  {
    id: 'incident-summary',
    title: 'Incident Summary',
    description: 'Active and recent incident tracking',
    icon: 'Siren',
    category: 'operations',
    route: '/modules/incident-summary',
  },
  {
    id: 'deployment-pipeline',
    title: 'Deployment Pipeline',
    description: 'CI/CD pipeline status and deployment frequency',
    icon: 'GitBranch',
    category: 'delivery',
    route: '/modules/deployment-pipeline',
  },
  {
    id: 'infrastructure-health',
    title: 'Infrastructure Health',
    description: 'Server, network, and cloud infrastructure status',
    icon: 'Server',
    category: 'operations',
    route: '/modules/infrastructure-health',
  },
  {
    id: 'security-posture',
    title: 'Security Posture',
    description: 'Overall security health and threat landscape',
    icon: 'Shield',
    category: 'security',
    route: '/modules/security-posture',
  },
  {
    id: 'vulnerability-tracker',
    title: 'Vulnerability Tracker',
    description: 'Open vulnerabilities by severity and age',
    icon: 'Bug',
    category: 'security',
    route: '/modules/vulnerability-tracker',
  },
  {
    id: 'tech-debt',
    title: 'Tech Debt',
    description: 'Technical debt tracking and remediation progress',
    icon: 'Layers',
    category: 'engineering',
    route: '/modules/tech-debt',
  },
  {
    id: 'sprint-metrics',
    title: 'Sprint Metrics',
    description: 'Sprint velocity, burndown, and team performance',
    icon: 'TrendingUp',
    category: 'delivery',
    route: '/modules/sprint-metrics',
  },
  {
    id: 'team-health',
    title: 'Team Health',
    description: 'Team capacity, morale, and workload distribution',
    icon: 'Users',
    category: 'people',
    route: '/modules/team-health',
  },
  {
    id: 'slo-dashboard',
    title: 'SLO Dashboard',
    description: 'Service level objectives and current attainment',
    icon: 'Gauge',
    category: 'reliability',
    route: '/modules/slo-dashboard',
  },
  {
    id: 'error-budget',
    title: 'Error Budget',
    description: 'Error budget consumption and remaining allowance',
    icon: 'PieChart',
    category: 'reliability',
    route: '/modules/error-budget',
  },
  {
    id: 'monitoring-alerts',
    title: 'Monitoring & Alerts',
    description: 'Active alerts and monitoring system status',
    icon: 'Bell',
    category: 'operations',
    route: '/modules/monitoring-alerts',
  },
  {
    id: 'capacity-planning',
    title: 'Capacity Planning',
    description: 'Resource utilization and capacity forecasts',
    icon: 'HardDrive',
    category: 'operations',
    route: '/modules/capacity-planning',
  },
  {
    id: 'sla-tracker',
    title: 'SLA Tracker',
    description: 'Service level agreement compliance and trends',
    icon: 'FileCheck',
    category: 'governance',
    route: '/modules/sla-tracker',
  },
  {
    id: 'vendor-management',
    title: 'Vendor Management',
    description: 'Third-party vendor performance and contracts',
    icon: 'Handshake',
    category: 'finance',
    route: '/modules/vendor-management',
  },
  {
    id: 'access-management',
    title: 'Access Management',
    description: 'Identity, access controls, and privilege reviews',
    icon: 'KeyRound',
    category: 'security',
    route: '/modules/access-management',
  },
  {
    id: 'test-coverage',
    title: 'Test Coverage',
    description: 'Code and test coverage metrics across services',
    icon: 'CheckCircle2',
    category: 'quality',
    route: '/modules/test-coverage',
  },
  {
    id: 'defect-tracker',
    title: 'Defect Tracker',
    description: 'Open defects by severity, age, and component',
    icon: 'CircleDot',
    category: 'quality',
    route: '/modules/defect-tracker',
  },
  {
    id: 'quality-gates',
    title: 'Quality Gates',
    description: 'Release quality gate pass/fail status',
    icon: 'ShieldCheck',
    category: 'quality',
    route: '/modules/quality-gates',
  },
  {
    id: 'architecture-overview',
    title: 'Architecture Overview',
    description: 'System architecture, dependencies, and topology',
    icon: 'Network',
    category: 'engineering',
    route: '/modules/architecture-overview',
  },
];

/** @type {Record<string, ModuleCardDefinition>} */
export const MODULE_CARDS_MAP = MODULE_CARDS.reduce((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {});

// ─── Module Categories ─────────────────────────────────────────────────────

export const MODULE_CATEGORIES = {
  STRATEGY: 'strategy',
  GOVERNANCE: 'governance',
  FINANCE: 'finance',
  OPERATIONS: 'operations',
  DELIVERY: 'delivery',
  ENGINEERING: 'engineering',
  SECURITY: 'security',
  RELIABILITY: 'reliability',
  QUALITY: 'quality',
  PEOPLE: 'people',
};

export const MODULE_CATEGORY_LABELS = {
  [MODULE_CATEGORIES.STRATEGY]: 'Strategy',
  [MODULE_CATEGORIES.GOVERNANCE]: 'Governance',
  [MODULE_CATEGORIES.FINANCE]: 'Finance',
  [MODULE_CATEGORIES.OPERATIONS]: 'Operations',
  [MODULE_CATEGORIES.DELIVERY]: 'Delivery',
  [MODULE_CATEGORIES.ENGINEERING]: 'Engineering',
  [MODULE_CATEGORIES.SECURITY]: 'Security',
  [MODULE_CATEGORIES.RELIABILITY]: 'Reliability',
  [MODULE_CATEGORIES.QUALITY]: 'Quality',
  [MODULE_CATEGORIES.PEOPLE]: 'People',
};

// ─── Application Defaults ──────────────────────────────────────────────────

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Horizon SPOG';

export const DEFAULT_PERSONA = import.meta.env.VITE_DEFAULT_PERSONA || 'executive';

export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,
  FAST: 15000,
  NORMAL: 30000,
  SLOW: 60000,
  VERY_SLOW: 300000,
};

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};