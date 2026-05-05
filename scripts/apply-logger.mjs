// One-shot codemod that replaces console.error/log/warn calls that take an
// `error` argument with the dev-only sanitized logger. Designed to be safe
// to re-run.
//
// Skips:
//   - src/utils/logger.js itself (it's where logError lives)
//   - src/services/tokenService.js (its console.errors are already
//     sanitized — they only print parse failures of localStorage strings,
//     never request/response payloads)
//
// We intentionally only touch console calls whose argument list ends with
// an identifier named `error`, `err`, or `e` followed by a closing paren —
// the exact shape that prints axios error objects. We don't rewrite calls
// that take only a string literal.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "src");
const LOGGER_ABS = path.resolve(SRC, "utils", "logger.js");
const SKIP = new Set([
  LOGGER_ABS,
  path.resolve(SRC, "services", "tokenService.js"),
]);

const ERROR_IDENTS = ["error", "err", "e"];
const CONSOLE_RE = new RegExp(
  String.raw`console\.(error|warn|log)\s*\(([^)]*)\)`,
  "g",
);

const isErrorArg = (argText) => {
  // Match cases like:
  //   console.error(error)
  //   console.error("X:", error)
  //   console.error(`X ${id}:`, err)
  //   console.warn("X", e)
  const trimmed = argText.trim();
  if (!trimmed) return false;
  // Last comma-separated arg, naive (good enough for these flat calls).
  const parts = [];
  let depth = 0;
  let buf = "";
  for (const ch of trimmed) {
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) parts.push(buf);
  const last = parts[parts.length - 1]?.trim();
  return ERROR_IDENTS.includes(last);
};

const computeImportPath = (fromFile) => {
  const fromDir = path.dirname(fromFile);
  let rel = path
    .relative(fromDir, LOGGER_ABS)
    .replace(/\\/g, "/")
    .replace(/\.js$/, "");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
};

const ensureImport = (source, importPath) => {
  if (/from\s+["'][^"']*\/utils\/logger["']/.test(source)) return source;
  // Insert after the last top-level import line.
  const lines = source.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s.+from\s+["'][^"']+["'];?\s*$/.test(lines[i])) {
      lastImport = i;
    } else if (lastImport !== -1 && lines[i].trim() === "") {
      // keep going past blank lines
    } else if (lastImport !== -1) {
      break;
    }
  }
  const importLine = `import { logError } from "${importPath}";`;
  if (lastImport === -1) {
    return `${importLine}\n${source}`;
  }
  lines.splice(lastImport + 1, 0, importLine);
  return lines.join("\n");
};

const transform = (source) => {
  let touched = false;
  const next = source.replace(CONSOLE_RE, (full, level, args) => {
    if (level === "log" && !isErrorArg(args)) return full;
    if (!isErrorArg(args)) return full;
    touched = true;
    return `logError(${args})`;
  });
  return { next, touched };
};

const walk = async (dir) => {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
};

const main = async () => {
  const files = await walk(SRC);
  let changed = 0;
  for (const file of files) {
    if (SKIP.has(file)) continue;
    const source = await fs.readFile(file, "utf8");
    if (!CONSOLE_RE.test(source)) continue;
    CONSOLE_RE.lastIndex = 0;
    const { next, touched } = transform(source);
    if (!touched) continue;
    const importPath = computeImportPath(file);
    const finalSource = ensureImport(next, importPath);
    await fs.writeFile(file, finalSource, "utf8");
    console.log("updated", path.relative(SRC, file));
    changed++;
  }
  console.log(`\nDone. ${changed} files modified.`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
