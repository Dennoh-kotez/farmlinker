import { waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry } from "@shared/schema";

export interface IStorage {
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
}

export class MemStorage implements IStorage {
  private waitlistEntries: Map<number, WaitlistEntry>;
  currentId: number;

  constructor() {
    this.waitlistEntries = new Map();
    this.currentId = 1;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email === email,
    );
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentId++;
    const now = new Date();
    const entry: WaitlistEntry = { 
      id,
      name: insertEntry.name,
      email: insertEntry.email,
      company: insertEntry.company ?? null,
      role: insertEntry.role ?? null,
      createdAt: now
    };
    this.waitlistEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
