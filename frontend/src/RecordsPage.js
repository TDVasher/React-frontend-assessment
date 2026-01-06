import React, { useRef, useState } from "react";
import Modal from "./Modal";
import RecordsTable from "./RecordsTable";
import RecordCreateForm from "./RecordCreateForm";
import { getRecords } from "./recordsApi";

export default function RecordsPage() {
  const didInitRef = useRef(false);

  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dept, setDept] = useState("");

  async function load() {
    setFetching(true);
    setMessage(null);

    try {
      const { records: list } = await getRecords({
        search: search.trim(),
        status,
        department: dept.trim(),
      });
      setRecords(Array.isArray(list) ? list : []);
    } catch (err) {
      setRecords([]);
      setMessage({
        type: "error",
        title: "Couldn’t load records",
        message: err?.message || "Please check the API and try again.",
      });
    } finally {
      setFetching(false);
    }
  }

  if (!didInitRef.current) {
    didInitRef.current = true;
    Promise.resolve().then(load);
  }

  const msgTone =
    message?.type === "success"
      ? "border-green-200 bg-green-50 text-green-900"
      : "border-red-200 bg-red-50 text-red-900";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Q-Centrix React Frontend Assessment
            </h1>

            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              type="button"
            >
              + New record
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-800">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Name, Patient ID, or Diagnosis"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800">Department</label>
              <input
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. Cardiology"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setDept("");
                setMessage(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={load}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Refresh
            </button>

            <div className="ml-auto text-sm text-slate-600">
              {fetching ? "Loading…" : `${records.length} record${records.length === 1 ? "" : "s"}`}
            </div>
          </div>

          {message ? (
            <div className={`mt-4 rounded-xl border p-4 ${msgTone}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{message.title}</div>
                  {message.message ? (
                    <div className="mt-1 text-sm opacity-90">{message.message}</div>
                  ) : null}
                </div>
                <button
                  className="rounded-md px-2 py-1 text-sm opacity-80 hover:opacity-100"
                  onClick={() => setMessage(null)}
                  type="button"
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {fetching ? (
          <div className="mt-4 rounded-xl border bg-white p-6 shadow-sm text-slate-700">
            Loading…
          </div>
        ) : records.length === 0 ? (
          <div className="mt-4 rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">No records found</div>
            <div className="mt-1 text-sm text-slate-600">
              Adjust filters, then hit <span className="font-semibold">Refresh</span>.
            </div>
          </div>
        ) : (
          <RecordsTable records={records} />
        )}
      </main>

      <Modal open={createOpen} title="Create Clinical Record" onClose={() => setCreateOpen(false)}>
        <div className="text-sm text-slate-600">
          All fields are required except discharge date.
          <span className="font-semibold">P###</span>.
        </div>

        <div className="mt-4">
          <RecordCreateForm
            onMessage={(m) =>
              setMessage({
                type: m.type,
                title: m.title,
                message: m.message,
              })
            }
            onCreated={async () => {
              setCreateOpen(false);
              setMessage({
                type: "success",
                title: "Record created",
                message: "The record was saved successfully.",
              });
              await load();
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
