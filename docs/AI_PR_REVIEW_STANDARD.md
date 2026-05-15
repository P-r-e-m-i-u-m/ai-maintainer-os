# AI PR Review Standard

This is a suggested review bar for repositories that accept AI-assisted contributions.

## Minimum PR Contract

Every non-trivial PR should answer:

- What changed?
- Why is this the right approach?
- How was it tested?
- What happens on unexpected input or failure?
- What issue, discussion, RFC, or design does this relate to?
- Who will maintain this behavior after merge?

## Fast Close Conditions

Maintainers can close or request changes when a PR:

- does not compile
- fails existing CI
- changes source code without tests or explanation
- touches workflows/secrets/auth without a maintainer design note
- mixes unrelated refactors with feature work
- cannot be explained by the author

## Healthy AI-Assisted PRs

AI-assisted PRs can be useful when they are:

- small
- tested
- explained by the author
- linked to an issue or discussion
- reviewed line by line before submission
- scoped to one problem

## Suggested PR Template Add-On

```md
## AI assistance

- [ ] I used AI assistance
- [ ] I reviewed every changed line
- [ ] I can explain and maintain this change

## Failure mode

What does this code do when input is invalid, dependencies fail, or the operation is retried?
```
