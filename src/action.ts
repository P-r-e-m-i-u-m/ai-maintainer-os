import * as core from "@actions/core";
import * as github from "@actions/github";
import { execFileSync } from "node:child_process";
import { parseUnifiedDiff } from "./diffParser.js";
import { renderMarkdown } from "./report.js";
import { shouldFail } from "./risk.js";
import { scanPullRequest } from "./scanner.js";
import type { RiskLevel } from "./types.js";

async function run(): Promise<void> {
  const token = core.getInput("github-token", { required: false }) || process.env.GITHUB_TOKEN;
  const failOn = (core.getInput("fail-on", { required: false }) || "high") as RiskLevel;
  const comment = core.getInput("comment", { required: false }) !== "false";

  if (!github.context.payload.pull_request) {
    core.info("No pull request context found. Skipping AI Maintainer OS.");
    return;
  }

  const pr = github.context.payload.pull_request;
  const baseRef = pr.base?.ref ?? "main";
  const diff = execFileSync("git", ["diff", `origin/${baseRef}...HEAD`], { encoding: "utf8" });
  const files = parseUnifiedDiff(diff);
  const report = scanPullRequest(
    {
      files,
      title: pr.title,
      body: pr.body ?? ""
    },
    { failOn }
  );
  const markdown = renderMarkdown(report);

  await core.summary.addRaw(markdown).write();
  core.setOutput("risk-level", report.level);
  core.setOutput("risk-score", String(report.score));

  if (comment && token) {
    const octokit = github.getOctokit(token);
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pr.number,
      body: markdown
    });
  }

  if (shouldFail(report.level, failOn)) {
    core.setFailed(`AI Maintainer OS risk ${report.level} meets fail-on threshold ${failOn}.`);
  }
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error));
});
