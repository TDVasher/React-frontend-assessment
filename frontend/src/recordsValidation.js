export function isValidPatientId(value) {
  return /^P\d{3}$/.test((value || "").trim());
}

export function isValidISODate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

export function compareISODate(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function normalizeRecordPayload(form) {
  return {
    patientId: form.patientId.trim(),
    patientName: form.patientName.trim(),
    dateOfBirth: form.dateOfBirth,
    diagnosis: form.diagnosis.trim(),
    admissionDate: form.admissionDate,
    dischargeDate: form.dischargeDate ? form.dischargeDate : null,
    status: form.status,
    department: form.department.trim(),
  };
}

export function validateRecordForm(form) {
  const e = {};

  if (!form.patientId.trim()) e.patientId = "Patient ID is required.";
  else if (!isValidPatientId(form.patientId)) e.patientId = "Format must be P### (example: P007).";

  if (!form.patientName.trim()) e.patientName = "Patient name is required.";

  if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
  else if (!isValidISODate(form.dateOfBirth)) e.dateOfBirth = "Invalid date format.";
  else if (compareISODate(form.dateOfBirth, new Date().toISOString().slice(0, 10)) === 1)
    e.dateOfBirth = "Date of birth cannot be in the future.";

  if (!form.diagnosis.trim()) e.diagnosis = "Diagnosis is required.";

  if (!form.admissionDate) e.admissionDate = "Admission date is required.";
  else if (!isValidISODate(form.admissionDate)) e.admissionDate = "Invalid date format.";

  if (form.admissionDate && form.dateOfBirth && compareISODate(form.admissionDate, form.dateOfBirth) === -1) {
    e.admissionDate = "Admission date cannot be before date of birth.";
  }

  if (form.dischargeDate) {
    if (!isValidISODate(form.dischargeDate)) e.dischargeDate = "Invalid date format.";
    else if (form.admissionDate && compareISODate(form.dischargeDate, form.admissionDate) === -1)
      e.dischargeDate = "Discharge date cannot be before admission date.";
  }

  if (!form.status) e.status = "Status is required.";
  if (!form.department.trim()) e.department = "Department is required.";

  return { fieldErrors: e, isValid: Object.keys(e).length === 0 };
}
