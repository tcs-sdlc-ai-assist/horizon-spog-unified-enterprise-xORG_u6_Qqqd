import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { LOCAL_STORAGE_KEYS, DEFAULT_PERSONA } from '../constants/constants.js';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [persona, setPersonaState] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_PERSONA);
      return stored || DEFAULT_PERSONA;
    } catch {
      return DEFAULT_PERSONA;
    }
  });

  const setPersona = useCallback((newPersona) => {
    setPersonaState(newPersona);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_PERSONA, newPersona);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const clearPersona = useCallback(() => {
    setPersonaState(DEFAULT_PERSONA);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_PERSONA);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const value = useMemo(() => ({
    persona,
    setPersona,
    clearPersona,
  }), [persona, setPersona, clearPersona]);

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}

export default PersonaContext;
