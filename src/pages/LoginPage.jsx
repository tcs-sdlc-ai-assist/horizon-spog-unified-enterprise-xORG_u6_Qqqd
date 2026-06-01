import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  ShieldCheck,
  Code2,
  Server,
  Activity,
  TestTube2,
  ShieldAlert,
  Settings,
} from 'lucide-react';
import { PERSONAS, PERSONA_IDS, APP_TITLE } from '../constants/constants.js';
import { usePersona } from '../contexts/PersonaContext.jsx';
import logo from '../assets/horizon-lightmodelogo.png';

const ICON_MAP = {
  LayoutDashboard,
  Building2,
  Cpu,
  ShieldCheck,
  Code2,
  Server,
  Activity,
  TestTube2,
  ShieldAlert,
  Settings,
};

function PersonaCard({ persona, onSelect }) {
  const IconComponent = ICON_MAP[persona.icon] || LayoutDashboard;

  return (
    <button
      type="button"
      onClick={() => onSelect(persona.id)}
      className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-horizon-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-horizon-500 focus:ring-offset-2 transition-all duration-300 dark:bg-dark-800 dark:hover:bg-dark-800/80 dark:border-dark-700/50 dark:hover:border-horizon-500"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-horizon-50 text-horizon-600 dark:bg-horizon-950/50 dark:text-horizon-400 transition-colors duration-200 group-hover:bg-horizon-100 dark:group-hover:bg-horizon-950 group-hover:text-horizon-750">
        <IconComponent className="h-7 w-7" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-extrabold text-dark-900 dark:text-dark-100 leading-none">
          {persona.label}
        </h3>
        <p className="mt-2 text-[10px] text-dark-450 dark:text-dark-400 font-medium leading-relaxed line-clamp-2">
          {persona.description}
        </p>
      </div>
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setPersona } = usePersona();

  const handleSelectPersona = useCallback(
    (personaId) => {
      setPersona(personaId);
      navigate('/');
    },
    [setPersona, navigate]
  );

  const personas = PERSONA_IDS.map((id) => PERSONAS[id]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-horizon-50 via-white to-horizon-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-5xl">
        <div className="mb-12 text-center space-y-3">
          <div className="mb-4 flex items-center justify-center">
            <div className="bg-white rounded-xl w-[204px] h-[72px] flex items-center justify-center p-2.5 shadow-md border border-transparent dark:border-dark-800">
              <img
                src={logo}
                alt="Horizon Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-base text-dark-500 dark:text-dark-400 max-w-md mx-auto">
            Single Pane of Glass command console. Select your active user role profile to authenticate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onSelect={handleSelectPersona}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-dark-400 dark:text-dark-500 font-semibold uppercase tracking-wider">
          Mock Authentication Flow • No passwords required for demonstration.
        </p>
      </div>
    </div>
  );
}