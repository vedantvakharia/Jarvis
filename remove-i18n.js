const fs = require("fs");
const path = require("path");

const targetDir = "./source/quartz"; // Path to the Quartz source directory

// Recursively walk through all directories and files
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

// Process each file
function cleanFile(filePath) {
  const ext = path.extname(filePath);
  if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) return;

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // Replace i18n.t("text") or i18n.t('text') → "text"
  content = content.replace(/i18n\.t\(\s*['"]([^'"]+)['"]\s*\)/g, (_, text) => `"${text}"`);

  // Remove import { i18n } from "...";
  content = content.replace(/import\s+\{\s*i18n\s*\}\s+from\s+["'][^"']+["'];?\s*\n?/g, "");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log("Cleaned:", filePath);
  }
}

// Run the script
walkDir(targetDir, cleanFile);

console.log("✅ All i18n.t() calls and imports removed.");
