# Codex Conductor

<p align="center">
  <img src="assets/icon.png" alt="Codex Conductor logo" width="96">
</p>

Codex Conductor 0.2.x combines native Codex orchestration with a curated,
lightweight engineering capability pack: bounded task-local subagents for
short-lived independent work and visible sessions for durable work.

## Two Execution Lanes

- `conductor` selects between bounded subagents and durable project/session
  dispatch, then coordinates collection and synthesis.
- `conductor-lite` works directly in the current task, plans only around real
  decisions or risk, uses bounded subagents only when independence materially
  helps, and runs one focused verification pass.

Use `CCC ...` for orchestration and `CCC Lite ...` or `Conductor Lite ...` for
the direct lane. The prompt hook intentionally does not route Lite selectors
into session orchestration.

## Proportional Engineering Quality

For substantive implementation or technical design, `conductor-lite` loads its
[engineering quality defaults](skills/conductor-lite/references/engineering-quality.md).
They preserve durable design and plan decisions, choose standards in
user/repository-first order with compatible mature guides as a fallback, put
unit tests in actual test files, separate functional acceptance from builds and
unit tests, and apply distinct review lenses without forcing extra execution
units.

## Curated Capability Layer

MCPs:

- `grep_app`
- `context7`
- `lsp`
- `git_bash` on native Windows
- optional `codegraph`

Non-blocking hooks:

- orchestration recommendation
- project rules on session start and prompt submit
- matching file rules after `apply_patch`
- project-rule cache reset after compaction
- Windows Git Bash reminder and reset

The plugin does not register automatic update, telemetry, configuration
migration, background CodeGraph setup, post-edit LSP blockers,
comment-checking blockers, stop-continuation, forced planning, or execution
evidence gates.

## Skills

Coordination:

- `conductor`
- `conductor-dispatch`
- `conductor-projects`
- `conductor-collector`
- `conductor-lite`

Engineering capabilities:

- `ast-grep`
- `coding-agent-sessions`
- `debugging`
- `frontend`
- `git-master`
- `lsp`
- `lsp-setup`
- `programming-strict` (explicit opt-in)
- `refactor`
- `remove-ai-slops`
- `rules`
- `ultimate-browsing`
- `visual-qa`

## Install

From the repository root:

```bash
./install.sh
```

Or use Codex's native local-marketplace flow:

```bash
codex plugin marketplace add "$PWD"
codex plugin add codex-conductor@codex-conductor
```

CodeGraph is optional and is never downloaded by a session hook:

```bash
./install.sh --with-codegraph
```

Start a new Codex task after installation so Codex reloads the plugin snapshot.

## Native Dispatch Model

The current Codex task stays responsible for coordination. Before creating or
messaging delegated units, it shows a concise `Dispatch Plan` with each unit's
kind, lifecycle, target, deliverable, evidence, permissions, and fan-out budget.
Bounded native subagents handle short-lived task-local work. Codex App
sessions/threads are reserved for explicitly requested durable, user-visible,
cross-turn, handoff, or independent-worktree execution.

If the matching primitive is unavailable, keep the work in the coordinator or
use another native primitive only when its lifecycle still matches the request.

## Prompt Hook Examples

Should trigger orchestration:

- `CCC 帮我拆成几个 session 跑`
- `codex con collect the project results`
- `跨 session 调度一下这个项目`

Should not trigger orchestration:

- `Conductor Lite：直接修这个问题`
- `CCC Lite finish this change`
- `解释一下这个函数`
- `不要用 conductor`

## License

Conductor's original code is MIT. Selected shared skills and Git Bash
components retain Sustainable Use License 1.0. See
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) and the license file inside
each third-party directory.
