import { NextResponse } from "next/server";
import { readAdminContext } from "@/lib/admin/admin-request";

export const dynamic = "force-dynamic";

export async function GET() {
  const { admin } = await readAdminContext();
  return NextResponse.json({ role: admin.role });
}
