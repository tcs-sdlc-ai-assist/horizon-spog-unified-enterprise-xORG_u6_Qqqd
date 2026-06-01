import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, AppWindow, FileWarning, Milestone, LayoutGrid, HelpCircle } from 'lucide-react';
import { dataService } from '../../services/dataService.js';

export default function SearchCommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ apps: [], incidents: [], journeys: [], domains: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Fetch match results on query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ apps: [], incidents: [], journeys: [], domains: [] });
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase();

    // Load data
    const apps = dataService.getApplications();
    const incidents = dataService.getIncidents();
    const journeys = dataService.getJourneys();
    const domains = dataService.getDomains();

    const matchedApps = apps
      .filter((app) => app.name.toLowerCase().includes(q) || app.id.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedIncidents = incidents
      .filter((inc) => inc.id.toLowerCase().includes(q) || inc.title.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedJourneys = journeys
      .filter((j) => j.name.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedDomains = domains
      .filter((d) => d.label.toLowerCase().includes(q) || d.id.toLowerCase().includes(q))
      .slice(0, 5);

    setResults({
      apps: matchedApps,
      incidents: matchedIncidents,
      journeys: matchedJourneys,
      domains: matchedDomains,
    });
    setSelectedIndex(0);
  }, [query]);

  // Flattened results list for easy index navigation
  const flatResults = [
    ...results.domains.map((d) => ({ type: 'domain', id: d.id, label: d.label, sub: d.description, route: `/domains?id=${d.id}` })),
    ...results.apps.map((a) => ({ type: 'app', id: a.id, label: a.name, sub: `Domain: ${a.domain} • Owner: ${a.owner}`, route: `/applications/${a.id}` })),
    ...results.journeys.map((j) => ({ type: 'journey', id: j.id, label: j.name, sub: j.description, route: `/journeys/${j.id}` })),
    ...results.incidents.map((i) => ({ type: 'incident', id: i.id, label: `${i.id}: ${i.title}`, sub: `Severity: ${i.severity} • Status: ${i.status}`, route: `/incidents?id=${i.id}` })),
  ];

  // Handle arrow keys and entry execution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatResults.length > 0 ? (prev + 1) % flatResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatResults.length > 0 ? (prev - 1 + flatResults.length) % flatResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          navigate(flatResults[selectedIndex].route);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatResults, selectedIndex, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const renderIcon = (type) => {
    switch (type) {
      case 'domain':
        return <LayoutGrid className="h-4 w-4 text-horizon-500" />;
      case 'app':
        return <AppWindow className="h-4 w-4 text-healthy-500" />;
      case 'journey':
        return <Milestone className="h-4 w-4 text-warning-500" />;
      case 'incident':
        return <FileWarning className="h-4 w-4 text-critical-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-dark-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 md:pt-32 px-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Command Palette Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-dark-200 dark:border-dark-800 h-14">
          <Search className="h-5 w-5 text-dark-400 dark:text-dark-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps, incidents, journeys, domains..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-dark-900 dark:text-dark-100 placeholder-dark-400 focus:ring-0 focus:outline-none p-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin"
        >
          {flatResults.length === 0 ? (
            <div className="py-12 text-center">
              {query ? (
                <>
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-300">No results found</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">Try another search term</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-dark-600 dark:text-dark-400">Quick Commands</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">Type to search for assets across the enterprise</p>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
                    <span className="px-2 py-1 bg-dark-100 dark:bg-dark-800 rounded text-[10px] font-semibold text-dark-600 dark:text-dark-400">Member Portal</span>
                    <span className="px-2 py-1 bg-dark-100 dark:bg-dark-800 rounded text-[10px] font-semibold text-dark-600 dark:text-dark-400">INC-1001</span>
                    <span className="px-2 py-1 bg-dark-100 dark:bg-dark-800 rounded text-[10px] font-semibold text-dark-600 dark:text-dark-400">Enrollment</span>
                    <span className="px-2 py-1 bg-dark-100 dark:bg-dark-800 rounded text-[10px] font-semibold text-dark-600 dark:text-dark-400">Claims</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {flatResults.map((item, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => {
                      navigate(item.route);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-horizon-500 text-white shadow-md'
                        : 'hover:bg-dark-50 dark:hover:bg-dark-800/50 text-dark-800 dark:text-dark-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-dark-100 dark:bg-dark-800'}`}>
                      {renderIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate leading-none">{item.label}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <span className={`text-[10px] line-clamp-1 mt-1 font-medium ${isActive ? 'text-white/80' : 'text-dark-400 dark:text-dark-500'}`}>
                        {item.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="h-10 bg-dark-50 dark:bg-dark-950 border-t border-dark-200 dark:border-dark-800 px-4 flex items-center justify-between text-[10px] text-dark-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
