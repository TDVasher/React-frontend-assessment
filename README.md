# Q-Centrix Frontend Developer Assessment

Welcome to the Q-Centrix Frontend Developer Assessment! This repository contains a backend API and a minimal frontend setup. Your task is to build a complete frontend application that interacts with the provided backend.

## ⚠️ Important Notice

**Please do not use AI tools (such as ChatGPT, GitHub Copilot, or similar AI assistants) to complete this assessment.** This assessment is designed to evaluate your personal coding skills, problem-solving abilities, and understanding of React and frontend development. Using AI tools defeats the purpose of the assessment and may result in disqualification.

## Overview

You'll be building a **Clinical Records Management** application with 2 core features:
1. **Display records** with search and filter functionality
2. **Create new records** through a form

The backend API is already implemented and ready to use. Your task is to create a React frontend that integrates with the provided backend API.

**Estimated Time: 3-4 hours**

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone this repository** (or download the assessment files)

2. **Start the Backend Server:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend will run on `http://localhost:3001`

3. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## Assessment Task

### Your Mission

Build a simple frontend application for viewing and creating clinical records. The backend API is fully functional and ready to use. You need to create a React application with **2 core features** that can be completed in **3-4 hours**.

### Task 1: Display Clinical Records with Search/Filter (Required)

**What to build:**
- A page that displays all clinical records in a table or card layout
- A search box that allows searching by patient name, patient ID, or diagnosis
- Filter options to filter by status (Active/Discharged) and/or department

**What to display for each record:**
- Patient ID (e.g., "P001")
- Patient Name
- Date of Birth (formatted nicely)
- Diagnosis
- Admission Date (formatted)
- Discharge Date (show "N/A" if not available)
- Status (with visual distinction - badge/color)
- Department

**Technical requirements:**
- Fetch data from `GET /api/records` endpoint
- Use query parameters for search and filtering: `?search=John&status=Active&department=Cardiology`
- Show loading state while fetching data
- Display error message if API call fails
- Handle empty state (no records found)
- Make it responsive (works on mobile and desktop)

**API Example:**
```javascript
// Get all records
fetch('http://localhost:3001/api/records')

// Search and filter
fetch('http://localhost:3001/api/records?search=John&status=Active')
```

### Task 2: Create New Record Form (Required)

**What to build:**
- A form to create new clinical records
- Form can be a modal, separate page, or inline - your choice

**Form fields (all required except discharge date):**
- Patient ID (text input, format: P###)
- Patient Name (text input)
- Date of Birth (date input)
- Diagnosis (text input)
- Admission Date (date input)
- Discharge Date (date input, optional)
- Status (dropdown: Active, Discharged, Pending, Cancelled)
- Department (text input)

**Validation requirements:**
- Validate all required fields are filled
- Show error messages for invalid inputs
- Handle API validation errors (e.g., duplicate patient ID, invalid dates)
- Show success message after successful creation
- Refresh the records list after creation

**User experience:**
- Show loading state when submitting
- Display success/error messages
- Clear form after successful submission
- Disable submit button during submission

**API Example:**
```javascript
POST http://localhost:3001/api/records
Content-Type: application/json

{
  "patientId": "P007",
  "patientName": "Alice Johnson",
  "dateOfBirth": "1990-05-15",
  "diagnosis": "Fever",
  "admissionDate": "2024-01-25",
  "dischargeDate": null,
  "status": "Active",
  "department": "General Medicine"
}
```

### Task 3: Responsive Design & Error Handling (Required)

**Responsive Design:**
- Use Tailwind CSS (already configured)
- Ensure the app works well on desktop, tablet, and mobile
- Make forms usable on mobile devices
- Create a clean, professional UI

**Error Handling:**
- Handle API errors (400, 404, 409, 500)
- Show user-friendly error messages
- Handle network failures gracefully

### Bonus Features (Optional - if time permits)

If you finish the core tasks early, you can add:
- Edit/Update existing records
- Delete records with confirmation
- Sort records by different fields
- Pagination for records list
- Statistics dashboard

**Note:** Focus on completing Tasks 1 and 2 well rather than rushing through all features.

## API Endpoints

You'll need these endpoints for the assessment. See `API_DOCUMENTATION.md` for detailed documentation.

**Required Endpoints:**
- `GET /api/records` - Get all clinical records (supports query parameters for search and filter)
- `POST /api/records` - Create a new record

**Optional Endpoints (for bonus features):**
- `GET /api/records/:id` - Get a specific record by ID
- `PUT /api/records/:id` - Update an existing record
- `DELETE /api/records/:id` - Delete a record
- `GET /api/departments` - Get list of all departments
- `GET /api/statuses` - Get list of valid status values

**Query Parameters for GET /api/records:**
- `status` - Filter by status (e.g., `?status=Active`)
- `department` - Filter by department (e.g., `?department=Cardiology`)
- `search` - Search in patient name, patient ID, or diagnosis (e.g., `?search=John`)

You can combine multiple parameters: `?search=John&status=Active&department=Cardiology`

**Example API Calls:**
```javascript
// Get all records
fetch('http://localhost:3001/api/records')

// Search for records
fetch('http://localhost:3001/api/records?search=John')

// Filter by status and department
fetch('http://localhost:3001/api/records?status=Active&department=Cardiology')

// Create a new record
fetch('http://localhost:3001/api/records', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: 'P007',
    patientName: 'Alice Johnson',
    dateOfBirth: '1990-05-15',
    diagnosis: 'Fever',
    admissionDate: '2024-01-25',
    dischargeDate: null,
    status: 'Active',
    department: 'General Medicine'
  })
})
```

### API Request/Response Examples

**Get all records:**
```bash
GET http://localhost:3001/api/records
```

**Create a record:**
```bash
POST http://localhost:3001/api/records
Content-Type: application/json

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

**Update a record:**
```bash
PUT http://localhost:3001/api/records/1
Content-Type: application/json

{
  "status": "Discharged",
  "dischargeDate": "2024-01-25"
}
```

## Technical Requirements

**Framework & Libraries:**
- Use **React** for the frontend (already set up with Create React App)
- Use **Tailwind CSS** for styling (already configured)
- You can use `fetch` API or `axios` for HTTP requests (your choice)
- Do NOT use UI component libraries (like Material-UI, Ant Design) - build your own components

**API Integration:**
- Make API calls to `http://localhost:3001/api`
- Handle GET and POST requests
- Properly handle request/response data (JSON)
- Include proper error handling

**Code Standards:**
- Follow React best practices (functional components, hooks)
- Write clean, readable code
- Use meaningful variable and function names
- Organize components logically

## What We're Evaluating

1. **Functionality**: 
   - Core features (display records, create records) work correctly
   - Proper integration with the backend API
   - Search and filter functionality works
   - Form validation and error handling

2. **Code Quality**:
   - Clean, readable, and well-organized code
   - Proper use of React hooks and components
   - Good component structure

3. **User Experience**:
   - Intuitive interface
   - Clear feedback (loading states, success/error messages)
   - Responsive design
   - Professional appearance

4. **Error Handling**:
   - Proper handling of API errors
   - User-friendly error messages
   - Graceful handling of edge cases

## Submission Guidelines

1. Complete the assessment in the provided time frame
2. Ensure both backend and frontend run without errors
3. Document any additional features or improvements you've made
4. If you encounter any issues with the backend, note them in your submission

## Important Notes

- **Time Limit**: This assessment is designed to be completed in **3-4 hours**. Focus on completing the 2 core tasks well.
- **Data Persistence**: The backend uses an in-memory data store, so data will reset when the server restarts. This is expected.
- **Date Format**: All dates should be in `YYYY-MM-DD` format when sending to the API. You can format them nicely for display.
- **Network Delays**: The backend includes simulated network delays (200-300ms) to test loading states.
- **Priority**: Complete Tasks 1 and 2 well rather than rushing through all features. Quality over quantity.
- **Browser Support**: Ensure your application works in modern browsers (Chrome, Firefox, Safari, Edge).


