---
name: conductor-collector
description: "Use when collecting results from worker Codex sessions/threads and synthesizing a coordinator-thread answer."
---

# Conductor Collector

Use this skill after worker sessions/threads have been created, forked, or
messaged and the coordinator needs to collect their outputs.

A collector may be dispatched as a visible unit when there are enough child
units or enough evidence that collection should be inspectable on its own. In
that mode, the collector summarizes evidence and blockers only. The coordinator
thread still owns the final synthesis and decision.

## Collection Workflow

1. Read each thread worker with `read_thread`.
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
