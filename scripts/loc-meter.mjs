#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { basename, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".php"]);
const ROOTS = ["apps/", "packages/", "jobs/", "wordpress/"];
const CONTROL = new Set(["if", "for", "while", "switch", "catch", "with"]);
const REGEX_WORDS = new Set([
  "return", "throw", "case", "typeof", "void", "delete", "await", "yield", "else", "do", "in", "of",
]);
const BAR = 16;
const CATEGORIES = ["tests", "config", "css", "recipe-data", "docs", "mockup", "tooling"];

export function statusFor(used, budget) {
  if (used > budget) return "RED";
  if (budget <= 0) return "GREEN";
  if (used / budget >= 0.8) return "YELLOW";
  return "GREEN";
}

export function bar(used, budget, width = BAR) {
  const ratio = budget <= 0 ? (used > 0 ? 1 : 0) : used / budget;
  const filled = Math.max(0, Math.min(width, Math.round(ratio * width)));
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export function matchGlob(glob, file) {
  const body = glob
    .split("**")
    .map((part) => part.split("*").map(escapeRegExp).join("[^/]*"))
    .join(".*");
  return new RegExp(`^${body}$`).test(file);
}

export function classify(filePath) {
  const path = filePath.replaceAll("\\", "/");
  if (path.startsWith("docs/design/sidebar-mockup/")) return "mockup";
  if (path.startsWith("docs/") || path.startsWith(".cursor/") || path.endsWith(".md")) return "docs";
  if (path.startsWith("prototype/")) return "prototype";
  if (isTest(path)) return "tests";
  if (path.startsWith("scripts/")) return "tooling";
  if (path.endsWith(".css")) return "css";
  if (isLockfile(path)) return "lockfiles";
  if (isConfig(path)) return "config";
  if (path.endsWith(".json") || isTemplate(path)) return "recipe-data";
  if (ROOTS.some((root) => path.startsWith(root)) && SOURCE_EXT.has(extname(path))) return "product";
  return "other";
}

export function analyze(source, ext) {
  const masked = mask(source, ext === ".php");
  const code = masked.split("\n").map((line) => line.trim() !== "");
  return { lines: code.filter(Boolean).length, functions: findFunctions(masked, code) };
}

export function evaluate(files, budget, baseFiles = null) {
  const modules = budget.modules.map((mod) => ({ ...mod, used: 0, base: 0 }));
  const categories = emptyCategories();
  const violations = [];
  const sum = budget.modules.reduce((total, mod) => total + mod.budget, 0);
  if (sum !== budget.total) {
    violations.push(`Module budgets sum to ${sum}, total is ${budget.total}`);
  }

  const current = tally(files, modules, categories, budget, violations, "used");
  const base = baseFiles ? tally(baseFiles, modules, categories, budget, [], "base") : null;
  const used = current.product + current.unassignedLines;
  const baseUsed = base ? base.product + base.unassignedLines : 0;
  if (used > budget.total) violations.push(`Total ${used}/${budget.total}`);

  return {
    modules,
    categories,
    violations,
    total: { used, budget: budget.total, base: baseUsed },
    showDelta: baseFiles !== null,
  };
}

export function formatReport(result, color = false) {
  const showDelta = result.showDelta;
  const header = ["Module", "Used", "Budget", ...(showDelta ? ["Delta"] : []), "%", "Status", "Bar"];
  const rows = result.modules.map((mod) => row(mod.id, mod.used, mod.budget, showDelta ? mod.used - mod.base : null));
  rows.push(row("TOTAL", result.total.used, result.total.budget, showDelta ? result.total.used - result.total.base : null));
  const widths = header.map((label, index) =>
    Math.max(label.length, ...rows.map((cells) => cells[index].length)),
  );
  const lines = [
    `Pandino line budget · phases 0-1 · ${result.total.budget} lines`,
    "",
    "GREEN under 80% · YELLOW 80-100% · RED over",
    "",
    align(header, widths, false),
    widths.map((width) => "-".repeat(width)).join("  "),
  ];
  for (const cells of rows) lines.push(align(cells, widths, color));

  lines.push("", "Not counted (non-blank lines)");
  const catHeader = ["Category", "Lines", ...(showDelta ? ["Delta"] : []), "Files"];
  const catRows = categoryRows(result.categories, showDelta);
  const catWidths = catHeader.map((label, index) =>
    Math.max(label.length, ...catRows.map((cells) => cells[index].length)),
  );
  lines.push(align(catHeader, catWidths, false));
  lines.push(catWidths.map((width) => "-".repeat(width)).join("  "));
  for (const cells of catRows) lines.push(align(cells, catWidths, false));

  if (result.violations.length) {
    lines.push("", "Over budget");
    for (const violation of result.violations) lines.push(violation);
  }
  lines.push("", result.violations.length ? "Result: over budget" : "Result: within budget");
  return lines.join("\n");
}

function categoryRows(categories, showDelta) {
  const names = [...CATEGORIES];
  for (const name of Object.keys(categories)) {
    if (!names.includes(name) && (categories[name].lines > 0 || categories[name].base > 0)) names.push(name);
  }
  return names.map((name) => {
    const cat = categories[name];
    const cells = [name, String(cat.lines)];
    if (showDelta) cells.push(formatDelta(cat.lines - cat.base));
    cells.push(String(cat.files));
    return cells;
  });
}

function row(id, used, budget, delta) {
  const status = statusFor(used, budget);
  const cells = [id, String(used), String(budget)];
  if (delta !== null) cells.push(formatDelta(delta));
    cells.push(percent(used, budget), status, bar(used, budget));
  return cells;
}

function align(cells, widths, color) {
  return cells
    .map((cell, index) => {
      const padded = index === 0 ? cell.padEnd(widths[index]) : cell.padStart(widths[index]);
      if (color && (cell === "GREEN" || cell === "YELLOW" || cell === "RED")) return padded.replace(cell, paint(cell, true));
      return padded;
    })
    .join("  ");
}

function percent(used, budget) {
  if (budget <= 0) return used > 0 ? "100%" : "0%";
  return `${Math.round((used / budget) * 100)}%`;
}

function formatDelta(delta) {
  return delta > 0 ? `+${delta}` : String(delta);
}

function paint(status, color) {
  if (!color) return status;
  const code = status === "GREEN" ? 32 : status === "YELLOW" ? 33 : 31;
  return `\x1b[${code}m${status}\x1b[0m`;
}

function emptyCategories() {
  const categories = {};
  for (const name of [...CATEGORIES, "lockfiles", "prototype", "other"]) {
    categories[name] = { lines: 0, base: 0, files: 0 };
  }
  return categories;
}

function tally(files, modules, categories, budget, violations, slot) {
  let product = 0;
  let unassignedLines = 0;
  for (const file of files) {
    const kind = classify(file.path);
    if (kind !== "product") {
      const cat = categories[kind] ?? (categories[kind] = { lines: 0, base: 0, files: 0 });
      cat[slot === "base" ? "base" : "lines"] += nonBlank(file.text);
      if (slot === "used") cat.files += 1;
      if (slot === "used" && kind === "other" && SOURCE_EXT.has(extname(file.path))) {
        violations.push(`Uncounted source file ${file.path} is outside apps, packages, jobs, and wordpress`);
      }
      continue;
    }
    const hits = modules.filter((mod) => mod.paths.some((glob) => matchGlob(glob, file.path)));
    const stats = analyze(file.text, extname(file.path));
    if (hits.length !== 1) {
      unassignedLines += stats.lines;
      if (slot === "used") {
        const why = hits.length === 0 ? "no module" : "more than one module";
        violations.push(`${file.path} matches ${why} (${stats.lines} lines)`);
      }
      continue;
    }
    hits[0][slot] += stats.lines;
    product += stats.lines;
    if (slot !== "used") continue;
    if (stats.lines > budget.caps.perFile) {
      violations.push(`File cap ${file.path} ${stats.lines}/${budget.caps.perFile}`);
    }
    for (const fn of stats.functions) {
      if (fn.lines > budget.caps.perFunction) {
        violations.push(`Function cap ${file.path}:${fn.line} ${fn.name} ${fn.lines}/${budget.caps.perFunction}`);
      }
    }
  }
  for (const mod of modules) {
    if (slot === "used" && mod.used > mod.budget) violations.push(`Module ${mod.id} ${mod.used}/${mod.budget}`);
  }
  return { product, unassignedLines };
}

function nonBlank(text) {
  return text.split("\n").filter((line) => line.trim() !== "").length;
}

function isTest(path) {
  return /\.(test|spec)\.[^.]+$/.test(path) || path.includes("/__tests__/");
}

function isLockfile(path) {
  return ["pnpm-lock.yaml", "package-lock.json", "yarn.lock"].includes(basename(path));
}

function isConfig(path) {
  const base = basename(path);
  if (["package.json", "loc-budget.json", "turbo.json", "pnpm-workspace.yaml", ".gitignore", ".npmrc"].includes(base)) {
    return true;
  }
  if (base.startsWith("tsconfig") && base.endsWith(".json")) return true;
  if (base.includes(".config.")) return true;
  if (base === "next-env.d.ts") return true;
  return path.startsWith(".github/");
}

function isTemplate(path) {
  return /\.(html|wxr)$/.test(path) && (path.startsWith("packages/") || path.startsWith("wordpress/"));
}

function escapeRegExp(value) {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function mask(source, php) {
  const out = [];
  let i = 0;
  let mode = "code";
  const resume = [];
  const exprAt = [];
  let brace = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (mode === "line") {
      out.push(c === "\n" ? "\n" : " ");
      if (c === "\n") mode = resume.pop() ?? "code";
      i++;
      continue;
    }
    if (mode === "block") {
      if (c === "*" && next === "/") {
        out.push(" ", " ");
        mode = resume.pop() ?? "code";
        i += 2;
        continue;
      }
      out.push(c === "\n" ? "\n" : " ");
      i++;
      continue;
    }
    if (mode === "sq" || mode === "dq" || mode === "tmpl") {
      if (c === "\\") {
        out.push(" ", source[i + 1] === "\n" ? "\n" : " ");
        i += 2;
        continue;
      }
      if ((mode === "sq" && c === "'") || (mode === "dq" && c === '"') || (mode === "tmpl" && c === "`")) {
        out.push(c);
        mode = resume.pop() ?? "code";
        i++;
        continue;
      }
      if (mode === "tmpl" && c === "$" && next === "{") {
        exprAt.push(brace);
        out.push("$", "{");
        brace++;
        mode = "code";
        i += 2;
        continue;
      }
      out.push(c === "\n" ? "\n" : " ");
      i++;
      continue;
    }
    if (c === "/" && next === "/") {
      resume.push(mode);
      mode = "line";
      out.push(" ", " ");
      i += 2;
      continue;
    }
    if (c === "/" && next === "*") {
      resume.push(mode);
      mode = "block";
      out.push(" ", " ");
      i += 2;
      continue;
    }
    if (php && c === "#") {
      resume.push(mode);
      mode = "line";
      out.push(" ");
      i++;
      continue;
    }
    if (c === "'" || c === '"' || (!php && c === "`")) {
      resume.push(mode);
      mode = c === "'" ? "sq" : c === '"' ? "dq" : "tmpl";
      out.push(c);
      i++;
      continue;
    }
    if (!php && c === "/" && regexStarts(out)) {
      const end = maskRegex(source, i, out);
      if (end > i) {
        i = end;
        continue;
      }
    }
    if (c === "{") brace++;
    if (c === "}") {
      if (brace > 0) brace--;
      if (exprAt.length > 0 && brace === exprAt.at(-1)) {
        exprAt.pop();
        mode = "tmpl";
      }
    }
    out.push(c);
    i++;
  }
  return out.join("");
}

function regexStarts(out) {
  let i = out.length - 1;
  while (i >= 0 && /\s/.test(out[i])) i--;
  if (i < 0) return true;
  const end = i;
  while (i >= 0 && /[A-Za-z0-9_$]/.test(out[i])) i--;
  const word = out.slice(i + 1, end + 1).join("");
  if (REGEX_WORDS.has(word)) return true;
  return "([{:;,=!?&|+-*%~^<>".includes(out[end]);
}

function maskRegex(source, start, out) {
  const saved = out.length;
  let i = start + 1;
  let inClass = false;
  while (i < source.length) {
    const c = source[i];
    if (c === "\\") {
      out.push(" ", " ");
      i += 2;
      continue;
    }
    if (c === "[") inClass = true;
    else if (c === "]") inClass = false;
    else if (c === "/" && !inClass) {
      out.push(" ");
      i++;
      while (i < source.length && /[a-z]/i.test(source[i])) {
        out.push(" ");
        i++;
      }
      return i;
    }
    if (c === "\n") {
      out.length = saved;
      return start;
    }
    out.push(" ");
    i++;
  }
  out.length = saved;
  return start;
}

function findFunctions(masked, code) {
  const functions = [];
  const stack = [];
  const scheduled = [];
  const parens = [];
  let depth = 0;
  let parenDepth = 0;
  let line = 1;
  let i = 0;
  while (i < masked.length) {
    const c = masked[i];
    if (c === "\n") {
      line++;
      i++;
      continue;
    }
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[A-Za-z0-9_$]/.test(c)) {
      i++;
      continue;
    }
    if (c === "(") {
      parens.push({ line, word: wordBefore(masked, i) });
      parenDepth++;
      i++;
      continue;
    }
    if (c === ")") {
      parenDepth--;
      const opened = parens.pop();
      if (opened && parenDepth === 0 && !CONTROL.has(opened.word)) {
        const at = bodyBrace(masked, i);
        if (at >= 0) scheduled.push({ at, start: opened.line, name: functionName(opened.word) });
      }
      i++;
      continue;
    }
    if (c === "=" && masked[i + 1] === ">") {
      let j = i + 2;
      while (j < masked.length && /\s/.test(masked[j])) j++;
      if (masked[j] === "{") {
        const close = previousClose(masked, i);
        scheduled.push({
          at: j,
          start: close ? close.line : line,
          name: arrowName(masked, i),
        });
      }
      i += 2;
      continue;
    }
    if (c === "{") {
      const start = scheduled.find((item) => item.at === i);
      if (start) stack.push({ depth, start: start.start, name: start.name });
      depth++;
      i++;
      continue;
    }
    if (c === "}") {
      depth--;
      if (stack.length && stack.at(-1).depth === depth) {
        const fn = stack.pop();
        functions.push({ name: fn.name, line: fn.start, lines: countCode(code, fn.start, line) });
      }
      i++;
      continue;
    }
    i++;
  }
  return functions;
}

function wordBefore(source, index) {
  let j = index - 1;
  while (j >= 0 && /\s/.test(source[j])) j--;
  const end = j;
  while (j >= 0 && /[A-Za-z0-9_$]/.test(source[j])) j--;
  return source.slice(j + 1, end + 1);
}

function functionName(word) {
  return word && word !== "function" ? word : "anonymous";
}

function bodyBrace(source, parenEnd) {
  let j = parenEnd + 1;
  while (j < source.length && /\s/.test(source[j])) j++;
  if (source[j] === "{") return j;
  if (source[j] !== ":") return -1;
  j++;
  let angle = 0;
  let curly = 0;
  let paren = 0;
  let bracket = 0;
  while (j < source.length) {
    const c = source[j];
    if (/\s/.test(c)) {
      j++;
      continue;
    }
    const depth = angle + curly + paren + bracket;
    if (c === "{") {
      const prev = previousChar(source, j);
      if (depth === 0 && prev && /[\w$>\])}]/.test(prev)) return j;
      curly++;
    } else if (c === "}" && curly) curly--;
    else if (c === "<") angle++;
    else if (c === ">" && angle) angle--;
    else if (c === "(") paren++;
    else if (c === ")" && paren) paren--;
    else if (c === "[") bracket++;
    else if (c === "]" && bracket) bracket--;
    else if (depth === 0 && c === "=" && source[j + 1] === ">") j++;
    else if (depth === 0 && (c === "=" || c === ";")) return -1;
    j++;
  }
  return -1;
}

function previousChar(source, index) {
  let j = index - 1;
  while (j >= 0 && /\s/.test(source[j])) j--;
  return j >= 0 ? source[j] : "";
}

function previousClose(source, index) {
  let j = index - 1;
  while (j >= 0 && /\s/.test(source[j])) j--;
  if (source[j] !== ")") return null;
  let line = 1;
  for (let k = 0; k < j; k++) if (source[k] === "\n") line++;
  return { index: j, line, word: wordBefore(source, j) };
}

function arrowName(source, eq) {
  const close = previousClose(source, eq);
  const from = close ? close.index : eq;
  const name = wordBefore(source, from);
  if (name && !["function", "async"].includes(name)) return name;
  return close?.word && close.word !== "function" ? close.word : "arrow";
}

function countCode(code, start, end) {
  let count = 0;
  for (let line = start; line <= end; line++) if (code[line - 1]) count++;
  return count;
}

function git(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error((result.stderr || `git ${args.join(" ")} failed`).trim());
  return result.stdout;
}

function readText(path) {
  const bytes = readFileSync(path);
  if (bytes.includes(0)) return null;
  return bytes.toString("utf8");
}

function listWorking(root) {
  const listed = `${git(["ls-files", "-z"], root)}${git(["ls-files", "--others", "--exclude-standard", "-z"], root)}`;
  return [...new Set(listed.split("\0").filter(Boolean))].map((path) => {
    const text = readText(`${root}/${path}`);
    return text === null ? null : { path, text };
  }).filter(Boolean);
}

function listRef(root, ref) {
  return git(["ls-tree", "-r", "--name-only", ref], root)
    .split("\n")
    .filter(Boolean)
    .map((path) => {
      const text = git(["show", `${ref}:${path}`], root);
      return text.includes("\0") ? null : { path, text };
    })
    .filter(Boolean);
}

function loadBudget(root) {
  const budget = JSON.parse(readFileSync(`${root}/loc-budget.json`, "utf8"));
  if (!Array.isArray(budget.modules) || typeof budget.total !== "number") {
    throw new Error("loc-budget.json needs a total and a modules array");
  }
  if (typeof budget.caps?.perFile !== "number" || typeof budget.caps?.perFunction !== "number") {
    throw new Error("loc-budget.json needs caps.perFile and caps.perFunction");
  }
  return budget;
}

function parseArgs(argv) {
  let base = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base") {
      base = argv[++i];
      if (!base) throw new Error("--base needs a git ref");
    } else if (argv[i] === "--help") {
      return { help: true };
    } else {
      throw new Error(`Unknown argument ${argv[i]}`);
    }
  }
  return { base };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log("Usage: node scripts/loc-meter.mjs [--base <git-ref>]");
    return 0;
  }
  const root = git(["rev-parse", "--show-toplevel"]).trim();
  const budget = loadBudget(root);
  const result = evaluate(listWorking(root), budget, options.base ? listRef(root, options.base) : null);
  console.log(formatReport(result, Boolean(process.stdout.isTTY)));
  return result.violations.length ? 1 : 0;
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : "";
if (entry === pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href) {
  try {
    process.exit(main());
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}
