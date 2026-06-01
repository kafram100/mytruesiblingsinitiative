import fs from "fs";
import path from "path";

const libDir = "lib";
const libFiles = {};

for (const f of fs.readdirSync(libDir)) {
  if (!f.endsWith(".ts") && !f.endsWith(".tsx")) continue;
  const content = fs.readFileSync(path.join(libDir, f), "utf-8");
  libFiles[f] = {
    importsDB: content.includes('@/lib/db') || content.includes('from "pg"'),
    content,
  };
}

function scanDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanDir(full));
    } else if (entry.name.endsWith(".tsx")) {
      const content = fs.readFileSync(full, "utf-8");
      if (!content.includes('"use client"')) continue;
      const imports = content.match(/from ["']@\/lib\/([^"']+)["']/g);
      if (imports) {
        for (const imp of imports) {
          const libFile = imp.match(/@\/lib\/([^"']+)/)[1];
          const candidates = [libFile, libFile + ".ts", libFile + ".tsx"];
          let found = null;
          for (const c of candidates) {
            if (libFiles[c]) { found = c; break; }
          }
          if (found && libFiles[found].importsDB) {
            const isTypeImport =
              /import\s+type\s*[\s{]/.test(content) ||
              new RegExp(`import type\\s*\\{[^}]*\\b${libFile.split(/[\/.]/)[0]}\\b`).test(content);
            results.push({
              file: full.replace(/\\/g, "/"),
              lib: found,
              isTypeImport,
            });
          }
        }
      }
    }
  }
  return results;
}

const problems = scanDir("app");
for (const p of problems) {
  console.log((p.isTypeImport ? "OK(import type): " : "FAIL(value import): ") + p.file + " -> " + p.lib);
}

const problems2 = scanDir("components");
for (const p of problems2) {
  console.log((p.isTypeImport ? "OK(import type): " : "FAIL(value import): ") + p.file + " -> " + p.lib);
}

if (problems.filter((p) => !p.isTypeImport).length === 0 && problems2.filter((p) => !p.isTypeImport).length === 0) {
  console.log("\nNo remaining value imports from db-dependent libs in client components.");
} else {
  console.log("\n** Remaining issues found above **");
}
