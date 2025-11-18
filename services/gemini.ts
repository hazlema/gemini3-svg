import { GoogleGenAI, Type } from "@google/genai";
import { SvgGenerationResponse } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSvg = async (prompt: string): Promise<SvgGenerationResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const modelId = 'gemini-3-pro-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Create an SVG for the following description: ${prompt}. Ensure the SVG is clean, uses a proper viewBox, and is visually appealing.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svgCode: {
              type: Type.STRING,
              description: "The full, valid XML string of the SVG image.",
            },
            title: {
              type: Type.STRING,
              description: "A short, 2-3 word title for the file.",
            },
            description: {
              type: Type.STRING,
              description: "A brief explanation of the design choices.",
            },
          },
          required: ["svgCode", "title", "description"],
        },
        systemInstruction: "You are an expert vector graphics designer and SVG code specialist. Your goal is to generate high-quality, scalable SVG code based on user prompts. Always ensure the SVG has a valid `viewBox` and generally uses a square aspect ratio unless specified otherwise. Avoid using external resources (images/fonts). Use inline styles or attributes for colors.",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(responseText) as SvgGenerationResponse;
    
    // Basic cleanup to ensure no markdown code blocks remain if the model ignores instructions (rare with JSON mode but possible)
    data.svgCode = data.svgCode.replace(/```svg/g, '').replace(/```/g, '').trim();

    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate SVG. Please try again.");
  }
};