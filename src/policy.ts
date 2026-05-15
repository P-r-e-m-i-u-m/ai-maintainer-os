import type { Policy, RiskLevel } from "./types.js";

export function defaultPolicy(failOn: RiskLevel = "high"): Policy {
  return {
    failOn,
    requireTestsForSourceChanges: true,
    sensitivePathPatterns: [
      /^\.github\/workflows\//,
      /^\.github\/actions\//,
      /^src\/auth\//,
      /^src\/security\//,
      /^src\/middleware\//,
      /package-lock\.json$/,
      /package\.json$/,
      /Dockerfile$/,
      /docker-compose.*\.ya?ml$/,
      /\.env/,
      /secret/i,
      /token/i,
      /credential/i
    ]
  };
}
