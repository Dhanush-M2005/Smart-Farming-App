import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePlantDisease = async (base64Image: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Using gemini-2.5-flash-image for image analysis as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this plant leaf. Identify the disease if present, the confidence level, causes, and recommended treatments. Format the response with clear headings."
          }
        ]
      }
    });

    return response.text || "Could not analyze the image. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error analyzing image. Please ensure your API key is valid.";
  }
};

export const getCropAdvisory = async (query: string, language: string): Promise<string> => {
  try {
    const ai = getClient();
    // Using gemini-2.5-flash for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert agricultural advisor. The user asks: "${query}". Answer in ${language} language concisely and helpfully.`,
    });
    return response.text || "I couldn't generate an answer.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Service unavailable.";
  }
};
