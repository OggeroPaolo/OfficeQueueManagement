import { getDatabase, execSQL, runQuery, getOne } from "../config/database.js";
import { logger } from "../config/logger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize the database with schema
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Initialize database connection
    getDatabase();
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, "schema.sql");
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf-8").trim();
      
      // Only execute if schema file has content
      if (schema.length > 0) {
        await execSQL(schema);
        logger.info("Database schema initialized successfully");
        
        // Seed default data
        await seedDefaultData();
      } else {
        logger.info("Schema file is empty, database initialized without schema");
      }
    } else {
      logger.warn("Schema file not found, database initialized without schema");
    }
    
  } catch (error) {
    logger.error({ error }, "Failed to initialize database");
    throw error;
  }
};

/**
 * Seed default data for testing
 */
const seedDefaultData = async (): Promise<void> => {
  try {
    // Check if we already have data
    const result = await getOne<{ count: number }>("SELECT COUNT(*) as count FROM services");
    
    if (result && result.count === 0) {
      logger.info("Seeding default data...");
      
      // Insert services
      await runQuery(
        `INSERT INTO services (tag_name, service_time) VALUES (?, ?)`,
        ["Shipping", 10]
      );
      await runQuery(
        `INSERT INTO services (tag_name, service_time) VALUES (?, ?)`,
        ["Account Management", 15]
      );
      await runQuery(
        `INSERT INTO services (tag_name, service_time) VALUES (?, ?)`,
        ["Money Deposit", 5]
      );
      await runQuery(
        `INSERT INTO services (tag_name, service_time) VALUES (?, ?)`,
        ["Bill Payment", 8]
      );

      // Insert counters
      await runQuery(
        `INSERT INTO counters (counter_number) VALUES (?)`,
        ["Counter 1"]
      );
      await runQuery(
        `INSERT INTO counters (counter_number) VALUES (?)`,
        ["Counter 2"]
      );
      await runQuery(
        `INSERT INTO counters (counter_number) VALUES (?)`,
        ["Counter 3"]
      );

      // Link services to counters
      // Counter 1: Shipping, Money Deposit
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [1, 1] // Counter 1 -> Shipping
      );
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [1, 3] // Counter 1 -> Money Deposit
      );

      // Counter 2: Account Management, Bill Payment
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [2, 2] // Counter 2 -> Account Management
      );
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [2, 4] // Counter 2 -> Bill Payment
      );

      // Counter 3: All services
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [3, 1] // Counter 3 -> Shipping
      );
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [3, 2] // Counter 3 -> Account Management
      );
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [3, 3] // Counter 3 -> Money Deposit
      );
      await runQuery(
        `INSERT INTO counter_services (counter_id, service_id) VALUES (?, ?)`,
        [3, 4] // Counter 3 -> Bill Payment
      );

      logger.info("Default data seeded successfully");
    } else {
      logger.info("Database already contains data, skipping seed");
    }
  } catch (error) {
    logger.error({ error }, "Failed to seed default data");
    // Don't throw error, as seeding is optional
  }
};

export default initializeDatabase;
