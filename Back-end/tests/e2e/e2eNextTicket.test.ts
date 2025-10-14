import request from "supertest";
import express from "express";
import router from "../../src/routes/index.js";
import { initializeDatabase } from "../../src/db/init.js";
import { closeDatabase } from "../../src/config/database.js";
import TicketDAO from "../../src/dao/ticketDao.js";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

let app: express.Express;

beforeAll(async () => {

  await initializeDatabase();

  app = express();
  app.use(express.json());
  app.use("/api", router);

  const ticketDao = new TicketDAO();

  // Add a new ticket
  await ticketDao.getNewTicket("Shipping");

});

afterAll(async () => {
  await closeDatabase();
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
