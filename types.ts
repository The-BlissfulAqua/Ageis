
export type View = 'dashboard' | 'sensors' | 'federated' | 'predictions' | 'adversarial' | 'field';

export enum AlertLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical',
}

export enum AlertStatus {
    New = 'New',
    Investigating = 'Investigating',
    Confirmed = 'Confirmed Intrusion',
    FalseAlarm = 'False Alarm',
    Resolved = 'Resolved',
}

export interface FieldFeedback {
    notes: string;
    photo?: string; // base64 or URL
}

export interface Alert {
    id: string;
    timestamp: number;
    sector: number;
    sectorName: string;
    level: AlertLevel;
    status: AlertStatus;
    confidence: number;
    reason: string;
    location: { lat: number; lng: number };
}

export type SensorType = 'motion' | 'gps' | 'thermal' | 'drone' | 'seismic' | 'patrol';

export interface Sector {
    id: number;
    name: string;
    description: string;
    sensors: SensorType[];
    data: { [key in SensorType]?: string | number | boolean };
    status: 'normal' | 'suspicious' | 'alert';
    modelContribution: number;
}

export interface ModelTrainingData {
    round: number;
    accuracy: number;
}

export interface Vulnerability {
    id: string;
    timestamp: number;
    sector: number;
    description: string;
    mitigation: string;
}

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    hash: string;
}

export interface HeatmapPoint {
    id: string;
    lat: number;
    lng: number;
    intensity: number;
}
