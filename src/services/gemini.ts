import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface WasteClassificationResult {
  category: "Paper" | "Plastic" | "Metal" | "Organic" | "Glass" | "Unknown";
  confidence: number;
  description: string;
  recyclingTips: string[];
}

const CATEGORY_TIPS: Record<string, string[]> = {
  "Plastic": [
    "Rinse the bottle to remove any residue.",
    "Check if your local facility accepts the plastic type (usually #1).",
    "Keep the cap on or remove based on local guidelines."
  ],
  "Paper": [
    "Remove any plastic tape or staples.",
    "Ensure the cardboard is dry and free of grease.",
    "Flatten completely to save space in the bin."
  ],
  "Organic": [
    "Add to your home compost pile or bin.",
    "Check if your city offers curbside organic waste collection.",
    "Avoid putting plastic stickers from fruit in the compost."
  ],
  "Metal": [
    "Empty all liquid contents completely.",
    "Rinse with water if possible.",
    "Do not crush if your local recycler uses optical sorters."
  ],
  "Glass": [
    "Remove the cork or metal cap.",
    "Rinse thoroughly to remove odors.",
    "Separate by color if required by your local facility."
  ],
  "Unknown": [
    "Examine the item for recycling symbols.",
    "Consult your local waste management guide.",
    "When in doubt, throw it out to avoid contaminating the recycling stream."
  ]
};

export async function classifyWaste(base64Image: string, mimeType: string): Promise<WasteClassificationResult> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Falling back to mock data.");
    return getMockResult();
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: mimeType
              }
            },
            {
              text: `Analyze the given image carefully and assign it to the most appropriate waste category: Paper, Plastic, Metal, Organic, or Glass.
              
              Instructions:
              - Focus on the main object in the image, not the background.
              - If multiple objects are present, choose the dominant or most relevant one.
              - Do not guess randomly—only select a category if there is clear visual evidence.
              - If the image does not clearly belong to any category, return: "Unknown".
              - Double-check for similar-looking categories before finalizing your answer.

              Return the result in JSON format.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: ["Paper", "Plastic", "Metal", "Organic", "Glass", "Unknown"] },
            confidence: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The confidence level of the classification" },
            reason: { type: Type.STRING, description: "A brief description of the identified item and why it was categorized this way" }
          },
          required: ["category", "confidence", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Map string confidence to numeric
    const confidenceMap: Record<string, number> = { "low": 0.3, "medium": 0.6, "high": 0.95 };
    
    return {
      category: result.category as any,
      confidence: confidenceMap[result.confidence] || 0.5,
      description: result.reason,
      recyclingTips: CATEGORY_TIPS[result.category] || CATEGORY_TIPS["Unknown"]
    };
  } catch (error) {
    console.error("Gemini classification failed:", error);
    return {
      category: "Unknown",
      confidence: 0,
      description: "Failed to analyze image. Please try again.",
      recyclingTips: CATEGORY_TIPS["Unknown"]
    };
  }
}

function getMockResult(): WasteClassificationResult {
  const categories: ("Paper" | "Plastic" | "Metal" | "Organic" | "Glass")[] = ["Paper", "Plastic", "Metal", "Organic", "Glass"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return {
    category,
    confidence: 0.85,
    description: `Mock classification of ${category}`,
    recyclingTips: CATEGORY_TIPS[category]
  };
}
