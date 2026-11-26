import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

// No built-in fallback in production: the source is not a safe place for a signing key.
function jwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is not set");
  return "local-development-only-secret";
}
const COOKIE_NAME = "saad_admin_session";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminSession): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, jwtSecret()) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyAdminToken(token);
    if (!decoded) return null;

    // Verify user is still active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(session: AdminSession) {
  const token = signAdminToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Role based permission checker
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const rolesHierarchy: Record<string, number> = {
    SUPER_ADMIN: 100,
    STORE_MANAGER: 80,
    ORDER_MANAGER: 60,
    CONTENT_MANAGER: 40,
    ACCOUNTS_MANAGER: 40,
    VIEWER: 10,
  };

  const userWeight = rolesHierarchy[userRole] || 0;
  const requiredWeight = rolesHierarchy[requiredRole] || 0;
  return userWeight >= requiredWeight;
}

/** Server-side gate for every admin page and inline server action. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
