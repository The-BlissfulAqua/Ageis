
import React from 'react';
import type { View } from '../types';
import { Shield } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="h-full w-16 md:w-64 bg-brand-surface border-r border-brand-border flex flex-col">
      <div className="flex items-center justify-center md:justify-start md:px-4 h-16 border-b border-brand-border flex-shrink-0">
        <Shield className="h-8 w-8 text-brand-accent" />
        <h1 className="hidden md:block ml-3 text-xl font-bold text-brand-text-primary">AEGIS</h1>
      </div>
      <ul className="flex-1 mt-4 space-y-2 px-2 md:px-4">
        {NAVIGATION_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView(item.id);
              }}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : 'text-brand-text-secondary hover:bg-brand-border/50 hover:text-brand-text-primary'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:block ml-4 font-medium">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-brand-border text-center text-xs text-brand-text-secondary">
        <p className="hidden md:block">Ver. 24.HACKATHON</p>
        <p>Aegis Predictive Security</p>
      </div>
    </nav>
  );
};

export default Sidebar;
