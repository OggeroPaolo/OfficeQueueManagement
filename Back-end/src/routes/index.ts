import { Router } from "express";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;