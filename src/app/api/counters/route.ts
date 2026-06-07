import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  countersCacheControl,
  emptyCountersSnapshot,
  snapshotFromRows,
} from "@/lib/counters/counters";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function GET() {
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  let snapshot = emptyCountersSnapshot;

  if (client) {
    const { data } = await client.from("counters").select("key, value, updated_at");
    if (data) {
      snapshot = snapshotFromRows(data);
    }
  }

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": countersCacheControl },
  });
}
