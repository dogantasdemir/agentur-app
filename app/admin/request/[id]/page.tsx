import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminReqDetail({ params }: { params: { id: string } }) {
  if (!isAdmin()) return <div className="p-6">Unauthorized</div>;
  const r = await prisma.request.findUnique({ where: { id: params.id } });
  if (!r) return <div className="p-6">Nicht gefunden</div>;

  return (
    <div className="space-y-4">
      <Link href={"/admin"} className="text-sm underline">← Zur Übersicht</Link>
      <h1 className="text-2xl font-semibold">{r.title}</h1>
      <div className="text-sm text-slate-600">Status: {r.status} • Priorität: {r.priority}</div>
      <pre className="whitespace-pre-wrap rounded border bg-white p-4">{r.description}</pre>
    </div>
  );
}
