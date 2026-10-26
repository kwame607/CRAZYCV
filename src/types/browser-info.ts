export type InfoStatus = "detected" | "inferred" | "unavailable" | "not-requested";

export interface InfoItem {
  label: string;
  value: string;
  status: InfoStatus;
  /** Plain-language caveat shown under the value. */
  note?: string;
}

export interface InfoSection {
  id: "browser" | "device" | "connection" | "portfolio";
  title: string;
  items: InfoItem[];
}

export interface ParsedBrowser {
  family: string;
  version: string | null;
  engine: string;
}

export interface ParsedPlatform {
  os: string;
  method: string;
  confidence: "best effort" | "unknown";
}

export interface ServerInfo {
  app: string;
  version: string;
  build: string;
  environment: string;
  health: "ok";
  time: string;
}

export type ServerInfoState =
  | { state: "loading" }
  | { state: "ok"; info: ServerInfo; roundTripMs: number }
  /** GitHub Pages preview: no server exists, values are baked in at build time. */
  | { state: "static"; version: string; build: string }
  | { state: "error"; message: string };

export type IpState =
  | { state: "not-requested" }
  | { state: "loading" }
  | { state: "ok"; ip: string; retrievedAt: string; method: string }
  | { state: "failed"; message: string };
