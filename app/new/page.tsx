import { requestCreateSchema } from "@/lib/zod";
import { prisma } from "@/lib/db";
import { getOrgSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default function NewRequestPage() {
  return (
    <form action={create} className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Neue Anfrage</h1>
      <input name="title" placeholder="Titel" className="w-full rounded border p-2" required />
      <textarea name="description" placeholder="Beschreibung" className="w-full rounded border p-2 h-40" required />
      <select name="priority" className="w-full rounded border p-2">
        <option value="MEDIUM">Priorität: Mittel</option>
        <option value="LOW">Priorität: Niedrig</option>
        <option value="HIGH">Priorität: Hoch</option>
      </select>
      <input name="deadline" type="datetime-local" className="w-full rounded border p-2" />
      <button className="rounded bg-black px-4 py-2 text-white">Anlegen</button>
    </form>
  );
}

async function create(formData: FormData) {
  const orgId = getOrgSession();
  if (!orgId) throw new Error("Kein Zugriff");

  const raw = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    priority: String(formData.get("priority") || "MEDIUM"),
    deadline: formData.get("deadline") ? new Date(String(formData.get("deadline"))).toISOString() : undefined,
  };

  const parsed = requestCreateSchema.parse(raw);

  await prisma.request.create({
    data: {
      organizationId: orgId,
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority as any,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
    },
  });

  redirect("/");
}
