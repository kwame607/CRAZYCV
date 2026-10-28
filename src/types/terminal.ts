import type { SectionId } from "@/lib/experience/actions";

export type LineKind = "cmd" | "out" | "err" | "info";

export interface TerminalLine {
  kind: LineKind;
  text: string;
  /** Renders as a "jump to" button instead of plain text. */
  go?: SectionId;
}

/**
 * What a command asks the page to do. Commands never touch the DOM, the OS or
 * the network themselves: the terminal component performs these few, fixed
 * actions on their behalf.
 */
export interface CommandResult {
  lines?: TerminalLine[];
  /** One of the page's own sections. Offered as a jump button, or scrolled to if `autoScroll`. */
  go?: SectionId;
  /** Scroll straight away (only the explicit `open` command does this). */
  autoScroll?: boolean;
  /** Download the CV PDF that ships with this site. */
  download?: "cv";
  /** Replay the intro animation. */
  replay?: boolean;
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
