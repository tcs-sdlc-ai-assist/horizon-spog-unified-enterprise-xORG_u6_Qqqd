import React, { useMemo } from 'react';
import { useFilters } from '../../contexts/FilterContext.jsx';
import { dataService } from '../../services/dataService.js';
import { ENVIRONMENT_LABELS, CRITICALITY_TIER_LABELS } from '../../constants/constants.js';
import { Filter, RotateCcw } from 'lucide-react';

export default function GlobalFilterBar() {
  const { filters, updateFilters, resetFilters } = useFilters();

  // Load all options
  const domains = useMemo(() => dataService.getDomains(), []);
  const apps = useMemo(() => dataService.getApplications(), []);

  // Compute portfolios dynamically based on active domain
  const portfolios = useMemo(() => {
    if (!filters.domain) {
      // Return all portfolios
      const all = [];
      domains.forEach(d => {
        if (d.portfolios) all.push(...d.portfolios);
      });
      return all;
    }
    const activeDomain = domains.find(d => d.id === filters.domain);
    return activeDomain ? activeDomain.portfolios || [] : [];
  }, [filters.domain, domains]);

  // Compute apps dynamically based on active domain/portfolio
  const filteredAppsList = useMemo(() => {
    let list = [...apps];
    if (filters.domain) {
      list = list.filter(a => a.domain === filters.domain);
    }
    if (filters.portfolio) {
      list = list.filter(a => a.portfolio === filters.portfolio);
    }
    return list;
  }, [filters.domain, filters.portfolio, apps]);

  const handleDomainChange = (e) => {
    const val = e.target.value;
    updateFilters({
      domain: val,
      portfolio: '', // Reset child filters
      application: '',
    });
  };

  const handlePortfolioChange = (e) => {
    const val = e.target.value;
    updateFilters({
      portfolio: val,
      application: '', // Reset child filter
    });
  };

  const handleAppChange = (e) => {
    const val = e.target.value;
    updateFilters({
      application: val,
    });
  };

  const handleEnvChange = (e) => {
    updateFilters({
      environment: e.target.value,
    });
  };

  const handleCriticalityChange = (tier) => {
    updateFilters(prev => {
      const active = prev.criticality || [];
      const next = active.includes(tier)
        ? active.filter(t => t !== tier)
        : [...active, tier];
      return { ...prev, criticality: next };
    });
  };

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-4 shadow-sm flex flex-col gap-4">
      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Domain Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Domain
          </label>
          <select
            value={filters.domain || ''}
            onChange={handleDomainChange}
            className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
          >
            <option value="">All Domains</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Portfolio Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Portfolio
          </label>
          <select
            value={filters.portfolio || ''}
            onChange={handlePortfolioChange}
            className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
          >
            <option value="">All Portfolios</option>
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Application Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Application
          </label>
          <select
            value={filters.application || ''}
            onChange={handleAppChange}
            className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
          >
            <option value="">All Applications</option>
            {filteredAppsList.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>

        {/* Environment Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Environment
          </label>
          <select
            value={filters.environment || ''}
            onChange={handleEnvChange}
            className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
          >
            <option value="">All Environments</option>
            {Object.entries(ENVIRONMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Section */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dark-200 dark:border-dark-800 rounded-lg text-xs font-semibold text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800/50 hover:text-dark-800 dark:hover:text-dark-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Criticality Filter Badges Row */}
      <div className="border-t border-dark-100 dark:border-dark-800 pt-3 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Criticality:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(CRITICALITY_TIER_LABELS).map(([tier, label]) => {
            const isSelected = (filters.criticality || []).includes(tier);
            return (
              <button
                key={tier}
                onClick={() => handleCriticalityChange(tier)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all duration-200 ${
                  isSelected
                    ? 'bg-horizon-500 text-white border-horizon-500 shadow-sm'
                    : 'bg-white dark:bg-dark-900 text-dark-600 dark:text-dark-400 border-dark-200 dark:border-dark-800 hover:border-dark-300 dark:hover:border-dark-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
