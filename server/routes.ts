import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistEntrySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Get all waitlist entries
  apiRouter.get("/waitlist", async (_req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waitlist entries" });
    }
  });

  // Add a new waitlist entry
  apiRouter.post("/waitlist", async (req, res) => {
    try {
      const parseResult = insertWaitlistEntrySchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }

      const { email } = parseResult.data;
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(email);
      if (existingEntry) {
        return res.status(409).json({ 
          message: "Email already registered on the waitlist" 
        });
      }

      const newEntry = await storage.createWaitlistEntry(parseResult.data);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to add to waitlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
