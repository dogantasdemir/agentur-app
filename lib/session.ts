import { cookies } from "next/headers";

const COOKIE_NAME = "org_session";

export function setOrgSession(organizationId: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: organizationId,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
}

export function getOrgSession(): string | null {
  const c = cookies().get(COOKIE_NAME);
  return c?.value ?? null;
}

export function clearOrgSession() {
  cookies().delete(COOKIE_NAME);
}
