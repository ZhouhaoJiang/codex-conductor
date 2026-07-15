---
name: conductor-dispatch
description: "Use when splitting a Codex task into bounded native subagents or durable sessions/threads for parallel investigation, implementation, and verification roles."
---

# Conductor Dispatch

Use this skill when the user wants the current Codex thread to act as a
coordinator and distribute work across native execution units.

## Dispatch Rules

- Keep this thread responsible for the final synthesis.
- Create delegated units only when parallelism or independent perspective has
  real value.
- Before creating or messaging units, show a concise `Dispatch Plan` in this
  thread.
- Prefer narrow ownership slices over broad duplicate prompts.
- Give each unit a kind, lifecycle, project or cwd, concrete deliverable,
  expected evidence, and fan-out budget.
- For delivery units, use the bundled `conductor-lite` discipline so execution
  stays direct and verification stays focused.
- Use bounded native subagents for short-lived, task-local investigation,
  review, comparison, testing, or verification. Each subagent gets one concrete
  deliverable and reports back to the coordinator.
- Use Codex App session/thread units only when the user explicitly asks for a
  project session/thread or another durable, user-visible, cross-turn, handoff,
  or independent-worktree execution artifact.
- If the preferred primitive is unavailable, keep the work in the coordinator
  or use another native primitive only when the lifecycle still matches.
- Treat sessions/threads as user-visible execution artifacts and subagents as
  bounded task-local execution evidence.
- Do not create a separate session-operator just to perform thread API calls.
  Dispatch meaningful work units instead.
- Use `fork_thread` only when a thread unit needs completed coordinator
  context.
- Use `create_thread` for independent project-scoped thread units.
- Use `read_thread` before summarizing results.
- Allow nested dispatch only when the child unit first shows its own
  `Dispatch Plan`, stays within its fan-out budget, and reports child evidence
  back to the coordinator.

## Dispatch Plan Shape

```text
Dispatch Plan:
- unit: <readable unit title>
  kind: <subagent | session | collector>
  lifecycle: <task-local | durable>
  target: <project name or cwd>
  deliverable: <specific output>
  evidence: <files, commands, screenshots, or thread evidence expected>
  changes: <none | allowed scope>
  fanout: <none | max child units and allowed kinds>
```

## Prompt Shape

```text
You are a Codex Conductor execution unit.

Role: <role>
Kind: <subagent | session | collector>
Lifecycle: <task-local | durable>
Project: <project name or absolute path>
Coordinator: <thread title or id if available>
Visibility: <reports to current task | user-visible session artifact>
Fan-out budget: <none | max child units and allowed kinds>

Task:
<focused task>

Report back with:
- findings
- changed files, if any
- commands or evidence used
- child units and evidence, if you used nested dispatch
- blockers
```
