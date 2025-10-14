import fs from "fs";
import path from "path";

const envPath = path.resolve(".env");
const testEnvPath = path.resolve(".env.tests");
const backupPath = path.resolve(".env.backup");

export function setupTestEnv() {
  // Backup original .env
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, backupPath);
    console.log("[setup] Original .env backed up");
  }

  // Overwrite .env with .env.tests
  fs.copyFileSync(testEnvPath, envPath);
  console.log("[setup] .env overwritten with .env.tests");
}

export function teardownTestEnv() {
  // Restore original .env from backup
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, envPath);
    fs.unlinkSync(backupPath);
    console.log("[teardown] .env restored and backup deleted");
  }
}
