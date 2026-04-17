// Mock service for local use without API keys
export interface WasteClassificationResult {
  category: "Paper" | "Plastic" | "Metal" | "Organic" | "Glass" | "Unknown";
  confidence: number;
  description: string;
  recyclingTips: string[];
}

const MOCK_RESULTS: WasteClassificationResult[] = [
  {
    category: "Plastic",
    confidence: 0.95,
    description: "Clear PET water bottle with cap.",
    recyclingTips: [
      "Rinse the bottle to remove any residue.",
      "Check if your local facility accepts the plastic type (usually #1).",
      "Keep the cap on or remove based on local guidelines."
    ]
  },
  {
    category: "Paper",
    confidence: 0.88,
    description: "Flattened cardboard shipping box.",
    recyclingTips: [
      "Remove any plastic tape or staples.",
      "Ensure the cardboard is dry and free of grease.",
      "Flatten completely to save space in the bin."
    ]
  },
  {
    category: "Organic",
    confidence: 0.92,
    description: "Banana peel and apple core.",
    recyclingTips: [
      "Add to your home compost pile or bin.",
      "Check if your city offers curbside organic waste collection.",
      "Avoid putting plastic stickers from fruit in the compost."
    ]
  },
  {
    category: "Metal",
    confidence: 0.97,
    description: "Aluminum soda can.",
    recyclingTips: [
      "Empty all liquid contents completely.",
      "Rinse with water if possible.",
      "Do not crush if your local recycler uses optical sorters."
    ]
  },
  {
    category: "Glass",
    confidence: 0.94,
    description: "Green glass wine bottle.",
    recyclingTips: [
      "Remove the cork or metal cap.",
      "Rinse thoroughly to remove odors.",
      "Separate by color if required by your local facility."
    ]
  }
];

export async function classifyWaste(_base64Image: string, _mimeType: string): Promise<WasteClassificationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a random mock result
  const randomIndex = Math.floor(Math.random() * MOCK_RESULTS.length);
  return MOCK_RESULTS[randomIndex];
}
