---
name: conductor-dispatch
description: "Use when splitting a Codex task into focused worker threads or assigning parallel investigation, implementation, and verification roles."
---

# Conductor Dispatch

Use this skill when the user wants the current Codex thread to act as a
coordinator and distribute work across worker threads.

## Dispatch Rules

- Keep this thread responsible for the final synthesis.
- Create workers only when parallelism has real value.
- Prefer narrow worker roles over broad duplicate prompts.
- Give each worker a project or cwd, a concrete deliverable, and expected
  evidence.
- Use `fork_thread` only when the worker needs completed coordinator context.
- Use `create_thread` for independent project-scoped workers.
- Use `read_thread` before summarizing worker results.

## Prompt Shape

```text
You are a Codex Conductor worker.

Role: <role>
Project: <project name or absolute path>
Coordinator: <thread title or id if available>

Task:
<focused task>

Report back with:
- findings
- changed files, if any
- commands or evidence used
- blockers
```
