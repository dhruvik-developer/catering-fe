import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const fontsDir = path.join(projectRoot, "src", "assets", "fonts");
const outputDir = path.join(fontsDir, "base64");

const FONT_FILES = [
  "NotoSansDevanagari-Variable.ttf",
  "NotoSansGujarati-Variable.ttf",
];

fs.mkdirSync(outputDir, { recursive: true });

FONT_FILES.forEach((fontFileName) => {
  const fontPath = path.join(fontsDir, fontFileName);
  if (!fs.existsSync(fontPath)) {
    throw new Error(
      `Missing font file: ${fontPath}. Download/place the TTF before running conversion.`
    );
  }

  const base64 = fs.readFileSync(fontPath).toString("base64");
  const outFileName = `${fontFileName.replace(".ttf", "")}.base64.js`;
  const outPath = path.join(outputDir, outFileName);

  const fileContents = `// AUTO-GENERATED FILE. DO NOT EDIT.\n// Run: npm run fonts:pdf\nexport default "${base64}";\n`;
  fs.writeFileSync(outPath, fileContents, "utf8");
  console.log(`Generated ${path.relative(projectRoot, outPath)}`);
});
