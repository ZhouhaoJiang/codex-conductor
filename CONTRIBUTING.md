# Contributing

Thanks for helping improve Codex Conductor.

## Development Setup

Install a local checkout with Codex's native marketplace flow:

```bash
codex plugin marketplace add "$PWD"
codex plugin add codex-conductor@codex-conductor
```

Run validation commands from the repository root:

```bash
./install.sh --dry-run
plugins/codex-conductor/scripts/smoke-test
```

`./install.sh --dry-run` previews the convenience installer; it does not install
the plugin.

Use a real install only when you want Codex to load the updated plugin:

```bash
./install.sh
```

Start a new Codex thread after reinstalling so Codex picks up updated skills
and hooks.

## Pull Request Checklist

- Keep the capability/governance split explicit: tools may be rich, but default
  hooks must stay non-blocking and lightweight.
- Do not add automatic updates, telemetry, background provisioning, forced
  planning, stop continuation, or hard evidence gates.
- Keep large optional runtimes out of the repository and out of session-start
  hooks. Provision them only through an explicit installer action.
- Preserve upstream licenses and modification notices for every selected
  third-party component or skill.
- Update `README.md` and `README.zh-CN.md` when behavior or install steps change.
- Run the verification commands documented in `README.md`.
- Avoid committing machine-local paths, generated caches, logs, or screenshots.

## Code Style

- Prefer portable POSIX-friendly shell, with Bash only where the script already
  declares `#!/usr/bin/env bash`.
- Keep hook behavior conservative. It should recommend Conductor, not start
  threads or mutate user state.
- Keep skill instructions focused and operational; avoid broad marketing copy.
- Prefer soft or explicit skill activation. Reserve strict profiles for skills
  whose names and descriptions clearly identify them as opt-in.
