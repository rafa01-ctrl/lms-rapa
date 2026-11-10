import { NextResponse } from "next/server";
import { Unauthorized } from "./auth";

export function ok(data: unknown, status = 200) { return NextResponse.json(data, { status }); }
export function fail(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }

/**
 * Bungkus handler API supaya:
 * - Unauthorized otomatis jadi 403 dengan pesan yang jelas,
 * - error lain jadi 500 yang rapi (dan tetap dicatat di server).
 * Pemakaian:  return handler(async () => { ... return ok(data); })
 */
export async function handler(fn: () => Promise<Response>, pesanGagal = "Terjadi kesalahan pada server"): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Unauthorized) return fail("Anda tidak memiliki akses ke data ini", 403);
    console.error(pesanGagal, e);
    return fail(pesanGagal, 500);
  }
}

/** Ambil id ObjectId yang valid dari string, atau null. */
export function oid(value: unknown): string | null {
  const s = String(value ?? "");
  return /^[a-f\d]{24}$/i.test(s) ? s : null;
}

/** Ubah body form menjadi angka 0-100 yang valid. */
export function angka(value: unknown, def = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return def;
  return Math.min(100, Math.max(0, n));
}
