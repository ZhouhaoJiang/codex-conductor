---
name: conductor
description: "Use when the user wants Codex to coordinate bounded native subagents or Codex App sessions/threads, switch or target projects, dispatch work, collect execution results, or use the codex-conductor CLI."
---

# Codex Conductor

Coordinate Codex work from the current App thread. Choose the smallest native
execution unit that matches the requested lifecycle: direct work in the current
task by default, bounded subagents for short-lived independent lanes, and Codex
App sessions/threads for explicitly requested durable, user-visible work.

## Intent

Use this skill when the user asks to:

- split a task across bounded native subagents or worker Codex sessions/threads
- keep the current thread as the coordinator
- work inside a specific Codex project
- inspect, message, fork, pin, archive, or collect from related execution units
- generate or use a project-scoped dispatch prompt
- respond to a Conductor hook recommendation

Use the focused companion skills when the intent is narrower:

- `conductor-lite` for direct delivery inside the current session without
  orchestration overhead
- `conductor-dispatch` for creating or assigning native execution units
- `conductor-projects` for CLI project registry and project targeting
- `conductor-collector` for collecting and synthesizing execution results

## Core Rule

Do not use MCP as the transport for orchestration. The plugin's MCPs form a
separate code-intelligence capability layer. For task-local bounded
investigation, review, comparison, testing, or verification, use the native
subagent/collaboration tools exposed by the environment, such as `spawn_agent`,
`send_message`, `followup_task`, `wait_agent`, `interrupt_agent`, and
`list_agents`.

For durable, user-visible coordination, use Codex App thread tools:

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

Use the CLI for terminal-side project registry and prompt generation. Do not
conflate the lifecycles: a subagent is a task-local execution primitive; a
session/thread is a durable artifact the user can revisit.

## Execution Unit Selection

- Keep work in the coordinator when it is small, sequential, or does not gain
  meaningful independence from delegation.
- Use a bounded native subagent when a short-lived, independently scoped lane
  benefits from concurrency or a genuinely different perspective. Typical
  lanes are repository investigation, design/code/test review, comparison, and
  focused verification. Give it one concrete deliverable and a finite fan-out
  budget.
- Use Codex App session/thread units when the user explicitly asks for a project
  session, worker session, thread, or another durable, user-visible, cross-turn,
  handoff, or independent-worktree artifact.
- If the preferred primitive is unavailable, keep the work in the coordinator
  or use another native primitive only when its lifecycle still matches the
  request. Lack of session tools must not disable bounded native subagents.
- A delegated unit may create children only when its prompt explicitly assigns
  a shard-leader role and a finite fan-out budget. Otherwise it must finish its
  own assignment and report back.

## Hook Recommendation Behavior

The plugin may inject a `codex-conductor-recommendation` context note on
`UserPromptSubmit` when the user's prompt looks like orchestration work.
It also treats shortcut-style prompts such as `CCC ...`, `/ccc ...`,
`codex conductor ...`, `codex-conductor ...`, `codex con ...`, and
`conductor ...` as direct Conductor triggers.

When that happens:

- If the user explicitly asked to split, dispatch, fork, coordinate, run work
  in parallel, or create worker sessions/threads, use this skill directly.
- If the prompt only loosely resembles orchestration, ask one short question:
  "这个要用 Codex Conductor 拆成并行执行单元吗？"
- If the task is tiny, single-threaded, or the user said not to use Conductor,
  ignore the recommendation and continue normally.

## App Orchestration Workflow

1. Restate the coordination goal in one short sentence.
2. If the target project is unclear, call `list_projects` and choose the closest
   project from the user's wording. Ask only if there is real ambiguity.
3. Before creating or messaging delegated execution units, show a concise
   `Dispatch Plan` in the coordinator thread. The plan should list each unit's
   kind (`subagent`, `session`, or `collector`), lifecycle (`task-local` or
   `durable`), target project or cwd, exact deliverable, expected evidence,
   whether it may make changes, and any fan-out budget.
4. Decide whether each unit should be:
   - a bounded native subagent for short-lived task-local work
   - a worker session/thread for durable, project-scoped execution
   - a task-local or durable collector when result collection is substantial
   - a shard leader only when it is explicitly allowed to create child units
   - an existing worker that should receive a follow-up message
5. For native subagents, use the collaboration tools exposed by the environment.
   Spawn only concrete bounded tasks, continue useful coordinator work while
   they run, and collect every result before synthesis.
6. For Codex App thread units, decide whether to use:
   - `fork_thread` for thread units that need the coordinator's completed context
   - `create_thread` for independent project-scoped thread units
   - `send_message_to_thread` for an existing thread unit
7. Keep prompts tight. Each delegated unit needs:
   - role
   - project or cwd
   - exact deliverable
   - verification expected
   - instruction to report concise evidence back
   - the bundled `conductor-lite` discipline for delivery work unless the role
     needs a stricter explicitly named profile
8. Treat each returned result as execution evidence. Sessions/threads remain
   user-visible artifacts; subagents remain bounded to the current task.
9. Allow nested dispatch only when the child unit first shows its own
   `Dispatch Plan`, stays within its fan-out budget, and reports child evidence
   back to the coordinator.
10. Set readable titles with `set_thread_title` when using thread units.
11. Use native result collection for subagents and `read_thread` for App thread
    units. Include outputs only when evidence is necessary.
12. Optionally create a collector unit when result collection itself is large
   enough to be worth making visible. The collector summarizes evidence; the
   coordinator still owns the final synthesis and decision.
13. Synthesize in the coordinator thread. Name unresolved blockers separately
   from completed child findings.

## Execution Unit Prompt Template

```text
You are a Codex Conductor execution unit.

Role: <role>
Kind: <subagent | session | collector>
Lifecycle: <task-local | durable>
Project: <project name or path>
Coordinator thread: <thread id or title if available>
Visibility: <reports to current task | user-visible session artifact>
Fan-out budget: <none | max child units and allowed kinds>

Task:
<specific task>

Constraints:
- Stay scoped to this role.
- Verify claims with repo files, commands, docs, or thread evidence.
- Do not create child units unless the fan-out budget explicitly allows it. If
  allowed, show your own Dispatch Plan first and report the child evidence back.
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
- Do not create a durable session when a bounded task-local subagent matches the
  requested lifecycle, and do not present a subagent as a durable session.
- Do not create a separate session-operator just to perform session API calls;
  dispatch meaningful work units instead.
- Do not send broad, identical prompts to many units.
- Do not allow unbounded recursive dispatch. Every nested dispatch needs a
  visible plan, a fan-out budget, and evidence back to the coordinator.
- Do not rely on active unfinished turns when forking; forks only contain
  completed history.
- Prefer worktree threads for code changes that may conflict.
- Prefer same-directory or existing-thread messages for read-only investigation.
- After substantive coordinated work, keep one coordinator-owned
  `.ccc/<session-id>.md` work report. Delegated units report back to the
  coordinator instead of creating separate reports.
