import { PrismaClient } from "@prisma/client";
import { generateAccessToken, sha256 } from "../lib/crypto";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({ data: { name: "Demo Kunde" } });

  const rawToken = generateAccessToken();
  const tokenHash = sha256(rawToken);

  await prisma.accessLink.create({
    data: {
      organizationId: org.id,
      tokenHash,
      expiresAt: null
    },
  });

  console.log("\\n=== Demo Access Link ===");
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/access?k=${rawToken}`;
  console.log(url);
  console.log("=======================\\n");
}

main().finally(async () => {
  await prisma.$disconnect();
});
