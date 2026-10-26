import { NextResponse } from "next/server";
import { getBuildInfo } from "@/lib/server/build-info";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json(getBuildInfo(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Never leak internals in errors.
    return NextResponse.json({ error: "Unavailable" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
