#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".php"]);
const ROOTS = ["apps/", "packages/", "jobs/", "wordpress/"];
const FLOW = new Set(["if", "for", "while", "switch", "catch", "with"]);
const CATS = ["tests", "config", "css", "recipe-data", "docs", "mockup", "lockfiles", "prototype", "other"];
const CONFIG = new Set([".gitignore", "package.json", "loc-budget.json", "turbo.json", "pnpm-workspace.yaml", "next-env.d.ts"]);

export function statusFor(used, budget) {
  if (used > budget) return "RED";
  return budget > 0 && used / budget >= 0.8 ? "YELLOW" : "GREEN";
}

export function bar(used, budget, width = 16) {
  const n = Math.min(width, Math.max(0, Math.round((budget > 0 ? used / budget : used ? 1 : 0) * width)));
  return `${"█".repeat(n)}${"░".repeat(width - n)}`;
}

export function matchGlob(glob, file) {
  const body = glob.split("**").map((part) => part.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", "[^/]*")).join(".*");
  return new RegExp(`^${body}$`).test(file);
}

export function classify(file) {
  const path = file.replaceAll("\\", "/");
  const base = basename(path);
  if (path.startsWith("docs/design/sidebar-mockup/")) return "mockup";
  if (path.startsWith("docs/") || path.startsWith(".cursor/") || path.endsWith(".md")) return "docs";
  if (path.startsWith("prototype/")) return "prototype";
  if (/\.(test|spec)\.[^.]+$/.test(path) || path.includes("/__tests__/")) return "tests";
  if (path.endsWith(".css")) return "css";
  if (["pnpm-lock.yaml", "package-lock.json", "yarn.lock"].includes(base)) return "lockfiles";
  if (base.includes(".config.") || /^tsconfig.*\.json$/.test(base) || path.startsWith(".github/") || CONFIG.has(base)) return "config";
  if (path.endsWith(".json") || (/\.(html|wxr)$/.test(path) && /^(packages|wordpress)\//.test(path))) return "recipe-data";
  if (ROOTS.some((root) => path.startsWith(root)) && EXT.has(extname(path))) return "product";
  return path.startsWith("scripts/") ? "tooling" : "other";
}

export function analyze(source) {
  let out = "", mode = "c";
  for (let i = 0; i < source.length; i++) {
    const c = source[i], n = source[i + 1] ?? "";
    if (mode === "l") { if (c === "\n") { mode = "c"; out += "\n"; } continue; }
    if (mode === "b") { if (c === "*" && n === "/") { mode = "c"; i++; } else if (c === "\n") out += "\n"; continue; }
    if (mode !== "c") { if (c === "\\") i++; else if (c === mode) mode = "c"; else if (c === "\n") out += "\n"; continue; }
    if (c === "/" && (n === "/" || n === "*")) { mode = n === "/" ? "l" : "b"; i++; continue; }
    if (c === "#") { mode = "l"; continue; }
    if ("'\"`".includes(c)) { mode = c; continue; }
    out += c;
  }
  const live = out.split("\n").map((line) => line.trim() !== "");
  const fns = [], stack = [];
  let depth = 0, at = 0;
  for (let i = 0; i < out.length; i++) {
    const c = out[i];
    if (c === "\n") at++;
    else if (c === "{") { const name = fnName(out, i); if (name) stack.push([depth, at, name]); depth++; }
    else if (c === "}") {
      depth--;
      if (stack.at(-1)?.[0] === depth) {
        const fn = stack.pop();
        fns.push({ name: fn[2], line: fn[1] + 1, lines: live.slice(fn[1], at + 1).filter(Boolean).length });
      }
    }
  }
  return { lines: live.filter(Boolean).length, functions: fns };
}

function fnName(src, brace) {
  let j = brace;
  while (--j >= 0 && /\s/.test(src[j]));
  if (src[j] === ">" && src[j - 1] === "=") return ident(src, j - 1) || "arrow";
  while (j >= 0 && src[j] !== ")") { if ("({};".includes(src[j])) return ""; j--; }
  if (src[j] !== ")") return "";
  let depth = 1;
  while (--j >= 0 && depth) depth += src[j] === ")" ? 1 : src[j] === "(" ? -1 : 0;
  const name = ident(src, j + 1);
  return FLOW.has(name) ? "" : name && name !== "function" ? name : "anonymous";
}

function ident(src, index) {
  let j = index;
  while (--j >= 0 && /\s/.test(src[j]));
  const end = j;
  while (j >= 0 && /[\w$]/.test(src[j])) j--;
  return src.slice(j + 1, end + 1);
}

export function evaluate(files, budget, baseFiles = null) {
  const violations = [];
  const modules = budget.modules.map((mod) => ({ ...mod, used: 0, base: 0 }));
  const tooling = { budget: budget.tooling?.budget ?? 0, paths: budget.tooling?.paths ?? [], used: 0, base: 0 };
  const categories = Object.fromEntries(CATS.map((name) => [name, { lines: 0, base: 0, files: 0 }]));
  const sum = modules.reduce((total, mod) => total + mod.budget, 0);
  if (sum !== budget.total) violations.push(`Module budgets sum to ${sum}, total is ${budget.total}`);
  if (!tooling.budget || !tooling.paths.length) violations.push("loc-budget.json needs a tooling budget");
  const now = tally(files, modules, tooling, categories, budget, violations, "used");
  const was = baseFiles ? tally(baseFiles, modules, tooling, categories, budget, [], "base") : null;
  const used = now.product + now.unassigned;
  if (used > budget.total) violations.push(`Total ${used}/${budget.total}`);
  if (tooling.used > tooling.budget) violations.push(`Tooling ${tooling.used}/${tooling.budget}`);
  return { modules, tooling, categories, violations, showDelta: Boolean(baseFiles), total: { used, budget: budget.total, base: was ? was.product + was.unassigned : 0 } };
}

function tally(files, modules, tooling, categories, budget, violations, slot) {
  let product = 0;
  let unassigned = 0;
  for (const file of files) {
    const group = classify(file.path);
    if (group !== "product" && group !== "tooling") {
      categories[group][slot === "base" ? "base" : "lines"] += file.text.split("\n").filter((line) => line.trim()).length;
      if (slot === "used") categories[group].files++;
      if (slot === "used" && group === "other" && EXT.has(extname(file.path))) violations.push(`Uncounted source file ${file.path}`);
      continue;
    }
    const stats = analyze(file.text);
    if (slot === "used") for (const fn of stats.functions) if (fn.lines > budget.caps.perFunction) violations.push(`Function cap ${file.path}:${fn.line} ${fn.name} ${fn.lines}/${budget.caps.perFunction}`);
    if (group === "tooling") {
      tooling[slot] += stats.lines;
      if (slot === "used" && !tooling.paths.some((glob) => matchGlob(glob, file.path))) violations.push(`${file.path} is tooling without a budget path`);
      continue;
    }
    const hits = modules.filter((mod) => mod.paths.some((glob) => matchGlob(glob, file.path)));
    if (hits.length === 1) {
      hits[0][slot] += stats.lines;
      product += stats.lines;
      if (slot === "used" && stats.lines > budget.caps.perFile) violations.push(`File cap ${file.path} ${stats.lines}/${budget.caps.perFile}`);
    } else {
      unassigned += stats.lines;
      if (slot === "used") violations.push(`${file.path} matches ${hits.length ? "more than one module" : "no module"} (${stats.lines} lines)`);
    }
  }
  if (slot === "used") for (const mod of modules) if (mod.used > mod.budget) violations.push(`Module ${mod.id} ${mod.used}/${mod.budget}`);
  return { product, unassigned };
}

export function formatReport(result) {
  const delta = result.showDelta;
  const row = (id, used, budget, base) => {
    const pct = `${budget > 0 ? Math.round((used / budget) * 100) : used ? 100 : 0}%`;
    const change = delta ? `  ${signed(used - base).padStart(5)}` : "";
    return `${id.padEnd(12)} ${String(used).padStart(5)}  ${String(budget).padStart(6)}${change}  ${pct.padStart(5)}  ${statusFor(used, budget).padEnd(6)}  ${bar(used, budget)}`;
  };
  const cats = CATS.filter((name) => result.categories[name].lines || result.categories[name].base || result.categories[name].files).map((name) => {
    const cat = result.categories[name];
    return `  ${name.padEnd(12)} ${String(cat.lines).padStart(5)}${delta ? `  ${signed(cat.lines - cat.base).padStart(5)}` : ""}  ${cat.files} files`;
  });
  const head = `Module        ${"Used".padStart(5)}  ${"Budget".padStart(6)}${delta ? `  ${"Delta".padStart(5)}` : ""}  ${"%".padStart(5)}  Status  Bar`;
  return [
    `Pandino line budget · phases 0-1 · ${result.total.budget} lines`,
    "", "GREEN under 80% · YELLOW 80-100% · RED over", "", head,
    ...result.modules.map((mod) => row(mod.id, mod.used, mod.budget, mod.base)),
    row("TOTAL", result.total.used, result.total.budget, result.total.base),
    "", `Tooling (outside the ${result.total.budget})`, row("tooling", result.tooling.used, result.tooling.budget, result.tooling.base),
    "", "Not counted (non-blank lines)", ...cats,
    ...(result.violations.length ? ["", "Over budget", ...result.violations] : []),
    "", result.violations.length ? "Result: over budget" : "Result: within budget",
  ].join("\n");
}

function signed(n) { return n > 0 ? `+${n}` : String(n); }

function git(args, cwd) {
  const run = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (run.status) throw new Error((run.stderr || `git ${args[0]} failed`).trim());
  return run.stdout;
}

function filesAt(root, ref) {
  const listed = ref ? git(["ls-tree", "-r", "--name-only", ref], root).split("\n") : `${git(["ls-files", "-z"], root)}${git(["ls-files", "--others", "--exclude-standard", "-z"], root)}`.split("\0");
  return listed.filter(Boolean).flatMap((path) => {
    const text = ref ? git(["show", `${ref}:${path}`], root) : readFileSync(`${root}/${path}`, "utf8");
    return text.includes("\0") ? [] : [{ path, text }];
  });
}

function main() {
  const baseFlag = process.argv.indexOf("--base");
  if (process.argv.includes("--help")) { console.log("Usage: node scripts/loc-meter.mjs [--base <git-ref>]"); return 0; }
  if (baseFlag >= 0 && !process.argv[baseFlag + 1]) throw new Error("--base needs a git ref");
  const root = git(["rev-parse", "--show-toplevel"]).trim();
  const result = evaluate(filesAt(root), JSON.parse(readFileSync(`${root}/loc-budget.json`, "utf8")), baseFlag < 0 ? null : filesAt(root, process.argv[baseFlag + 1]));
  console.log(formatReport(result));
  return result.violations.length ? 1 : 0;
}

if (process.argv[1]?.endsWith("loc-meter.mjs")) {
  try { process.exit(main()); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exit(2); }
}
