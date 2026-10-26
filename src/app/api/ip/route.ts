import { NextResponse } from "next/server";
import { readClientIp } from "@/lib/server/client-ip";

export const dynamic = "force-dynamic";

// Responses are per-visitor and must never be cached or shared.
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "*" };

export function GET(request: Request) {
  const found = readClientIp(request.headers);
  if (found.kind === "ok") {
    return NextResponse.json(
      { ip: found.ip, method: found.method, retrievedAt: new Date().toISOString() },
      { headers: noStore },
    );
  }
  const error =
    found.kind === "non-public"
      ? "This request arrived from a local or private address (for example localhost), so there is no public IP to show."
      : "Your public IP could not be determined from this request.";
  return NextResponse.json({ error }, { status: 404, headers: noStore });
}
