import { NextResponse } from "next/server";
import { buildStationRefreshDraft } from "@/lib/stations/refresh-draft";

// Daily agentic Cron endpoint. It returns a review DRAFT only and never
// publishes unverified affected-station changes; an admin must approve them.
export async function POST() {
  const draft = buildStationRefreshDraft();
  return NextResponse.json(draft, { status: 202 });
}
