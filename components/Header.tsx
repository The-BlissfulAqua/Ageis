
import React from 'react';
import type { Dashboard } from '../types';
import { Shield, LayoutDashboard, BarChart3, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentDashboard: Dashboard;
  setCurrentDashboard: (dashboard: Dashboard) => void;
}

const DASHBOARDS: { id: Dashboard; name: string; icon: React.ElementType }[] = [
    { id: 'command', name: 'Command View', icon: LayoutDashboard },
    { id: 'analyst', name: 'Analyst View', icon: BarChart3 },
    { id: 'field', name: 'Field Agent', icon: Smartphone },
];

const Header: React.FC<HeaderProps> = ({ currentDashboard, setCurrentDashboard }) => {
  return (
    <header className="flex items-center justify-between h-16 bg-brand-surface border-b border-brand-border px-4 md:px-6 lg:px-8 flex-shrink-0">
      <div className="flex items-center">
        <Shield className="h-8 w-8 text-brand-accent" />
        <h1 className="ml-3 text-xl font-bold text-brand-text-primary hidden sm:block">AEGIS</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 p-1 bg-brand-bg rounded-lg">
        {DASHBOARDS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentDashboard(item.id)}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg ${
              currentDashboard === item.id
                ? 'bg-brand-accent text-white shadow-md'
                : 'text-brand-text-secondary hover:bg-brand-border/50 hover:text-brand-text-primary'
            }`}
          >
            <item.icon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{item.name}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
