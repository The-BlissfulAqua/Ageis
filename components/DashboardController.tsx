
import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, Sector, ModelTrainingData, Vulnerability, LogEntry, AlertLevel, AlertStatus, HeatmapPoint, FieldFeedback } from '../types';
import { SECTORS, SIMULATION_TICK_RATE_MS, FEDERATED_ROUND_TIME_MS, ADVERSARIAL_TEST_TIME_MS } from '../constants';
import { useInterval } from '../hooks/useInterval';

import DashboardView from './views/DashboardView';
import SensorView from './views/SensorView';
import FederatedModelView from './views/FederatedModelView';
import PredictionView from './views/PredictionView';
import AdversarialView from './views/AdversarialView';
import FieldAgentView from './views/FieldAgentView';

const generateInitialSectors = (): Sector[] => 
  SECTORS.map(s => ({
    ...s,
    status: 'normal',
    data: s.sensors.reduce((acc, sensorType) => {
        switch (sensorType) {
            case 'motion': acc.motion = false; break;
            case 'gps': acc.gps = `31.55, -106.${10 + s.id * 5}`; break;
            case 'thermal': acc.thermal = 22; break;
            case 'drone': acc.drone = 'Patrolling'; break;
            case 'seismic': acc.seismic = 0.05; break;
            case 'patrol': acc.patrol = 'On-route'; break;
        }
        return acc;
    }, {} as {[key: string]: string|number|boolean}),
    modelContribution: Math.random() * 0.1 + 0.05,
  }));

const DashboardController: React.FC<{ currentView: View }> = ({ currentView }) => {
    const [sectors, setSectors] = useState<Sector[]>(generateInitialSectors);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [modelTrainingData, setModelTrainingData] = useState<ModelTrainingData[]>([{ round: 0, accuracy: 0.75 }]);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const addLog = useCallback((message: string) => {
        setLogs(prev => [{
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            message,
            hash: Math.random().toString(36).substring(2, 10),
        }, ...prev].slice(0, 100));
    }, []);

    const handleUpdateAlertStatus = useCallback((alertId: string, status: AlertStatus, feedback?: FieldFeedback) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
        setSelectedAlert(prev => prev && prev.id === alertId ? { ...prev, status } : prev);
        const feedbackMsg = feedback?.notes ? ` with feedback: "${feedback.notes}"` : '';
        const photoMsg = feedback?.photo ? ' [Photo evidence attached]' : '';
        addLog(`Alert ${alertId.slice(-6)} status updated to ${status} by field agent${feedbackMsg}${photoMsg}.`);
        if (status === AlertStatus.Confirmed || status === AlertStatus.FalseAlarm) {
            addLog(`Feedback recorded. Model will be updated in next federated cycle.`);
        }
    }, [addLog]);

    // Main Simulation Tick
    useInterval(() => {
        setSectors(prevSectors => prevSectors.map(sector => {
            const isAnomalous = Math.random() < 0.1;
            let newStatus = sector.status;
            let newData = { ...sector.data };

            if (isAnomalous) {
                const newAlertLevel = [AlertLevel.High, AlertLevel.Critical][Math.floor(Math.random() * 2)];
                let reason = '';
                
                switch (sector.id) {
                    case 1: // Desert
                        newData.motion = true;
                        reason = 'Anomalous motion signature detected in desert terrain.';
                        break;
                    case 2: // River
                        newData.thermal = 37.5 + Math.random() * 5;
                        reason = 'High thermal signature detected near river crossing at night.';
                        break;
                    case 3: // Forest
                        newData.seismic = 0.8 + Math.random() * 0.5;
                        reason = 'Unusual seismic vibrations consistent with foot traffic in forested area.';
                        break;
                }

                const newAlert: Alert = {
                    id: `alert-${Date.now()}-${sector.id}`,
                    timestamp: Date.now(),
                    sector: sector.id,
                    sectorName: sector.name,
                    level: newAlertLevel,
                    status: AlertStatus.New,
                    confidence: 0.75 + Math.random() * 0.2,
                    reason: reason,
                    location: { lat: 31.5 + Math.random() * 0.5, lng: -106.0 + sector.id * 0.2 + Math.random() * 0.05 },
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 50));
                addLog(`New ${newAlert.level} alert in ${sector.name}. Confidence: ${Math.round(newAlert.confidence * 100)}%`);
                newStatus = 'alert';
            } else {
                if (sector.status === 'alert') {
                     newStatus = 'normal';
                } else if (Math.random() < 0.1) {
                    newStatus = 'suspicious';
                } else if (sector.status === 'suspicious' && Math.random() < 0.5) {
                    newStatus = 'normal';
                }
                
                // Reset data to normal values
                sector.sensors.forEach(sensorType => {
                    switch(sensorType) {
                        case 'motion': newData.motion = false; break;
                        case 'thermal': newData.thermal = 22 + Math.random() * 3; break;
                        case 'seismic': newData.seismic = 0.05 + Math.random() * 0.1; break;
                    }
                });
            }

            return {
                ...sector,
                status: newStatus,
                data: newData,
            };
        }));

        // Update heatmap
        setHeatmapPoints(prev => {
            const newPoints = Array.from({length: 3}, () => ({
                id: `heat-${Date.now()}-${Math.random()}`,
                lat: 31.5 + Math.random() * 0.5,
                lng: -106.0 + Math.random() * 1.5,
                intensity: Math.random()
            }));
            return [...prev.slice(-50), ...newPoints];
        });

    }, SIMULATION_TICK_RATE_MS);

    // Federated Learning Simulation
    useInterval(() => {
        setModelTrainingData(prev => {
            const lastRound = prev[prev.length - 1];
            if (lastRound.accuracy > 0.98) return prev;
            const newAccuracy = lastRound.accuracy + (1 - lastRound.accuracy) * (Math.random() * 0.3);
            addLog(`Federated learning cycle complete. Global model accuracy increased to ${Math.round(newAccuracy*100)}%.`);
            return [...prev, { round: lastRound.round + 1, accuracy: newAccuracy }];
        });
    }, FEDERATED_ROUND_TIME_MS);

    // Adversarial AI Simulation
    useInterval(() => {
        const vulnerableSectorIndex = Math.floor(Math.random() * SECTORS.length);
        const vulnerableSector = SECTORS[vulnerableSectorIndex];
        const descriptions = [
          `Simulated penetration achieved via sensor blind spot near terrain feature.`,
          `AI tricked by decoy heat signatures mimicking wildlife.`,
          `Zigzag pathing simulation confused predictive tracking algorithm.`
        ];
        const newVulnerability: Vulnerability = {
            id: `vuln-${Date.now()}`,
            timestamp: Date.now(),
            sector: vulnerableSector.id,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            mitigation: `Increase drone patrol frequency in ${vulnerableSector.name} during low-light conditions.`,
        };
        setVulnerabilities(prev => [newVulnerability, ...prev].slice(0, 20));
        addLog(`Adversarial AI found new vulnerability in ${vulnerableSector.name}.`);
    }, ADVERSARIAL_TEST_TIME_MS);

    useEffect(() => {
      addLog("Aegis Command & Control System Initialized.");
    }, [addLog]);

    const commonProps = {
        sectors,
        alerts,
        modelTrainingData,
        vulnerabilities,
        logs,
        heatmapPoints,
        selectedAlert,
        setSelectedAlert,
        updateAlertStatus: handleUpdateAlertStatus,
    };

    switch (currentView) {
        case 'dashboard': return <DashboardView {...commonProps} />;
        case 'sensors': return <SensorView sectors={sectors} />;
        case 'federated': return <FederatedModelView modelTrainingData={modelTrainingData} sectors={sectors} />;
        case 'predictions': return <PredictionView heatmapPoints={heatmapPoints} alerts={alerts} />;
        case 'adversarial': return <AdversarialView vulnerabilities={vulnerabilities} />;
        case 'field': return <FieldAgentView alerts={alerts} updateAlertStatus={handleUpdateAlertStatus} />;
        default: return <DashboardView {...commonProps} />;
    }
};

export default DashboardController;
