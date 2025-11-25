import { type User, type InsertUser, type Demolition, type InsertDemolition } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDemolitions(): Promise<Demolition[]>;
  getDemolition(id: string): Promise<Demolition | undefined>;
  createDemolition(demolition: InsertDemolition): Promise<Demolition>;
  updateDemolition(id: string, demolition: Partial<InsertDemolition>): Promise<Demolition | undefined>;
  deleteDemolition(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private demolitions: Map<string, Demolition>;

  constructor() {
    this.users = new Map();
    this.demolitions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDemolitions(): Promise<Demolition[]> {
    return Array.from(this.demolitions.values()).sort((a, b) => 
      new Date(a.demolitionDate).getTime() - new Date(b.demolitionDate).getTime()
    );
  }

  async getDemolition(id: string): Promise<Demolition | undefined> {
    return this.demolitions.get(id);
  }

  async createDemolition(demolition: InsertDemolition): Promise<Demolition> {
    const id = randomUUID();
    const now = new Date();
    const newDemolition: Demolition = {
      id,
      ownerName: demolition.ownerName ?? null,
      buildingName: demolition.buildingName,
      location: demolition.location ?? null,
      demolitionDate: new Date(demolition.demolitionDate),
      imageUrl: demolition.imageUrl ?? null,
      extractedText: demolition.extractedText ?? null,
      notes: demolition.notes ?? null,
      createdAt: now,
    };
    this.demolitions.set(id, newDemolition);
    return newDemolition;
  }

  async updateDemolition(id: string, updates: Partial<InsertDemolition>): Promise<Demolition | undefined> {
    const existing = this.demolitions.get(id);
    if (!existing) return undefined;

    const updated: Demolition = {
      ...existing,
      ...(updates.ownerName !== undefined && { ownerName: updates.ownerName ?? null }),
      ...(updates.buildingName !== undefined && { buildingName: updates.buildingName }),
      ...(updates.location !== undefined && { location: updates.location ?? null }),
      ...(updates.demolitionDate !== undefined && { demolitionDate: new Date(updates.demolitionDate) }),
      ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl ?? null }),
      ...(updates.extractedText !== undefined && { extractedText: updates.extractedText ?? null }),
      ...(updates.notes !== undefined && { notes: updates.notes ?? null }),
    };
    
    this.demolitions.set(id, updated);
    return updated;
  }

  async deleteDemolition(id: string): Promise<boolean> {
    return this.demolitions.delete(id);
  }
}

export const storage = new MemStorage();
