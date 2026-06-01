import React from 'react';
import PropTypes from 'prop-types';

export default function RAGBadge({ status, variant = 'badge' }) {
  const normStatus = (status || 'unknown').toLowerCase();

  let colorClasses = '';
  let dotColor = '';
  let label = '';

  switch (normStatus) {
    case 'green':
    case 'healthy':
    case 'success':
      colorClasses = 'bg-healthy-50 text-healthy-700 border-healthy-200 dark:bg-healthy-950/20 dark:text-healthy-400 dark:border-healthy-900/50';
      dotColor = 'bg-healthy-500';
      label = 'Healthy';
      break;
    case 'amber':
    case 'warning':
    case 'warn':
      colorClasses = 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/20 dark:text-warning-400 dark:border-warning-900/50';
      dotColor = 'bg-warning-500';
      label = 'Warning';
      break;
    case 'red':
    case 'critical':
    case 'danger':
    case 'fail':
    case 'error':
      colorClasses = 'bg-critical-50 text-critical-700 border-critical-200 dark:bg-critical-950/20 dark:text-critical-400 dark:border-critical-900/50';
      dotColor = 'bg-critical-500';
      label = 'Critical';
      break;
    default:
      colorClasses = 'bg-dark-50 text-dark-700 border-dark-200 dark:bg-dark-950/20 dark:text-dark-400 dark:border-dark-900/50';
      dotColor = 'bg-dark-400';
      label = 'Unknown';
  }

  if (variant === 'dot') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-dark-700 dark:text-dark-300">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} inline-block animate-pulse-slow`}></span>
        {label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${colorClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
      {label}
    </span>
  );
}

RAGBadge.propTypes = {
  status: PropTypes.string,
  variant: PropTypes.oneOf(['badge', 'dot']),
};
