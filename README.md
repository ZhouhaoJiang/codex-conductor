# Codex Conductor

<p align="center">
  <img src="plugins/codex-conductor/assets/icon.png" alt="Codex Conductor logo" width="96">
</p>

Codex Conductor is a lightweight project/session orchestration layer plus a
curated developer capability pack for Codex. It keeps the useful tools and
knowledge from OMO while removing the default governance that can make strong
models over-plan, over-verify, or keep working after the task is done.

[中文说明](./README.zh-CN.md)

## Ask Codex To Install It

Paste this prompt into Codex:

```text
Install Codex Conductor from https://github.com/ZhouhaoJiang/codex-conductor. Add it as a Codex plugin marketplace, install codex-conductor@codex-conductor, and link the optional CLI.
```

Codex can run the native plugin install flow for you. Approve the shell
commands and plugin trust prompt when Codex asks.

## Status

Codex Conductor 0.2.x is experimental. The CLI, curated MCPs, skills, hooks,
and local marketplace install path are usable, but Codex plugin APIs may still
change.

## Design Boundary

Conductor separates capability from governance:

| Layer | Included | Default behavior |
| --- | --- | --- |
| Native orchestration | bounded task-local subagents, visible session dispatch plans, project routing, collection | direct by default; sessions only for explicit durable or user-visible work |
| Lightweight execution | `conductor-lite` | explicit opt-in; direct work, brief planning only when needed, one focused verification pass |
| Engineering quality | proportional design/plan artifacts, project-first standards, real test files, functional acceptance | applied while building; review lenses are not automatic gates |
| Session work report | `.ccc/<session-id>.md` with a concise cumulative work, completion, and verification summary | quiet session-start guidance; written only after substantive project work |
| Code intelligence | LSP, grep.app, Context7, optional CodeGraph, Windows Git Bash | available on demand; no post-edit blocking diagnostics |
| Project context | project-rule loading and file-rule matching | context-only hooks; upstream model-specific rules are excluded |
| Specialist knowledge | selected/adapted engineering skills | soft activation or explicit opt-in |

The plugin deliberately does not include automatic update checks, telemetry,
configuration migration, background CodeGraph provisioning, forced planning,
goal/ledger loops, stop-continuation hooks, execution evidence gates, or the
upstream comment-checker blocker.

## Proportional Engineering Quality

For substantive delivery, Conductor Lite loads a compact engineering-quality
reference and applies it according to the task:

- Preserve durable architecture or tradeoff decisions in a design document,
  and durable multi-stage coordination in a plan document. Small local changes
  do not manufacture both artifacts.
- Choose the coding standard before implementation. Explicit user and repository
  rules win, then official ecosystem conventions, then an appropriate mature
  large-scale guide such as Google's when it is compatible with the codebase.
- Put unit tests in actual repository test files. One-off commands and manual
  reproducers are verification evidence, not unit tests.
- Accept features through their real UI, API, CLI, integration, or runtime
  path. A build or unit test suite does not substitute for functional
  acceptance.
- Review design/plan, code, tests, and function as distinct perspectives. One
  reviewer may apply them in one focused pass; bounded native subagents are
  available when independence materially improves confidence, while extra
  sessions are not the default.

The durable rationale is in the
[engineering quality model](docs/design/engineering-quality-model.md), with the
[integration plan](docs/plans/2026-07-14-engineering-quality-integration.md)
tracking this repository change.

## What It Does

- Registers and switches named local projects from the terminal.
- Opens or runs Codex CLI commands in the active project.
- Generates execution-unit-aware dispatch prompts for Codex App coordinator
  threads.
- Packages focused skills for orchestration, direct execution, code search,
  session discovery, Git, LSP, debugging, frontend work, refactoring, and QA.
- Exposes five MCP integrations: grep.app, Context7, LSP, Windows Git Bash, and
  optional CodeGraph.
- Loads project rules through non-blocking lifecycle hooks.
- Guides Codex to maintain one concise project-local work report per session.
- Uses a conservative prompt hook to recommend Conductor for orchestration
  without creating execution units or mutating the workspace itself.

## Native Dispatch Model

Conductor keeps the current Codex task as the coordinator:

1. Show a concise `Dispatch Plan` before creating or messaging execution units.
2. Use bounded native subagents for short-lived, task-local independent work.
3. Use Codex App session/thread units for explicitly requested durable,
   user-visible work.
4. Give nested dispatch a visible plan and a finite fan-out budget.
5. Collect child results and synthesize the final answer in the coordinator.

Subagents are native Codex execution primitives bounded to the current task;
session/thread units are durable, user-visible artifacts. Conductor does not
create a hidden session operator just to call thread APIs. If the matching
primitive is unavailable, it keeps the work in the coordinator unless another
native primitive has the same lifecycle semantics.

## Session Work Reports

At `SessionStart`, a non-blocking hook quietly tells Codex where the current
session report belongs: `.ccc/<session-id>.md` in the project Git root. Codex
creates or updates it only after a turn produces substantive project work or
durable findings, and keeps the content limited to:

- what it did
- what it completed
- verification results, or why verification was not run

Greetings, simple Q&A, explanations, clarification, approvals, planning-only,
and status-only turns do not update the report. It is one cumulative report per
session, not one section per message. The hook never writes, checks, or blocks
completion, and never produces a follow-up message. Reports must not contain
chain-of-thought, prompts, raw transcripts, secrets, or routine tool logs. They
remain local session metadata and are not staged or committed unless the user
explicitly asks.

## Requirements

- macOS or Linux shell environment
- Codex CLI installed and authenticated, with plugin commands available
- Node.js 20 or newer for local hooks and MCP runtimes
- Python 3 only for skills that explicitly use their bundled Python helpers

## Install

### Native Codex Install

Install the Git marketplace and plugin:

```bash
codex plugin marketplace add ZhouhaoJiang/codex-conductor
codex plugin add codex-conductor@codex-conductor
```

For a local clone:

```bash
git clone https://github.com/ZhouhaoJiang/codex-conductor.git
cd codex-conductor
codex plugin marketplace add "$PWD"
codex plugin add codex-conductor@codex-conductor
```

Then optionally link the CLI:

```bash
mkdir -p ~/.local/bin
ln -sf "$PWD/plugins/codex-conductor/bin/codex-conductor" ~/.local/bin/codex-conductor
```

### Convenience Installer

`./install.sh` registers the local marketplace, installs the plugin, and links
the CLI:

```bash
./install.sh
```

Useful options:

```bash
./install.sh --no-cli
./install.sh --cli-dir /usr/local/bin
./install.sh --dry-run
```

If an older Codex CLI appears first on `PATH`:

```bash
CODEX_BIN=/Applications/Codex.app/Contents/Resources/codex ./install.sh
```

### Optional CodeGraph

CodeGraph has a large platform runtime, so Conductor never downloads it during
session startup. Install the pinned runtime explicitly:

```bash
./install.sh --with-codegraph
```

It is stored under `~/.local/share/codex-conductor/codegraph` by default. Set
`CODEX_CONDUCTOR_RUNTIME_HOME` to choose another runtime root, or set
`CODEX_CONDUCTOR_CODEGRAPH_BIN` to use an existing executable.

After installing or upgrading the plugin, start a new Codex task so Codex loads
the refreshed skills, hooks, and MCP manifest.

## Upgrade

Git marketplaces are installed from snapshots. Refresh and reinstall with:

```bash
codex plugin marketplace upgrade codex-conductor
codex plugin add codex-conductor@codex-conductor
```

For a local marketplace checkout, running `./install.sh` again refreshes the
installed snapshot.

## CLI Quick Start

```bash
codex-conductor project add app ~/projects/my-app
codex-conductor project use app
codex-conductor project list
codex-conductor dispatch "split this into db, backend, and ui sessions"
```

Available commands:

```text
codex-conductor project add <name> <absolute-path> [profile]
codex-conductor project use <name>
codex-conductor project current
codex-conductor project list
codex-conductor project path [name]
codex-conductor open [name] [prompt...]
codex-conductor exec [name] <prompt...>
codex-conductor resume <thread-id-or-name> [prompt...]
codex-conductor fork <thread-id-or-name> [prompt...]
codex-conductor dispatch [name] <goal...>
```

Set `CODEX_CONDUCTOR_HOME` to store CLI project state somewhere other than
`~/.codex-conductor`.

## Codex App Usage

For visible multi-session orchestration:

```text
CCC split this task into focused sessions and collect the result.
```

For fast direct execution in the current task:

```text
Conductor Lite: implement this directly and verify the changed path once.
```

`CCC` and `/ccc` trigger the orchestration recommendation when used as
standalone tokens. Prompts beginning with `codex conductor`, `codex-conductor`,
`codex con`, or `conductor` also trigger it. `CCC Lite` and `Conductor Lite`
select the direct lane and are intentionally not routed into orchestration.

For delivery-shaped Conductor work, the hook pairs coordination with the
bundled `conductor-lite` discipline instead of depending on an external
execution loop.

## Packaged Capabilities

MCPs:

- `grep_app` — remote public-code search
- `context7` — remote library documentation lookup
- `lsp` — local diagnostics, symbols, definitions, references, and rename
- `git_bash` — local Git Bash execution on native Windows
- `codegraph` — optional local repository graph MCP

Non-blocking hooks:

- Conductor recommendation on orchestration-shaped prompts
- project rules on session start and prompt submit
- matching project file rules after `apply_patch`
- project-rule cache reset after compaction
- Windows Git Bash recommendation and reminder reset
- quiet session-start guidance for `.ccc/<session-id>.md`

Curated skills include the four Conductor skills plus `conductor-lite`,
`ast-grep`, `coding-agent-sessions`, `debugging`, `frontend`, `git-master`,
`lsp`, `lsp-setup`, `programming-strict`, `refactor`, `remove-ai-slops`,
`rules`, `ultimate-browsing`, and `visual-qa`.

`programming-strict` retains the deep strict-programming reference but is
explicit opt-in. The adapted debugging, frontend, refactor, cleanup, and visual
QA skills use focused single-pass workflows rather than automatic parallel
review gates.

## Repository Layout

```text
.agents/plugins/marketplace.json
plugins/codex-conductor/
  .codex-plugin/plugin.json
  .mcp.json
  bin/codex-conductor
  hooks/
  runtime/
    git-bash-hook/
    git-bash-mcp/
    lsp-daemon/
    rules/
  scripts/
    codegraph-mcp.mjs
    conductor-hook.mjs
    install-codegraph-runtime
    rules-hook.mjs
    work-report-hook.mjs
    smoke-test
  skills/
  THIRD_PARTY_NOTICES.md
```

## Development Verification

```bash
plugins/codex-conductor/scripts/smoke-test
node --check plugins/codex-conductor/scripts/conductor-hook.mjs
node --check plugins/codex-conductor/scripts/codegraph-mcp.mjs
node --check plugins/codex-conductor/scripts/rules-hook.mjs
node --check plugins/codex-conductor/scripts/work-report-hook.mjs
python3 -m json.tool plugins/codex-conductor/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/codex-conductor/.mcp.json >/dev/null
bash -n install.sh plugins/codex-conductor/bin/codex-conductor \
  plugins/codex-conductor/scripts/install-codegraph-runtime \
  plugins/codex-conductor/scripts/smoke-test
./install.sh --dry-run
```

## Contributing And Security

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), and
[CHANGELOG.md](./CHANGELOG.md).

## License

Conductor's original code is MIT. Selected OMO shared skills and Git Bash
components remain under Sustainable Use License 1.0. The MIT Rules/LSP
components and all modifications are identified in
[THIRD_PARTY_NOTICES.md](./plugins/codex-conductor/THIRD_PARTY_NOTICES.md); the
applicable license is also included inside each third-party directory.
