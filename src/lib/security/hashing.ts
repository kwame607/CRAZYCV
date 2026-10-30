/**
 * A teaching demo of why password storage uses salts. SHA-256 is used because
 * the browser provides it; real systems should use a deliberately slow
 * password hash such as Argon2, scrypt or bcrypt. Nothing leaves the browser.
 */

const encoder = new TextEncoder();

const toHex = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export async function sha256Hex(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("This browser does not provide the Web Crypto API.");
  return toHex(await subtle.digest("SHA-256", encoder.encode(text)));
}

export function randomSaltHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const saltedHash = (saltHex: string, password: string): Promise<string> => sha256Hex(`${saltHex}:${password}`);

/** A very short list of well-known weak passwords, enough to show how a lookup table works. */
export const commonPasswords = ["123456", "password", "12345678", "qwerty", "123456789", "111111", "letmein", "admin", "welcome", "iloveyou"] as const;

let table: Promise<Map<string, string>> | null = null;

/** Hashes of the common passwords with no salt, built once. This is the "lookup table" an attacker could precompute. */
export function lookupTable(): Promise<Map<string, string>> {
  table ??= Promise.all(commonPasswords.map(async (p) => [await sha256Hex(p), p] as const)).then((e) => new Map(e));
  return table;
}

export async function reverseFromTable(hashHex: string): Promise<string | null> {
  return (await lookupTable()).get(hashHex) ?? null;
}
