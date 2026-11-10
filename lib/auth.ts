import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export type Role = "admin" | "guru" | "siswa" | "kurikulum" | "kepsek";
export type Session = { id: string; name: string; email: string; role: Role; classId?: string };
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export async function hashPassword(password: string) { return bcrypt.hash(password, 10); }
export async function comparePassword(password: string, hash: string) { return bcrypt.compare(password, hash); }

export async function createSession(user: { _id: unknown; name: string; email: string; role: Role; classId?: unknown }) {
  const token = await new SignJWT({ id: String(user._id), name: user.name, email: user.email, role: user.role, classId: user.classId ? String(user.classId) : undefined })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const store = await cookies();
  store.set("lms_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("lms_session")?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return payload as unknown as Session; }
  catch { return null; }
}

/** Dilempar saat role tidak diizinkan; route menangkapnya dan mengubah ke 403 yang rapi. */
export class Unauthorized extends Error { }

export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Unauthorized("Tidak diizinkan");
  return session;
}

/** Helper untuk route handler: kembalikan NextResponse 401/403 bila tidak berhak. */
export function deny(e: unknown) {
  if (e instanceof Unauthorized) {
    return NextResponse.json({ error: "Anda tidak memiliki akses ke data ini" }, { status: 403 });
  }
  return null;
}

export async function currentUser() {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  return User.findById(session.id).lean();
}
