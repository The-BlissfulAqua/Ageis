
import React, { useState } from 'react';
import type { Alert, FieldFeedback } from '../../types';
import { AlertStatus } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Send, MessageSquare, Camera, Trash2 } from 'lucide-react';

interface AlertModalProps {
  alert: Alert | null;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: AlertStatus, feedback?: FieldFeedback) => void;
}

const levelColorMap = {
  Low: 'bg-green-500/20 text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  High: 'bg-orange-500/20 text-orange-400',
  Critical: 'bg-red-500/20 text-red-400',
};

const AlertModal: React.FC<AlertModalProps> = ({ alert, onClose, onUpdateStatus }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);


  if (!alert) return null;
  
  const handleFeedbackSubmit = (status: AlertStatus) => {
    if (!alert) return;
    onUpdateStatus(alert.id, status, { notes: feedbackText, photo: photo || undefined });
    setFeedbackText('');
    setPhoto(null);
    if(status === AlertStatus.Confirmed || status === AlertStatus.FalseAlarm) {
        onClose();
    }
  };

  const handlePhotoUpload = () => {
    setPhoto('https://images.unsplash.com/photo-1518977676601-b53f82aba657?q=80&w=800&auto=format&fit=crop');
  };

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-brand-surface border border-brand-border rounded-xl w-full max-w-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary transition-colors">
              <X size={24} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-brand-border">
              <h2 className="text-2xl font-bold text-brand-text-primary">Alert Details</h2>
              <p className="text-sm text-brand-text-secondary">ID: {alert.id}</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Details & XAI */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Alert Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-brand-text-secondary w-24 inline-block">Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                    <p><strong className="text-brand-text-secondary w-24 inline-block">Sector:</strong> {alert.sectorName}</p>
                    <p><strong className="text-brand-text-secondary w-24 inline-block">Level:</strong> <span className={`px-2 py-1 rounded-md text-xs ${levelColorMap[alert.level]}`}>{alert.level}</span></p>
                    <p><strong className="text-brand-text-secondary w-24 inline-block">Status:</strong> {alert.status}</p>
                    <p><strong className="text-brand-text-secondary w-24 inline-block">Confidence:</strong> {(alert.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Explainable AI (XAI)</h3>
                  <div className="bg-brand-bg p-3 rounded-lg border border-brand-border text-sm">
                    <p className="text-brand-text-secondary">This alert was triggered because the AI model detected:</p>
                    <ul className="list-disc list-inside mt-2 text-brand-text-primary">
                      <li>{alert.reason}</li>
                      <li>Correlation with historical intrusion patterns for this time of day.</li>
                      <li>Deviation from baseline sensor readings by >3 standard deviations.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column - Field Agent Feedback */}
              <div className="space-y-4">
                 <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Recommended Action</h3>
                  <div className="bg-brand-accent/10 p-3 rounded-lg border border-brand-accent/50 text-sm">
                    <p className="font-medium text-brand-accent">Dispatch patrol to {alert.sectorName}. Advise caution and approach from designated safe zones.</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Field Agent Feedback</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button onClick={() => handleFeedbackSubmit(AlertStatus.Confirmed)} className="flex-1 flex items-center justify-center gap-2 bg-green-500/80 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <CheckCircle size={18} /> Confirm Intrusion
                      </button>
                      <button onClick={() => handleFeedbackSubmit(AlertStatus.FalseAlarm)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <XCircle size={18} /> False Alarm
                      </button>
                    </div>
                    <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Add field notes..."
                        className="w-full bg-brand-bg border border-brand-border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                        rows={2}
                      />
                      <div className="flex items-center gap-3">
                        <button onClick={handlePhotoUpload} className="flex items-center gap-2 text-sm text-brand-accent hover:text-sky-400 transition-colors">
                            <Camera size={16} /> Attach Photo
                        </button>
                        {photo && (
                            <div className="relative group">
                                <img src={photo} alt="Uploaded evidence" className="h-12 w-16 object-cover rounded"/>
                                <button onClick={() => setPhoto(null)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={18} className="text-white" />
                                </button>
                            </div>
                        )}
                      </div>
                     <button onClick={() => handleFeedbackSubmit(AlertStatus.Investigating)} className="w-full flex items-center justify-center gap-2 bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!feedbackText && !photo}>
                        <Send size={18} /> Submit Notes & Investigate
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
