import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key preventing "process is not defined" crash in browser
const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env) {
            return process.env.API_KEY || '';
        }
    } catch (e) {
        // process not defined
    }
    return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

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