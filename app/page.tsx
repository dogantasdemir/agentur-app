import { prisma } from "@/lib/db";
import { getOrgSession } from "@/lib/session";
import Link from "next/link";

export default async function Dashboard() {
  const orgId = getOrgSession();
  if (!orgId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Kein Zugriff</h1>
        <p>Öffne deinen persönlichen Zugangslink aus der E-Mail.</p>
      </div>
    );
  }

  const requests = await prisma.request.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Deine Anfragen</h1>
        <Link href="/new" className="rounded-lg border px-4 py-2">Neue Anfrage</Link>
      </div>
      {requests.length === 0 ? (
        <p className="text-sm text-slate-600">Noch keine Anfragen.</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-white">
          {requests.map((r) => (
            <li key={r.id} className="p-4 hover:bg-slate-50">
              <Link href={`/request/${r.id}`} className="font-medium">{r.title}</Link>
              <div className="text-xs text-slate-600">Status: {r.status} • Erstellt: {r.createdAt.toDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
