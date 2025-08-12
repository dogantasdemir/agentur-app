import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { setOrgSession } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("k");
  if (!raw) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const now = new Date();
  const tokenHash = sha256(raw);

  const link = await prisma.accessLink.findUnique({ where: { tokenHash } });
  if (!link || !link.active || (link.expiresAt && link.expiresAt < now)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  setOrgSession(link.organizationId);
  await prisma.accessLink.update({ where: { id: link.id }, data: { lastUsedAt: now } });

  const redirectTo = `${process.env.APP_URL ?? "http://localhost:3000"}/`;
  return NextResponse.redirect(redirectTo, { status: 302 });
}
