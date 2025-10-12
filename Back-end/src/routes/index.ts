import { Router } from "express";
import ServiceDao from "../dao/serviceDao.js";
import { closeDatabase } from "../config/database.js"

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


export default router;