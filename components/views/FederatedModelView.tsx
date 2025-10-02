
import React from 'react';
import type { ModelTrainingData, Sector } from '../../types';
import Card from '../shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart, Bar, Cell } from 'recharts';

const FederatedModelView: React.FC<{ modelTrainingData: ModelTrainingData[], sectors: Sector[] }> = ({ modelTrainingData, sectors }) => {
  const latestAccuracy = modelTrainingData.length > 0 ? modelTrainingData[modelTrainingData.length - 1].accuracy : 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Federated AI Model</h1>
      <p className="text-brand-text-secondary mb-8 max-w-3xl">
        This view shows the privacy-preserving federated learning process. Each sector trains a local model on its own data. These localized insights are aggregated using Federated Averaging (FedAvg) to create an improved global model, which is then redistributed to all sectors without exposing raw, sensitive data.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Global Model Accuracy Convergence" className="lg:col-span-2">
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={modelTrainingData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
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
                            contentStyle={{
                                backgroundColor: '#121a2e',
                                border: '1px solid #2a344d',
                                color: '#f0f4f8'
                            }}
                            labelStyle={{ color: '#a0aec0' }}
                            formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Accuracy']}
                        />
                        <Legend wrapperStyle={{color: '#a0aec0'}} />
                        <Area type="monotone" dataKey="accuracy" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} name="Global Model Accuracy" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <div className="space-y-4">
                <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Current Accuracy</p>
                    <p className="text-2xl font-bold text-brand-accent">{(latestAccuracy * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Last Update</p>
                    <p className="text-lg font-semibold text-brand-text-primary">Just now</p>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Next Cycle</p>
                    <p className="text-lg font-semibold text-brand-text-primary">In a few seconds...</p>
                </div>
            </div>
        </Card>
        <Card title="Per-Sector Model Contribution" className="lg:col-span-3">
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectors} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a344d" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{fill: '#a0aec0'}} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#121a2e',
                                border: '1px solid #2a344d'
                            }}
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

export default FederatedModelView;
