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
      className="group flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 hover:border-horizon-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-horizon-500 focus:ring-offset-2"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-horizon-50 text-horizon-600 transition-colors duration-200 group-hover:bg-horizon-100 group-hover:text-horizon-700">
        <IconComponent className="h-7 w-7" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-dark-900">{persona.label}</h3>
        <p className="mt-1 text-xs text-dark-500 leading-relaxed">{persona.description}</p>
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-horizon-50 via-white to-horizon-50 px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-horizon-600 text-white shadow-executive">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-dark-900">
              {APP_TITLE}
            </h1>
          </div>
          <p className="text-base text-dark-500">
            Single Pane of Glass — Select your persona to continue
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onSelect={handleSelectPersona}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-dark-400">
          No authentication required — select a persona to explore the dashboard.
        </p>
      </div>
    </div>
  );
}