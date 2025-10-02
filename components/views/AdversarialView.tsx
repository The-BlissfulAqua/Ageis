
import React from 'react';
import type { Vulnerability } from '../../types';
import Card from '../shared/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Wrench } from 'lucide-react';


const VulnerabilityCard: React.FC<{ vulnerability: Vulnerability }> = ({ vulnerability }) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="bg-brand-bg p-4 rounded-lg border border-brand-border"
        >
            <div className="flex items-start">
                <ShieldAlert className="h-6 w-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-brand-text-primary">Vulnerability in Sector {vulnerability.sector}</h3>
                        <p className="text-xs text-brand-text-secondary">{new Date(vulnerability.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">{vulnerability.description}</p>
                    <div className="flex items-start p-3 bg-brand-surface rounded-md border border-brand-border/50">
                        <Wrench className="h-5 w-5 text-brand-accent mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-brand-accent">Suggested Mitigation</p>
                            <p className="text-xs text-brand-text-secondary">{vulnerability.mitigation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const AdversarialView: React.FC<{ vulnerabilities: Vulnerability[] }> = ({ vulnerabilities }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Adversarial Test Panel</h1>
            <p className="text-brand-text-secondary mb-8 max-w-3xl">
                The Red Team AI continuously simulates smuggler strategies (e.g., decoys, zigzag paths) and novel intrusion techniques to find blind spots and weaknesses in our detection grid. This allows for proactive defense adjustments before real-world exploitation.
            </p>
            <Card title="Vulnerability Log">
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                   <AnimatePresence>
                    {vulnerabilities.length > 0 ? (
                        vulnerabilities.map(v => <VulnerabilityCard key={v.id} vulnerability={v} />)
                    ) : (
                        <div className="text-center py-10 text-brand-text-secondary">No vulnerabilities found yet. The system is running tests...</div>
                    )}
                   </AnimatePresence>
                </div>
            </Card>
        </div>
    );
};

export default AdversarialView;
