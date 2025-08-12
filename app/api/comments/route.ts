import { prisma } from "@/lib/db";
import { getOrgSession } from "@/lib/session";
import { commentCreateSchema } from "@/lib/zod";

export async function POST(req: Request) {
  const orgId = getOrgSession();
  if (!orgId) return new Response("Unauthorized", { status: 401 });
  const json = await req.json();
  const parsed = commentCreateSchema.parse(json);
  const created = await prisma.comment.create({
    data: { requestId: parsed.requestId, authorType: "CUSTOMER", body: parsed.body },
  });
  return Response.json(created, { status: 201 });
}
