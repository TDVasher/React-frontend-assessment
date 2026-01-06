import React from "react";

export default function InputField({ label, error, children }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <div className="mt-1">{children}</div>
      {error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null}
    </div>
  );
}
