import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("Gemini API key not found. AI features will be disabled. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const suggestCategory = async (description: string, categories: { id: string; name: string }[]): Promise<string | null> => {
    if (!process.env.API_KEY || categories.length === 0) {
        return null;
    }

    const categoryNames = categories.map(c => c.name);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following transaction description, pick the most appropriate category from this list: [${categoryNames.join(', ')}]. \n\nDescription: "${description}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: {
                            type: Type.STRING,
                            description: `The suggested category, which must be one of the provided category names.`,
                            enum: categoryNames,
                        },
                    },
                    required: ["category"],
                },
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && result.category) {
            const matchedCategory = categories.find(c => c.name === result.category);
            return matchedCategory ? matchedCategory.id : null;
        }

        return null;
    } catch (error) {
        console.error("Error suggesting category with Gemini:", error);
        return null;
    }
};