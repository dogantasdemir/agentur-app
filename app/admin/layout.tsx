import React from "react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) {
    return (
      <div className="p-6 text-sm text-slate-600">
        Nicht eingeloggt. <Link className="underline" href="/admin/login">Zum Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <aside className="sticky top-0 flex h-screen w-20 flex-col items-center justify-between bg-slate-900 py-6 text-white">
          <div className="space-y-6">
            <Link href="/admin" className="block">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-xl font-black">7</div>
            </Link>
            <nav className="flex flex-col items-center gap-4 text-slate-300">
              <Link title="Dashboard" href="/admin" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10">🏠</Link>
              <Link title="Aufträge" href="/admin" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10">🗂️</Link>
              <Link title="Einstellungen" href="/admin" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10">⚙️</Link>
            </nav>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">👤</div>
        </aside>
        <main className="mx-auto w-full max-w-6xl p-8">{children}</main>
      </div>
    </div>
  );
}
