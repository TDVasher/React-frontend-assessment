import React from "react";

export default function RecordsTable({ records }) {
  return (
    <div className="mt-4">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Diagnosis
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Department
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{r.patientName}</div>
                  <div className="text-sm text-slate-600">{r.patientId}</div>
                  <div className="text-xs text-slate-500">DOB: {r.dateOfBirth}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">{r.diagnosis}</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  <div>Admit: {r.admissionDate}</div>
                  <div>Disch: {r.dischargeDate ?? "—"}</div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {r.status}
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">{r.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {records.map((r) => (
          <div key={r.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900">{r.patientName}</div>
                <div className="text-sm text-slate-600">{r.patientId}</div>
              </div>
              <div className="text-sm font-semibold text-slate-900">{r.status}</div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-slate-800">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Diagnosis
                </div>
                <div>{r.diagnosis}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DOB
                  </div>
                  <div>{r.dateOfBirth}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dept
                  </div>
                  <div>{r.department}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admit
                  </div>
                  <div>{r.admissionDate}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Discharge
                  </div>
                  <div>{r.dischargeDate ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
