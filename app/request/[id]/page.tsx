import { prisma } from "@/lib/db";
import { getOrgSession } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function RequestDetail({ params }: { params: { id: string } }) {
  const orgId = getOrgSession();
  if (!orgId) return notFound();

  const req = await prisma.request.findFirst({
    where: { id: params.id, organizationId: orgId },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!req) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{req.title}</h1>
        <p className="text-slate-700 whitespace-pre-wrap">{req.description}</p>
        <div className="text-xs text-slate-600">Status: {req.status} • Priorität: {req.priority}</div>
      </div>

      <form action={addComment.bind(null, req.id)} className="space-y-2 max-w-xl">
        <textarea name="body" placeholder="Kommentar hinzufügen" className="w-full rounded border p-2 h-28" required />
        <button className="rounded bg-black px-4 py-2 text-white">Kommentar senden</button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">Kommentare</h2>
        <ul className="space-y-2">
          {req.comments.map((c) => (
            <li key={c.id} className="rounded border bg-white p-3 text-sm">
              <div className="text-xs text-slate-500">{c.authorType} • {c.createdAt.toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{c.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function addComment(requestId: string, formData: FormData) {
  const orgId = getOrgSession();
  if (!orgId) throw new Error("Kein Zugriff");
  const body = String(formData.get("body") || "");
  if (!body.trim()) return;

  await prisma.comment.create({
    data: {
      requestId,
      authorType: "CUSTOMER",
      body,
    },
  });
}
