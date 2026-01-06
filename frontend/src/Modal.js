import React, { useRef } from "react";

export default function Modal({ open, title, children, onClose }) {
  const panelRef = useRef(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-end justify-center p-4 sm:items-center">
        <div
          ref={(node) => {
            panelRef.current = node;
            if (node) node.focus();
          }}
          tabIndex={-1}
          className="w-full max-w-2xl rounded-xl bg-white shadow-xl outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <button
              className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="px-4 py-4 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
