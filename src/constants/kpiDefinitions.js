/**
 * KPI Framework Definitions for Horizon SPOG
 *
 * Each KPI has:
 * @typedef {Object} KPIDefinition
 * @property {string} id - Unique KPI identifier
 * @property {string} label - Display label
 * @property {string} category - KPI category grouping
 * @property {string} unit - Unit of measurement (e.g., '%', 'count', 'minutes', 'hours', 'days')
 * @property {string} format - Display format hint (e.g., 'percentage', 'number', 'duration', 'decimal')
 * @property {'up'|'down'|'neutral'} trendDirection - Desired trend direction ('up' = higher is better, 'down' = lower is better, 'neutral' = context-dependent)
 */

// ─── KPI Categories ────────────────────────────────────────────────────────

export const KPI_FRAMEWORK_CATEGORIES = {
  ENTERPRISE: 'enterprise',
  DEVSECOPS: 'devsecops',
  QE: 'qe',
  SECURITY: 'security',
  TRANSFORMATION: 'transformation',
};

export const KPI_FRAMEWORK_CATEGORY_LABELS = {
  [KPI_FRAMEWORK_CATEGORIES.ENTERPRISE]: 'Enterprise',
  [KPI_FRAMEWORK_CATEGORIES.DEVSECOPS]: 'DevSecOps',
  [KPI_FRAMEWORK_CATEGORIES.QE]: 'Quality Engineering',
  [KPI_FRAMEWORK_CATEGORIES.SECURITY]: 'Security',
  [KPI_FRAMEWORK_CATEGORIES.TRANSFORMATION]: 'Transformation',
};

// ─── Trend Directions ──────────────────────────────────────────────────────

export const TREND_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral',
};

// ─── Enterprise KPIs ───────────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const ENTERPRISE_KPIS = [
  {
    id: 'availability-pct',
    label: 'Availability %',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'sla-compliance-pct',
    label: 'SLA Compliance %',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'sev1-sev2-count',
    label: 'Sev1/Sev2 Incident Count',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'mttd',
    label: 'Mean Time to Detect (MTTD)',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: 'minutes',
    format: 'duration',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'mttr',
    label: 'Mean Time to Resolve (MTTR)',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: 'minutes',
    format: 'duration',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'repeat-incident-rate',
    label: 'Repeat Incident Rate',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'alert-noise-reduction-pct',
    label: 'Alert Noise Reduction %',
    category: KPI_FRAMEWORK_CATEGORIES.ENTERPRISE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
];

// ─── DevSecOps KPIs ────────────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const DEVSECOPS_KPIS = [
  {
    id: 'deployment-frequency',
    label: 'Deployment Frequency',
    category: KPI_FRAMEWORK_CATEGORIES.DEVSECOPS,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'lead-time',
    label: 'Lead Time for Changes',
    category: KPI_FRAMEWORK_CATEGORIES.DEVSECOPS,
    unit: 'hours',
    format: 'duration',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'change-failure-rate',
    label: 'Change Failure Rate',
    category: KPI_FRAMEWORK_CATEGORIES.DEVSECOPS,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'rollback-rate',
    label: 'Rollback Rate',
    category: KPI_FRAMEWORK_CATEGORIES.DEVSECOPS,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'pipeline-success-rate',
    label: 'Pipeline Success Rate',
    category: KPI_FRAMEWORK_CATEGORIES.DEVSECOPS,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
];

// ─── QE KPIs ───────────────────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const QE_KPIS = [
  {
    id: 'test-execution-success-pct',
    label: 'Test Execution Success %',
    category: KPI_FRAMEWORK_CATEGORIES.QE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'automation-coverage-pct',
    label: 'Automation Coverage %',
    category: KPI_FRAMEWORK_CATEGORIES.QE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'defect-leakage-pct',
    label: 'Defect Leakage %',
    category: KPI_FRAMEWORK_CATEGORIES.QE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'escaped-defects',
    label: 'Escaped Defects',
    category: KPI_FRAMEWORK_CATEGORIES.QE,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'environment-readiness-pct',
    label: 'Environment Readiness %',
    category: KPI_FRAMEWORK_CATEGORIES.QE,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
];

// ─── Security KPIs ─────────────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const SECURITY_KPIS = [
  {
    id: 'critical-vulns',
    label: 'Critical Vulnerabilities',
    category: KPI_FRAMEWORK_CATEGORIES.SECURITY,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'aged-findings',
    label: 'Aged Findings',
    category: KPI_FRAMEWORK_CATEGORIES.SECURITY,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.DOWN,
  },
  {
    id: 'secure-sdlc-compliance-pct',
    label: 'Secure SDLC Compliance %',
    category: KPI_FRAMEWORK_CATEGORIES.SECURITY,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'policy-violations',
    label: 'Policy Violations',
    category: KPI_FRAMEWORK_CATEGORIES.SECURITY,
    unit: 'count',
    format: 'number',
    trendDirection: TREND_DIRECTION.DOWN,
  },
];

// ─── Transformation KPIs ───────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const TRANSFORMATION_KPIS = [
  {
    id: 'apps-onboarded-pct',
    label: 'Apps Onboarded %',
    category: KPI_FRAMEWORK_CATEGORIES.TRANSFORMATION,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'observability-coverage-pct',
    label: 'Observability Coverage %',
    category: KPI_FRAMEWORK_CATEGORIES.TRANSFORMATION,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'automation-adoption-pct',
    label: 'Automation Adoption %',
    category: KPI_FRAMEWORK_CATEGORIES.TRANSFORMATION,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
  {
    id: 'value-realized',
    label: 'Value Realized',
    category: KPI_FRAMEWORK_CATEGORIES.TRANSFORMATION,
    unit: '%',
    format: 'percentage',
    trendDirection: TREND_DIRECTION.UP,
  },
];

// ─── All KPIs ──────────────────────────────────────────────────────────────

/** @type {KPIDefinition[]} */
export const ALL_KPIS = [
  ...ENTERPRISE_KPIS,
  ...DEVSECOPS_KPIS,
  ...QE_KPIS,
  ...SECURITY_KPIS,
  ...TRANSFORMATION_KPIS,
];

/** @type {Record<string, KPIDefinition>} */
export const KPI_MAP = ALL_KPIS.reduce((acc, kpi) => {
  acc[kpi.id] = kpi;
  return acc;
}, {});

/** @type {Record<string, KPIDefinition[]>} */
export const KPIS_BY_CATEGORY = ALL_KPIS.reduce((acc, kpi) => {
  if (!acc[kpi.category]) {
    acc[kpi.category] = [];
  }
  acc[kpi.category].push(kpi);
  return acc;
}, {});

/** @type {string[]} */
export const KPI_IDS = ALL_KPIS.map((kpi) => kpi.id);