import type { CommandDef, CommandResult, TerminalContext, TerminalLine } from "@/types/terminal";
import type { SectionId } from "@/lib/experience/actions";
import { profile, education, experience, certifications } from "@/data/profile";
import { projects } from "@/data/projects";
import { moreBuilds } from "@/data/more-builds";
import { skillGroups, skillLevel, levelLabels } from "@/data/skills";
import { assessments } from "@/data/assessments";
import { parseCommand } from "./command-parser";

const out = (...texts: string[]): TerminalLine[] => texts.map((text) => ({ kind: "out", text }));
const err = (text: string): TerminalLine[] => [{ kind: "err", text }];

/** Names a visitor can type after `open`. Each maps to a real section of this page. */
const sectionNames: Record<string, SectionId> = {
  home: "hero",
  hero: "hero",
  work: "work",
  projects: "work",
  about: "about",
  skills: "skills",
  security: "security",
  terminal: "terminal",
  system: "system",
  journey: "journey",
  experience: "journey",
  cv: "journey",
  contact: "contact",
};

const timelineLine = (e: { title: string; org: string; period?: string }) => [e.title, e.org, e.period].filter(Boolean).join(", ");

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
    description: "Short profile, then jump to About",
    run: () => ({ lines: out(profile.summary), go: "about" }),
  },
  {
    name: "projects",
    description: "List projects. 'projects <name>' shows one",
    run: (args) => {
      const q = (args[0] ?? "").toLowerCase();
      if (q) {
        const p = projects.find((x) => x.slug === q || x.slug.startsWith(q) || x.title.toLowerCase().includes(q));
        if (!p) return { lines: err(`No project matches '${q}'. Type 'projects' to list them.`) };
        return {
          lines: [
            ...out(p.title, p.tagline, `Status: ${p.status}`, "", p.overview, "", "Features:"),
            ...out(...p.featuresVerified.map((f) => `  - ${f}`)),
            ...out("", "Technologies:"),
            ...out(...p.technologiesVerified.map((t) => `  - ${t}`)),
            ...(p.links.length ? out("", ...p.links.map((l) => `${l.label}: ${l.href}`)) : []),
          ],
        };
      }
      return {
        lines: [
          ...out("Projects (type 'projects <name>' for details):"),
          ...projects.map((p) => ({ kind: "out" as const, text: `  ${p.slug.padEnd(22)} ${p.title}` })),
          ...out("", "Also built (from the CV):", ...moreBuilds.map((b) => `  ${b.title}`)),
        ],
        go: "work",
      };
    },
  },
  {
    name: "skills",
    description: "Skills, with how much evidence backs each",
    run: () => ({
      lines: [
        ...skillGroups.flatMap((g) => out(`${g.title}: ${g.skills.map((s) => `${s.name} [${skillLevel(s)}]`).join(", ")}`)),
        ...out("", ...(Object.entries(levelLabels) as [string, { label: string; meaning: string }][]).map(([k, v]) => `[${k}] ${v.label}: ${v.meaning}`)),
      ],
      go: "skills",
    }),
  },
  {
    name: "experience",
    description: "Work experience",
    run: () => ({ lines: experience.flatMap((e) => out(timelineLine(e), `  ${e.detail}`)), go: "journey" }),
  },
  {
    name: "education",
    description: "Education and certifications",
    run: () => ({
      lines: [
        ...education.flatMap((e) => out(timelineLine(e), `  ${e.detail}`)),
        ...certifications.flatMap((e) => out(`Certificate: ${e.title}, ${e.org}`)),
      ],
      go: "journey",
    }),
  },
  {
    name: "security",
    description: "What is real, what is simulated, and what is published",
    run: () => {
      const real = assessments.filter((a) => !a.sample).length;
      return {
        lines: out(
          "Security work on this site is labelled REAL or SIMULATED.",
          `Published real assessments: ${real}.`,
          real === 0 ? "None yet. The assessment record on the Security Lab page is an illustrative sample, not a result." : "",
          "The port-scan demo is a SIMULATION against reserved documentation addresses (RFC 5737).",
          "Nothing on this site scans any third-party host.",
        ).filter((l) => l.text !== ""),
        go: "security",
      };
    },
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
              return [
                { kind: "out", text: `Public IP: ${ip}` },
                { kind: "info", text: "VPNs, proxies and carrier NAT can change this. It is not stored." },
              ];
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
    name: "system",
    description: "Browser and system overview, then jump to it",
    run: (_a, ctx) => ({ lines: out(...ctx.systemLines()), go: "system" }),
  },
  {
    name: "browser",
    description: "Detected browser details",
    run: (_a, ctx) => ({ lines: out(...ctx.browserLines()) }),
  },
  {
    name: "cv",
    description: "CV summary. 'cv download' saves the PDF",
    run: (args) => {
      if (args[0] === "download") return { lines: out("Downloading Kwame-Emmanuel-Adom-CV.pdf"), download: "cv" };
      return {
        lines: out(`${profile.name}, ${profile.roles[0]}`, ...experience.map(timelineLine).map((l) => `  ${l}`), "", "Type 'cv download' to save the PDF."),
        go: "journey",
      };
    },
  },
  {
    name: "contact",
    description: "How to reach me",
    run: () => ({
      lines: out(
        `Email:    ${profile.email ?? "not configured yet"}`,
        `WhatsApp: ${profile.whatsapp.display}`,
        `LinkedIn: ${profile.linkedin ?? "not configured yet"}`,
        `GitHub:   ${profile.github ?? "not configured yet"}`,
        `Website:  ${profile.website}`,
        `Based in: ${profile.location}`,
      ),
      go: "contact",
    }),
  },
  {
    name: "github",
    description: "GitHub profile",
    run: () => ({ lines: profile.github ? out(profile.github) : err("GitHub link is not configured yet.") }),
  },
  {
    name: "open",
    description: "open <section>: scroll to a section of this page",
    run: (args) => {
      const id = sectionNames[(args[0] ?? "").toLowerCase()];
      if (!id) return { lines: err(`Usage: open <${Object.keys(sectionNames).join("|")}>`) };
      return { lines: out(`Opening ${id}.`), go: id, autoScroll: true };
    },
  },
  {
    name: "replay",
    description: "Replay the opening animation",
    run: () => ({ lines: out("Replaying the intro."), replay: true }),
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
      lines: err(`${parsed.name}: command not found. Type 'help' to see available commands.`),
    };
  }
  return def.run(parsed.args, ctx);
}
