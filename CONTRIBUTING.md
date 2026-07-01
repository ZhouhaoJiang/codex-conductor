# Contributing

Thanks for helping improve Codex Conductor.

## Development Setup

Run the project from a local clone:

```bash
./install.sh --dry-run
plugins/codex-conductor/scripts/smoke-test
```

Use a real install only when you want Codex to load the updated plugin:

```bash
./install.sh
```

Start a new Codex thread after reinstalling so Codex picks up updated skills
and hooks.

## Pull Request Checklist

- Keep the V1 scope small: CLI, Codex skills, and prompt hooks only.
- Do not add an MCP server unless the design explicitly requires one.
- Update `README.md` and `README.zh-CN.md` when behavior or install steps change.
- Run the verification commands documented in `README.md`.
- Avoid committing machine-local paths, generated caches, logs, or screenshots.

## Code Style

- Prefer portable POSIX-friendly shell, with Bash only where the script already
  declares `#!/usr/bin/env bash`.
- Keep hook behavior conservative. It should recommend Conductor, not start
  threads or mutate user state.
- Keep skill instructions focused and operational; avoid broad marketing copy.
