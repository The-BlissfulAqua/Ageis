import { GoogleGenAI } from "@google/genai";
import type { Alert, Sector, Vulnerability } from '../types';

// Fix: Refactor API key handling to align with Gemini API guidelines.
// The API key is sourced from `process.env.API_KEY` and is assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


export const generateIntelligenceBriefing = async (
    alerts: Alert[],
    sectors: Sector[],
    vulnerabilities: Vulnerability[],
    modelAccuracy: number
): Promise<string> => {
    const highPriorityAlerts = alerts.filter(a => a.level === 'High' || a.level === 'Critical').slice(0, 3);
    const suspiciousSectors = sectors.filter(s => s.status === 'suspicious' || s.status === 'alert');
    
    const prompt = `
    Generate a concise, professional intelligence briefing for a border security commander based on the following real-time data.
    Format the output as clean markdown. Use headings like "### Key Threats" and "### Recommendations".

    Current System Status:
    - Global Federated Model Accuracy: ${Math.round(modelAccuracy * 100)}%
    - Total Active Sectors: ${sectors.length}
    - Active High-Priority Alerts: ${highPriorityAlerts.length}
    - Recently Discovered Vulnerabilities: ${vulnerabilities.length}

    High-Priority Alerts Details:
    ${highPriorityAlerts.length > 0 ? highPriorityAlerts.map(a => `- ${a.sectorName}: ${a.reason} (Confidence: ${Math.round(a.confidence * 100)}%)`).join('\n') : 'None'}

    Suspicious Sector Activity:
    ${suspiciousSectors.length > 0 ? suspiciousSectors.map(s => `- ${s.name} is showing anomalous readings.`).join('\n') : 'All sectors operating within normal parameters.'}

    Adversarial AI Findings (Vulnerabilities):
    ${vulnerabilities.length > 0 ? vulnerabilities.map(v => {
        const sector = sectors.find(s => s.id === v.sector);
        return `- ${sector ? sector.name : `Sector ${v.sector}`}: ${v.description}. Recommended Mitigation: ${v.mitigation}`;
    }).join('\n') : 'No new vulnerabilities detected.'}

    Based on this data, provide a summary of the current threat landscape, identify the most critical areas of concern, and suggest immediate, actionable recommendations for patrol allocation and asset deployment.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating intelligence briefing:", error);
        return "An error occurred while generating the AI briefing. Please check the console for details.";
    }
};
