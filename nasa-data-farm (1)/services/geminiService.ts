
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, NasaData, TerraAnalysisResponse, Location } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export const getAIAssistantTip = async (gameState: GameState, nasaData: NasaData, location: Location): Promise<string> => {
  if (!API_KEY) {
    return "The AI assistant is currently offline. Please check your configuration.";
  }

  const plantedCrops = gameState.tiles.filter(t => t.planted).length;
  const shouldGiveFact = Math.random() < 0.2; // 20% chance for a fun fact

  const prompt = `
    You are Terra, a friendly and insightful AI farm assistant for the tycoon game "NASA Data Farm".
    Your goal is to provide a single, short, helpful, and cozy message to the player.
    Your advice can be either:
    1.  IMMEDIATE & TACTICAL: Based on current satellite data and farm status (e.g., "Soil moisture is low, consider watering.")
    2.  STRATEGIC & LONG-TERM: Based on the player's progress, money, and upcoming seasons (e.g., "Saving up for an upgrade would be a great investment.")

    Decide which type of advice is most relevant right now. Keep your response to 1-2 concise sentences. Do not use markdown.
    
    ${shouldGiveFact
      ? `Instead of a gameplay tip, provide one fascinating, one-sentence fun fact related to NASA, space exploration, sustainable agriculture, or earth science.`
      : `
        When relevant, briefly explain the "why" behind your tip by referencing a data point.
        The player is playing a tycoon game. They care about making money, gaining XP, and expanding their farm efficiently.

        Current Location: ${location.name}
        Current Game State:
        - Day: ${gameState.day}, Season: ${gameState.season}
        - Money: $${gameState.money}
        - Level: ${gameState.level}
        - Water: ${gameState.water}L
        - Planted Crops: ${plantedCrops} out of ${gameState.tiles.filter(t => !t.locked).length} available tiles

        Current NASA Satellite Data:
        - Soil Moisture: ${nasaData.soilMoisture.toFixed(0)}%
        - Temperature: ${nasaData.temperature.toFixed(0)}°C
        - NDVI (Vegetation Index): ${nasaData.ndvi.toFixed(2)}

        Based on this data, provide one helpful, educational, and encouraging tip.
        Example (Tactical): "The soil moisture is getting low at ${nasaData.soilMoisture.toFixed(0)}%. Watering your crops now will keep them healthy!"
        Example (Strategic): "You have $${gameState.money}. Saving up for a farm expansion could really boost your income next season."
        Example (Seasonal): "Fall is approaching in ${30 - (gameState.day % 30)} days. It's a good time to harvest your summer crops."
        Be creative, friendly, and aware of the tycoon game mechanics.
      `
    }
  `;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.8,
          topP: 0.9,
        }
    });

    if (response.text) {
      return response.text.trim().replace(/"/g, ''); // Clean up quotes
    }
    return "Let's check the data panels for our next move!";

  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "I seem to be having trouble analyzing the data right now. Let's stick to the basics!";
  }
};


export const getTerraAnalysis = async (gameState: GameState, nasaData: NasaData, location: Location): Promise<TerraAnalysisResponse> => {
    if (!API_KEY) {
        return {
            summary: "AI systems are offline. Cannot perform analysis.",
            suggestion: null,
        };
    }

    const plantedTiles = gameState.tiles.filter(t => t.planted && !t.locked);
    const unwateredCount = plantedTiles.filter(t => !t.watered).length;
    const unfertilizedCount = plantedTiles.filter(t => !t.fertilized).length;

    const prompt = `
    You are Terra, an expert AI farm analyst. Your task is to analyze the provided game state and satellite data for "NASA Data Farm" and return a structured JSON response.

    Your analysis should include:
    1.  A "summary": A brief, friendly, 1-2 sentence overview of the farm's current situation, mentioning the location.
    2.  A "suggestion": The single most impactful, actionable suggestion the player can take right now. The suggestion must be something that can be automated, like watering all dry plants. If nothing needs to be done, suggestion should be null.

    Current Location: ${location.name}
    Current Game State & Data:
    - Season: ${gameState.season}
    - Water: ${gameState.water}L
    - Energy: ${gameState.energy}
    - Planted Tiles: ${plantedTiles.length}
    - Unwatered Planted Tiles: ${unwateredCount}
    - Unfertilized Planted Tiles: ${unfertilizedCount}
    - Soil Moisture: ${nasaData.soilMoisture.toFixed(0)}%
    - NDVI (Vegetation Index): ${nasaData.ndvi.toFixed(2)}

    Decision Logic for Suggestion:
    - PRIORITY 1: If soil moisture is low (< 40%) and there are unwatered plants, suggest watering.
    - PRIORITY 2: If NDVI is low (< 0.5) and there are unfertilized plants, suggest fertilizing.
    - If neither of these high-priority conditions is met, return the suggestion as null.

    Provide your response ONLY in the specified JSON format.
  `;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        suggestion: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                action: { type: Type.STRING, enum: ['water', 'fertilize'] },
                                message: { type: Type.STRING },
                                criteria: {
                                    type: Type.OBJECT,
                                    properties: {
                                        requiresPlanted: { type: Type.BOOLEAN },
                                        isWatered: { type: Type.BOOLEAN, nullable: true },
                                        isFertilized: { type: Type.BOOLEAN, nullable: true },
                                        soilMoisture: {
                                            type: Type.OBJECT,
                                            nullable: true,
                                            properties: {
                                                comparison: { type: Type.STRING, enum: ['less_than'] },
                                                value: { type: Type.NUMBER }
                                            }
                                        },
                                        ndvi: {
                                            type: Type.OBJECT,
                                            nullable: true,
                                            properties: {
                                                comparison: { type: Type.STRING, enum: ['less_than'] },
                                                value: { type: Type.NUMBER }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText) as TerraAnalysisResponse;
        return parsed;

    } catch (error) {
        console.error("Gemini analysis call failed:", error);
        return {
            summary: "I had a system error while analyzing the farm. Please check the raw data yourself!",
            suggestion: null,
        };
    }
};
