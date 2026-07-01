# Security Policy

## Supported Versions

Codex Conductor is currently experimental. Security fixes are provided for the
latest published version only.

## Reporting a Vulnerability

Please report vulnerabilities privately to the maintainers before publishing
details. If this project is mirrored to GitHub, use the repository's private
security advisory flow when available.

Include:

- affected version or commit
- operating system and Codex CLI version
- steps to reproduce
- expected impact

## Security Model

Codex Conductor is a local Codex plugin. It does not run a server and does not
send telemetry. The CLI stores project registry state under
`~/.codex-conductor` by default, or under `CODEX_CONDUCTOR_HOME` when set.

The prompt hook only reads the current hook payload and, when available, the
local transcript path provided by Codex to avoid duplicate recommendations. It
does not create threads, execute user prompts, or contact the network.
