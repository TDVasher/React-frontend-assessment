# API Documentation

This document provides detailed information about the backend API endpoints.

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2024-01-25T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

### Get All Records
**GET** `/api/records`

Retrieve all clinical records with optional filtering, pagination, search, and sorting.

**Query Parameters:**
- `status` (optional) - Filter by status (e.g., `Active`, `Discharged`, `Pending`, `Cancelled`)
- `department` (optional) - Filter by department name
- `search` (optional) - Search in patient name, patient ID, or diagnosis
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of records per page (default: 10)
- `sortBy` (optional) - Field to sort by (default: `id`)
- `sortOrder` (optional) - Sort order: `asc` or `desc` (default: `asc`)

**Examples:**
```
GET /api/records
GET /api/records?status=Active
GET /api/records?department=Cardiology&status=Active
GET /api/records?search=John
GET /api/records?page=1&limit=5
GET /api/records?sortBy=admissionDate&sortOrder=desc
GET /api/records?status=Active&page=1&limit=10&sortBy=patientName&sortOrder=asc
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": "P001",
      "patientName": "John Doe",
      "dateOfBirth": "1980-05-15",
      "diagnosis": "Hypertension",
      "admissionDate": "2024-01-15",
      "dischargeDate": "2024-01-20",
      "status": "Discharged",
      "department": "Cardiology",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "status": null,
    "department": null,
    "search": null
  }
}
```

**Status Codes:**
- `200` - Success

---

### Get Records Statistics
**GET** `/api/records/stats`

Get statistics about clinical records.

**Response:**
```json
{
  "total": 6,
  "byStatus": {
    "active": 3,
    "discharged": 3,
    "pending": 0,
    "cancelled": 0
  },
  "byDepartment": {
    "Cardiology": 2,
    "Pulmonology": 2,
    "General Surgery": 1,
    "Endocrinology": 1
  }
}
```

**Status Codes:**
- `200` - Success

---

### Get Single Record
**GET** `/api/records/:id`

Retrieve a specific clinical record by ID.

**Parameters:**
- `id` (path parameter) - The record ID

**Response:**
```json
{
  "id": 1,
  "patientId": "P001",
  "patientName": "John Doe",
  "dateOfBirth": "1980-05-15",
  "diagnosis": "Hypertension",
  "admissionDate": "2024-01-15",
  "dischargeDate": "2024-01-20",
  "status": "Discharged",
  "department": "Cardiology",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid record ID format
- `404` - Record not found

---

### Create Record
**POST** `/api/records`

Create a new clinical record.

**Request Body:**
```json
{
  "patientId": "P004",
  "patientName": "Alice Brown",
  "dateOfBirth": "1985-03-20",
  "diagnosis": "Diabetes",
  "admissionDate": "2024-01-25",
  "dischargeDate": null,
  "status": "Active",
  "department": "Endocrinology"
}
```

**Required Fields:**
- `patientId` (string, format: P###, e.g., "P001")
- `patientName` (string, minimum 2 characters)
- `dateOfBirth` (string, format: YYYY-MM-DD, must be in the past)
- `diagnosis` (string, minimum 2 characters)
- `admissionDate` (string, format: YYYY-MM-DD)
- `status` (string, one of: "Active", "Discharged", "Pending", "Cancelled")
- `department` (string)

**Optional Fields:**
- `dischargeDate` (string, format: YYYY-MM-DD, or null, must be after admission date)

**Response:**
```json
{
  "id": 4,
  "patientId": "P004",
  "patientName": "Alice Brown",
  "dateOfBirth": "1985-03-20",
  "diagnosis": "Diabetes",
  "admissionDate": "2024-01-25",
  "dischargeDate": null,
  "status": "Active",
  "department": "Endocrinology",
  "createdAt": "2024-01-25T10:00:00Z",
  "updatedAt": "2024-01-25T10:00:00Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Bad request (missing or invalid fields, validation errors)
- `409` - Conflict (patient ID already exists)

**Error Response Examples:**

Missing fields (400):
```json
{
  "error": "Missing required fields",
  "missing": ["patientId", "status"],
  "required": ["patientId", "patientName", "dateOfBirth", "diagnosis", "admissionDate", "status", "department"]
}
```

Duplicate patient ID (409):
```json
{
  "error": "Patient ID already exists",
  "existingRecordId": 1
}
```

Invalid date format (400):
```json
{
  "error": "Invalid dateOfBirth format. Use YYYY-MM-DD"
}
```

Invalid status (400):
```json
{
  "error": "Invalid status. Must be one of: Active, Discharged, Pending, Cancelled"
}
```

---

### Update Record
**PUT** `/api/records/:id`

Update an existing clinical record.

**Parameters:**
- `id` (path parameter) - The record ID

**Request Body:**
```json
{
  "status": "Discharged",
  "dischargeDate": "2024-01-25"
}
```

All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "id": 1,
  "patientId": "P001",
  "patientName": "John Doe",
  "dateOfBirth": "1980-05-15",
  "diagnosis": "Hypertension",
  "admissionDate": "2024-01-15",
  "dischargeDate": "2024-01-25",
  "status": "Discharged",
  "department": "Cardiology"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (invalid date format, validation errors)
- `404` - Record not found
- `409` - Conflict (patient ID already exists if updating patientId)

---

### Delete Record
**DELETE** `/api/records/:id`

Delete a clinical record.

**Parameters:**
- `id` (path parameter) - The record ID

**Response:**
No content (204 status code)

**Status Codes:**
- `204` - Successfully deleted
- `400` - Invalid record ID format
- `404` - Record not found

---

### Get Departments
**GET** `/api/departments`

Get a list of all unique departments (sorted alphabetically).

**Response:**
```json
[
  "Cardiology",
  "Endocrinology",
  "General Surgery",
  "Pulmonology"
]
```

**Status Codes:**
- `200` - Success

---

### Get Valid Statuses
**GET** `/api/statuses`

Get a list of all valid status values.

**Response:**
```json
[
  "Active",
  "Discharged",
  "Pending",
  "Cancelled"
]
```

**Status Codes:**
- `200` - Success

---

## Data Model

### Clinical Record
```typescript
{
  id: number;                    // Auto-generated unique identifier
  patientId: string;             // Patient identifier (format: P###, e.g., "P001")
  patientName: string;           // Full name of the patient (min 2 characters)
  dateOfBirth: string;           // Date in YYYY-MM-DD format (must be in past)
  diagnosis: string;             // Medical diagnosis (min 2 characters)
  admissionDate: string;         // Date in YYYY-MM-DD format
  dischargeDate: string | null; // Date in YYYY-MM-DD format or null (must be >= admissionDate)
  status: string;               // One of: "Active", "Discharged", "Pending", "Cancelled"
  department: string;           // Department name
  createdAt: string;            // ISO 8601 timestamp (auto-generated)
  updatedAt: string;            // ISO 8601 timestamp (auto-updated)
}
```

## Notes

- **Date Format**: All dates must be in `YYYY-MM-DD` format
- **Network Delays**: The API includes simulated network delays (150-300ms) to test loading states
- **Data Persistence**: Data is stored in-memory and will reset when the server restarts
- **Status Values**: Valid statuses are: "Active", "Discharged", "Pending", "Cancelled"
- **Patient ID Format**: Must start with "P" followed by numbers (e.g., "P001", "P123")
- **Validation**: 
  - Date of birth must be in the past
  - Discharge date must be after or equal to admission date
  - Patient ID must be unique
  - Patient name and diagnosis must be at least 2 characters
- **Error Responses**: All error responses include an `error` field with a descriptive message
- **Request Logging**: All requests are logged to the console with timestamp, method, path, query, and body

