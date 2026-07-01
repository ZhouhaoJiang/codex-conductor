---
name: conductor
description: "Use when the user wants Codex to coordinate multiple Codex App threads, switch or target projects, dispatch worker sessions, collect worker results, or use the codex-conductor CLI."
---

# Codex Conductor

Coordinate Codex work from the current App thread. This skill pairs with the
`codex-conductor` CLI, but App-side orchestration should use Codex App's native
thread tools directly.

## Intent

Use this skill when the user asks to:

- split a task across worker Codex threads
- keep the current thread as the coordinator
- work inside a specific Codex project
- inspect, message, fork, pin, archive, or collect from related threads
- generate or use a project-scoped dispatch prompt
- respond to a Conductor hook recommendation

Use the focused companion skills when the intent is narrower:

- `conductor-dispatch` for creating or assigning worker threads
- `conductor-projects` for CLI project registry and project targeting
- `conductor-collector` for collecting and synthesizing worker results

## Core Rule

Do not introduce MCP for V1 orchestration. Prefer the native Codex App thread
tools available in the session:

- `list_projects`
- `create_thread`
- `fork_thread`
- `list_threads`
- `read_thread`
- `send_message_to_thread`
- `set_thread_title`
- `set_thread_pinned`
- `set_thread_archived`
- `handoff_thread`

Use the CLI for terminal-side project registry and prompt generation. Use App
thread tools for App-side coordination.

## Hook Recommendation Behavior

The plugin may inject a `codex-conductor-recommendation` context note on
`UserPromptSubmit` when the user's prompt looks like orchestration work.
It also treats shortcut-style prompts such as `CCC ...`, `/ccc ...`,
`codex conductor ...`, `codex-conductor ...`, `codex con ...`, and
`conductor ...` as direct Conductor triggers.

When that happens:

- If the user explicitly asked to split, dispatch, fork, coordinate, or run
  worker threads, use this skill directly.
- If the prompt only loosely resembles orchestration, ask one short question:
  "这个要用 Codex Conductor 拆成多线程 worker 跑吗？"
- If the task is tiny, single-threaded, or the user said not to use Conductor,
  ignore the recommendation and continue normally.

## App Orchestration Workflow

1. Restate the coordination goal in one short sentence.
2. If the target project is unclear, call `list_projects` and choose the closest
   project from the user's wording. Ask only if there is real ambiguity.
3. Decide whether to use:
   - `fork_thread` for workers that need the coordinator's completed context
   - `create_thread` for independent project-scoped workers
   - `send_message_to_thread` for an existing worker
4. Keep worker prompts tight. Each worker needs:
   - role
   - project or cwd
   - exact deliverable
   - verification expected
   - instruction to report concise evidence back
5. Set readable titles with `set_thread_title`.
6. Use `read_thread` to collect results. Include outputs only when evidence is
   necessary.
7. Synthesize in the coordinator thread. Name unresolved blockers separately
   from completed worker findings.

## Worker Prompt Template

```text
You are a Codex Conductor worker.

Role: <role>
Project: <project name or path>
Coordinator thread: <thread id or title if available>

Task:
<specific task>

Constraints:
- Stay scoped to this role.
- Verify claims with repo files, commands, docs, or thread evidence.
- Do not make destructive changes.
- Report concise findings, changed files if any, and verification results.
```

## CLI Workflow

The CLI lives at `bin/codex-conductor` inside this plugin.

Common commands:

```bash
codex-conductor project add <name> <absolute-path> [profile]
codex-conductor project use <name>
codex-conductor project list
codex-conductor open [name] [prompt...]
codex-conductor exec [name] <prompt...>
codex-conductor dispatch [name] <goal...>
```

If the CLI is not on `PATH`, run it from the plugin directory:

```bash
./bin/codex-conductor help
```

## Guardrails

- Keep the coordinator responsible for final synthesis.
- Do not spawn workers for tiny tasks.
- Do not send broad, identical prompts to many workers.
- Do not rely on active unfinished turns when forking; forks only contain
  completed history.
- Prefer worktree threads for code changes that may conflict.
- Prefer same-directory or existing-thread messages for read-only investigation.
