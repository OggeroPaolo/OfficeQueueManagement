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


// POST /tickets/new - Crea un nuovo ticket per un servizio specificato
router.post("/tickets/new", async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ error: "Missing serviceId in request body" });
    }

    const ticketDao = new TicketDAO();
    const newTicket = await ticketDao.getNewTicket(Number(serviceId));

    res.status(201).json(newTicket);
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes("FOREIGN KEY")) {
      // Errore vincolo integrità: serviceId inesistente
      res.status(400).json({ error: "Invalid serviceId: no such service found" });
    } else {
      res.status(500).json({ error: msg });
    }
  }
});


export default router;