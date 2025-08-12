import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminHome() {
  if (!isAdmin()) return <div className="p-6">Unauthorized</div>;
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Organisationen</h1>
      <ul className="divide-y rounded border bg-white">
        {orgs.map((o) => (
          <li key={o.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{o.name}</div>
                <div className="text-xs text-slate-600">{o.id}</div>
              </div>
              <Link href={`/admin/org/${o.id}`} className="rounded border px-3 py-1 text-sm">Öffnen</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
