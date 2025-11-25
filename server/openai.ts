import OpenAI from "openai";

// Lazy-load OpenAI client to avoid initialization errors when API key is not set
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Please add your OpenAI API key to Secrets.");
  }
  
  if (!openai) {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  return openai;
}

interface ExtractedDemolitionData {
  ownerName?: string;
  buildingName: string;
  location?: string;
  demolitionDate: string;  // ISO format
  extractedText: string;
}

export async function extractDemolitionInfo(base64Image: string): Promise<ExtractedDemolitionData> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o",  // Using gpt-4o for vision capabilities  
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract demolition notice information from this image. Return JSON with:
- ownerName: property owner's name (if visible)
- buildingName: name/type of building
- location: location, zone, or region name (if visible)
- demolitionDate: date and time in ISO 8601 format
- extractedText: all visible text from the notice

If any field is not found, omit it except buildingName and demolitionDate which are required.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const extracted = JSON.parse(content) as ExtractedDemolitionData;
    
    // Validate required fields
    if (!extracted.buildingName || !extracted.demolitionDate) {
      throw new Error("Missing required fields: buildingName or demolitionDate");
    }

    return extracted;
  } catch (error) {
    console.error("OpenAI extraction error:", error);
    throw new Error(`Failed to extract demolition info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
