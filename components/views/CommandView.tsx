
import React, { useState } from 'react';
import type { Alert, Sector, ModelTrainingData, Vulnerability, LogEntry, HeatmapPoint, FieldFeedback, AIModel, SensorType } from '../../types';
import { AlertStatus } from '../../types';
import Card from '../shared/Card';
import AlertModal from '../shared/AlertModal';
import LiveMapView from '../shared/LiveMapView';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Cpu, Wifi } from 'lucide-react';

interface CommandViewProps {
  sectors: Sector[];
  alerts: Alert[];
  modelTrainingData: ModelTrainingData[];
  vulnerabilities: Vulnerability[];
  logs: LogEntry[];
  heatmapPoints: HeatmapPoint[];
  selectedAlert: Alert | null;
  setSelectedAlert: (alert: Alert | null) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus, feedback?: FieldFeedback) => void;
  aiModels: AIModel[];
  onToggleAIModel: (modelId: string) => void;
}

const AlertItem: React.FC<{ alert: Alert, onClick: () => void }> = ({ alert, onClick }) => {
    const levelColorMap = {
        Low: 'border-l-green-500',
        Medium: 'border-l-yellow-500',
        High: 'border-l-orange-500',
        Critical: 'border-l-red-500',
    };
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`p-3 bg-brand-bg hover:bg-brand-border/30 border-l-4 ${levelColorMap[alert.level]} rounded-r-md cursor-pointer transition-colors`}
        >
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-brand-text-primary">{alert.sectorName}</span>
                <span className="text-brand-text-secondary">{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-brand-text-secondary mt-1 truncate">{alert.reason}</p>
        </motion.div>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => {
    return (
        <button
            onClick={onChange}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface ${
                enabled ? 'bg-brand-accent' : 'bg-brand-border'
            }`}
        >
            <motion.span
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className="inline-block w-4 h-4 transform bg-white rounded-full"
                style={{ translateX: enabled ? '1.5rem' : '0.25rem' }}
            />
        </button>
    );
};


const SystemStatusPanel: React.FC<{
    sectors: Sector[];
    aiModels: AIModel[];
    onToggleAIModel: (modelId: string) => void;
}> = ({ sectors, aiModels, onToggleAIModel }) => {
    const [activeTab, setActiveTab] = useState<'sensors' | 'ai'>('sensors');
    const [sensitivity, setSensitivity] = useState(75);

    const getSensorStatus = (sectorId: number, sensorType: SensorType) => {
        // Simple deterministic simulation based on ID and time
        const hash = (sectorId + sensorType.charCodeAt(0) + Math.floor(Date.now() / 30000)) % 100;
        if (hash > 97) return { status: 'OFFLINE', color: 'text-red-500' };
        if (hash > 95) return { status: 'MAINTENANCE', color: 'text-yellow-500' };
        return { status: 'ONLINE', color: 'text-green-500' };
    };
    
    const aiStatusColors: Record<AIModel['status'], string> = {
        ONLINE: 'bg-green-500',
        OFFLINE: 'bg-red-500',
        TRAINING: 'bg-yellow-500 animate-pulse',
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex border-b border-brand-border mb-4 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('sensors')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'sensors'
                            ? 'border-b-2 border-brand-accent text-brand-accent'
                            : 'text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                >
                    Sensor Status
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'ai'
                            ? 'border-b-2 border-brand-accent text-brand-accent'
                            : 'text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                >
                    AI Models
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2">
                {activeTab === 'sensors' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                        {sectors.map(sector => (
                            <div key={sector.id}>
                                <h4 className="text-sm font-semibold text-brand-text-primary mb-2">{sector.name}</h4>
                                <ul className="space-y-1.5 text-xs font-mono">
                                    {sector.sensors.map(sensorType => {
                                        const { status, color } = getSensorStatus(sector.id, sensorType);
                                        return (
                                            <li key={sensorType} className="flex justify-between items-center">
                                                <span className="text-brand-text-secondary capitalize">{sensorType}</span>
                                                <span className={`font-bold ${color}`}>{status}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                )}
                {activeTab === 'ai' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col h-full">
                        <div className="flex-grow space-y-3">
                            {aiModels.map(model => (
                                <div key={model.id} className="bg-brand-bg p-3 rounded-lg border border-brand-border/50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${aiStatusColors[model.status]}`}></div>
                                            <p className="text-sm font-medium text-brand-text-primary">{model.name}</p>
                                        </div>
                                        <ToggleSwitch enabled={model.enabled} onChange={() => onToggleAIModel(model.id)} />
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-brand-text-secondary mt-2 pl-4">
                                        <span>ACC: {(model.accuracy * 100).toFixed(1)}%</span>
                                        <span>LAT: {model.latency}ms</span>
                                        <span className={`font-bold ${model.enabled ? 'text-green-400' : 'text-red-400'}`}>{model.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 flex-shrink-0">
                            <label htmlFor="sensitivity-slider" className="block text-sm font-medium text-brand-text-secondary mb-2">Global Threat Sensitivity</label>
                            <div className="flex items-center gap-3">
                                <input
                                    id="sensitivity-slider"
                                    type="range"
                                    min="25"
                                    max="100"
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="font-mono text-brand-accent font-bold w-10 text-right">{sensitivity}%</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};


const AdversarialPanel: React.FC<{ vulnerabilities: Vulnerability[] }> = ({ vulnerabilities }) => {
    const latestVuln = vulnerabilities[0];
    if (!latestVuln) return <p className="text-sm text-center text-brand-text-secondary">No vulnerabilities detected.</p>;
    
    return (
        <div className="text-sm">
            <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-brand-text-primary">Latest Finding in Sector {latestVuln.sector}</p>
                    <p className="text-xs text-brand-text-secondary">{latestVuln.description}</p>
                </div>
            </div>
        </div>
    );
};


const CommandView: React.FC<CommandViewProps> = (props) => {
    const { alerts, sectors, vulnerabilities, heatmapPoints, selectedAlert, setSelectedAlert, updateAlertStatus, aiModels, onToggleAIModel } = props;
    const activeAlerts = alerts.filter(a => a.status === AlertStatus.New || a.status === AlertStatus.Investigating);

    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[85vh] lg:h-full">
                <Card title="Live Operations Map" className="h-full flex flex-col">
                    <LiveMapView heatmapPoints={heatmapPoints} alerts={alerts} onAlertClick={setSelectedAlert} />
                </Card>
            </div>
            
            <div className="lg:col-span-1 h-full flex flex-col gap-6">
                <Card title="High-Priority Alert Queue" className="flex-[2] flex flex-col">
                    <div className="overflow-y-auto flex-grow pr-1">
                        <AnimatePresence>
                            <motion.div layout className="space-y-3">
                                {activeAlerts.length > 0 ? activeAlerts.slice(0, 10).map(alert => (
                                    <AlertItem key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert)} />
                                )) : (
                                    <div className="text-center py-10 text-brand-text-secondary text-sm">
                                        <CheckCircle className="mx-auto h-8 w-8 mb-2 text-green-500" />
                                        All clear. No active alerts.
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Card>

                <Card title="System Status" className="flex-[3] flex flex-col">
                    <SystemStatusPanel sectors={sectors} aiModels={aiModels} onToggleAIModel={onToggleAIModel} />
                </Card>
                
                <Card title="Adversarial Test Panel">
                    <AdversarialPanel vulnerabilities={vulnerabilities} />
                </Card>
            </div>

            <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} onUpdateStatus={updateAlertStatus} />
        </div>
    );
};

export default CommandView;