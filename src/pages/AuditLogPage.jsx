import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService.js';
import { History, Trash2, HelpCircle } from 'lucide-react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(auditService.getLogs());
  }, []);

  const handleClearLogs = () => {
    auditService.clearLogs();
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
            Administrative Audit Trail
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Review security trace details of actions executed by managers, operators, or administration accounts.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-critical-200 text-critical-700 hover:bg-critical-50 rounded-lg text-xs font-bold transition-colors dark:border-critical-900 dark:text-critical-400 dark:hover:bg-critical-950/20"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Audit Logs</span>
          </button>
        )}
      </div>

      {/* Audit Log table */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
          Audit Trail Log Entries ({logs.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Active Persona</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-horizon-600 dark:text-horizon-400">{log.id}</td>
                  <td className="py-3 px-3 text-dark-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold capitalize text-dark-900 dark:text-dark-100">{log.persona}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded bg-dark-50 dark:bg-dark-800 border border-dark-200/50 dark:border-dark-750 text-[10px] font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-dark-800 dark:text-dark-250 leading-relaxed max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-dark-400 italic">
                    <History className="h-10 w-10 mx-auto mb-2 text-dark-300" />
                    No audit records recorded yet. Actions like importing spreadsheets or configuring widgets will log events here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
