import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../../contexts/PersonaContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { PERSONAS } from '../../constants/constants.js';
import logo from '../../assets/horizon-lightmodelogo.png';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function TopBar({ onSearchClick }) {
  const { persona, setPersona, clearPersona } = usePersona();
  const { darkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentPersonaDef = PERSONAS[persona] || PERSONAS.executive;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePersonaChange = (newPersonaId) => {
    setPersona(newPersonaId);
    setDropdownOpen(false);
    // When persona changes, navigate to dashboard to show updated view
    navigate('/');
  };

  const handleLogout = () => {
    clearPersona();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 z-40 flex items-center justify-between pr-4 pl-0">
      {/* Brand logo */}
      <div className="flex items-center pl-[20px]">
        <div className="bg-dark-100 rounded-xl w-[204px] h-[72px] flex items-center justify-center p-2.5 shadow-sm border border-dark-200">
          <img
            src={logo}
            alt="Horizon Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Action icons & Persona selector */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Global Search Button */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-dark-400 dark:text-dark-500 hover:border-dark-300 dark:hover:border-dark-700 transition-colors text-xs font-medium max-w-[120px] md:max-w-xs"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[9px] font-bold bg-dark-200 dark:bg-dark-800 text-dark-500 rounded border border-dark-300 dark:border-dark-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical-500 border border-white dark:border-dark-900"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-5 w-5 text-warning-400" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Persona Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-lg border border-dark-200 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-950 hover:border-dark-300 dark:hover:border-dark-700 transition-all text-sm font-medium text-dark-700 dark:text-dark-200"
          >
            <div className="h-7 w-7 rounded-full bg-horizon-100 dark:bg-horizon-950 text-horizon-700 dark:text-horizon-300 flex items-center justify-center border border-horizon-200 dark:border-horizon-800">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:flex flex-col items-start leading-none text-left">
              <span className="text-xs font-semibold">{currentPersonaDef.label}</span>
              <span className="text-[9px] text-dark-400 dark:text-dark-500 font-medium">Role view</span>
            </div>
            <ChevronDown className="h-4 w-4 text-dark-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 shadow-xl py-2 z-50 animate-slide-down">
              <div className="px-4 py-2 border-b border-dark-100 dark:border-dark-800">
                <p className="text-xs font-medium text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                  Active Persona
                </p>
                <div className="flex items-center gap-1 mt-1 text-horizon-600 dark:text-horizon-400 font-semibold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>{currentPersonaDef.label}</span>
                </div>
                <p className="text-[10px] text-dark-500 dark:text-dark-400 mt-1 italic line-clamp-2">
                  {currentPersonaDef.description}
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                <p className="px-4 py-1 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                  Switch Persona
                </p>
                {Object.values(PERSONAS).map((pDef) => (
                  <button
                    key={pDef.id}
                    onClick={() => handlePersonaChange(pDef.id)}
                    className={`w-full text-left px-4 py-2 text-xs flex flex-col hover:bg-dark-50 dark:hover:bg-dark-800 ${
                      pDef.id === persona
                        ? 'bg-horizon-50 dark:bg-horizon-950/30 text-horizon-700 dark:text-horizon-400 font-semibold'
                        : 'text-dark-700 dark:text-dark-300'
                    }`}
                  >
                    <span>{pDef.label}</span>
                    <span className="text-[9px] text-dark-400 dark:text-dark-500 font-normal line-clamp-1">
                      {pDef.description}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-dark-100 dark:border-dark-800 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-critical-600 dark:text-critical-400 hover:bg-critical-50 dark:hover:bg-critical-950/20 flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout / Persona Select</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
