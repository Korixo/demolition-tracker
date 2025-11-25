import Tesseract from "tesseract.js";

interface ExtractedDemolitionData {
  ownerName?: string;
  buildingName: string;
  location?: string;
  demolitionDate: string;  // ISO format
  extractedText: string;
}

function parseDate(dateString: string): string {
  // Try to parse various date formats and convert to ISO 8601
  const dateStr = dateString.trim();
  
  // Try common formats
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  
  // If parsing fails, return a placeholder
  return new Date().toISOString();
}

function extractFieldsFromText(text: string): Partial<ExtractedDemolitionData> {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const result: Partial<ExtractedDemolitionData> = {};

  // Look for dates (common patterns like "2024-01-15", "01/15/2024", "January 15, 2024")
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/gi;
  const dateMatches = text.match(datePattern);
  if (dateMatches && dateMatches.length > 0) {
    result.demolitionDate = parseDate(dateMatches[0]);
  }

  // Look for building name (often after "Building:", "Property:", "Structure:", etc.)
  const buildingMatch = text.match(/(?:Building|Property|Structure|Building\s+Name)[:\s]+([^\n]+)/i);
  if (buildingMatch && buildingMatch[1]) {
    result.buildingName = buildingMatch[1].trim();
  }

  // Look for owner name (often after "Owner:", "Property Owner:", "Applicant:", etc.)
  const ownerMatch = text.match(/(?:Owner|Property\s+Owner|Applicant|Owner\s+Name)[:\s]+([^\n]+)/i);
  if (ownerMatch && ownerMatch[1]) {
    result.ownerName = ownerMatch[1].trim();
  }

  // Look for location (often after "Location:", "Address:", "Site:", "Zone:", "Area:")
  const locationMatch = text.match(/(?:Location|Address|Site|Zone|Area|District)[:\s]+([^\n]+)/i);
  if (locationMatch && locationMatch[1]) {
    result.location = locationMatch[1].trim();
  }

  return result;
}

export async function extractDemolitionInfo(imagePath: string): Promise<ExtractedDemolitionData> {
  try {
    // Perform OCR using Tesseract
    const result = await Tesseract.recognize(imagePath, "eng");
    const extractedText = result.data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the image");
    }

    // Extract fields from the text
    const fields = extractFieldsFromText(extractedText);

    // Ensure required fields exist
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
    console.error("OCR extraction error:", error);
    throw new Error(`Failed to extract demolition info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
