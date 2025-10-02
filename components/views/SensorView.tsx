
import React from 'react';
import type { Sector, SensorType } from '../../types';
import Card from '../shared/Card';
import { Thermometer, Waves, Footprints, MapPin, Drone, UserCheck, type Icon } from 'lucide-react';
import { motion } from 'framer-motion';

const statusStyles = {
    normal: {
        borderColor: 'border-green-500/50',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
    },
    suspicious: {
        borderColor: 'border-yellow-500/50',
        bgColor: 'bg-yellow-500/10 animate-pulse-yellow',
        textColor: 'text-yellow-400',
    },
    alert: {
        borderColor: 'border-red-500/50',
        bgColor: 'bg-red-500/10 animate-pulse-red',
        textColor: 'text-red-400',
    },
};

const sensorIconMap: Record<SensorType, Icon> = {
    thermal: Thermometer,
    seismic: Waves,
    motion: Footprints,
    gps: MapPin,
    drone: Drone,
    patrol: UserCheck,
};

const formatSensorData = (type: SensorType, value: any) => {
    switch(type) {
        case 'thermal': return `${Number(value).toFixed(1)}°C`;
        case 'seismic': return `${Number(value).toFixed(3)}g`;
        case 'motion': return value ? 'DETECTED' : 'None';
        case 'gps': return value;
        case 'drone': return value;
        case 'patrol': return value;
        default: return String(value);
    }
}

const SectorCard: React.FC<{ sector: Sector }> = ({ sector }) => {
    const styles = statusStyles[sector.status];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} transition-all duration-300`}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg text-brand-text-primary">{sector.name}</h3>
                    <p className="text-sm text-brand-text-secondary">{sector.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles.bgColor} ${styles.textColor} border ${styles.borderColor}`}>
                    {sector.status.toUpperCase()}
                </span>
            </div>
            <div className="space-y-2 text-sm border-t border-brand-border/50 pt-3 mt-3">
                {sector.sensors.map(sensorType => {
                    const IconComponent = sensorIconMap[sensorType];
                    const value = sector.data[sensorType];
                    const isAlert = sensorType === 'motion' && value === true;

                    return (
                        <div key={sensorType} className="flex items-center justify-between">
                            <div className="flex items-center text-brand-text-secondary capitalize">
                                <IconComponent size={16} className="mr-2" /> {sensorType}
                            </div>
                            <span className={`font-mono ${isAlert ? 'text-red-400' : 'text-brand-text-primary'}`}>
                                {formatSensorData(sensorType, value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

const SensorView: React.FC<{ sectors: Sector[] }> = ({ sectors }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Live Sensor Grid</h1>
            <p className="text-brand-text-secondary mb-8 max-w-3xl">
                Real-time data from all deployed sensor arrays across the monitored border sectors.
                Each sector runs local anomaly detection, forwarding suspicious events to the central command.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sectors.map(sector => (
                    <SectorCard key={sector.id} sector={sector} />
                ))}
            </div>
        </div>
    );
};

export default SensorView;
