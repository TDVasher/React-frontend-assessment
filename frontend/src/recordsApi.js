const API_BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api").replace(/\/$/, "");

const msg = (s, apiMsg) => {
  if (s === 400) return "Error 400, Invalid";
  if (s === 404) return "Error 404, Endpoint not found.";
  if (s === 409) return "Error 409, Conflict.";
  if (s >= 500) return "Error 500, Server Error";
  return apiMsg ? `Request failed. — ${apiMsg}` : "Request failed.";
};

async function requestJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

  if (!res.ok) {
    const apiMsg =
      (data && (data.message || data.error || data.details)) ||
      (typeof data === "string" ? data : "") ||
      "";
    const err = new Error(msg(res.status, apiMsg));
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function getRecords({ search = "", status = "", department = "" } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (status.trim()) params.set("status", status.trim());
  if (department.trim()) params.set("department", department.trim());

  const url = `${API_BASE}/records${params.toString() ? `?${params}` : ""}`;
  const payload = await requestJson(url, { method: "GET" });

  if (!payload || typeof payload !== "object" || !Array.isArray(payload.data)) {
    throw new Error("Unexpected API response.");
  }

  return {
    records: payload.data,
    pagination: payload.pagination || {
      page: 1,
      limit: payload.data.length,
      total: payload.data.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    filters: payload.filters || { status: null, department: null, search: null },
  };
}

export async function createRecord(recordPayload) {
  const r = await requestJson(`${API_BASE}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recordPayload),
  });
  return r && typeof r === "object" && "data" in r ? r.data : r;
}
