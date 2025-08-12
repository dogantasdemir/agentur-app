import React from "react";

export function StatusPill({ value }: { value: "OPEN"|"IN_PROGRESS"|"REVIEW"|"DONE"|"ON_HOLD" }) {
  const map: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    IN_PROGRESS: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    REVIEW: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    DONE: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    ON_HOLD: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  };
  const label: Record<string,string> = {
    OPEN: "Neu",
    IN_PROGRESS: "Aktiv",
    REVIEW: "Review",
    DONE: "Erledigt",
    ON_HOLD: "Pausiert",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${map[value]}`}>{label[value]}</span>;
}

export function TagPill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs ring-1 ring-slate-200">{children}</span>;
}

export function IconButton({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-slate-200 hover:bg-slate-50">{children}</button>
  );
}

export function SearchBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-80">
        <input placeholder="Suchen…" className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm ring-1 ring-slate-200 placeholder:text-slate-400 outline-none" />
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">🔎</span>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <TagPill>Fertige Aufträge</TagPill>
        <TagPill>Offene Aufträge</TagPill>
        <TagPill>Neue Aufträge</TagPill>
        <TagPill>Ansprechpartner</TagPill>
      </div>
    </div>
  );
}
