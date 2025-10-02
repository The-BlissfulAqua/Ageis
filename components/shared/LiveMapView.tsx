
import React from 'react';
import type { HeatmapPoint, Alert } from '../../types';
import { AlertStatus } from '../../types';
import { motion } from 'framer-motion';

const LiveMapView: React.FC<{ heatmapPoints: HeatmapPoint[], alerts: Alert[], onAlertClick: (alert: Alert) => void }> = ({ heatmapPoints, alerts, onAlertClick }) => {
    // A very simple projection. In a real app, use a library like d3-geo or leaflet.
    const project = (lat: number, lng: number) => {
        const x = (lng - (-107.5)) / 2.5 * 100;
        const y = (32.2 - lat) / 1.0 * 100;
        return { x, y };
    };
    
    const activeAlerts = alerts.filter(a => a.status === AlertStatus.New || a.status === AlertStatus.Investigating);

    return (
        <div className="relative w-full h-full bg-brand-bg rounded-lg overflow-hidden border border-brand-border">
            {/* Map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-yellow-900/30 opacity-40"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    radial-gradient(circle at 25% 30%, #ffffff05 1px, transparent 1px),
                    radial-gradient(circle at 75% 70%, #ffffff05 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
            }}></div>
            
            {/* Heatmap points */}
            {heatmapPoints.map(p => {
                const { x, y } = project(p.lat, p.lng);
                return (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${p.intensity * 120 + 40}px`,
                            height: `${p.intensity * 120 + 40}px`,
                            background: `radial-gradient(circle, rgba(239, 68, 68, ${p.intensity * 0.35}) 0%, rgba(239, 68, 68, 0) 60%)`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                );
            })}

            {/* Alert points */}
            {activeAlerts.map(a => {
                 const { x, y } = project(a.location.lat, a.location.lng);
                 return (
                    <motion.div 
                        key={a.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute group"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => onAlertClick(a)}
                    >
                        <div
                            className="w-4 h-4 rounded-full border-2 border-white bg-red-500 animate-pulse-red cursor-pointer"
                            title={`Alert in ${a.sectorName}`}
                        />
                         <div className="absolute bottom-full mb-2 w-48 bg-brand-surface text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-x-1/2 left-1/2">
                            {a.reason}
                            <div className="w-2 h-2 bg-brand-surface transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                    </motion.div>
                 )
            })}
        </div>
    );
};

export default LiveMapView;
