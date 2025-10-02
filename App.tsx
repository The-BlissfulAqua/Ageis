
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardController from './components/DashboardController';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="flex h-screen w-full bg-brand-bg font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <DashboardController currentView={currentView} />
      </main>
    </div>
  );
};

export default App;
