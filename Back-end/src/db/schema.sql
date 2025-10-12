-- Office Queue Management System Database Schema
-- Minimal schema for User Stories: Get Ticket & Next Customer

-- ============================================
-- Services Table
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY,
  tag_name TEXT NOT NULL UNIQUE,
  service_time INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_tag_name ON services(tag_name);

-- ============================================
-- Counters Table
-- ============================================
CREATE TABLE IF NOT EXISTS counters (
  id INTEGER PRIMARY KEY,
  counter_number TEXT NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_counters_number ON counters(counter_number);

-- ============================================
-- Counter Services (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS counter_services (
  id INTEGER PRIMARY KEY,
  counter_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE(counter_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_counter_services_counter ON counter_services(counter_id);
CREATE INDEX IF NOT EXISTS idx_counter_services_service ON counter_services(service_id);

-- ============================================
-- Tickets Table
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY,
  ticket_code TEXT NOT NULL UNIQUE,
  service_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('waiting', 'called', 'served')) DEFAULT 'waiting',
  counter_id INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  called_at DATETIME,
  served_at DATETIME,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_service ON tickets(service_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_counter ON tickets(counter_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
