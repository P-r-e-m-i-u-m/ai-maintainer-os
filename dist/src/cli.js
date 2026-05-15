#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { Command } from "commander";
import pc from "picocolors";
import { parseUnifiedDiff } from "./diffParser.js";
import { renderJson, renderMarkdown } from "./report.js";
import { shouldFail } from "./risk.js";
import { scanPullRequest } from "./scanner.js";
const program = new Command();
program
    .name("ai-maintainer-os")
    .description("Review AI-assisted pull requests with deterministic maintainer guardrails.")
    .version("0.1.0");
program
    .command("scan")
    .requiredOption("--diff <path>", "Path to unified diff file")
    .option("--title <title>", "Pull request title")
    .option("--body <body>", "Pull request body")
    .option("--format <format>", "Output format: markdown or json", "markdown")
    .option("--fail-on <level>", "Risk level that exits non-zero: low, medium, high, critical, never", "high")
    .action(async (options) => {
    const diff = await readFile(options.diff, "utf8");
    const files = parseUnifiedDiff(diff);
    const report = scanPullRequest({
        files,
        title: options.title,
        body: options.body
    }, { failOn: options.failOn });
    const output = options.format === "json" ? renderJson(report) : renderMarkdown(report);
    console.log(output);
    if (options.failOn !== "never" && shouldFail(report.level, options.failOn)) {
        console.error(pc.red(`AI Maintainer OS failed because risk level is ${report.level}.`));
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=cli.js.map