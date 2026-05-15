export type RiskLevel = "low" | "medium" | "high" | "critical";
export interface FileChange {
    path: string;
    additions: number;
    deletions: number;
    patch: string;
}
export interface Finding {
    id: string;
    title: string;
    level: RiskLevel;
    points: number;
    reason: string;
    evidence: string[];
    recommendation: string;
}
export interface ScanInput {
    files: FileChange[];
    title?: string;
    body?: string;
}
export interface ScanReport {
    score: number;
    level: RiskLevel;
    summary: string;
    findings: Finding[];
    changedFiles: string[];
    requiredActions: string[];
    maintainerNote: string;
}
export interface Policy {
    failOn: RiskLevel;
    requireTestsForSourceChanges: boolean;
    sensitivePathPatterns: RegExp[];
}
