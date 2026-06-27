import crypto from "crypto";

interface SessionData {
  userId: number;
  phone: string;
  isAdmin: boolean;
}

const sessions = new Map<string, SessionData>();

export function createSession(data: SessionData): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, data);
  return token;
}

export function getSession(token: string | undefined): SessionData | null {
  if (!token) return null;
  return sessions.get(token) ?? null;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function getTokenFromRequest(req: { headers: Record<string, string | string[] | undefined>; cookies?: Record<string, string> }): string | undefined {
  // Check Authorization header first, then cookie
  const auth = req.headers["authorization"];
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return req.cookies?.["kilai_session"];
}
