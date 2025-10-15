# OfficeQueueManagement Back-end

## This is the README for the Back-end of the Office Queue Management

please check config/database.ts for pre-defined database promises

please read readme file at ./db/README.md for better understanding of db initalization

--------------------------------------------------------------------

Important notes!

- test script to be changed to our testing tool later!!

- .env file MUST be created an example:

- NODE_ENV=development

- PORT=3000

- CORS_ORIGIN=*

- DB_PATH= //optional it has deafult value

- During testing, the default .env file is replaced by .env.tests. If tests require different environment variables (e.g., different database path), define them in the .env.tests file instead of .env.

--------------------------------------------------------------------


## API Endpoints

### Health Check

**GET `/health`**

- **Request Parameters:** None

- **Success Response (200 OK):**
```json
{
  "ok": true,
  "uptime": 123.45,
  "timestamp": "2025-10-12T12:34:56.789Z"
}
```

### services

**GET `/services`**

- **Request Parameters:** None

- **Success Response (200 OK):**
```json
[
  "service1",
  "service2",
  "service3",
]
```

- **Error Response (500 Internal Server Error):**
```json
{
  "error": "Database connection failed"
}
```

### Tickets

**POST `/tickets/new`**

- **Request Parameters:** None

- **Request Body content:**
```json
{
    "serviceTag": "service1"
}
```

- **Success Response (201 OK):**
```json
{
    "id": 27,
    "ticket_code": "TKT-A26",
    "service_id": 1,
    "status": "waiting"
}
```

- **Error Response (500 Internal Server Error):**
```json
{
  "error": "Database connection failed"
}
```
```json
{
  "error": "Failed to retrieve the new ticket after insertion"
}
```
```json
{
  "error": "Failed to count tickets"
}
```
- **Error Response (400 Bad Request):**
```json
{
  "error": "Missing serviceTag in request body"
}
```
```json
{
  "error": "Service with tag 'service1' not found"
}
```
**POST `/tickets/next`**

- **Request Parameters:** None

- **Request Body content:**
```json
{
    "counterNumber": "Counter 1"
}
```

- **Success Response (201 OK):**
```json
{
    "id": 27,
    "ticket_code": "TKT-A26",
    "service_id": 1,
    "status": "called",
    "called_at": "2025-10-15 13:44:33"
}
```

- **Error Response (500 Internal Server Error):**
```json
{
  "error": "Database connection failed"
}
```
```json
{
  "error": "Error finalizing called ticket for counter Counter 1: {error_message}"
}
```
- **Error Response (400 Bad Request):**
```json
{
  "error": "Missing counterNumber in request body"
}
```
```json
{
  "error": "Counter with number 'Counter 1' not found"
}
```