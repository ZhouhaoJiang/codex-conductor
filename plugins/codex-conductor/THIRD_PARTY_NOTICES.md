# Third-party notices

Codex Conductor's original code is licensed under the repository's MIT License.
The plugin also carries selected third-party components and skills under their
own terms. Those terms override the repository license for the files named
below.

## OMO / oh-my-openagent shared skills

The following directories were selected from OMO 4.17.1 / the
`lazycodex-ai` shared skill distribution by Yeongyu Kim:

- `skills/ast-grep/`
- `skills/coding-agent-sessions/`
- `skills/lsp-setup/`
- `skills/programming-strict/`
- `skills/ultimate-browsing/`

They remain under Sustainable Use License 1.0. A copy is included as
`LICENSE.md` in each directory. Codex Conductor rebuilt their Codex agent
metadata, shortened the `lsp-setup` activation description, softened
`coding-agent-sessions` activation, and renamed/re-gated `programming` as the
explicit opt-in `programming-strict`. Those changes are not an attempt to
relicense the underlying material.

## Codex Rules

`runtime/rules/` is derived from `@code-yeongyu/codex-rules` 4.17.1 by Yeongyu
Kim and is distributed under the MIT License included in that directory. Its
upstream NOTICE is retained. Conductor excludes the upstream model-specific
bundled rules and invokes the runtime with bundled rules disabled.

## Codex LSP

`runtime/lsp-daemon/` is derived from `@code-yeongyu/lsp-daemon` 0.1.0 and the
MIT-licensed Codex LSP distribution by Yeongyu Kim. The license and notice are
included in that directory.

## Git Bash support

`runtime/git-bash-mcp/` and `runtime/git-bash-hook/` are selected from OMO
4.17.1. They remain under Sustainable Use License 1.0, included in each
directory. Conductor modified the hook's product wording and local reminder
state path.

## Optional CodeGraph runtime

CodeGraph is not vendored into this repository. When explicitly requested with
`./install.sh --with-codegraph`, the installer downloads
`@colbymchenry/codegraph` 1.4.1 from npm into the user's Conductor runtime
directory. CodeGraph declares the MIT License; its installed package carries
the applicable package and runtime notices.

## Remote MCP services

The grep.app and Context7 MCP endpoints are referenced as remote services and
are not redistributed by this repository. Their service terms and privacy
policies apply when those MCPs are used.
