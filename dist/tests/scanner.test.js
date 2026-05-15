import assert from "node:assert/strict";
import { parseUnifiedDiff } from "../src/diffParser.js";
import { renderMarkdown } from "../src/report.js";
import { shouldFail } from "../src/risk.js";
import { scanPullRequest } from "../src/scanner.js";
const riskyDiff = `diff --git a/src/auth/session.ts b/src/auth/session.ts
index 1111111..2222222 100644
--- a/src/auth/session.ts
+++ b/src/auth/session.ts
@@ -1,2 +1,4 @@
+const apiKey = "sk-test-secret-value";
+export const timeout = 1000;
 export function ok() { return true; }
diff --git a/package.json b/package.json
index 3333333..4444444 100644
--- a/package.json
+++ b/package.json
@@ -3,6 +3,7 @@
   "dependencies": {
+    "some-new-package": "latest"
   }
 }`;
const files = parseUnifiedDiff(riskyDiff);
assert.equal(files.length, 2);
assert.equal(files[0].path, "src/auth/session.ts");
const report = scanPullRequest({
    files,
    title: "Update auth session",
    body: "Small fix"
});
assert.equal(report.level, "critical");
assert.ok(report.findings.some((finding) => finding.id === "secret-like-change"));
assert.ok(report.findings.some((finding) => finding.id === "sensitive-path"));
assert.ok(report.findings.some((finding) => finding.id === "missing-review-contract"));
assert.ok(shouldFail(report.level, "high"));
const markdown = renderMarkdown(report);
assert.ok(markdown.includes("AI Maintainer OS Review"));
assert.ok(markdown.includes("[CRITICAL]"));
const safeReport = scanPullRequest({
    files: parseUnifiedDiff(`diff --git a/docs/readme.md b/docs/readme.md
index 1111111..2222222 100644
--- a/docs/readme.md
+++ b/docs/readme.md
@@ -1 +1,2 @@
 # Docs
+More explanation.
`),
    title: "Improve docs",
    body: "This PR improves the documentation with a small clarification and does not change runtime code."
});
assert.equal(safeReport.level, "low");
const contractReport = scanPullRequest({
    files: parseUnifiedDiff(`diff --git a/src/retry.ts b/src/retry.ts
index 1111111..2222222 100644
--- a/src/retry.ts
+++ b/src/retry.ts
@@ -1 +1,2 @@
 export const retry = true;
+export const maxAttempts = 3;
`),
    title: "Update retry behavior",
    body: "Implements retry behavior."
});
assert.ok(contractReport.findings.some((finding) => finding.id === "missing-review-contract"));
console.log("Scanner tests passed.");
//# sourceMappingURL=scanner.test.js.map