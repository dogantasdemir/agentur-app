import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "admin_session";

function hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function isAdmin() {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  const expected = process.env.ADMIN_PASSWORD ? hash(process.env.ADMIN_PASSWORD) : "";
  return c === expected && !!expected;
}

export function setAdminSession() {
  if (!process.env.ADMIN_PASSWORD) throw new Error("Missing ADMIN_PASSWORD");
  const val = hash(process.env.ADMIN_PASSWORD);
  cookies().set({ name: COOKIE, value: val, httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 8 });
}

export function clearAdminSession() {
  cookies().delete(COOKIE);
}
