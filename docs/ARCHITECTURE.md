# Architecture

AI Maintainer OS has three layers:

```text
pull request diff
  |
  v
diff parser
  |
  v
deterministic rule engine
  |
  v
risk score + maintainer report
  |
  +-- CLI output
  +-- GitHub Action summary
  +-- PR comment
```

## Core Modules

- `diffParser.ts` converts unified diffs into file-level changes.
- `rules.ts` applies deterministic review rules.
- `scanner.ts` combines findings into a score and risk level.
- `report.ts` renders maintainer-readable Markdown or JSON.
- `action.ts` integrates with GitHub Actions.
- `cli.ts` provides local usage.

## Why Deterministic Rules First

Top maintainers need reproducible checks. A deterministic engine makes the first release predictable, testable, and safe for public repositories.

LLM-based summaries can be added later, but they should sit behind redaction, policy controls, and explicit opt-in behavior.

## Risk Score

Each rule contributes points. The scanner caps the final score at 100.

Risk levels:

- `low`: 0-29
- `medium`: 30-59
- `high`: 60-84
- `critical`: 85-100

The GitHub Action can fail the workflow when the report level meets or exceeds `fail-on`.
