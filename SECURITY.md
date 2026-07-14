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

Codex Conductor is a local Codex plugin. It does not send telemetry. The CLI
stores project registry state under
`~/.codex-conductor` by default, or under `CODEX_CONDUCTOR_HOME` when set.

The prompt hook only reads the current hook payload and, when available, the
local transcript path provided by Codex to avoid duplicate recommendations. It
does not create threads, execute user prompts, or contact the network.

The packaged project-rule and Git Bash hooks execute locally and do not perform
network provisioning. The remote grep.app and Context7 MCPs contact their
respective services only when invoked. The LSP and Git Bash MCPs are local.

CodeGraph is optional. It is installed only through an explicit
`./install.sh --with-codegraph` action, then runs with download, daemon, and
telemetry settings disabled by the Conductor wrapper. No session-start hook
downloads or initializes it.

Some bundled skills can invoke network tools or browser automation when the
user selects those capabilities. Review the skill's command and the applicable
third-party service terms before authorizing sensitive access.
