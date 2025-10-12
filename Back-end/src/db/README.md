# Database Documentation

## Overview

This directory contains the SQLite database schema and initialization scripts for the 
Office Queue Management System.

- `schema.sql` - Complete database schema with all tables, indexes, and triggers
- `init.ts` - Database initialization script that creates tables and seeds default 
data
## Database Schema

### Tables

#### services
Service types offered by the office.
- `id` - Primary key
- `tag_name` - Unique service identifier (e.g., "Shipping", "Money Deposit")
- `service_time` - Average service time in minutes
- `created_at` - Timestamp

#### counters
Service counters in the office.
- `id` - Primary key
- `counter_number` - Counter identifier (e.g., "Counter 1", "Counter 2")
- `created_at` - Timestamp

#### counter_services
Many-to-many relationship linking counters to services they can handle.
- `id` - Primary key
- `counter_id` - Foreign key to counters
- `service_id` - Foreign key to services
- Unique constraint on (counter_id, service_id)

#### tickets
Tickets issued to customers.
- `id` - Primary key
- `ticket_code` - Unique ticket code shown to customer
- `service_id` - Foreign key to services
- `status` - Ticket status: 'waiting', 'called', 'served'
- `counter_id` - Counter serving this ticket (nullable)
- `created_at` - When ticket was issued
- `called_at` - When ticket was called
- `served_at` - When ticket was served

## Default Data

The system seeds the following test data:

**Services:**
- Shipping (10 min)
- Account Management (15 min)
- Money Deposit (5 min)
- Bill Payment (8 min)

**Counters:**
- Counter 1: Shipping, Money Deposit
- Counter 2: Account Management, Bill Payment
- Counter 3: All services
