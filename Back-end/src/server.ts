import http from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  logger.info(`Server listening on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error while closing server");
      process.exit(1);
    }
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));