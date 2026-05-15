import type { RiskLevel, ScanInput, ScanReport } from "./types.js";
export declare function scanPullRequest(input: ScanInput, options?: {
    failOn?: RiskLevel;
}): ScanReport;
