import type { RiskLevel } from "./types.js";

const order: RiskLevel[] = ["low", "medium", "high", "critical"];

export function riskFromScore(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function shouldFail(reportLevel: RiskLevel, failOn: RiskLevel): boolean {
  return order.indexOf(reportLevel) >= order.indexOf(failOn);
}

export function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}
