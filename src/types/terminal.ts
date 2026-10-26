export type AppId =
  | "home"
  | "projects"
  | "terminal"
  | "system"
  | "security-lab"
  | "network-tools"
  | "skills"
  | "cv"
  | "about"
  | "contact";

export type LineKind = "cmd" | "out" | "err" | "info";

export interface TerminalLine {
  kind: LineKind;
  text: string;
}

/** What a command wants the shell to do. Commands never touch the DOM or OS directly. */
export interface CommandResult {
  lines?: TerminalLine[];
  openApp?: AppId;
  clear?: boolean;
  /** Async follow-up, e.g. user-requested IP lookup. Returns more lines. */
  deferred?: () => Promise<TerminalLine[]>;
}

export interface TerminalContext {
  /** Plain-text system report lines built from data the browser already exposed. */
  systemLines: () => string[];
  browserLines: () => string[];
  networkLines: () => string[];
  requestIp: () => Promise<string>;
}

export interface CommandDef {
  name: string;
  description: string;
  run: (args: string[], ctx: TerminalContext) => CommandResult;
}
