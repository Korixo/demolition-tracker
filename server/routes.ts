import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDemolitionSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { extractDemolitionInfo } from "./ocr";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and extract demolition info from image
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    let tempFilePath: string | null = null;
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Store image as data URL for now (in production, use object storage)
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

      // Save image temporarily for Tesseract OCR
      tempFilePath = join("/tmp", `ocr_${Date.now()}_${req.file.originalname}`);
      writeFileSync(tempFilePath, req.file.buffer);

      // Extract demolition info using Tesseract OCR (free!)
      const extractedData = await extractDemolitionInfo(tempFilePath);

      res.json({
        imageUrl,
        extractedData,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ 
        error: "Failed to process image", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      // Clean up temporary file
      if (tempFilePath) {
        try {
          unlinkSync(tempFilePath);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  });

  // Get all demolitions
  app.get("/api/demolitions", async (_req, res) => {
    try {
      const demolitions = await storage.getDemolitions();
      res.json(demolitions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demolitions" });
    }
  });

  // Get single demolition
  app.get("/api/demolitions/:id", async (req, res) => {
    try {
      const demolition = await storage.getDemolition(req.params.id);
      if (!demolition) {
        return res.status(404).json({ error: "Demolition not found" });
      }
      res.json(demolition);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demolition" });
    }
  });

  // Create new demolition
  app.post("/api/demolitions", async (req, res) => {
    try {
      const validatedData = insertDemolitionSchema.parse(req.body);
      const demolition = await storage.createDemolition(validatedData);
      res.status(201).json(demolition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create demolition" });
    }
  });

  // Update demolition
  app.patch("/api/demolitions/:id", async (req, res) => {
    try {
      const partialSchema = insertDemolitionSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const demolition = await storage.updateDemolition(req.params.id, validatedData);
      
      if (!demolition) {
        return res.status(404).json({ error: "Demolition not found" });
      }
      
      res.json(demolition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update demolition" });
    }
  });

  // Delete demolition
  app.delete("/api/demolitions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDemolition(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Demolition not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete demolition" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
