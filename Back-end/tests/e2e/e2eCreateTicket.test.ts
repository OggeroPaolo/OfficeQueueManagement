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

describe.skip("POST /tickets/new", () => {
  it("returns 400 if serviceTag is missing", async () => {
    const res = await request(app).post("/api/tickets/new").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing serviceTag");
  });

  it("returns 400 if serviceTag does not exist", async () => {
    const res = await request(app)
      .post("/api/tickets/new")
      .send({ serviceTag: "NonExist" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch('not found');
  });

  it("creates a new ticket successfully", async () => {
    const res = await request(app)
      .post("/api/tickets/new")
      .send({ serviceTag: "Shipping" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("ticket_code");
    expect(res.body).toHaveProperty("service_id");
  });

  it("handles unexpected DB errors (500)", async () => {
    // Temporarily rename the table to simulate DB failure
    await db.run(`ALTER TABLE services RENAME TO _services_temp;`);

    const res = await request(app)
      .post("/api/tickets/new")
      .send({ serviceTag: "Shipping" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();

    // Restore table for cleanup
    await db.run(`ALTER TABLE _services_temp RENAME TO services;`);
  });
});
