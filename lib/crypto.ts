import crypto from "crypto";

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateAccessToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex"); // 64 hex chars ~ 256 bit
}
