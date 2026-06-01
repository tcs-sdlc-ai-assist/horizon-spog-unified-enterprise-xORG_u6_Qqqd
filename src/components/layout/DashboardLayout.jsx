import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import Sidebar from './Sidebar.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import SearchCommandPalette from '../shared/SearchCommandPalette.jsx';
import { LOCAL_STORAGE_KEYS } from '../../constants/constants.js';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync collapsed state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isCollapsed));
    } catch {
      // LocalStorage access may fail
    }
  }, [isCollapsed]);

  // Handle Ctrl+K/Cmd+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-dark-100 transition-colors duration-200">
      {/* Top Header Bar */}
      <TopBar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Main Page Layout Wrapper */}
      <div className="flex pt-20">
        {/* Navigation Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Content Panel */}
        <main
          className={`flex-1 min-h-[calc(100vh-5rem)] p-4 md:p-6 transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          {/* Breadcrumbs and Top Actions Area */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Breadcrumbs />
          </div>

          {/* Child Routes Outlet */}
          <div className="animate-fade-in pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette Search */}
      {isSearchOpen && <SearchCommandPalette onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}
