import React, { useState, useEffect } from 'react';
import { PERSONAS, MODULE_CARDS } from '../constants/constants.js';
import { getWidgetsForPersona } from '../constants/personaWidgetMap.js';
import { auditService } from '../services/auditService.js';
import { usePersona } from '../contexts/PersonaContext.jsx';
import { Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AdminConfigPage() {
  const { persona } = usePersona();
  const [targetPersona, setTargetPersona] = useState('executive');
  const [activeWidgets, setActiveWidgets] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Load configured widgets when persona selection changes
  useEffect(() => {
    const widgets = getWidgetsForPersona(targetPersona);
    setActiveWidgets(widgets);
    setStatusMessage('');
  }, [targetPersona]);

  const handleToggleWidget = (id) => {
    setActiveWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem(`horizon_layout_preferences_${targetPersona}`, JSON.stringify(activeWidgets));
      auditService.logAction(persona, 'Configure Layout', `Updated module widget layout for ${targetPersona} persona. Count: ${activeWidgets.length}.`);
      setStatusMessage('Configuration preferences successfully saved.');
    } catch (err) {
      setStatusMessage('Failed to save layout preferences.');
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(`horizon_layout_preferences_${targetPersona}`);
      const defaults = getWidgetsForPersona(targetPersona);
      setActiveWidgets(defaults);
      auditService.logAction(persona, 'Reset Layout', `Restored default module layout preferences for ${targetPersona} persona.`);
      setStatusMessage('Restored default persona configuration.');
    } catch (err) {
      setStatusMessage('Failed to reset preferences.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
          Module Configuration Manager
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Customize active module visibility grids and dashboard widgets for individual user persona roles.
        </p>
      </div>

      {/* Split configuration board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left selector card */}
        <div className="md:col-span-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
              Target Persona
            </label>
            <select
              value={targetPersona}
              onChange={(e) => setTargetPersona(e.target.value)}
              className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
            >
              {Object.values(PERSONAS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleSave}
              className="w-full py-2 bg-horizon-600 hover:bg-horizon-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              Save Custom Layout
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 border border-dark-200 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-850 rounded-lg text-xs font-bold text-dark-600 dark:text-dark-400 transition-colors"
            >
              Restore Defaults
            </button>
          </div>

          {statusMessage && (
            <div className="p-3 bg-healthy-50 border border-healthy-200 text-healthy-750 text-xs font-semibold rounded-lg flex items-center gap-2 dark:bg-healthy-950/20 dark:text-healthy-400 dark:border-healthy-900/50">
              <CheckCircle2 className="h-4 w-4" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Right selector board list */}
        <div className="md:col-span-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Widgets & Module Cards Directory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
            {MODULE_CARDS.map((card) => {
              const isChecked = activeWidgets.includes(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => handleToggleWidget(card.id)}
                  className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'border-horizon-500 bg-horizon-500/5 dark:bg-horizon-500/10'
                      : 'border-dark-100 dark:border-dark-800 hover:border-dark-200 dark:hover:border-dark-750 bg-white dark:bg-dark-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div click
                    className="mt-0.5 h-4 w-4 text-horizon-600 border-dark-300 rounded focus:ring-horizon-500 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-dark-900 dark:text-dark-100">
                      {card.title}
                    </h3>
                    <p className="text-[10px] text-dark-450 dark:text-dark-400 leading-snug mt-1.5 font-medium line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
