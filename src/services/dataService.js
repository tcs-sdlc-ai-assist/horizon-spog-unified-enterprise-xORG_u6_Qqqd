import defaultApplications from '../mocks/applications.json';
import defaultDomains from '../mocks/domains.json';
import defaultIncidents from '../mocks/incidents.json';
import defaultJourneys from '../mocks/journeys.json';
import defaultKpiData from '../mocks/kpiData.json';
import defaultReleases from '../mocks/releases.json';

const OVERRIDE_KEYS = {
  APPLICATIONS: 'horizon_override_applications',
  DOMAINS: 'horizon_override_domains',
  INCIDENTS: 'horizon_override_incidents',
  JOURNEYS: 'horizon_override_journeys',
  KPI_DATA: 'horizon_override_kpiData',
  RELEASES: 'horizon_override_releases',
};

// Local storage helper
function getStoredData(key, defaultData) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Failed to parse stored data for key ${key}:`, error);
    return defaultData;
  }
}

function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to store data for key ${key}:`, error);
  }
}

export const dataService = {
  // Get Raw Arrays
  getApplications() {
    const data = getStoredData(OVERRIDE_KEYS.APPLICATIONS, defaultApplications);
    return data.applications || data;
  },

  getDomains() {
    const data = getStoredData(OVERRIDE_KEYS.DOMAINS, defaultDomains);
    return data.domains || data;
  },

  getIncidents() {
    const data = getStoredData(OVERRIDE_KEYS.INCIDENTS, defaultIncidents);
    return data.incidents || data;
  },

  getJourneys() {
    const data = getStoredData(OVERRIDE_KEYS.JOURNEYS, defaultJourneys);
    return data.journeys || data;
  },

  getKpiData() {
    const data = getStoredData(OVERRIDE_KEYS.KPI_DATA, defaultKpiData);
    return data.kpis || data.kpiData || data;
  },

  getReleases() {
    const data = getStoredData(OVERRIDE_KEYS.RELEASES, defaultReleases);
    return data.releases || data;
  },

  // Save Overrides
  saveApplications(apps) {
    setStoredData(OVERRIDE_KEYS.APPLICATIONS, { applications: apps });
  },

  saveDomains(doms) {
    setStoredData(OVERRIDE_KEYS.DOMAINS, { domains: doms });
  },

  saveIncidents(incs) {
    setStoredData(OVERRIDE_KEYS.INCIDENTS, { incidents: incs });
  },

  saveJourneys(jrnys) {
    setStoredData(OVERRIDE_KEYS.JOURNEYS, { journeys: jrnys });
  },

  saveKpiData(kpis) {
    setStoredData(OVERRIDE_KEYS.KPI_DATA, kpis);
  },

  saveReleases(rels) {
    setStoredData(OVERRIDE_KEYS.RELEASES, { releases: rels });
  },

  // Reset all local storage overrides
  resetAllData() {
    Object.values(OVERRIDE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignore
      }
    });
  },

  // Filter Data according to Global Filters
  getFilteredData(filters) {
    const apps = this.getApplications();
    const incidents = this.getIncidents();
    const journeys = this.getJourneys();
    const kpis = this.getKpiData();
    const releases = this.getReleases();

    let filteredApps = [...apps];
    let filteredIncidents = [...incidents];
    let filteredJourneys = [...journeys];
    let filteredReleases = [...releases];

    // 1. Filter by Domain ID
    if (filters.domain) {
      filteredApps = filteredApps.filter(app => app.domain === filters.domain);
      filteredIncidents = filteredIncidents.filter(inc => inc.domain === filters.domain);
      
      // Filter journeys where at least one step uses a matching application
      const domainAppIds = new Set(filteredApps.map(app => app.id));
      filteredJourneys = filteredJourneys.filter(journey =>
        journey.steps.some(step => domainAppIds.has(step.application))
      );
      
      filteredReleases = filteredReleases.filter(release =>
        filteredApps.some(app => app.id === release.applicationId)
      );
    }

    // 2. Filter by Portfolio ID
    if (filters.portfolio) {
      filteredApps = filteredApps.filter(app => app.portfolio === filters.portfolio);
      
      const portfolioAppIds = new Set(filteredApps.map(app => app.id));
      filteredIncidents = filteredIncidents.filter(inc => portfolioAppIds.has(inc.application));
      filteredJourneys = filteredJourneys.filter(journey =>
        journey.steps.some(step => portfolioAppIds.has(step.application))
      );
      filteredReleases = filteredReleases.filter(release =>
        portfolioAppIds.has(release.applicationId)
      );
    }

    // 3. Filter by Specific Application ID
    if (filters.application) {
      filteredApps = filteredApps.filter(app => app.id === filters.application);
      filteredIncidents = filteredIncidents.filter(inc => inc.application === filters.application);
      filteredJourneys = filteredJourneys.filter(journey =>
        journey.steps.some(step => step.application === filters.application)
      );
      filteredReleases = filteredReleases.filter(release => release.applicationId === filters.application);
    }

    // 4. Filter by Environment
    if (filters.environment) {
      // apps list environments in their schema
      filteredApps = filteredApps.filter(app => 
        app.environments ? app.environments.includes(filters.environment) : true
      );
      // Releases might list target environment
      filteredReleases = filteredReleases.filter(release => 
        release.environment ? release.environment === filters.environment : true
      );
      // Incidents might be filtered by environment if incident tracks it, else assume production/all
    }

    // 5. Filter by Criticality (array)
    if (filters.criticality && filters.criticality.length > 0) {
      filteredApps = filteredApps.filter(app => filters.criticality.includes(app.criticality));
      const criticalAppIds = new Set(filteredApps.map(app => app.id));
      
      filteredIncidents = filteredIncidents.filter(inc => criticalAppIds.has(inc.application));
      filteredJourneys = filteredJourneys.filter(journey =>
        journey.steps.some(step => criticalAppIds.has(step.application))
      );
      filteredReleases = filteredReleases.filter(release => criticalAppIds.has(release.applicationId));
    }

    // 6. Filter by RAG status (array)
    if (filters.ragStatus && filters.ragStatus.length > 0) {
      filteredApps = filteredApps.filter(app => filters.ragStatus.includes(app.ragStatus));
      
      // Let's filter incidents and journeys dynamically if needed
    }

    // 7. Filter by Search Query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filteredApps = filteredApps.filter(app => 
        app.name.toLowerCase().includes(q) || 
        app.id.toLowerCase().includes(q) ||
        (app.owner && app.owner.toLowerCase().includes(q))
      );
      filteredIncidents = filteredIncidents.filter(inc => 
        inc.title.toLowerCase().includes(q) || 
        inc.id.toLowerCase().includes(q) ||
        inc.application.toLowerCase().includes(q)
      );
      filteredJourneys = filteredJourneys.filter(j => 
        j.name.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }

    return {
      applications: filteredApps,
      incidents: filteredIncidents,
      journeys: filteredJourneys,
      releases: filteredReleases,
      kpis, // Raw KPIs for dashboard selectors
    };
  }
};

export default dataService;
