# Maintainer Playbook

## How To Read A Report

Start with:

1. Risk level
2. Required actions
3. Findings with evidence
4. Changed files

The score is not the final decision. It is a triage signal.

## Suggested Review Responses

For missing tests:

```md
Thanks for the PR. This changes runtime code but does not include regression tests.
Can you add a focused test for the changed behavior or explain why existing coverage is enough?
```

For workflow edits:

```md
This changes GitHub Actions behavior, so I want one more maintainer review before merge.
Please explain the permission changes and whether this can run safely on forked PRs.
```

For missing review context:

```md
Before I do a deep review, please add the review context:

- test evidence
- failure mode or rollback notes
- linked issue, discussion, or design context

That keeps review focused and prevents maintainers from reverse-engineering the intent.
```

For secret-like values:

```md
This diff appears to include a credential-like value. Please remove it from the PR.
If the value was real, rotate it before continuing.
```

## What Not To Do

- Do not auto-merge only because risk is low.
- Do not shame contributors for AI-assisted code.
- Do not expose private prompts, secrets, or proprietary code in comments.
- Do not let the tool replace human ownership.
