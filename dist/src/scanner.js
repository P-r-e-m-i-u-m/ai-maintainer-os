import { defaultPolicy } from "./policy.js";
import { riskFromScore } from "./risk.js";
import { evaluateRules } from "./rules.js";
export function scanPullRequest(input, options = {}) {
    const policy = defaultPolicy(options.failOn);
    const findings = evaluateRules(input, policy);
    const score = Math.min(100, findings.reduce((sum, finding) => sum + finding.points, 0));
    const level = riskFromScore(score);
    const requiredActions = findings
        .filter((finding) => finding.level === "high" || finding.level === "critical")
        .map((finding) => finding.recommendation);
    return {
        score,
        level,
        summary: summarize(score, findings.length),
        findings,
        changedFiles: input.files.map((file) => file.path),
        requiredActions,
        maintainerNote: requiredActions.length > 0
            ? "This PR needs maintainer attention before merge."
            : "No blocking risk was detected by the current policy. Human review is still required."
    };
}
function summarize(score, findingCount) {
    if (findingCount === 0)
        return "No policy findings detected.";
    if (score >= 85)
        return "Critical review risk detected. Do not merge until resolved.";
    if (score >= 60)
        return "High review risk detected. Maintainer approval should be required.";
    if (score >= 30)
        return "Moderate review risk detected. Ask for evidence before merge.";
    return "Low review risk detected. Review normally.";
}
//# sourceMappingURL=scanner.js.map