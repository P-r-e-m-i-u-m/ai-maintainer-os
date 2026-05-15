import type { FileChange, Finding, Policy, ScanInput } from "./types.js";

const sourceFile = /\.(ts|tsx|js|jsx|py|go|rs|java|rb|php|cs)$/;
const testFile = /(\.test\.|\.spec\.|__tests__|tests\/|test\/)/;
const secretPattern =
  /(api[_-]?key|secret|password|private[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=]\s*['"][^'"]{8,}/i;
const suspiciousDependencyPattern = /^\+\s*["']?([a-z0-9._-]+)["']?\s*:\s*["']?\^?0\.0\.|latest["']?/im;

export function evaluateRules(input: ScanInput, policy: Policy): Finding[] {
  const findings: Finding[] = [];
  findings.push(...checkSecrets(input.files));
  findings.push(...checkSensitivePaths(input.files, policy));
  findings.push(...checkMissingTests(input.files, policy));
  findings.push(...checkLargeChange(input.files));
  findings.push(...checkDependencyRisk(input.files));
  findings.push(...checkWorkflowRisk(input.files));
  findings.push(...checkPrDescription(input));
  findings.push(...checkReviewContract(input));
  return findings;
}

function checkSecrets(files: FileChange[]): Finding[] {
  const evidence = files
    .filter((file) => secretPattern.test(file.patch))
    .map((file) => file.path);

  if (evidence.length === 0) return [];

  return [
    {
      id: "secret-like-change",
      title: "Secret-like value detected in diff",
      level: "critical",
      points: 90,
      reason: "The patch appears to add credential-like material.",
      evidence,
      recommendation: "Remove the value, rotate the secret if it was real, and use environment or secret storage."
    }
  ];
}

function checkSensitivePaths(files: FileChange[], policy: Policy): Finding[] {
  const evidence = files
    .filter((file) => policy.sensitivePathPatterns.some((pattern) => pattern.test(file.path)))
    .map((file) => file.path);

  if (evidence.length === 0) return [];

  return [
    {
      id: "sensitive-path",
      title: "Sensitive path changed",
      level: "high",
      points: Math.min(35 + evidence.length * 5, 55),
      reason: "Security, workflow, dependency, or credential-adjacent files require closer review.",
      evidence,
      recommendation: "Require a maintainer review and verify runtime/security impact before merge."
    }
  ];
}

function checkMissingTests(files: FileChange[], policy: Policy): Finding[] {
  if (!policy.requireTestsForSourceChanges) return [];

  const sourceChanges = files.filter((file) => sourceFile.test(file.path) && !testFile.test(file.path));
  const testChanges = files.filter((file) => testFile.test(file.path));

  if (sourceChanges.length === 0 || testChanges.length > 0) return [];

  return [
    {
      id: "missing-tests",
      title: "Source changed without test updates",
      level: "medium",
      points: 25,
      reason: "Production code changed but no test file was changed in the same PR.",
      evidence: sourceChanges.map((file) => file.path),
      recommendation: "Ask for focused regression tests or explain why existing coverage is enough."
    }
  ];
}

function checkLargeChange(files: FileChange[]): Finding[] {
  const total = files.reduce((sum, file) => sum + file.additions + file.deletions, 0);
  if (total < 500 && files.length < 15) return [];

  return [
    {
      id: "large-change",
      title: "Large change set",
      level: total > 1200 || files.length > 30 ? "high" : "medium",
      points: total > 1200 || files.length > 30 ? 45 : 25,
      reason: "Large PRs are harder to review and more likely to hide accidental AI-generated changes.",
      evidence: [`${files.length} files changed`, `${total} changed lines`],
      recommendation: "Consider splitting into smaller PRs or require a stronger test/evidence section."
    }
  ];
}

function checkDependencyRisk(files: FileChange[]): Finding[] {
  const dependencyFiles = files.filter((file) => /package(-lock)?\.json|requirements\.txt|pyproject\.toml|go\.mod|Cargo\.toml/.test(file.path));
  const suspicious = dependencyFiles.filter((file) => suspiciousDependencyPattern.test(file.patch));

  if (dependencyFiles.length === 0) return [];

  return [
    {
      id: suspicious.length > 0 ? "suspicious-dependency" : "dependency-change",
      title: suspicious.length > 0 ? "Suspicious dependency version" : "Dependency manifest changed",
      level: suspicious.length > 0 ? "high" : "medium",
      points: suspicious.length > 0 ? 50 : 25,
      reason:
        suspicious.length > 0
          ? "The diff appears to add a weak or ambiguous dependency version."
          : "Dependency changes can introduce supply-chain risk and should be reviewed deliberately.",
      evidence: dependencyFiles.map((file) => file.path),
      recommendation: "Verify package names, lockfile integrity, provenance, and whether the dependency is necessary."
    }
  ];
}

function checkWorkflowRisk(files: FileChange[]): Finding[] {
  const evidence = files.filter((file) => file.path.startsWith(".github/workflows/")).map((file) => file.path);
  if (evidence.length === 0) return [];

  return [
    {
      id: "workflow-change",
      title: "GitHub Actions workflow changed",
      level: "high",
      points: 45,
      reason: "Workflow edits can change permissions, tokens, release behavior, and code execution paths.",
      evidence,
      recommendation: "Review permissions, token use, third-party actions, and whether the change can run on forks."
    }
  ];
}

function checkPrDescription(input: ScanInput): Finding[] {
  const body = input.body?.trim() ?? "";
  if (body.length >= 120) return [];

  return [
    {
      id: "thin-description",
      title: "PR description lacks review context",
      level: "low",
      points: 10,
      reason: "Maintainers need intent, test evidence, and risk notes to review quickly.",
      evidence: [body ? "Description is short" : "Description is empty"],
      recommendation: "Ask for what changed, why, how it was tested, and known risks."
    }
  ];
}

function checkReviewContract(input: ScanInput): Finding[] {
  const body = `${input.title ?? ""}\n${input.body ?? ""}`.toLowerCase();
  const sourceChanges = input.files.filter((file) => sourceFile.test(file.path) && !testFile.test(file.path));
  if (sourceChanges.length === 0) return [];

  const missingSignals: string[] = [];
  if (!/(test|tested|npm run|pytest|cargo test|go test|ci passed)/.test(body)) {
    missingSignals.push("test evidence");
  }
  if (!/(risk|rollback|failure|edge case|unexpected input|blast radius)/.test(body)) {
    missingSignals.push("risk/failure-mode note");
  }
  if (!/(closes|fixes|refs|issue|discussion|rfc|design)/.test(body)) {
    missingSignals.push("linked issue/design context");
  }

  if (missingSignals.length === 0) return [];

  return [
    {
      id: "missing-review-contract",
      title: "PR is missing maintainer review context",
      level: missingSignals.length >= 2 ? "medium" : "low",
      points: missingSignals.length >= 2 ? 25 : 10,
      reason: "Maintainers need evidence that the author understood, tested, and scoped the change.",
      evidence: missingSignals,
      recommendation:
        "Ask the author to add test evidence, risk notes, and a linked issue/design discussion before deep review."
    }
  ];
}
