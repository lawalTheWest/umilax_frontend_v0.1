## Complaints

### POST /complaints/  ✅ Created
- Log a new complaint (Employee, Secretary)
- Auth: JWT (Employee, Secretary)
- Request:
  - Body: `{ "message": string }`
- Response:
  - 201 Created: `{ "id": int, "message": string, "role": string, "created_at": string, ... }`
  - 400 Bad Request: `{ "error": "..." }`

### GET /complaints/  ✅ Created
- List complaints (CEO sees all, Employee/Secretary sees own)
- Auth: JWT
- Response:
  - 200 OK: `[ { ... } ]`

### POST /complaints/{id}/respond  ✅ Created
- CEO responds to a complaint
- Auth: JWT (CEO)
- Request:
  - Body: `{ "response": string }`
- Response:
  - 200 OK: `{ ... }`
  - 403 Forbidden: `{ "error": "Only CEO can respond" }`
  - 404 Not Found: `{ "error": "Complaint not found" }`

### PATCH /complaints/{id}  ✅ Created
- Edit complaint (only by complainant, before response)
- Auth: JWT (Employee, Secretary)
- Request:
  - Body: `{ "message": string }`
- Response:
  - 200 OK: `{ ... }`
  - 403 Forbidden: `{ "error": "You can only edit your own complaint before it is responded to." }`
  - 404 Not Found: `{ "error": "Complaint not found" }`

### DELETE /complaints/{id}  ❌ Not allowed
- Not allowed (deleting complaints is forbidden)

---
# UMILAX Salon Management System – API Specification

---

## Authentication

### POST /auth/register
- Registers a new user (CEO, Secretary, Employee)
- Request:
  - Body: `{ "name": string, "email": string, "password": string, "role": string }`
- Response:
  - 201 Created: `{ "id": int, "name": string, "email": string, "role": string }`
  - 400 Bad Request: `{ "error": "Email already exists" }`

### POST /auth/login
- Authenticates a user
- Request:
  - Body: `{ "email": string, "password": string }`
- Response:
  - 200 OK: `{ "access": string, "refresh": string, "user": { ... } }`
  - 401 Unauthorized: `{ "error": "Invalid credentials" }`

### POST /auth/refresh
- Refreshes JWT token
- Request:
  - Body: `{ "refresh": string }`
- Response:
  - 200 OK: `{ "access": string }`
  - 401 Unauthorized: `{ "error": "Invalid refresh token" }`

### POST /auth/google
- Google SSO login
- Request:
  - Body: `{ "token": string }`
- Response:
  - 200 OK: `{ "access": string, "refresh": string, "user": { ... } }`
  - 401 Unauthorized: `{ "error": "Invalid Google token" }`

---

## Users & Roles

### GET /users/
- List all users (CEO only)
- Auth: JWT (CEO)
- Response:
  - 200 OK: `[ { "id": int, "name": string, "email": string, "role": string, ... } ]`

### POST /users/
- Create a new user (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "name": string, "email": string, "role": string, ... }`
- Response:
  - 201 Created: `{ "id": int, ... }`
  - 400 Bad Request: `{ "error": "..." }`

### GET /users/{id}
- Get user details
- Auth: JWT
- Response:
  - 200 OK: `{ "id": int, "name": string, ... }`
  - 404 Not Found: `{ "error": "User not found" }`

### PATCH /users/{id}
- Update user details (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "name"?: string, "role"?: string, ... }`
- Response:
  - 200 OK: `{ ... }`
  - 404 Not Found: `{ "error": "User not found" }`

### DELETE /users/{id}
- Delete user (CEO only)
- Auth: JWT (CEO)
- Response:
  - 204 No Content
  - 404 Not Found: `{ "error": "User not found" }`

### GET /roles/
- List all roles
- Auth: JWT
- Response:
  - 200 OK: `[ "CEO", "Secretary", "Employee" ]`

---

## Services

### GET /services/
- List all services
- Auth: JWT
- Response:
  - 200 OK: `[ { "id": int, "name": string, "base_price": number, ... } ]`

### POST /services/
- Create a new service (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "name": string, "base_price": number, "priority_level": int }`
- Response:
  - 201 Created: `{ ... }`
  - 400 Bad Request: `{ "error": "..." }`

### PATCH /services/{id}
- Update service (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "name"?: string, "base_price"?: number, ... }`
- Response:
  - 200 OK: `{ ... }`
  - 404 Not Found: `{ "error": "Service not found" }`

### DELETE /services/{id}
- Delete service (CEO only)
- Auth: JWT (CEO)
- Response:
  - 204 No Content
  - 404 Not Found: `{ "error": "Service not found" }`

---

## Transactions

### POST /transactions/record
- Record a new transaction (Secretary only)
- Auth: JWT (Secretary)
- Request:
  - Body: `{ "employee_id": int, "service_ids": [int], "amount_paid": number, "timestamp": string }`
- Response:
  - 201 Created: `{ ... }`
  - 400 Bad Request: `{ "error": "..." }`

### GET /transactions/
- List transactions (CEO, Secretary, Employee)
- Auth: JWT
- Query params: `?shop_id=...&employee_id=...&date_from=...&date_to=...`
- Response:
  - 200 OK: `[ { ... } ]`

---

## Expenses

### POST /expenses/
- Record a new expense (Secretary only)
- Auth: JWT (Secretary)
- Request:
  - Body: `{ "description": string, "amount": number, "deduct_before_division"?: boolean, "service_type"?: string }`
- Response:
  - 201 Created: `{ ... }`
  - 400 Bad Request: `{ "error": "..." }`

### GET /expenses/
- List expenses (CEO, Secretary)
- Auth: JWT
- Query params: `?shop_id=...&status=...`
- Response:
  - 200 OK: `[ { ... } ]`

### PATCH /expenses/{id}/approve
- Approve/reject expense and set deduction timing (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "approved": boolean, "deduct_before_division"?: boolean }`
- Response:
  - 200 OK: `{ ... }`
  - 404 Not Found: `{ "error": "Expense not found" }`

---

## Revenue Division Logic (Updated)

- CEO can mark any expense as "deduct before division" or "after division".
- During revenue calculation:
  - All expenses with `deduct_before_division=true` are subtracted from total revenue before division.
  - All other approved expenses are subtracted from the shop's share after division (can go negative).
- Dye cost is now just a special case of this logic.

## Division Settings

### GET /division-settings/
- Get division base per shop (CEO only)
- Auth: JWT (CEO)
- Query params: `?shop_id=...`
- Response:
  - 200 OK: `{ "shop_id": int, "division_base": int }`

### PATCH /division-settings/
- Update division base per shop (CEO only)
- Auth: JWT (CEO)
- Request:
  - Body: `{ "shop_id": int, "division_base": int }`
- Response:
  - 200 OK: `{ ... }`
  - 400 Bad Request: `{ "error": "..." }`

---

## Earnings

### GET /earnings/{employee_id}
- Get earnings breakdown for employee (Employee, CEO)
- Auth: JWT
- Query params: `?date_from=...&date_to=...&shop_id=...`
- Response:
  - 200 OK: `{ "total": number, "breakdown": [ ... ] }`
  - 404 Not Found: `{ "error": "Employee not found" }`

---

## Reports

### GET /reports/  ✅ Created
- Get reports (CEO, Employee)
- Auth: JWT
- Query params: `?shop_id=...&date_from=...&date_to=...&type=daily|weekly|monthly|yearly`
- Response:
  - 200 OK: `{ "summary": { ... }, "details": [ ... ] }`

### GET /reports/export  ✅ Created
- Export reports in PDF or CSV format (CEO only)
- Auth: JWT (CEO)
- Query params: `?shop_id=...&date_from=...&date_to=...&type=daily|weekly|monthly|yearly&format=pdf|csv`
- Response:
  - 200 OK: PDF or CSV file download
  - 400 Bad Request: `{ "error": "Invalid format or parameters" }`

---
# All endpoints above are now implemented and active in the backend.

## Error Codes
- 400 Bad Request: Invalid input or missing fields
- 401 Unauthorized: Invalid or missing authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource does not exist
- 409 Conflict: Duplicate or conflicting data
- 500 Internal Server Error: Unexpected server error

---

## Notes
- All endpoints require JWT authentication unless otherwise specified.
- CEO-only endpoints are restricted by role.
- All date/time fields are ISO 8601 strings (UTC).
- Pagination, filtering, and sorting are supported on list endpoints via query params.

---

## Additional endpoints discovered in backend code

The backend registers several router-mounted resources under their app prefixes. Below are additional endpoints (and sub-resources) that were found in the backend `urls.py` files. All require JWT auth unless otherwise noted.

### Users (mounted at `/users/`)
- POST `/users/login/` — Session login (custom session login endpoint). Accepts username/password; returns session info and includes `role` in the response.
- POST `/users/google/` — Social login endpoint for Google SSO (POST id_token or access_token to backend; backend verifies and returns JWT access/refresh + user info).
- Standard user CRUD via `/users/` and `/users/{id}/` (list, create, retrieve, update, delete).

### Services (mounted at `/services/`)
- `/services/services/` — Service CRUD (list, create, update, delete).
- `/services/combos/` — Combo services CRUD (CEO can create combos that package multiple services).

### Shops app router (mounted at `/shops/`)
- `/shops/shops/` — Shop CRUD (create/list/retrieve/update/delete shops).
- `/shops/division-settings/` — Division settings per shop (get & patch).
- `/shops/earnings/` — Employee earnings endpoints and breakdowns per shop.
- `/shops/complaints/` — Shop-scoped complaints (complaints may also appear under the `reports` router).
- `/shops/reports/` — Shop-scoped reports.
- `/shops/ceo-dashboard/` — CEO dashboard metrics for shops and aggregated data.

### Transactions (mounted at `/transactions/`)
- `/transactions/record/` — Transaction ViewSet (create/list/retrieve). This is the endpoint to record services and transactions.

### Expenses (mounted at `/expenses/`)
- `/expenses/expenses/` — Expense ViewSet mounted by router (record, list, approve endpoints are available under this router).

### Reports (mounted at `/reports/`)
- `/reports/reports/` — Report ViewSet (list, export endpoints).
- `/reports/complaints/` — Complaint endpoints registered under the reports router.

### Roles (mounted at `/roles/`)
- `/roles/` — Role CRUD endpoints (list/create/update/delete).

Notes:
- Router-mounted prefixes can produce paths that combine the include prefix and the router prefix (e.g., `/shops/shops/` if the `shops` app registers `shops` on its router then is included at `/shops/`). In this spec I used the full logical paths discovered in code; adjust as necessary for human-facing documentation.
