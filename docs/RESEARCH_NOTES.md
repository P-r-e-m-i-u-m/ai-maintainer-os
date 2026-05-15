# Research Notes

This project is shaped by current maintainer pain around AI-assisted pull requests.

## What Maintainers Are Reporting

Common complaints from Reddit, Hacker News, and open-source discussions:

- PRs are large, unfocused, and hard to review.
- Contributors open PRs without prior issue/design discussion.
- Source code changes arrive without tests.
- PR descriptions are empty or generic.
- CI fails because contributors did not run checks locally.
- Dependency and workflow changes are mixed into unrelated PRs.
- Authors sometimes cannot explain or maintain the generated code.
- Review time increases even when code generation time decreases.

## Product Implications

AI Maintainer OS should focus on review readiness, not AI detection.

It should ask:

- Is the PR small enough to review?
- Did the author provide test evidence?
- Did the author describe failure modes and risk?
- Did the PR touch sensitive files?
- Did dependency or workflow changes appear?
- Is a maintainer review required before merge?

## Positioning

Bad positioning:

```text
Detect AI code.
```

Better positioning:

```text
Make PR review resilient to AI-assisted code.
```

The tool should not shame contributors for using AI. It should raise the review standard for everyone.
