---
name: conductor
description: "Use when the user wants Codex to coordinate visible subagents or Codex App threads, switch or target projects, dispatch worker sessions, collect execution results, or use the codex-conductor CLI."
---

# Codex Conductor

Coordinate Codex work from the current App thread. This skill pairs with the
`codex-conductor` CLI, but App-side orchestration should stay implementation
neutral: use whatever visible subagent or thread capabilities the current Codex
environment exposes.

## Intent

Use this skill when the user asks to:

- split a task across visible subagents, worker Codex threads, or both
- keep the current thread as the coordinator
- work inside a specific Codex project
- inspect, message, fork, pin, archive, or collect from related execution units
- generate or use a project-scoped dispatch prompt
- respond to a Conductor hook recommendation

Use the focused companion skills when the intent is narrower:

- `conductor-dispatch` for creating or assigning visible execution units
- `conductor-projects` for CLI project registry and project targeting
- `conductor-collector` for collecting and synthesizing execution results

## Core Rule

Do not introduce MCP for V1 orchestration. Prefer visible orchestration
capabilities already available in the session. For durable App-side thread
coordination, use native Codex App thread tools:

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

Use the CLI for terminal-side project registry and prompt generation. Keep
Conductor's protocol independent of any specific subagent implementation.

## Execution Unit Selection

- Default to Codex App thread units when the user asks for a project session,
  worker session, thread, durable worker, code changes in a project, or
  project-scoped execution. Do not route those requests through a subagent first.
- Use visible subagents for short-lived sidecar work, parallel exploration, or
  execution in environments where thread creation is not available or not
  useful.
- A subagent should create child project sessions only when its prompt
  explicitly assigns it a shard-leader role, gives it a fan-out budget, and the
  current environment exposes thread tools. Otherwise, it should finish its own
  assigned work and report back to the coordinator.

## Hook Recommendation Behavior

The plugin may inject a `codex-conductor-recommendation` context note on
`UserPromptSubmit` when the user's prompt looks like orchestration work.
It also treats shortcut-style prompts such as `CCC ...`, `/ccc ...`,
`codex conductor ...`, `codex-conductor ...`, `codex con ...`, and
`conductor ...` as direct Conductor triggers.

When that happens:

- If the user explicitly asked to split, dispatch, fork, coordinate, or run
  visible subagents or worker threads, use this skill directly.
- If the prompt only loosely resembles orchestration, ask one short question:
  "这个要用 Codex Conductor 拆成可见 worker 跑吗？"
- If the task is tiny, single-threaded, or the user said not to use Conductor,
  ignore the recommendation and continue normally.

## App Orchestration Workflow

1. Restate the coordination goal in one short sentence.
2. If the target project is unclear, call `list_projects` and choose the closest
   project from the user's wording. Ask only if there is real ambiguity.
3. Before creating or messaging execution units, show a concise `Dispatch Plan`
   in the coordinator thread. The plan should list each visible unit, its kind
   (`subagent`, `thread`, or `collector`), target project or cwd, exact
   deliverable, expected evidence, whether it may make changes, and any fan-out
   budget.
4. Decide whether each unit should be:
   - a worker thread for durable, project-scoped execution
   - a visible subagent for short-lived sidecar work or exploration
   - a shard leader only when it is explicitly allowed to create child sessions
   - an existing worker that should receive a follow-up message
5. For Codex App thread units, decide whether to use:
   - `fork_thread` for thread units that need the coordinator's completed context
   - `create_thread` for independent project-scoped thread units
   - `send_message_to_thread` for an existing thread unit
6. Keep prompts tight. Each visible unit needs:
   - role
   - project or cwd
   - exact deliverable
   - verification expected
   - instruction to report concise evidence back
7. Treat visible subagents and worker threads as the execution evidence. Do not
   hide meaningful work behind a single coordinator message.
8. Allow nested dispatch only when the child unit first shows its own
   `Dispatch Plan`, stays within its fan-out budget, and reports child evidence
   back to the coordinator.
9. Set readable titles with `set_thread_title` when using thread units.
10. Use `read_thread` or the available subagent collection mechanism to collect
   results. Include outputs only when evidence is necessary.
11. Optionally create a collector unit when result collection itself is large
   enough to be worth making visible. The collector summarizes evidence; the
   coordinator still owns the final synthesis and decision.
12. Synthesize in the coordinator thread. Name unresolved blockers separately
   from completed child findings.

## Worker Prompt Template

```text
You are a Codex Conductor visible worker.

Role: <role>
Kind: <subagent | thread | collector>
Project: <project name or path>
Coordinator thread: <thread id or title if available>
Visibility: Your work is user-visible execution evidence for this dispatch.
Fan-out budget: <none | max child units and allowed kinds>

Task:
<specific task>

Constraints:
- Stay scoped to this role.
- Verify claims with repo files, commands, docs, or thread evidence.
- If you create child units, show your own Dispatch Plan first and report the
  child evidence back to the coordinator.
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
- Make dispatch visible before creating execution units.
- Do not create execution units for tiny tasks.
- Do not create a separate session-operator just to perform session API calls;
  dispatch meaningful work units instead.
- Do not send broad, identical prompts to many units.
- Do not allow unbounded recursive dispatch. Every nested dispatch needs a
  visible plan, a fan-out budget, and evidence back to the coordinator.
- Do not rely on active unfinished turns when forking; forks only contain
  completed history.
- Prefer worktree threads for code changes that may conflict.
- Prefer same-directory or existing-thread messages for read-only investigation.
