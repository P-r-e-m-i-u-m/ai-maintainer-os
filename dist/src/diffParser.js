export function parseUnifiedDiff(diffText) {
    const files = [];
    const sections = diffText.split(/^diff --git /m).filter(Boolean);
    for (const section of sections) {
        const header = section.split(/\r?\n/, 1)[0] ?? "";
        const match = header.match(/a\/(.+?) b\/(.+)$/);
        const path = match?.[2] ?? "unknown";
        const lines = section.split(/\r?\n/);
        let additions = 0;
        let deletions = 0;
        for (const line of lines) {
            if (line.startsWith("+++") || line.startsWith("---"))
                continue;
            if (line.startsWith("+"))
                additions++;
            if (line.startsWith("-"))
                deletions++;
        }
        files.push({
            path,
            additions,
            deletions,
            patch: section
        });
    }
    return files;
}
//# sourceMappingURL=diffParser.js.map