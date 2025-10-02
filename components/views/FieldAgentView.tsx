
import React, { useState } from 'react';
import type { Alert, FieldFeedback } from '../../types';
import { AlertStatus } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Camera, Image } from 'lucide-react';


const FieldAlertCard: React.FC<{ alert: Alert, onUpdateStatus: (alertId: string, status: AlertStatus, feedback?: FieldFeedback) => void }> = ({ alert, onUpdateStatus }) => {
    const [feedback, setFeedback] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    const levelColorMap = {
        Low: 'bg-green-500/80',
        Medium: 'bg-yellow-500/80',
        High: 'bg-orange-500/80',
        Critical: 'bg-red-500/80',
    };

    const handleUpdate = (status: AlertStatus) => {
        onUpdateStatus(alert.id, status, { notes: feedback, photo: photo || undefined });
    };

    const handlePhotoUpload = () => {
        setPhoto('https://images.unsplash.com/photo-1518977676601-b53f82aba657?q=80&w=800&auto=format&fit=crop');
    };
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-brand-surface border border-brand-border rounded-lg shadow-md overflow-hidden"
        >
            <div className={`p-4 border-b border-brand-border flex justify-between items-center ${levelColorMap[alert.level]}`}>
                <h3 className="font-bold text-white">Alert: {alert.sectorName}</h3>
                <span className="text-sm text-white font-medium">{alert.level} Priority</span>
            </div>
            <div className="p-4 space-y-3">
                <p className="text-sm text-brand-text-secondary"><strong>Time:</strong> {new Date(alert.timestamp).toLocaleTimeString()}</p>
                <p className="text-sm text-brand-text-primary"><strong>Reason:</strong> {alert.reason}</p>
                <p className="text-sm text-brand-text-primary"><strong>Confidence:</strong> {(alert.confidence * 100).toFixed(1)}%</p>
                
                <div className="pt-3 border-t border-brand-border/50">
                    <p className="text-xs text-brand-text-secondary mb-2">Field Report:</p>
                    <textarea 
                        value={feedback} 
                        onChange={e => setFeedback(e.target.value)}
                        placeholder="Add notes..."
                        rows={2}
                        className="w-full bg-brand-bg border border-brand-border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <button onClick={handlePhotoUpload} className="flex items-center gap-2 text-sm text-brand-accent hover:text-sky-400">
                            <Camera size={16} /> {photo ? 'Change Photo' : 'Attach Photo'}
                        </button>
                        {photo && <Image size={20} className="text-green-400" title="Photo attached" />}
                    </div>
                </div>

                <div className="pt-3 border-t border-brand-border/50">
                    <p className="text-xs text-center text-brand-text-secondary mb-2">Submit Final Assessment:</p>
                    <div className="flex gap-3">
                        <button onClick={() => handleUpdate(AlertStatus.Confirmed)} className="flex-1 flex items-center justify-center gap-2 bg-green-500/80 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <CheckCircle size={18} /> Confirm
                        </button>
                        <button onClick={() => handleUpdate(AlertStatus.FalseAlarm)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <XCircle size={18} /> False Alarm
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const FieldAgentView: React.FC<{ alerts: Alert[], updateAlertStatus: (alertId: string, status: AlertStatus, feedback?: FieldFeedback) => void }> = ({ alerts, updateAlertStatus }) => {
    const activeAlerts = alerts.filter(a => a.status === AlertStatus.New || a.status === AlertStatus.Investigating);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Field Agent Interface</h1>
            <p className="text-brand-text-secondary mb-8 max-w-3xl">
                A simplified, mobile-friendly view for agents in the field. New high-priority alerts are pushed here for immediate validation, closing the human-in-the-loop feedback cycle.
            </p>
            
            <div className="w-full max-w-md mx-auto bg-brand-bg p-2 md:p-4 rounded-xl border-2 border-brand-border shadow-2xl">
                <div className="bg-black text-white p-2 rounded-t-lg text-center font-bold">AEGIS FIELD APP</div>
                <div className="h-[65vh] overflow-y-auto p-2 space-y-4 bg-brand-bg">
                    <AnimatePresence>
                        {activeAlerts.length > 0 ? (
                            activeAlerts.map(alert => (
                                <FieldAlertCard key={alert.id} alert={alert} onUpdateStatus={updateAlertStatus} />
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-brand-text-secondary text-center">No active alerts assigned. Stand by.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FieldAgentView;
