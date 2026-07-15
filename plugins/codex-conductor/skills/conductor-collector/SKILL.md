---
name: conductor-collector
description: "Use when collecting results from native Codex subagents or sessions/threads and synthesizing a coordinator-thread answer."
---

# Conductor Collector

Use this skill after task-local subagents or durable sessions/threads have been
created, forked, or messaged and the coordinator needs to collect their outputs.

A collector may be a bounded task-local subagent or a visible durable session,
depending on the lifecycle the user requested. It summarizes evidence and
blockers only. The coordinator thread still owns the final synthesis and
decision.

## Collection Workflow

1. Collect each task-local subagent result with the native collaboration tools,
   and read each durable thread worker with `read_thread`.
2. Separate completed findings from blockers.
3. Preserve concise evidence such as commands, files, diffs, or error text.
4. Do not paste long transcripts unless the user asks.
5. If acting as a collector unit, report a concise evidence summary back to
   the coordinator.
6. If acting as the coordinator, produce the final answer from this coordinator
   thread.

## Synthesis Format

- Start with the outcome.
- List child-unit findings only when they materially affect the conclusion.
- Name unresolved blockers separately.
- Include verification status for any code or CLI behavior.
