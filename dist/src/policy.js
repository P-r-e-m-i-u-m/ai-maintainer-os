export function defaultPolicy(failOn = "high") {
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
//# sourceMappingURL=policy.js.map