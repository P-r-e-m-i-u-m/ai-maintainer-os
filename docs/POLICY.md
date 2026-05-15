# Policy Model

The first release ships with a default maintainer policy.

## Default Checks

- Secret-like values in diffs
- Sensitive path changes
- GitHub Actions workflow changes
- Dependency manifest changes
- Suspicious dependency versions
- Source changes without tests
- Large change sets
- Thin PR descriptions
- Missing test evidence, risk notes, or linked issue/design context

## Sensitive Paths

Examples:

- `.github/workflows/`
- `.github/actions/`
- `src/auth/`
- `src/security/`
- `src/middleware/`
- `package.json`
- `package-lock.json`
- `Dockerfile`
- `.env`
- files containing `secret`, `token`, or `credential`

## Blocking Behavior

Use `fail-on` to control CI blocking.

```yaml
with:
  fail-on: high
```

Recommended defaults:

- Open source repo: `high`
- Security-sensitive repo: `medium`
- Experimental repo: `critical`

## Future Config File

A future release should support:

```json
{
  "failOn": "high",
  "requireTestsForSourceChanges": true,
  "sensitivePaths": ["src/auth/**", ".github/workflows/**"]
}
```
