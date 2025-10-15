
import request from "supertest";
import express from "express";
import router from "../../src/routes/index.js"; 
import { getDatabase } from "../../src/config/database.js";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { initializeDatabase } from "../../src/db/init.js";
import { closeDatabase } from "../../src/config/database.js";

let app: express.Express;
let db: any;

beforeAll(async () => {
  await initializeDatabase();

  app = express();
  app.use(express.json());
  app.use("/api", router);

  db = await getDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("GET /services", () => {
  it("returns list of all services successfully", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    // Check that it contains expected seeded services
    expect(res.body).toContain("Shipping");
    expect(res.body).toContain("Account Management");
    expect(res.body).toContain("Money Deposit");
    expect(res.body).toContain("Bill Payment");
  });

  it("returns services in correct format (array of strings)", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    // Verify all items are strings
    res.body.forEach((service: any) => {
      expect(typeof service).toBe("string");
    });
  });

  it("handles unexpected DB errors (500)", async () => {
    // Temporarily rename the table to simulate DB failure
    await db.run(`ALTER TABLE services RENAME TO _services_temp;`);

    const res = await request(app).get("/api/services");

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();

    // Restore table for cleanup
    await db.run(`ALTER TABLE _services_temp RENAME TO services;`);
  });
});
