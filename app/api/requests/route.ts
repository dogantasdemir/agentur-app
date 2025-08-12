import { prisma } from "@/lib/db";
import { getOrgSession } from "@/lib/session";
import { requestCreateSchema } from "@/lib/zod";

export async function GET() {
  const orgId = getOrgSession();
  if (!orgId) return new Response("Unauthorized", { status: 401 });
  const data = await prisma.request.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "desc" } });
  return Response.json(data);
}

export async function POST(req: Request) {
  const orgId = getOrgSession();
  if (!orgId) return new Response("Unauthorized", { status: 401 });
  const json = await req.json();
  const parsed = requestCreateSchema.parse(json);
  const created = await prisma.request.create({
    data: {
      organizationId: orgId,
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority as any,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
    },
  });
  return Response.json(created, { status: 201 });
}
