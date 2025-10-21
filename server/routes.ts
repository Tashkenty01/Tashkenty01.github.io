import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertDocumentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_config,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User registration
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Document upload
  app.post("/api/documents", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const documentData = insertDocumentSchema.parse(req.body);
      
      const document = await storage.createDocument(
        documentData,
        req.file.filename,
        req.file.path,
        req.file.size
      );
      
      res.json(document);
    } catch (error: any) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      res.status(400).json({ message: error.message });
    }
  });

  // Get all documents with search
  app.get("/api/documents", async (req, res) => {
    try {
      const { search, category } = req.query;
      
      let documents;
      if (search || category) {
        documents = await storage.searchDocuments(
          search as string || "", 
          category as string || undefined
        );
      } else {
        documents = await storage.getAllDocuments();
      }
      
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Download document
  app.get("/api/documents/:id/download", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = document.filePath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete document
  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Delete file from disk
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      const deleted = await storage.deleteDocument(req.params.id);
      if (deleted) {
        res.json({ message: "Document deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete document" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const documents = await storage.getAllDocuments();
      
      const stats = {
        totalUsers: users.length,
        totalDocuments: documents.length,
        todayDownloads: Math.floor(Math.random() * 500) + 100, // Mock data for demo
        storage: "15.7 GB" // Mock data for demo
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
