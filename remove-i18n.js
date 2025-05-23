function cleanFile(filePath) {
    const ext = path.extname(filePath);
    if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) return;
  
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;
  
    let replacements = 0;
  
    content = content.replace(/i18n\.t\(\s*['"]([^'"]+)['"]\s*\)/g, (_, text) => {
      replacements++;
      return `"${text}"`;
    });
  
    const importRegex = /import\s+\{\s*i18n\s*\}\s+from\s+["'][^"']+["'];?\s*\n?/g;
    const importMatches = content.match(importRegex);
    if (importMatches) {
      replacements += importMatches.length;
      content = content.replace(importRegex, "");
    }
  
    if (replacements > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Cleaned: ${filePath} with ${replacements} replacements`);
    }
  }
  
