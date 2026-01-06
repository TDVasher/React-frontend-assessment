import React, { useState } from "react";
import InputField from "./InputField";
import { createRecord } from "./recordsApi";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function isValidPatientId(value) {
  return /^P\d{3}$/.test((value || "").trim());
}

function isValidISODate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

function compareISODate(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function normalizeRecordPayload(form) {
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

export default function RecordCreateForm({ onCreated, onMessage }) {
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    dateOfBirth: "",
    diagnosis: "",
    admissionDate: "",
    dischargeDate: "",
    status: "Active",
    department: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const e = {};

    const pid = (form.patientId || "").trim().toUpperCase();
    if (!pid) e.patientId = "Patient ID is required.";
    else if (!isValidPatientId(pid)) e.patientId = "Format must be P### (example: P007).";

    if (!form.patientName.trim()) e.patientName = "Patient name is required.";

    const today = new Date().toISOString().slice(0, 10);

    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    else if (!isValidISODate(form.dateOfBirth)) e.dateOfBirth = "Invalid date.";
    else if (compareISODate(form.dateOfBirth, today) === 1)
      e.dateOfBirth = "Date of birth cannot be in the future.";

    if (!form.diagnosis.trim()) e.diagnosis = "Diagnosis is required.";

    if (!form.admissionDate) e.admissionDate = "Admission date is required.";
    else if (!isValidISODate(form.admissionDate)) e.admissionDate = "Invalid date.";

    if (form.dischargeDate) {
      if (!isValidISODate(form.dischargeDate)) e.dischargeDate = "Invalid date.";
      else if (form.admissionDate && compareISODate(form.dischargeDate, form.admissionDate) === -1)
        e.dischargeDate = "Discharge date cannot be before admission date.";
    }

    if (!form.status) e.status = "Status is required.";
    if (!form.department.trim()) e.department = "Department is required.";

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!validate()) {
      onMessage?.({
        type: "error",
        title: "Fix the form",
        message: "Please correct the highlighted fields and try again.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = normalizeRecordPayload({
        ...form,
        patientId: form.patientId.trim().toUpperCase(),
      });

      const created = await createRecord(payload);

      setForm({
        patientId: "",
        patientName: "",
        dateOfBirth: "",
        diagnosis: "",
        admissionDate: "",
        dischargeDate: "",
        status: "Active",
        department: "",
      });
      setFieldErrors({});

      onCreated?.(created);
    } catch (err) {
      const fe = err?.data?.fieldErrors || err?.data?.errors || err?.data?.fields || null;

      if (fe && typeof fe === "object") {
        const mapped = {};
        for (const k of Object.keys(fe)) mapped[k] = String(fe[k]);
        setFieldErrors((p) => ({ ...p, ...mapped }));
      }

      onMessage?.({
        type: "error",
        title: "Create failed",
        message:
          err?.message || "Something went wrong while creating the record. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase = "w-full rounded-lg border px-3 py-2 text-sm outline-none";
  const ok = "border-slate-300 focus:ring-2 focus:ring-slate-200";
  const bad = "border-red-300 focus:ring-2 focus:ring-red-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Patient ID" error={fieldErrors.patientId}>
          <input
            value={form.patientId}
            onChange={(e) => setField("patientId", e.target.value.toUpperCase())}
            className={classNames(inputBase, fieldErrors.patientId ? bad : ok)}
            placeholder="P007"
            autoComplete="off"
          />
        </InputField>

        <InputField label="Patient Name" error={fieldErrors.patientName}>
          <input
            value={form.patientName}
            onChange={(e) => setField("patientName", e.target.value)}
            className={classNames(inputBase, fieldErrors.patientName ? bad : ok)}
            autoComplete="off"
          />
        </InputField>

        <InputField label="Date of Birth" error={fieldErrors.dateOfBirth}>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
            className={classNames(inputBase, fieldErrors.dateOfBirth ? bad : ok)}
          />
        </InputField>

        <InputField label="Diagnosis" error={fieldErrors.diagnosis}>
          <input
            value={form.diagnosis}
            onChange={(e) => setField("diagnosis", e.target.value)}
            className={classNames(inputBase, fieldErrors.diagnosis ? bad : ok)}
            autoComplete="off"
          />
        </InputField>

        <InputField label="Admission Date" error={fieldErrors.admissionDate}>
          <input
            type="date"
            value={form.admissionDate}
            onChange={(e) => setField("admissionDate", e.target.value)}
            className={classNames(inputBase, fieldErrors.admissionDate ? bad : ok)}
          />
        </InputField>

        <InputField label="Discharge Date (optional)" error={fieldErrors.dischargeDate}>
          <input
            type="date"
            value={form.dischargeDate}
            onChange={(e) => setField("dischargeDate", e.target.value)}
            className={classNames(inputBase, fieldErrors.dischargeDate ? bad : ok)}
          />
        </InputField>

        <InputField label="Status" error={fieldErrors.status}>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className={classNames(inputBase, fieldErrors.status ? bad : ok)}
          >
            <option value="Active">Active</option>
            <option value="Discharged">Discharged</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </InputField>

        <InputField label="Department" error={fieldErrors.department}>
          <input
            value={form.department}
            onChange={(e) => setField("department", e.target.value)}
            className={classNames(inputBase, fieldErrors.department ? bad : ok)}
            autoComplete="off"
          />
        </InputField>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className={classNames(
            "rounded-lg px-4 py-2 text-sm font-semibold",
            submitting
              ? "cursor-not-allowed bg-slate-200 text-slate-600"
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          {submitting ? "Creating..." : "Create record"}
        </button>
      </div>
    </form>
  );
}
