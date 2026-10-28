import { describe, expect, it } from "vitest";
import { parseCommand, MAX_INPUT_LENGTH } from "./command-parser";
import { runCommand, commandNames } from "./command-registry";
import type { TerminalContext } from "@/types/terminal";

const ctx: TerminalContext = {
  systemLines: () => ["sys"],
  browserLines: () => ["browser"],
  networkLines: () => ["net"],
  requestIp: async () => "203.0.113.9",
};

describe("parseCommand", () => {
  it("returns null for blank input", () => {
    expect(parseCommand("   ")).toBeNull();
  });
  it("lowercases the command and splits arguments", () => {
    expect(parseCommand("  NETWORK   ip ")).toEqual({ name: "network", args: ["ip"] });
  });
  it("strips control characters and caps length", () => {
    const p = parseCommand("help\u0000\u001b[31m" + "x".repeat(1000));
    expect(p).not.toBeNull();
    expect(JSON.stringify(p)).not.toMatch(/[\u0000-\u001f]/);
    expect(((p?.name ?? "") + (p?.args.join(" ") ?? "")).length).toBeLessThanOrEqual(MAX_INPUT_LENGTH);
  });
});

describe("command registry", () => {
  it("registers every required command", () => {
    for (const name of ["help", "clear", "whoami", "about", "projects", "skills", "experience", "security", "network", "cv", "contact", "system", "browser", "education", "github", "open", "replay"]) {
      expect(commandNames).toContain(name);
    }
  });
  it("help lists every registered command", () => {
    const text = (runCommand("help", ctx).lines ?? []).map((l) => l.text).join("\n");
    for (const name of commandNames) expect(text).toContain(name);
  });
  it("clear requests a screen clear", () => {
    expect(runCommand("clear", ctx).clear).toBe(true);
  });
  it("whoami shows the configured identity", () => {
    const text = (runCommand("whoami", ctx).lines ?? []).map((l) => l.text).join("\n");
    expect(text).toContain("Kwame Emmanuel Adom");
    expect(text).toContain("Location: Kumasi, Ghana");
  });
  it("projects lists real project titles and offers a jump to Work without scrolling by itself", () => {
    const r = runCommand("projects", ctx);
    expect((r.lines ?? []).map((l) => l.text).join("\n")).toContain("AdepaMarket");
    expect(r.go).toBe("work");
    expect(r.autoScroll).toBeUndefined();
  });
  it("'projects <name>' prints details from the data, and unknown names error", () => {
    const text = (runCommand("projects adepamarket", ctx).lines ?? []).map((l) => l.text).join("\n");
    expect(text).toContain("Cloudflare");
    expect(text).toContain("https://adepamarket.admunz.workers.dev/");
    expect(runCommand("projects nope", ctx).lines?.[0]?.kind).toBe("err");
  });
  it("'open <section>' is the only command that scrolls on its own", () => {
    expect(runCommand("open security", ctx)).toMatchObject({ go: "security", autoScroll: true });
    expect(runCommand("open nonsense", ctx).lines?.[0]?.kind).toBe("err");
    expect(runCommand("about", ctx).autoScroll).toBeUndefined();
  });
  it("cv only downloads when asked to", () => {
    expect(runCommand("cv", ctx).download).toBeUndefined();
    expect(runCommand("cv download", ctx).download).toBe("cv");
  });
  it("security states the real/simulated split and publishes no invented assessment", () => {
    const text = (runCommand("security", ctx).lines ?? []).map((l) => l.text).join("\n");
    expect(text).toContain("Published real assessments: 0");
    expect(text).toContain("SIMULATION");
  });
  it("skills labels each skill with its evidence level", () => {
    const text = (runCommand("skills", ctx).lines ?? []).map((l) => l.text).join("\n");
    expect(text).toMatch(/Python \[shipped\]/);
    expect(text).toMatch(/C\+\+ \[learning\]/);
  });
  it("replay asks the page to replay the intro", () => {
    expect(runCommand("replay", ctx).replay).toBe(true);
  });
  it("system returns the context-provided values", () => {
    expect(runCommand("system", ctx).lines?.[0]?.text).toBe("sys");
  });
  it("network ip is deferred and only runs when requested", async () => {
    expect(runCommand("network", ctx).deferred).toBeUndefined();
    const r = runCommand("network ip", ctx);
    const lines = await r.deferred?.();
    expect(lines?.[0]?.text).toContain("203.0.113.9");
  });
  it.each(["rm -rf /", "ls", "cat /etc/passwd", "bash -c id", "node -e 1", "curl http://x", "$(whoami)", "; ls", "python3"])(
    "rejects arbitrary command %s with a safe error",
    (input) => {
      const r = runCommand(input, ctx);
      expect(r.go).toBeUndefined();
      expect(r.download).toBeUndefined();
      expect(r.replay).toBeUndefined();
      expect(r.deferred).toBeUndefined();
      expect(r.lines?.[0]?.kind).toBe("err");
      expect(r.lines?.[0]?.text).toContain("command not found");
    },
  );
  it("does not treat prototype keys as commands", () => {
    for (const k of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
      expect(runCommand(k, ctx).lines?.[0]?.kind).toBe("err");
    }
  });
});
