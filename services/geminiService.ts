import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key preventing "process is not defined" crash in browser
const getApiKey = () => {
    try {
        // Check for global process polyfill or standard process
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        // Fallback for Vite's import.meta.env
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
            // @ts-ignore
            return import.meta.env.VITE_API_KEY;
        }
    } catch (e) {
        // Ignore errors
    }
    return '';
};

const apiKey = getApiKey();
// Initialize with a dummy key if missing to prevent immediate crash, but calls will fail gracefully
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });

export const generateNewsContent = async (headline: string, context: string): Promise<string> => {
    if (!apiKey) return "API Key missing. Cannot generate content.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a professional news article (approx 200 words) based on this headline: "${headline}" and these context notes: "${context}". formatting should be plain text paragraphs.`,
        });
        return response.text || "Failed to generate content.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating content. Please try again.";
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following text into a concise 2-sentence snippet for a news feed: ${text}`,
        });
        return response.text || "Failed to summarize.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating summary.";
    }
};