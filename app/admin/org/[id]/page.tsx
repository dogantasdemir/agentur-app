import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { generateAccessToken, sha256 } from "@/lib/crypto";
import { StatusPill, IconButton, SearchBar } from "@/components/ui";
import Link from "next/link";

export default async function OrgDetail({ params }: { params: { id: string } }) {
  if (!isAdmin()) return <div className="p-6">Unauthorized</div>;

  const org = await prisma.organization.findUnique({ where: { id: params.id } });
  if (!org) return <div className="p-6">Nicht gefunden</div>;

  const requests = await prisma.request.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: "desc" } });
  const link = await prisma.accessLink.findFirst({ where: { organizationId: org.id, active: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{org.name}</h1>
          <p className="text-sm text-slate-500">{requests.length} Aufträge</p>
        </div>
        <form action={rotateLink.bind(null, org.id)}>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Access Link rotieren</button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <SearchBar />
        <Link href={`/admin/org/${org.id}/new`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Neuer Auftrag</Link>
      </div>

      <div className="space-y-2">
        {requests.map((r, idx) => (
          <div key={r.id} className="flex items-center justify-between rounded-full bg-white px-5 py-4 ring-1 ring-slate-200">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100">👤</div>
              <div className="min-w-0">
                <Link href={`/admin/request/${r.id}`} className="block truncate font-medium hover:underline">{r.title}</Link>
                <div className="truncate text-xs text-slate-500">Ansprechpartner: –</div>
              </div>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <div className="flex items-center gap-2 text-xs text-slate-500">🕘 {r.createdAt.toLocaleString()}</div>
              <div className="text-xs"><span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">#{(5000+idx).toString()}</span></div>
              <StatusPill value={r.status} />
              <div className="flex items-center gap-2">
                <form action={cycleStatus.bind(null, r.id, r.status)}><IconButton title="Status ändern">✏️</IconButton></form>
                <form action={removeRequest.bind(null, r.id)}><IconButton title="Löschen">🗑️</IconButton></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function rotateLink(orgId: string) {
  const raw = generateAccessToken();
  const tokenHash = sha256(raw);
  await prisma.accessLink.updateMany({ where: { organizationId: orgId, active: true }, data: { active: false } });
  await prisma.accessLink.create({ data: { organizationId: orgId, tokenHash, active: true } });
  console.log("Neuer Access Link:", `${process.env.APP_URL ?? "http://localhost:3000"}/access?k=${raw}`);
  revalidatePath(`/admin/org/${orgId}`);
}

async function cycleStatus(id: string, current: any) {
  const order = ["OPEN","IN_PROGRESS","REVIEW","DONE","ON_HOLD"] as const;
  const next = order[(order.indexOf(current) + 1) % order.length];
  await prisma.request.update({ where: { id }, data: { status: next as any } });
  revalidatePath("/admin");
}

async function removeRequest(id: string) {
  await prisma.request.delete({ where: { id } });
  revalidatePath("/admin");
}
