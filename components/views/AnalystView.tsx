
import React, { useState } from 'react';
import type { Alert, Sector, ModelTrainingData, Vulnerability } from '../../types';
import Card from '../shared/Card';
import WhatIfSimulator from '../shared/WhatIfSimulator';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateIntelligenceBriefing } from '../../services/geminiService';
import { Bot } from 'lucide-react';
import Markdown from 'react-markdown';

interface AnalystViewProps {
  sectors: Sector[];
  alerts: Alert[];
  modelTrainingData: ModelTrainingData[];
  vulnerabilities: Vulnerability[];
}

const AnalystView: React.FC<AnalystViewProps> = ({ sectors, alerts, modelTrainingData, vulnerabilities }) => {
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);
    const [briefing, setBriefing] = useState<string | null>(null);
    
    const latestAccuracy = modelTrainingData.length > 0 ? modelTrainingData[modelTrainingData.length - 1].accuracy : 0;

    const handleGenerateBriefing = async () => {
        setIsBriefingLoading(true);
        setBriefing(null);
        const result = await generateIntelligenceBriefing(alerts, sectors, vulnerabilities, latestAccuracy);
        setBriefing(result);
        setIsBriefingLoading(false);
    };

    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
                <Card title="AI Intelligence Briefing" className="flex-1 flex flex-col">
                    <div className="flex-grow overflow-y-auto pr-2 min-h-[200px]">
                       {briefing && !isBriefingLoading && (
                            <div className="prose prose-sm prose-invert max-w-none">
                               <Markdown>{briefing}</Markdown>
                            </div>
                        )}
                        {isBriefingLoading && (
                            <div className="flex items-center justify-center h-full">
                                <Bot className="h-8 w-8 text-brand-accent animate-spin" />
                                <p className="ml-3 text-brand-text-secondary">Generating briefing...</p>
                            </div>
                        )}
                         {!briefing && !isBriefingLoading && (
                            <div className="flex items-center justify-center h-full text-center text-brand-text-secondary">
                                <p>Click to generate an up-to-the-minute briefing using Gemini AI.</p>
                            </div>
                        )}
                    </div>
                     <button onClick={handleGenerateBriefing} disabled={isBriefingLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-sky-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Bot size={18} /> Generate AI Briefing
                    </button>
                </Card>
                <Card title="'What-If' Scenario Simulator" className="flex-1 flex flex-col">
                    <WhatIfSimulator />
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <Card title="Global Model Accuracy Convergence" className="flex-1 flex flex-col">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={modelTrainingData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a344d" />
                                <XAxis dataKey="round" stroke="#a0aec0" name="Training Round" />
                                <YAxis domain={[0.7, 1]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} stroke="#a0aec0" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121a2e', border: '1px solid #2a344d', color: '#f0f4f8' }}
                                    labelStyle={{ color: '#a0aec0' }}
                                    formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Accuracy']}
                                />
                                <Area type="monotone" dataKey="accuracy" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} name="Global Model Accuracy" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card title="Per-Sector Model Contribution" className="flex-1 flex flex-col">
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectors} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a344d" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{fill: '#a0aec0'}} width={60} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121a2e', border: '1px solid #2a344d' }}
                                    formatter={(value: number) => [value.toFixed(4), 'Contribution Weight']}
                                />
                                <Bar dataKey="modelContribution" fill="#38bdf8" background={{ fill: '#ffffff08' }} name="Contribution Weight" />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalystView;
