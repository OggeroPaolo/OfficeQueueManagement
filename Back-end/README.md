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