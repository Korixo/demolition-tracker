import vision from "@google-cloud/vision";
import * as fs from "fs";

// Initialize Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

interface ExtractedDemolitionData {
  ownerName?: string;
  buildingName: string;
  location?: string;
  demolitionDate: string;
  extractedText: string;
}

function parseDateFromText(text: string): string {
  // Look for date patterns like "09.12.2025", "2025-12-09", etc.
  const datePattern = /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{4}[./-]\d{1,2}[./-]\d{1,2})/;
  const match = text.match(datePattern);

  if (match) {
    try {
      // Handle DD.MM.YYYY format (common in Europe/ArcheAge)
      const parts = match[0].split(/[./-]/);
      let date;

      if (parts[2].length === 4) {
        // Format: DD.MM.YYYY or MM-DD-YYYY
        if (parseInt(parts[0]) > 12) {
          // Definitely DD.MM.YYYY
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
          // Ambiguous, try MM-DD-YYYY first, fallback to DD.MM.YYYY
          const asMMDD = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          const asDDMM = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          date = asMMDD;
        }
      } else {
        // Format: YYYY-MM-DD
        date = new Date(match[0]);
      }

      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      // Fallback to current date
    }
  }

  return new Date().toISOString();
}

function extractFieldsFromText(text: string): Partial<ExtractedDemolitionData> {
  const result: Partial<ExtractedDemolitionData> = {};

  // Extract demolition date
  result.demolitionDate = parseDateFromText(text);

  // Look for building name (after "Building Name:" or "Miner's Farmhouse" pattern)
  const buildingMatch = text.match(
    /(?:Building\s*Name|Farmhouse|House|Structure)[:\s]+([^\n]+)/i
  );
  if (buildingMatch && buildingMatch[1]) {
    result.buildingName = buildingMatch[1].trim();
  }

  // Look for owner (after "Owner:" or name pattern)
  const ownerMatch = text.match(/Owner[:\s]+([^\n]+)/i);
  if (ownerMatch && ownerMatch[1]) {
    result.ownerName = ownerMatch[1].trim();
  }

  // Look for location/territory (after "Territory", "Zone", "Protected Until" location info)
  const locationMatch = text.match(/(?:Territory|Zone|Area|Region|Location)[:\s]+([^\n]+)/i);
  if (locationMatch && locationMatch[1]) {
    result.location = locationMatch[1].trim();
  }

  return result;
}

export async function extractDemolitionInfo(
  imagePath: string
): Promise<ExtractedDemolitionData> {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CLOUD_API_KEY) {
      throw new Error(
        "Google Cloud credentials not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CLOUD_API_KEY."
      );
    }

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Call Google Cloud Vision API with proper typing
    const request = {
      image: {
        content: base64Image,
      },
      features: [
        {
          type: "TEXT_DETECTION" as const,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result] = await (client.batchAnnotateImages as any)({ requests: [request] });
    const annotations = result.responses[0];

    if (!annotations.fullTextAnnotation) {
      throw new Error("No text could be extracted from the image");
    }

    const extractedText = annotations.fullTextAnnotation.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No readable text in image");
    }

    // Extract fields from the text
    const fields = extractFieldsFromText(extractedText);

    // Ensure required fields
    if (!fields.buildingName) {
      fields.buildingName = "Unknown Building";
    }
    if (!fields.demolitionDate) {
      fields.demolitionDate = new Date().toISOString();
    }

    return {
      ownerName: fields.ownerName,
      buildingName: fields.buildingName,
      location: fields.location,
      demolitionDate: fields.demolitionDate,
      extractedText,
    };
  } catch (error) {
    console.error("Google Cloud Vision error:", error);
    throw new Error(
      `Failed to extract demolition info: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
