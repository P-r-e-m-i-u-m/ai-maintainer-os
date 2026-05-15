import type { RiskLevel } from "./types.js";
export declare function riskFromScore(score: number): RiskLevel;
export declare function shouldFail(reportLevel: RiskLevel, failOn: RiskLevel): boolean;
export declare function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel;
