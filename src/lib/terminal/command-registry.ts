import type { AppId, CommandDef, CommandResult, TerminalContext, TerminalLine } from "@/types/terminal";
import { profile, education, experience } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { parseCommand } from "./command-parser";

const out = (...texts: string[]): TerminalLine[] => texts.map((text) => ({ kind: "out", text }));

const appNames: Record<string, AppId> = {
  home: "home",
  projects: "projects",
  terminal: "terminal",
  system: "system",
  "security-lab": "security-lab",
  network: "network-tools",
  "network-tools": "network-tools",
  skills: "skills",
  cv: "cv",
  about: "about",
  contact: "contact",
};

const commands: CommandDef[] = [
  {
    name: "help",
    description: "List available commands",
    run: () => ({
      lines: [
        ...out("Available commands:"),
        ...commands.map((c) => ({ kind: "out" as const, text: `  ${c.name.padEnd(14)} ${c.description}` })),
        ...out("", "This terminal is a portfolio navigator, not a shell. Only the commands above exist."),
      ],
    }),
  },
  { name: "clear", description: "Clear the screen", run: () => ({ clear: true }) },
  {
    name: "whoami",
    description: "Who is this?",
    run: () => ({
      lines: out(profile.name, `Role: ${profile.roles[0]}`, `Focus: ${profile.focus}`, `Location: ${profile.location}`),
    }),
  },
  {
    name: "about",
    description: "Short profile (opens About)",
    run: () => ({ lines: out(profile.summary), openApp: "about" }),
  },
  {
    name: "projects",
    description: "List projects (opens Projects)",
    run: () => ({
      lines: [
        ...out("Projects:"),
        ...projects.map((p) => ({ kind: "out" as const, text: `  ${p.title.padEnd(30)} ${p.status}` })),
        ...out("", "Opening the Projects app for case studies."),
      ],
      openApp: "projects",
    }),
  },
  {
    name: "skills",
    description: "Skills grouped by area (opens Skills)",
    run: () => ({
      lines: skillGroups.flatMap((g) => out(`${g.title}: ${g.skills.map((s) => s.name).join(", ")}`)),
      openApp: "skills",
    }),
  },
  {
    name: "contact",
    description: "How to reach me (opens Contact)",
    run: () => ({
      lines: out(
        `Email:  ${profile.email ?? "not configured yet"}`,
        `GitHub: ${profile.github ?? "not configured yet"}`,
      ),
      openApp: "contact",
    }),
  },
  {
    name: "cv",
    description: "View CV (opens CV)",
    run: () => ({ lines: out("Opening CV."), openApp: "cv" }),
  },
  {
    name: "system",
    description: "Browser and system overview",
    run: (_a, ctx) => ({ lines: out(...ctx.systemLines()), openApp: "system" }),
  },
  {
    name: "browser",
    description: "Detected browser details",
    run: (_a, ctx) => ({ lines: out(...ctx.browserLines()) }),
  },
  {
    name: "network",
    description: "Connection info. 'network ip' looks up your public IP",
    run: (args, ctx): CommandResult => {
      if (args[0] === "ip") {
        return {
          lines: [{ kind: "info", text: "Looking up your public IP via this site's own server (not stored)…" }],
          deferred: async () => {
            try {
              const ip = await ctx.requestIp();
              return [{ kind: "out", text: `Public IP: ${ip}` }, { kind: "info", text: "VPNs, proxies and carrier NAT can change this. It is not stored." }];
            } catch (e) {
              return [{ kind: "err", text: `Public IP: not retrieved. ${e instanceof Error ? e.message : "The lookup failed."}` }];
            }
          },
        };
      }
      return { lines: out(...ctx.networkLines()) };
    },
  },
  {
    name: "security-lab",
    description: "Open the Security Lab",
    run: () => ({
      lines: out("Security Lab: simulated demos, assessment format, no real scans of third-party systems."),
      openApp: "security-lab",
    }),
  },
  {
    name: "education",
    description: "Education",
    run: () => ({ lines: education.flatMap((e) => out(`${e.title}, ${e.org}, ${e.period}`, `  ${e.detail}`)) }),
  },
  {
    name: "experience",
    description: "Experience",
    run: () => ({ lines: experience.flatMap((e) => out(`${e.title}, ${e.org}, ${e.period}`, `  ${e.detail}`)) }),
  },
  {
    name: "github",
    description: "GitHub profile",
    run: () => ({
      lines: profile.github ? out(profile.github) : [{ kind: "err", text: "GitHub link is not configured yet." }],
    }),
  },
  {
    name: "open",
    description: "open <app>: open an app window",
    run: (args) => {
      const id = appNames[(args[0] ?? "").toLowerCase()];
      if (!id) {
        return { lines: [{ kind: "err", text: `Usage: open <${Object.keys(appNames).join("|")}>` }] };
      }
      return { lines: out(`Opening ${id}.`), openApp: id };
    },
  },
];

const registry = new Map(commands.map((c) => [c.name, c] as const));

export const commandNames = commands.map((c) => c.name);

/** Execute a raw input line. Only registered commands can ever run. */
export function runCommand(raw: string, ctx: TerminalContext): CommandResult {
  const parsed = parseCommand(raw);
  if (!parsed) return {};
  const def = registry.get(parsed.name);
  if (!def) {
    return {
      lines: [{ kind: "err", text: `${parsed.name}: command not found. Type 'help' to see available commands.` }],
    };
  }
  return def.run(parsed.args, ctx);
}
