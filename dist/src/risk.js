const order = ["low", "medium", "high", "critical"];
export function riskFromScore(score) {
    if (score >= 85)
        return "critical";
    if (score >= 60)
        return "high";
    if (score >= 30)
        return "medium";
    return "low";
}
export function shouldFail(reportLevel, failOn) {
    return order.indexOf(reportLevel) >= order.indexOf(failOn);
}
export function maxRisk(a, b) {
    return order.indexOf(a) >= order.indexOf(b) ? a : b;
}
//# sourceMappingURL=risk.js.map