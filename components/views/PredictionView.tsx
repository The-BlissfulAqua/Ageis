
import React, { useState } from 'react';
import type { HeatmapPoint, Alert } from '../../types';
import Card from '../shared/Card';
import { motion } from 'framer-motion';

const SimulatedMap: React.FC<{ heatmapPoints: HeatmapPoint[], alerts: Alert[], timeOffset: number }> = ({ heatmapPoints, alerts, timeOffset }) => {
    // A very simple projection. In a real app, use a library like d3-geo or leaflet.
    const project = (lat: number, lng: number) => {
        const x = (lng - (-107.5)) / 2.5 * 100;
        const y = (32.2 - lat) / 1.0 * 100;
        return { x, y };
    };

    const visiblePoints = heatmapPoints.slice(Math.max(0, heatmapPoints.length - 20 - timeOffset), heatmapPoints.length - timeOffset);
    const visibleAlerts = alerts.filter(a => a.timestamp > Date.now() - 3600000 * (timeOffset / 10 + 1));

    return (
        <div className="relative w-full h-full bg-brand-bg rounded-lg overflow-hidden border border-brand-border">
            {/* Map background - could be an image */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-yellow-900/30 opacity-40"></div>
            
            {/* Heatmap points */}
            {visiblePoints.map(p => {
                const { x, y } = project(p.lat, p.lng);
                return (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute rounded-full"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${p.intensity * 150 + 50}px`,
                            height: `${p.intensity * 150 + 50}px`,
                            background: `radial-gradient(circle, rgba(239, 68, 68, ${p.intensity * 0.4}) 0%, rgba(239, 68, 68, 0) 60%)`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                );
            })}

            {/* Alert points */}
            {visibleAlerts.map(a => {
                 const { x, y } = project(a.location.lat, a.location.lng);
                 return (
                    <motion.div 
                        key={a.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute w-4 h-4 rounded-full border-2 border-white bg-red-500 animate-pulse-red"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        title={`Alert in ${a.sectorName}`}
                    />
                 )
            })}
        </div>
    );
};


const PredictionView: React.FC<{ heatmapPoints: HeatmapPoint[], alerts: Alert[] }> = ({ heatmapPoints, alerts }) => {
    const [timeOffset, setTimeOffset] = useState(0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Predictive Heatmap</h1>
            <p className="text-brand-text-secondary mb-8 max-w-3xl">
                The prediction engine uses historical intrusion data, weather patterns, and terrain analysis to generate heatmaps of high-risk areas for the next 6-12 hours. Use the slider to scrub through time and see how predictions evolve.
            </p>
            <Card className="h-[60vh]">
                <div className="w-full h-full flex flex-col">
                    <div className="flex-grow">
                        <SimulatedMap heatmapPoints={heatmapPoints} alerts={alerts} timeOffset={timeOffset} />
                    </div>
                    <div className="pt-4 mt-4 border-t border-brand-border">
                        <label htmlFor="time-slider" className="block mb-2 text-sm font-medium text-brand-text-secondary">Prediction Time Replay (Hours Ago)</label>
                        <div className="flex items-center gap-4">
                            <span className="text-brand-text-primary">Now</span>
                            <input
                                id="time-slider"
                                type="range"
                                min="0"
                                max="12"
                                step="1"
                                value={timeOffset}
                                onChange={(e) => setTimeOffset(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-brand-text-primary">12h ago</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PredictionView;
