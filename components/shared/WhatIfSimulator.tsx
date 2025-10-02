
import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { generateWhatIfAnalysis } from '../../services/geminiService';
import Markdown from 'react-markdown';
import { SECTORS } from '../../constants';

const WhatIfSimulator: React.FC = () => {
    const [weather, setWeather] = useState('Clear Skies');
    const [time, setTime] = useState('Night (02:00)');
    const [sector, setSector] = useState(SECTORS[0].name);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSimulate = async () => {
        setIsLoading(true);
        setResult('');
        const response = await generateWhatIfAnalysis({ weather, time, sector });
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Controls */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-brand-text-secondary mb-1">Weather</label>
                        <select value={weather} onChange={e => setWeather(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none">
                            <option>Clear Skies</option>
                            <option>Heavy Fog</option>
                            <option>Sandstorm</option>
                            <option>Thunderstorm</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-brand-text-secondary mb-1">Time of Day</label>
                        <select value={time} onChange={e => setTime(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none">
                            <option>Day (14:00)</option>
                            <option>Dusk (19:00)</option>
                            <option>Night (02:00)</option>
                            <option>Dawn (05:00)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-brand-text-secondary mb-1">Sector</label>
                        <select value={sector} onChange={e => setSector(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none">
                            {SECTORS.map(s => <option key={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
                {/* Button */}
                <button 
                    onClick={handleSimulate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-sky-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-full"
                >
                    <Sparkles size={18} /> Run Simulation
                </button>
            </div>
            {/* Result */}
            <div className="flex-grow bg-brand-bg border border-brand-border rounded-lg p-4 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Bot className="h-8 w-8 text-brand-accent animate-spin" />
                        <p className="ml-3 text-brand-text-secondary">AI is analyzing scenario...</p>
                    </div>
                )}
                {!isLoading && !result && (
                    <div className="flex items-center justify-center h-full text-center text-brand-text-secondary">
                        <p>Configure a scenario and run the simulation to get an AI-powered risk assessment.</p>
                    </div>
                )}
                {result && (
                     <div className="prose prose-sm prose-invert max-w-none">
                        <Markdown>{result}</Markdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatIfSimulator;
