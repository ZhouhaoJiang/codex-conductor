---
name: conductor-dispatch
description: "Use when splitting a Codex task into visible subagents, worker threads, or parallel investigation, implementation, and verification roles."
---

# Conductor Dispatch

Use this skill when the user wants the current Codex thread to act as a
coordinator and distribute work across visible execution units.

## Dispatch Rules

- Keep this thread responsible for the final synthesis.
- Create visible units only when parallelism has real value.
- Before creating or messaging units, show a concise `Dispatch Plan` in this
  thread.
- Prefer narrow ownership slices over broad duplicate prompts.
- Give each unit a kind, project or cwd, concrete deliverable, expected
  evidence, and fan-out budget.
- Prefer Codex App thread units for project sessions, worker sessions, durable
  workers, project-scoped code changes, or any task where the user expects a
  separate session. Do not send those through a subagent first.
- Use visible subagents for short-lived sidecar work, parallel exploration, or
  when thread creation is not available or not useful.
- Treat visible subagents and worker threads as user-visible execution units for
  the dispatch.
- Do not create a separate session-operator just to perform thread API calls.
  Dispatch meaningful work units instead.
- Use `fork_thread` only when a thread unit needs completed coordinator
  context.
- Use `create_thread` for independent project-scoped thread units.
- Use `read_thread` or the available subagent collection mechanism before
  summarizing results.
- Allow nested dispatch only when the child unit first shows its own
  `Dispatch Plan`, stays within its fan-out budget, and reports child evidence
  back to the coordinator.

## Dispatch Plan Shape

```text
Dispatch Plan:
- unit: <readable unit title>
  kind: <subagent | thread | collector>
  target: <project name or cwd>
  deliverable: <specific output>
  evidence: <files, commands, screenshots, or thread evidence expected>
  changes: <none | allowed scope>
  fanout: <none | max child units and allowed kinds>
```

## Prompt Shape

```text
You are a Codex Conductor visible worker.

Role: <role>
Kind: <subagent | thread | collector>
Project: <project name or absolute path>
Coordinator: <thread title or id if available>
Visibility: Your work is user-visible execution evidence for this dispatch.
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
