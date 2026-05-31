/**
 * Persona-Widget Mapping Configuration for Horizon SPOG
 *
 * Default mapping of personas to their visible widgets/modules.
 * Each persona key maps to an array of widget IDs they can see by default.
 * Used by WidgetConfigManager and DashboardService.
 *
 * @module personaWidgetMap
 * @see {@link ../constants/constants.js} for PERSONAS and MODULE_CARDS definitions
 * @stories SCRUM-8880, SCRUM-8889
 */

import { PERSONAS, MODULE_CARDS_MAP } from './constants.js';

// ─── Persona → Widget ID Mapping ───────────────────────────────────────────

/**
 * @typedef {Record<string, string[]>} PersonaWidgetMap
 * Maps each persona ID to an ordered array of widget/module IDs
 * that are visible by default on their dashboard.
 */

/** @type {PersonaWidgetMap} */
export const PERSONA_WIDGET_MAP = {
  executive: [
    'portfolio-health',
    'risk-summary',
    'compliance-overview',
    'kpi-scorecard',
    'budget-tracker',
    'incident-summary',
  ],
  cio: [
    'portfolio-health',
    'budget-tracker',
    'kpi-scorecard',
    'compliance-overview',
    'vendor-management',
    'risk-summary',
  ],
  cto: [
    'architecture-overview',
    'tech-debt',
    'deployment-pipeline',
    'kpi-scorecard',
    'incident-summary',
    'portfolio-health',
  ],
  ciso: [
    'security-posture',
    'vulnerability-tracker',
    'compliance-overview',
    'incident-summary',
    'risk-summary',
    'access-management',
  ],
  vp_engineering: [
    'deployment-pipeline',
    'sprint-metrics',
    'tech-debt',
    'team-health',
    'kpi-scorecard',
    'incident-summary',
  ],
  ops_lead: [
    'infrastructure-health',
    'incident-summary',
    'deployment-pipeline',
    'sla-tracker',
    'capacity-planning',
    'monitoring-alerts',
  ],
  sre: [
    'slo-dashboard',
    'error-budget',
    'incident-summary',
    'infrastructure-health',
    'monitoring-alerts',
    'deployment-pipeline',
  ],
  qe_lead: [
    'test-coverage',
    'defect-tracker',
    'sprint-metrics',
    'deployment-pipeline',
    'kpi-scorecard',
    'quality-gates',
  ],
  devsecops_lead: [
    'security-posture',
    'deployment-pipeline',
    'vulnerability-tracker',
    'compliance-overview',
    'quality-gates',
    'access-management',
  ],
  admin: [
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
};

// ─── Helper Functions ──────────────────────────────────────────────────────

/**
 * Returns the array of widget IDs for a given persona.
 * Falls back to the executive persona if the provided persona ID is not found.
 *
 * @param {string} personaId - The persona identifier
 * @returns {string[]} Array of widget IDs visible to the persona
 */
export function getWidgetsForPersona(personaId) {
  return PERSONA_WIDGET_MAP[personaId] || PERSONA_WIDGET_MAP.executive;
}

/**
 * Returns the full module card definitions for a given persona's widgets.
 * Falls back to the executive persona if the provided persona ID is not found.
 *
 * @param {string} personaId - The persona identifier
 * @returns {import('./constants.js').ModuleCardDefinition[]} Array of module card definitions
 */
export function getWidgetDefinitionsForPersona(personaId) {
  const widgetIds = getWidgetsForPersona(personaId);
  return widgetIds
    .map((id) => MODULE_CARDS_MAP[id])
    .filter(Boolean);
}

/**
 * Checks whether a specific widget is visible to a given persona.
 *
 * @param {string} personaId - The persona identifier
 * @param {string} widgetId - The widget/module identifier
 * @returns {boolean} True if the widget is in the persona's default widget list
 */
export function isWidgetVisibleForPersona(personaId, widgetId) {
  const widgetIds = getWidgetsForPersona(personaId);
  return widgetIds.includes(widgetId);
}

/**
 * Returns all persona IDs that have a specific widget in their default view.
 *
 * @param {string} widgetId - The widget/module identifier
 * @returns {string[]} Array of persona IDs that include the widget
 */
export function getPersonasForWidget(widgetId) {
  return Object.keys(PERSONA_WIDGET_MAP).filter(
    (personaId) => PERSONA_WIDGET_MAP[personaId].includes(widgetId)
  );
}

/**
 * Validates that all widget IDs in the persona map reference valid module cards.
 * Useful for development-time integrity checks.
 *
 * @returns {{ valid: boolean, errors: string[] }} Validation result with any errors found
 */
export function validatePersonaWidgetMap() {
  const errors = [];

  for (const [personaId, widgetIds] of Object.entries(PERSONA_WIDGET_MAP)) {
    if (!PERSONAS[personaId]) {
      errors.push(`Persona "${personaId}" in widget map does not exist in PERSONAS`);
    }

    for (const widgetId of widgetIds) {
      if (!MODULE_CARDS_MAP[widgetId]) {
        errors.push(`Widget "${widgetId}" for persona "${personaId}" does not exist in MODULE_CARDS_MAP`);
      }
    }

    // Check for consistency with PERSONAS.modules
    if (PERSONAS[personaId]) {
      const personaModules = PERSONAS[personaId].modules;
      for (const widgetId of widgetIds) {
        if (!personaModules.includes(widgetId)) {
          errors.push(
            `Widget "${widgetId}" in widget map for persona "${personaId}" is not listed in PERSONAS.${personaId}.modules`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/** @type {string[]} */
export const PERSONA_WIDGET_MAP_KEYS = Object.keys(PERSONA_WIDGET_MAP);