import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LOCAL_STORAGE_KEYS, DEFAULT_FILTERS } from '../constants/constants.js';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFiltersState] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_FILTERS);
      return stored ? JSON.parse(stored) : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  // Save filters to localstorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_FILTERS, JSON.stringify(filters));
    } catch {
      // LocalStorage access may fail
    }
  }, [filters]);

  const updateFilters = useCallback((updater) => {
    setFiltersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const value = useMemo(() => ({
    filters,
    updateFilters,
    resetFilters,
  }), [filters, updateFilters, resetFilters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

export default FilterContext;
