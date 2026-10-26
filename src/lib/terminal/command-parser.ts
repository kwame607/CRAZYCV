export const MAX_INPUT_LENGTH = 200;

export interface ParsedCommand {
  name: string;
  args: string[];
}

/**
 * Turns raw input into a command name and arguments. The result is only ever
 * used as a key into a fixed registry. It is never passed to a shell,
 * interpreter, filesystem call or network request.
 */
export function parseCommand(raw: string): ParsedCommand | null {
  // Drop control characters, cap length, collapse whitespace.
  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .slice(0, MAX_INPUT_LENGTH)
    .trim();
  if (!cleaned) return null;
  const [name, ...args] = cleaned.split(/\s+/);
  return { name: (name ?? "").toLowerCase(), args };
}
