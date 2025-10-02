
import React, { useState } from 'react';
import Header from './components/Header';
import DashboardController from './components/DashboardController';
import { Dashboard } from './types';

const App: React.FC = () => {
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard>('command');

  return (
    <div className="flex flex-col h-screen w-full bg-brand-bg font-sans">
      <Header currentDashboard={currentDashboard} setCurrentDashboard={setCurrentDashboard} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <DashboardController currentDashboard={currentDashboard} />
      </main>
    </div>
  );
};

export default App;
