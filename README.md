# Employee Management (AngularJS + Express + SQL Server)

Fullstack CRUD web app for managing employee data (technical test submission).

## Features
- Employee CRUD (Create, Read, Update, Delete)
- Server-side validation:
  - `Name` is required
  - `Salary` must be a number > 0
- List endpoint supports **pagination** and **search**
- Consistent API error format:
  - `400 VALIDATION_ERROR` with field-level `details`
  - `404 NOT_FOUND`

## Tech Stack
- **Database**: Microsoft SQL Server (Docker)
- **Backend**: Node.js + Express + `mssql`
- **Frontend**: AngularJS 1.x + Bootstrap (CDN)

## Prerequisites
- Docker Desktop
- Node.js **>= 24 < 25** (recommended via nvm on Windows)
- A SQL tool (Azure Data Studio / SSMS) to execute the SQL script

## Project Structure
```
.
├─ docker-compose.yml
├─ .env.example                 # compose env template (DO NOT commit .env)
├─ sql/
│  └─ 001_create_tables.sql
├─ backend/
│  ├─ .env.example              # backend env template (DO NOT commit .env)
│  ├─ package.json
│  └─ src/
│     ├─ app.js
│     ├─ server.js
│     ├─ db/pool.js
│     ├─ routes/employees.routes.js
│     ├─ controllers/employees.controller.js
│     ├─ services/employees.service.js
│     ├─ repositories/employees.repo.js
│     ├─ middlewares/
│     │  ├─ validateEmployee.js
│     │  └─ errorHandler.js
│     └─ utils/httpError.js
└─ frontend/
   ├─ index.html
   └─ app/
      ├─ app.module.js
      ├─ app.routes.js
      ├─ services/employee.services.js
      ├─ controllers/
      │  ├─ employeeList.controller.js
      │  └─ employeeForm.controller.js
      └─ views/
         ├─ employees.html
         └─ employee-form.html
```

## Environment Variables

This project uses **two** environment files:

### 1) Root `.env` (for Docker Compose / SQL Server)
- File: `./.env`
- Used by `docker compose` to set the SQL Server SA password.
- **Do not commit this file**.

Create it from the template:
- Copy `./.env.example` → `./.env`
- Set a strong password:

```env
MSSQL_SA_PASSWORD=MyStrong(!)Password123
```

### 2) Backend `.env` (for Express API)
- File: `./backend/.env`
- Used by Node.js (`dotenv`) for DB connection settings.
- **Do not commit this file**.

Create it from the template:
- Copy `./backend/.env.example` → `./backend/.env`
- Ensure `DB_PASSWORD` matches the same password you set in root `.env`.

## Getting Started (Local)

### 1) Start SQL Server (Docker)
From the project root:

```bash
docker compose up -d
```

SQL Server will be available at:
- Host: `localhost`
- Port: `1433`

### 2) Create DB + Table
Run the SQL script:
- File: `sql/001_create_tables.sql`

This script creates:
- Database: `EmployeeDB`
- Table: `dbo.Employees`

Recommended tools:
- Azure Data Studio / SSMS
- Connect using SQL Login:
  - User: `sa`
  - Password: value from `MSSQL_SA_PASSWORD` in root `.env`

> If you recreate the Docker volume (`docker compose down -v`), the database will be empty again and you must re-run this script.

### 3) Run Backend API
```bash
cd backend
npm install
npm run dev
```

Backend runs on:
- `http://localhost:3001`

Endpoints:
- Health: `GET /api/health`
- DB check: `GET /api/db-check`
- Employees: `/api/employees`

### 4) Run Frontend
Serve the `frontend` folder with any static server.

Example:
```bash
cd frontend
npx http-server -p 5173
```

Open:
- `http://localhost:5173/#!/employees`

> Frontend calls API at `http://localhost:3001/api` (see `frontend/app/services/employee.services.js`).

## API Reference

Base URL:
- `http://localhost:3001/api`

### List employees
`GET /employees?page=1&limit=10&search=andi`

Response:
```json
{
  "data": [
    {
      "EmployeeID": 1,
      "Name": "Andi",
      "Position": "Developer",
      "Salary": 7500000,
      "CreatedAt": "2026-01-01T02:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1, "search": "andi" }
}
```

### Get employee by id
`GET /employees/:id`

Response:
```json
{
  "data": {
    "EmployeeID": 1,
    "Name": "Andi",
    "Position": "Developer",
    "Salary": 7500000,
    "CreatedAt": "2026-01-01T02:00:00.000Z"
  }
}
```

### Create employee
`POST /employees`

Body:
```json
{ "Name": "Andi", "Position": "Developer", "Salary": 7500000 }
```

Response (`201 Created`):
```json
{
  "data": {
    "EmployeeID": 1,
    "Name": "Andi",
    "Position": "Developer",
    "Salary": 7500000,
    "CreatedAt": "2026-01-01T02:00:00.000Z"
  }
}
```

### Update employee
`PUT /employees/:id`

Body:
```json
{ "Name": "Andi Updated", "Position": "Senior Developer", "Salary": 9000000 }
```

Response:
```json
{
  "data": {
    "EmployeeID": 1,
    "Name": "Andi Updated",
    "Position": "Senior Developer",
    "Salary": 9000000,
    "CreatedAt": "2026-01-01T02:00:00.000Z"
  }
}
```

### Delete employee
`DELETE /employees/:id`

Response:
- `204 No Content`

## Error Format

### 400 Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid employee payload",
    "details": [
      { "field": "Name", "message": "Name is required." },
      { "field": "Salary", "message": "Salary must be a number greater than 0." }
    ]
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Employee not found"
  }
}
```
## Troubleshooting

### `Login failed for user 'sa'` (Error 18456 State 8)
- Password mismatch between:
  - root `./.env` (`MSSQL_SA_PASSWORD`)
  - backend `./backend/.env` (`DB_PASSWORD`)
- If you changed the SA password after the container was initialized, reset the volume:
  ```bash
  docker compose down -v
  docker compose up -d
  ```
  Then re-run `sql/001_create_tables.sql`.

### `Failed to open the explicitly specified database 'EmployeeDB'` (Error 18456 State 38)
- The database `EmployeeDB` does not exist (often after volume reset).
- Re-run `sql/001_create_tables.sql`.
