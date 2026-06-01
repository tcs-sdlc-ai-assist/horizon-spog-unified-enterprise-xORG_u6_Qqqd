import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PersonaProvider, usePersona } from './contexts/PersonaContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { FilterProvider } from './contexts/FilterContext.jsx';

import DashboardLayout from './components/layout/DashboardLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DomainExplorerPage from './pages/DomainExplorerPage.jsx';
import App360Page from './pages/App360Page.jsx';
import JourneysPage from './pages/JourneysPage.jsx';
import JourneyDetailPage from './pages/JourneyDetailPage.jsx';
import IncidentCommandPage from './pages/IncidentCommandPage.jsx';
import ReleaseGovernancePage from './pages/ReleaseGovernancePage.jsx';
import SecurityPosturePage from './pages/SecurityPosturePage.jsx';
import QualityEngineeringPage from './pages/QualityEngineeringPage.jsx';
import ObservabilityPage from './pages/ObservabilityPage.jsx';
import ValueRealizationPage from './pages/ValueRealizationPage.jsx';
import AdminUploadPage from './pages/AdminUploadPage.jsx';
import AdminConfigPage from './pages/AdminConfigPage.jsx';
import AuditLogPage from './pages/AuditLogPage.jsx';

function ProtectedRoute({ children }) {
  const { persona } = usePersona();
  if (!persona) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Shell wrapped layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="domains" element={<DomainExplorerPage />} />
        <Route path="applications/:appId" element={<App360Page />} />
        <Route path="journeys" element={<JourneysPage />} />
        <Route path="journeys/:journeyId" element={<JourneyDetailPage />} />
        <Route path="incidents" element={<IncidentCommandPage />} />
        <Route path="releases" element={<ReleaseGovernancePage />} />
        <Route path="security" element={<SecurityPosturePage />} />
        <Route path="qe" element={<QualityEngineeringPage />} />
        <Route path="observability" element={<ObservabilityPage />} />
        <Route path="value-realization" element={<ValueRealizationPage />} />
        <Route path="admin/upload" element={<AdminUploadPage />} />
        <Route path="admin/config" element={<AdminConfigPage />} />
        <Route path="admin/audit" element={<AuditLogPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <ThemeProvider>
          <FilterProvider>
            <AppRoutes />
          </FilterProvider>
        </ThemeProvider>
      </PersonaProvider>
    </BrowserRouter>
  );
}
