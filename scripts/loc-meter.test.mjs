import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { analyze, bar, classify, evaluate, matchGlob, statusFor } from "./loc-meter.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const budget = {
  total: 100,
  caps: { perFile: 80, perFunction: 40 },
  tooling: { budget: 150, paths: ["scripts/loc-meter.mjs"] },
  modules: [
    { id: "schema", budget: 60, paths: ["packages/schema/**"] },
    { id: "editor", budget: 40, paths: ["apps/web/app/**"] },
  ],
};

test("status turns yellow at 80% and red only when over", () => {
  assert.equal(statusFor(79, 100), "GREEN");
  assert.equal(statusFor(80, 100), "YELLOW");
  assert.equal(statusFor(100, 100), "YELLOW");
  assert.equal(statusFor(101, 100), "RED");
  assert.equal(statusFor(0, 0), "GREEN");
});

test("bar fills in proportion to the budget", () => {
  assert.equal(bar(0, 100, 4), "░░░░");
  assert.equal(bar(50, 100, 4), "██░░");
  assert.equal(bar(200, 100, 4), "████");
});

test("globs assign files to one module", () => {
  assert.equal(matchGlob("packages/schema/**", "packages/schema/src/site.ts"), true);
  assert.equal(matchGlob("packages/schema/**", "packages/schema-extra/site.ts"), false);
  assert.equal(matchGlob("apps/web/app/**", "apps/web/app/page.tsx"), true);
});

test("classification keeps product code apart from everything else", () => {
  assert.equal(classify("packages/schema/src/site.ts"), "product");
  assert.equal(classify("packages/schema/src/site.test.ts"), "tests");
  assert.equal(classify("apps/web/next.config.ts"), "config");
  assert.equal(classify("apps/web/app/globals.css"), "css");
  assert.equal(classify("packages/schema/examples/rossi-auto-body.json"), "recipe-data");
  assert.equal(classify("docs/PLAN.md"), "docs");
  assert.equal(classify("docs/design/sidebar-mockup/sidebar.js"), "mockup");
  assert.equal(classify("scripts/loc-meter.mjs"), "tooling");
  assert.equal(classify("scripts/shots.mjs"), "scripts");
  assert.equal(classify("pnpm-lock.yaml"), "lockfiles");
  assert.equal(classify("AGENTS.md"), "docs");
});

test("comments, strings, and regex braces are not code structure", () => {
  const counted = analyze('const a = 1;\n\n// hidden\nconst b = "// not a comment";\n', ".ts");
  assert.equal(counted.lines, 2);

  const regex = analyze("const re = /^[a-z]{2}$/;\nconst schema = z.object({\n  a: 1,\n});\n", ".ts");
  assert.equal(regex.functions.length, 0);

  const fn = analyze("function tiny() {\n  return 1;\n}\n", ".ts");
  assert.equal(fn.functions.length, 1);
  assert.equal(fn.functions[0].name, "tiny");
  assert.equal(fn.functions[0].lines, 3);
});

test("php comments and functions count", () => {
  const php = analyze("<?php\n# note\nfunction ping($ok) {\n  return $ok;\n}\n", ".php");
  assert.equal(php.functions.length, 1);
  assert.equal(php.functions[0].name, "ping");
  assert.equal(php.lines, 4);
});

test("caps and unassigned files fail", () => {
  const long = `function huge() {\n${"  const n = 1;\n".repeat(45)}}`;
  const over = evaluate(
    [
      { path: "packages/schema/src/site.ts", text: long },
      { path: "apps/web/stray.ts", text: "export const n = 1;\n" },
    ],
    budget,
  );
  assert.ok(over.violations.some((item) => item.startsWith("Function cap")));
  assert.ok(over.violations.some((item) => item.includes("stray.ts")));

  const css = evaluate([{ path: "apps/web/app/globals.css", text: ".a {\n  color: red;\n}\n" }], budget);
  assert.equal(css.total.used, 0);
  assert.equal(css.categories.css.lines, 3);
  assert.equal(css.violations.length, 0);
});

test("delta compares against a base file list", () => {
  const current = [{ path: "packages/schema/src/site.ts", text: "export const n = 1;\nexport const m = 2;\n" }];
  const base = [{ path: "packages/schema/src/site.ts", text: "export const n = 1;\n" }];
  const result = evaluate(current, budget, base);
  assert.equal(result.modules[0].used, 2);
  assert.equal(result.modules[0].base, 1);
  assert.equal(result.showDelta, true);
});

test("the repository is within budget", () => {
  const result = spawnSync(process.execPath, ["scripts/loc-meter.mjs", "--base", "origin/main"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /schema/);
  assert.match(result.stdout, /mockup/);
  assert.match(result.stdout, /tooling/);
  assert.match(result.stdout, /Result: within budget/);
});
