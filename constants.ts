// Fix: Add React import to be able to use React.ElementType
import React from 'react';
// Fix: Add icon imports for NAVIGATION_ITEMS
import {
    LayoutDashboard,
    Wifi,
    Cpu,
    Map,
    ShieldAlert,
    FileText,
} from 'lucide-react';
// Fix: Add View type import
import type { View } from './types';


export const SIMULATION_TICK_RATE_MS = 2000;
export const FEDERATED_ROUND_TIME_MS = 10000;
export const ADVERSARIAL_TEST_TIME_MS = 15000;

export const SECTORS: { id: number, name: string, description: string, sensors: any[] }[] = [
    { id: 1, name: 'Sector A', description: 'Desert', sensors: ['motion', 'gps'] },
    { id: 2, name: 'Sector B', description: 'River', sensors: ['thermal', 'drone'] },
    { id: 3, name: 'Sector C', description: 'Forest', sensors: ['seismic', 'patrol'] },
];

// Fix: Define and export NAVIGATION_ITEMS constant for the analyst sidebar.
export const NAVIGATION_ITEMS: { id: View; name: string; icon: React.ElementType }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'sensors', name: 'Sensor Grid', icon: Wifi },
    { id: 'model', name: 'AI Model', icon: Cpu },
    { id: 'predictions', name: 'Predictions', icon: Map },
    { id: 'adversarial', name: 'Adversarial AI', icon: ShieldAlert },
    { id: 'logs', name: 'Command Log', icon: FileText },
];
