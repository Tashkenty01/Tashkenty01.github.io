import { type User, type InsertUser, type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Document operations
  createDocument(document: InsertDocument, fileName: string, filePath: string, fileSize: number): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  searchDocuments(query: string, category?: string): Promise<Document[]>;
  deleteDocument(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    
    // Add some sample data
    this.seedData();
  }

  private async seedData() {
    // Sample users
    const sampleUsers = [
      { fullName: "Ana García López", email: "ana.garcia@email.com", phone: "+1 (555) 123-4567", institution: "Universidad Nacional", areaOfInterest: "literatura" },
      { fullName: "Carlos Mendoza", email: "carlos.mendoza@universidad.edu", phone: "+1 (555) 234-5678", institution: "Instituto Tecnológico", areaOfInterest: "ciencias" },
      { fullName: "María Rodríguez", email: "maria.rodriguez@gmail.com", phone: "+1 (555) 345-6789", institution: "Biblioteca Central", areaOfInterest: "historia" },
    ];

    for (const userData of sampleUsers) {
      await this.createUser(userData);
    }

    // Sample documents
    const sampleDocs = [
      { title: "Cien años de soledad", author: "Gabriel García Márquez", category: "novela", year: 1967, description: "Una obra maestra del realismo mágico", keywords: "realismo mágico, literatura latinoamericana" },
      { title: "Don Quijote de La Mancha", author: "Miguel de Cervantes", category: "novela", year: 1605, description: "La historia del ingenioso hidalgo", keywords: "literatura clásica, aventuras" },
      { title: "El Aleph", author: "Jorge Luis Borges", category: "cuento", year: 1949, description: "Cuentos fantásticos y filosóficos", keywords: "literatura fantástica, filosofía" },
      { title: "La Casa de los Espíritus", author: "Isabel Allende", category: "novela", year: 1982, description: "Saga familiar en Chile", keywords: "realismo mágico, familia" },
      { title: "Rayuela", author: "Julio Cortázar", category: "novela", year: 1963, description: "Novela experimental revolucionaria", keywords: "literatura experimental, vanguardia" },
      { title: "Pedro Páramo", author: "Juan Rulfo", category: "novela", year: 1955, description: "Historia de fantasmas en Comala", keywords: "realismo mágico, México" },
      { title: "Ficciones", author: "Jorge Luis Borges", category: "cuento", year: 1944, description: "Cuentos laberínticos", keywords: "literatura fantástica, laberintos" },
      { title: "La Ciudad y los Perros", author: "Mario Vargas Llosa", category: "novela", year: 1963, description: "Novela sobre la adolescencia", keywords: "literatura peruana, juventud" },
    ];

    const userIds = Array.from(this.users.keys());
    for (const docData of sampleDocs) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      await this.createDocument({ ...docData, uploadedBy: randomUserId }, `${docData.title}.pdf`, `/uploads/${docData.title.replace(/\s+/g, '_')}.pdf`, Math.floor(Math.random() * 5000000) + 1000000);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone ?? null,
      institution: insertUser.institution ?? null,
      areaOfInterest: insertUser.areaOfInterest ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createDocument(insertDocument: InsertDocument, fileName: string, filePath: string, fileSize: number): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      fileName,
      filePath,
      fileSize,
      year: insertDocument.year ?? null,
      description: insertDocument.description ?? null,
      keywords: insertDocument.keywords ?? null,
      uploadedBy: insertDocument.uploadedBy ?? null,
      createdAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async searchDocuments(query: string, category?: string): Promise<Document[]> {
    const allDocs = Array.from(this.documents.values());
    
    return allDocs.filter(doc => {
      const matchesQuery = !query || 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.author.toLowerCase().includes(query.toLowerCase()) ||
        doc.keywords?.toLowerCase().includes(query.toLowerCase()) ||
        doc.description?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || doc.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }
}

export const storage = new MemStorage();
