import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import RAGBadge from '../components/shared/RAGBadge.jsx';
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  Folder, 
  AppWindow, 
  Cpu, 
  GitBranch, 
  Slack,
  ExternalLink
} from 'lucide-react';

export default function DomainExplorerPage() {
  const domains = dataService.getDomains();
  const [expandedDomains, setExpandedDomains] = useState({});
  const [expandedPortfolios, setExpandedPortfolios] = useState({});

  const toggleDomain = (id) => {
    setExpandedDomains((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePortfolio = (id) => {
    setExpandedPortfolios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Domain Hierarchy Explorer
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Explore the relationship hierarchy from Business Domain down to individual Applications and Deployments.
        </p>
      </div>

      {/* Main Hierarchy Tree */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {domains.map((domain) => {
            const isDomainExpanded = !!expandedDomains[domain.id];
            return (
              <div 
                key={domain.id} 
                className="border border-dark-100 dark:border-dark-800 rounded-xl overflow-hidden bg-dark-50/50 dark:bg-dark-950/20"
              >
                {/* Domain Header */}
                <div 
                  onClick={() => toggleDomain(domain.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-100/50 dark:hover:bg-dark-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-dark-400">
                      {isDomainExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    <div className="p-2 bg-horizon-100 dark:bg-horizon-950 text-horizon-600 dark:text-horizon-400 rounded-lg">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-dark-900 dark:text-dark-100">
                        {domain.label}
                      </h2>
                      <p className="text-2xs text-dark-400 dark:text-dark-500 font-medium">
                        {domain.description}
                      </p>
                    </div>
                  </div>
                  <RAGBadge status={domain.ragStatus} />
                </div>

                {/* Portfolios list (under Domain) */}
                {isDomainExpanded && (
                  <div className="px-4 pb-4 space-y-3 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 pt-3">
                    {domain.portfolios && domain.portfolios.length > 0 ? (
                      domain.portfolios.map((portfolio) => {
                        const isPortfolioExpanded = !!expandedPortfolios[portfolio.id];
                        return (
                          <div 
                            key={portfolio.id}
                            className="border border-dark-100 dark:border-dark-800/60 rounded-lg bg-dark-50/30 dark:bg-dark-950/10"
                          >
                            {/* Portfolio Header */}
                            <div 
                              onClick={() => togglePortfolio(portfolio.id)}
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-dark-100/30 dark:hover:bg-dark-800/20 transition-colors"
                            >
                              <div className="flex items-center gap-3 pl-2">
                                <button className="text-dark-400">
                                  {isPortfolioExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                <Folder className="h-4.5 w-4.5 text-warning-500" />
                                <div>
                                  <h3 className="text-xs font-bold text-dark-800 dark:text-dark-200">
                                    {portfolio.label}
                                  </h3>
                                  <p className="text-[10px] text-dark-400 dark:text-dark-500">
                                    {portfolio.description}
                                  </p>
                                </div>
                              </div>
                              <RAGBadge status={portfolio.ragStatus} />
                            </div>

                            {/* Applications (under Portfolio) */}
                            {isPortfolioExpanded && (
                              <div className="px-3 pb-3 border-t border-dark-100 dark:border-dark-800/40 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white dark:bg-dark-900">
                                {portfolio.applications && portfolio.applications.length > 0 ? (
                                  portfolio.applications.map((app) => (
                                    <div 
                                      key={app.id}
                                      className="p-4 border border-dark-100 dark:border-dark-800/80 rounded-xl hover:border-horizon-300 dark:hover:border-horizon-700 hover:shadow-sm transition-all flex flex-col justify-between group relative"
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <AppWindow className="h-4 w-4 text-healthy-500" />
                                            <span className="text-xs font-bold text-dark-900 dark:text-dark-100">
                                              {app.name}
                                            </span>
                                          </div>
                                          <RAGBadge status={app.ragStatus} />
                                        </div>
                                        
                                        {/* App Details List */}
                                        <div className="mt-3 space-y-1 text-[10px] font-medium text-dark-500 dark:text-dark-400">
                                          <div className="flex justify-between">
                                            <span>Criticality:</span>
                                            <span className="font-semibold text-dark-700 dark:text-dark-300 capitalize">{app.criticality}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Lead Owner:</span>
                                            <span className="text-dark-700 dark:text-dark-300">{app.owner}</span>
                                          </div>
                                          {app.teamSlack && (
                                            <div className="flex justify-between items-center">
                                              <span>Slack Channel:</span>
                                              <span className="text-horizon-600 dark:text-horizon-400 flex items-center gap-0.5">
                                                <Slack className="h-2.5 w-2.5" />
                                                {app.teamSlack}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Environments row */}
                                        {app.environments && (
                                          <div className="mt-3 flex items-center gap-1">
                                            <span className="text-[9px] uppercase font-bold text-dark-400">Envs:</span>
                                            <div className="flex gap-1">
                                              {app.environments.map((env) => (
                                                <span 
                                                  key={env}
                                                  className="text-[8px] font-bold px-1.5 py-0.2 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 rounded uppercase border border-dark-200/50 dark:border-dark-700/50"
                                                >
                                                  {env.slice(0, 3)}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div className="mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-semibold text-dark-400 dark:text-dark-500">
                                            {app.techStack ? app.techStack.slice(0, 2).join(' + ') : ''}
                                          </span>
                                        </div>
                                        <Link
                                          to={`/applications/${app.id}`}
                                          className="text-[10px] font-bold text-horizon-600 dark:text-horizon-400 flex items-center gap-1 hover:underline"
                                        >
                                          <span>App 360</span>
                                          <ExternalLink className="h-3 w-3" />
                                        </Link>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-dark-400 italic col-span-2 p-2">No applications configured</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-dark-400 italic">No portfolios configured</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
