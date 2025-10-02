
import React from 'react';
import type { LogEntry } from '../../types';
import Card from '../shared/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const CommandLogView: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Immutable Command Log</h1>
            <p className="text-brand-text-secondary mb-8 max-w-3xl">
                All significant system events are recorded in this secure, immutable log, simulating a blockchain ledger for auditable and tamper-proof record-keeping.
            </p>
            <Card>
                <div className="font-mono text-xs max-h-[75vh] overflow-y-auto pr-4">
                    <AnimatePresence initial={false}>
                        {logs.map(log => (
                            <motion.div
                                key={log.id}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 50, mass: 0.5 }}
                                className="flex items-start py-2 border-b border-brand-border/50"
                            >
                                <span className="text-brand-accent/70 mr-4">{new Date(log.timestamp).toISOString()}</span>
                                <span className="text-brand-text-primary flex-1 mr-4">{log.message}</span>
                                <span className="flex items-center text-brand-text-secondary">
                                    <Lock size={12} className="mr-2"/>
                                    {log.hash}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    );
};

export default CommandLogView;
