---
name: conductor-collector
description: "Use when collecting results from worker Codex threads and synthesizing a coordinator-thread answer."
---

# Conductor Collector

Use this skill after worker threads have been created, forked, or messaged and
the coordinator needs to collect their outputs.

## Collection Workflow

1. Read each worker with `read_thread`.
2. Separate completed findings from blockers.
3. Preserve concise evidence such as commands, files, diffs, or error text.
4. Do not paste long worker transcripts unless the user asks.
5. Produce the final answer from this coordinator thread.

## Synthesis Format

- Start with the outcome.
- List worker findings only when they materially affect the conclusion.
- Name unresolved blockers separately.
- Include verification status for any code or CLI behavior.
