import { Router } from "express";
import ServiceDao from "../dao/serviceDao.js";
import { closeDatabase } from "../config/database.js"
import TicketDAO from "../dao/ticketDao.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


// Get all services
router.get("/services", async (req, res, next) => {
  try {
    const serviceDao = new ServiceDao();

    const serviceList = await serviceDao.getAllServices();

    res.status(200).json(serviceList);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// POST /tickets/new - Creates a new ticket for a selected service
router.post("/tickets/new", async (req, res) => {
  try {
    const { serviceTag } = req.body;
    if (!serviceTag) {
      return res.status(400).json({ error: "Missing serviceTag in request body" });
    }

    const ticketDao = new TicketDAO();
    const newTicket = await ticketDao.getNewTicket(serviceTag);

    res.status(201).json(newTicket);
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes("not found")) {
      res.status(400).json({ error: msg });
    } else {
      res.status(500).json({ error: msg });
    }
  }
});


// POST /tickets/next - Retreives the next ticket to serve for a selected counter
router.post("/tickets/next", async (req, res) => {
  try {
    const { counterNumber } = req.body;
    if (!counterNumber) {
      return res.status(400).json({ error: "Missing counterNumber in request body" });
    }

    const ticketDao = new TicketDAO();
    const nextTicket = await ticketDao.getNextTicket(counterNumber);

    if (!nextTicket) {
      return res.status(204).send(); // No Content - nessun ticket da chiamare
    }

    res.status(200).json(nextTicket);

  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes("not found")) {
      res.status(400).json({ error: msg });
    } else {
      res.status(500).json({ error: msg });
    }
  }
});


export default router;