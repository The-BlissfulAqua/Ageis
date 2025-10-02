// Fix: Add React import to be able to use React.ElementType
import React from 'react';
import { View } from './types';
import { LayoutDashboard, Rss, BrainCircuit, Map, ShieldAlert, Smartphone } from 'lucide-react';

export const SIMULATION_TICK_RATE_MS = 2000;
export const FEDERATED_ROUND_TIME_MS = 10000;
export const ADVERSARIAL_TEST_TIME_MS = 15000;

export const SECTORS: { id: number, name: string, description: string, sensors: any[] }[] = [
    { id: 1, name: 'Sector A', description: 'Desert', sensors: ['motion', 'gps'] },
    { id: 2, name: 'Sector B', description: 'River', sensors: ['thermal', 'drone'] },
    { id: 3, name: 'Sector C', description: 'Forest', sensors: ['seismic', 'patrol'] },
];

export const NAVIGATION_ITEMS: { id: View; name: string; icon: React.ElementType }[] = [
    { id: 'dashboard', name: 'Commander Dashboard', icon: LayoutDashboard },
    { id: 'sensors', name: 'Live Sensors', icon: Rss },
    { id: 'federated', name: 'Federated AI Model', icon: BrainCircuit },
    { id: 'predictions', name: 'Predictive Heatmap', icon: Map },
    { id: 'adversarial', name: 'Adversarial Test Panel', icon: ShieldAlert },
    { id: 'field', name: 'Field Agent View', icon: Smartphone },
];
