
import React, { useState } from 'react';
import type { Alert, Sector, ModelTrainingData, Vulnerability, LogEntry, HeatmapPoint, FieldFeedback } from '../../types';
import { AlertStatus } from '../../types';
import Card from '../shared/Card';
import AlertModal from '../shared/AlertModal';
import { ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { generateIntelligenceBriefing } from '../../services/geminiService';
import { Bot, Lock } from 'lucide-react';
import Markdown from 'react-markdown';


interface DashboardViewProps {
  sectors: Sector[];
  alerts: Alert[];
  modelTrainingData: ModelTrainingData[];
  vulnerabilities: Vulnerability[];
  logs: LogEntry[];
  selectedAlert: Alert | null;
  setSelectedAlert: (alert: Alert | null) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus, feedback?: FieldFeedback) => void;
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

const DashboardView: React.FC<DashboardViewProps> = ({ sectors, alerts, modelTrainingData, vulnerabilities, logs, selectedAlert, setSelectedAlert, updateAlertStatus }) => {
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);
    const [briefing, setBriefing] = useState<string | null>(null);

    const activeAlerts = alerts.filter(a => a.status === AlertStatus.New || a.status === AlertStatus.Investigating);
    const normalSectors = sectors.filter(s => s.status === 'normal').length;
    const latestAccuracy = modelTrainingData.length > 0 ? modelTrainingData[modelTrainingData.length - 1].accuracy : 0;

    const handleGenerateBriefing = async () => {
        setIsBriefingLoading(true);
        setBriefing(null);
        const result = await generateIntelligenceBriefing(alerts, sectors, vulnerabilities, latestAccuracy);
        setBriefing(result);
        setIsBriefingLoading(false);
    };

    return (
        <div className="h-full w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-6">Commander Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-red-500/20 to-brand-surface">
                    <h4 className="text-sm font-medium text-brand-text-secondary">Active Alerts</h4>
                    <p className="text-3xl font-bold text-red-400">{activeAlerts.length}</p>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/20 to-brand-surface">
                    <h4 className="text-sm font-medium text-brand-text-secondary">Sectors Normal</h4>
                    <p className="text-3xl font-bold text-green-400">{normalSectors} / {sectors.length}</p>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/20 to-brand-surface">
                    <h4 className="text-sm font-medium text-brand-text-secondary">Model Accuracy</h4>
                    <p className="text-3xl font-bold text-blue-400">{(latestAccuracy * 100).toFixed(1)}%</p>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500/20 to-brand-surface">
                    <h4 className="text-sm font-medium text-brand-text-secondary">Vulnerabilities</h4>
                    <p className="text-3xl font-bold text-yellow-400">{vulnerabilities.length}</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-150px)]">
                <div className="lg:col-span-2 grid grid-rows-2 gap-6">
                    <Card title="AI Intelligence Briefing" className="flex flex-col">
                        <div className="flex-grow overflow-y-auto pr-2">
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
                                    <p>Click the button to generate an up-to-the-minute briefing using Gemini AI.</p>
                                </div>
                            )}
                        </div>
                         <button onClick={handleGenerateBriefing} disabled={isBriefingLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-sky-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <Bot size={18} /> Generate AI Briefing
                        </button>
                    </Card>

                    <Card title="Immutable Command Log" className="flex flex-col">
                         <div className="font-mono text-xs flex-grow overflow-y-auto pr-2">
                            <AnimatePresence initial={false}>
                                {logs.slice(0, 20).map(log => (
                                    <motion.div
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 50, mass: 0.5 }}
                                        className="flex items-start py-1.5 border-b border-brand-border/30"
                                    >
                                        <span className="text-brand-accent/70 mr-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        <span className="text-brand-text-primary flex-1 mr-3">{log.message}</span>
                                        <span className="flex items-center text-brand-text-secondary">
                                            <Lock size={10} className="mr-1.5"/>
                                            {log.hash}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>
                
                <Card title="High-Priority Alert Queue" className="flex flex-col">
                    <div className="overflow-y-auto flex-grow pr-1">
                        <AnimatePresence>
                            <motion.div layout className="space-y-3">
                                {activeAlerts.length > 0 ? activeAlerts.slice(0, 10).map(alert => (
                                    <AlertItem key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert)} />
                                )) : (
                                    <div className="text-center py-10 text-brand-text-secondary text-sm">No new alerts.</div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Card>
            </div>

            <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} onUpdateStatus={updateAlertStatus} />
        </div>
    );
};

export default DashboardView;
