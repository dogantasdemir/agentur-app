import { setAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:grid-cols-2">
        <form action={login} className="space-y-4 p-8 md:p-12">
          <div className="mb-6">
            <div className="mb-2 text-sm text-slate-500">Bei 7i7® einloggen</div>
            <h1 className="text-2xl font-semibold">Verwalte Deine Aufträge smart.</h1>
          </div>
          <label className="block text-sm">Dein Passwort*</label>
          <input name="password" type="password" placeholder="••••••••" className="mb-4 w-full rounded-lg border px-3 py-2" required />
          <button className="w-full rounded-lg bg-slate-900 py-2 text-white">Login</button>
          <div className="text-xs text-slate-500">Hinweis: Dieses MVP nutzt ein einmaliges Admin-Passwort aus deiner .env</div>
        </form>
        <div className="hidden items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900 md:flex">
          <div className="text-6xl font-black text-white/80">7</div>
        </div>
      </div>
    </div>
  );
}

async function login(formData: FormData) {
  const pw = String(formData.get("password") || "");
  if (!process.env.ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD fehlt");
  if (pw !== process.env.ADMIN_PASSWORD) throw new Error("Falsches Passwort");
  setAdminSession();
  redirect("/admin");
}
