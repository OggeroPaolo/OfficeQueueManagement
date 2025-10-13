import request from "supertest";
import express from "express";
import router from "../../src/routes/index.js"; // adjust if needed
import { getDatabase } from "../../src/config/database.js";
import TicketDAO from "../../src/dao/ticketDao.js";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

let app: express.Express;
let db: any;

beforeAll(async () => {
  process.env.DB_PATH = ":memory:"; // in-memory SQLite
  db = await getDatabase();


  app = express();
  app.use(express.json());
  app.use("/api", router);

  // Initialize DAO with db
  const ticketDao = new TicketDAO();

  // Add a new ticket
  await ticketDao.getNewTicket("Shipping");

});

afterAll(async () => {
  await db.close();
});

describe("POST /tickets/next", () => {
  it("returns 400 if counterNumber is missing", async () => {
    const res = await request(app).post("/api/tickets/next").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing counterNumber");
  });

  it("returns 400 if counterNumber does not exist", async () => {
    const res = await request(app).post("/api/tickets/next").send({ counterNumber: "Non-exist Counter" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("not found");
  });

  it("returns 200 with next ticket", async () => {
    const res = await request(app).post("/api/tickets/next").send({ counterNumber: "Counter 1" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("returns 204 when no tickets remain", async () => {
    const res = await request(app).post("/api/tickets/next").send({ counterNumber: "Counter 1" });
    expect(res.status).toBe(204);
  });
});



// 40 minutes