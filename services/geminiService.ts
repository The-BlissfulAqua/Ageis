
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

export const generateWhatIfAnalysis = async (
    scenario: { weather: string, time: string, sector: string }
): Promise<string> => {
    const prompt = `
    As a senior border security analyst, conduct a "what-if" simulation.
    Analyze the provided scenario and generate a concise risk assessment and tactical recommendation.
    Format as clean markdown.

    Scenario Details:
    - Sector of Interest: ${scenario.sector}
    - Time of Day: ${scenario.time}
    - Weather Conditions: ${scenario.weather}

    Based on these variables, provide:
    1.  **Threat Assessment:** What is the likely change in intrusion risk? What types of threats are most probable?
    2.  **AI Model Impact:** How might these conditions affect sensor performance (e.g., thermal in fog) and AI predictions?
    3.  **Tactical Recommendations:** What specific, actionable steps should be taken? (e.g., "Increase drone surveillance in Sector B's northern ridge," "Re-task patrol unit 3 to the river crossing.")
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating what-if analysis:", error);
        return "An error occurred during the simulation. Please check the console.";
    }
};
