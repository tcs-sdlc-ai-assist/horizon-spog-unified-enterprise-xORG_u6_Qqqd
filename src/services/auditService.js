const AUDIT_LOG_KEY = 'horizon_audit_logs';

export const auditService = {
  getLogs() {
    try {
      const stored = localStorage.getItem(AUDIT_LOG_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  logAction(persona, action, details) {
    try {
      const logs = this.getLogs();
      const newEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        persona,
        action,
        details,
      };
      logs.unshift(newEntry);
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200))); // Cap at last 200 actions
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  },

  clearLogs() {
    try {
      localStorage.removeItem(AUDIT_LOG_KEY);
    } catch {
      // Ignore
    }
  }
};

export default auditService;
