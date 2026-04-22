import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT_DIR = process.cwd();
const TARGET_DIR = join(ROOT_DIR, "src");
const FILE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
]);

const CLASS_ATTR_REGEX = /className\s*=\s*(?:"([^"]*)"|'([^']*)'|`([\s\S]*?)`)/g;
const PRIMARY_BG_TOKEN_REGEX = /(?:^|\s)bg-\[var\(--color-primary\)\](?:\s|$)/;
const PRIMARY_GRADIENT_FROM_TOKEN_REGEX =
  /(?:^|\s)from-\[var\(--color-primary\)\](?:\s|$)/;
const PRIMARY_GRADIENT_TO_TOKEN_REGEX =
  /(?:^|\s)to-\[var\(--color-primary\)\](?:\s|$)/;
const HARDCODED_HOVER_BG_REGEX =
  /hover:bg-\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/;
const HARDCODED_HOVER_FROM_REGEX =
  /hover:from-\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/;
const HARDCODED_HOVER_TO_REGEX =
  /hover:to-\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/;

function walkFiles(dirPath, fileList = []) {
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkFiles(fullPath, fileList);
      continue;
    }

    const dotIndex = entry.lastIndexOf(".");
    const ext = dotIndex >= 0 ? entry.slice(dotIndex) : "";

    if (FILE_EXTENSIONS.has(ext)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

const violations = [];
const files = walkFiles(TARGET_DIR);

for (const filePath of files) {
  const content = readFileSync(filePath, "utf8");
  let match;

  while ((match = CLASS_ATTR_REGEX.exec(content)) !== null) {
    const classValue = match[1] ?? match[2] ?? match[3] ?? "";
    const hasPrimaryBgMismatch =
      PRIMARY_BG_TOKEN_REGEX.test(classValue) &&
      HARDCODED_HOVER_BG_REGEX.test(classValue);
    const hasPrimaryFromMismatch =
      PRIMARY_GRADIENT_FROM_TOKEN_REGEX.test(classValue) &&
      HARDCODED_HOVER_FROM_REGEX.test(classValue);
    const hasPrimaryToMismatch =
      PRIMARY_GRADIENT_TO_TOKEN_REGEX.test(classValue) &&
      HARDCODED_HOVER_TO_REGEX.test(classValue);

    if (!hasPrimaryBgMismatch && !hasPrimaryFromMismatch && !hasPrimaryToMismatch) {
      continue;
    }

    const line = getLineNumber(content, match.index);
    violations.push({
      file: relative(ROOT_DIR, filePath),
      line,
      classValue: classValue.replace(/\s+/g, " ").trim(),
    });
  }
}

if (violations.length > 0) {
  console.error(
    "Theme mismatch found: avoid hardcoded hover color when using var(--color-primary)."
  );
  console.error("");

  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} -> ${violation.classValue}`
    );
  }

  console.error("");
  console.error(
    "Fix: replace hardcoded hover hex with theme-safe utility like hover:brightness-95."
  );
  process.exit(1);
}

console.log("Theme hover check passed.");
