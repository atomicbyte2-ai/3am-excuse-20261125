import * as fs from "node:fs";
import * as path from "node:path";

// The entry: one line, in the voice of a hardware wallet that refuses
// to sign at 3 AM. The hour is the joke — the wallet is not being
// difficult, it is protecting a sleep-deprived human from themself.
const ENTRY =
  "It's 3 AM — I don't sign for sleep-deprived humans. Your 'genius' trade can wait until your brain wakes up.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error(`entry must be 1-199 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // No control characters at all — tabs included. A one-liner should
  // contain only printable text and ordinary spaces.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("entry contains a control character");
    }
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const outFile = path.join(outDir, "entry.txt");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, ENTRY, "utf8");
  // Read it back and confirm the file on disk is byte-exact: no
  // trailing newline, no surprise encoding, exactly the validated line.
  const written = fs.readFileSync(outFile, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt on disk does not match the validated entry");
  }
  console.log(`Wrote entry.txt (${ENTRY.length} characters)`);
}

main();
