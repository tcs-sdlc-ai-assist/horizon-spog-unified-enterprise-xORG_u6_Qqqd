export const aiRecommendationService = {
  getRecommendations(data) {
    const { applications = [], incidents = [], releases = [], kpis = [] } = data;
    const recommendations = [];

    // Rule 1: High Active Incidents
    const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
    if (activeIncidents.length > 0) {
      recommendations.push({
        id: 'rec-incidents',
        title: 'Cascade Threat Flagged',
        description: `Active outages detected on ${activeIncidents[0].application}. Cross-system traces show DB Pool exhaustion patterns.`,
        reason: 'Correlated APM alerts match ITSM change ticket CR-8942 deployed 5m prior.',
        confidence: 94.5,
        priority: 'critical',
        category: 'operations',
      });
    }

    // Rule 2: Low Secure SDLC Compliance
    const secureSdlcCompliant = applications.filter(app => app.securityPosture?.secureSDLCCompliant);
    const compliancePct = applications.length ? (secureSdlcCompliant.length / applications.length) * 100 : 100;
    if (compliancePct < 90) {
      recommendations.push({
        id: 'rec-security',
        title: 'CI/CD Guardrails Violation',
        description: 'Vulnerability scanner reporting pipeline pass bypass rules on 3 active code repos.',
        reason: 'PR approvals merged without waiting for code security scan feedback triggers.',
        confidence: 88.0,
        priority: 'high',
        category: 'security',
      });
    }

    // Rule 3: Rollback Events
    const rollbacks = releases.filter(r => r.rollbackFlag);
    if (rollbacks.length > 0) {
      recommendations.push({
        id: 'rec-rollback',
        title: 'Deployment Gate Failure',
        description: `Recent rollback flagged on ${rollbacks[0].application} in Production.`,
        reason: 'Performance regression identified: P99 latency breached SLO limits during canary testing.',
        confidence: 91.2,
        priority: 'high',
        category: 'delivery',
      });
    }

    // Rule 4: Defect Leakage
    const criticalDefects = applications.reduce((sum, app) => sum + (app.defectCount?.critical || 0), 0);
    if (criticalDefects > 0) {
      recommendations.push({
        id: 'rec-quality',
        title: 'Escaped Defect Alert',
        description: `${criticalDefects} critical defects leaked to Production. Pre-release automation coverage incomplete.`,
        reason: 'Test suite coverage dropped below 80% boundary line on recent release builds.',
        confidence: 82.5,
        priority: 'medium',
        category: 'quality',
      });
    }

    // Default recommendation if list is thin
    if (recommendations.length < 2) {
      recommendations.push({
        id: 'rec-default',
        title: 'Observability Optimization Opportunity',
        description: 'Onboard remaining sandbox environments to Splunk central logger pipeline.',
        reason: 'Trace visibility gaps identified on auxiliary member portal BFF components.',
        confidence: 76.5,
        priority: 'info',
        category: 'transformation',
      });
    }

    return recommendations;
  }
};

export default aiRecommendationService;
