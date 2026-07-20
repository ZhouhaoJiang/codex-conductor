---
name: conductor-lite
description: "Use only when the user explicitly asks for Conductor Lite, CCC Lite, or the bundled lightweight execution mode. Execute directly, plan only when a real decision or risk requires it, and verify once without adding orchestration state."
---

# Conductor Lite

Conductor Lite is the direct-execution lane inside Codex Conductor. It keeps
useful engineering discipline while leaving a strong model room to reason.

## Activation

Activate only when the user explicitly says `Conductor Lite`, `CCC Lite`, or
directly names this skill. Ordinary prompts should use normal Codex behavior.

## Operating contract

1. Inspect the smallest amount of real workspace context needed to act.
2. Start implementation immediately when the path is clear.
3. Write a brief plan only when the work has a real architectural choice,
   multiple dependent stages, destructive risk, or an unclear success
   criterion. Keep that plan to 2-5 outcome-oriented steps.
4. Do not create duplicate goals, ledgers, evidence files, or checkpoints.
   Repository-native plans and artifacts still apply when the repository or
   user explicitly requires them. The plugin-managed
   `.ccc/<session-id>.md` session work report is the single default exception;
   update it only after substantive project work, but do not create extra
   workflow files around it.
5. Do not delegate by default. Use a small, bounded set of native subagents only
   when short-lived independent investigation, review, comparison, testing, or
   verification materially improves speed or confidence. Use Conductor
   session/thread dispatch only when the user explicitly asks for a durable,
   user-visible, cross-turn, handoff, or independent-worktree execution
   artifact.
6. Make the smallest coherent change that fulfills the request and preserves
   nearby conventions.
7. Run one focused verification pass covering the changed behavior. Add more
   verification only when the first pass exposes a concrete risk or failure.
8. Report the outcome, the verification performed, and any real remaining
   limitation. Do not narrate routine internal steps.

## Engineering quality

For substantive implementation or technical design, read the
[engineering quality defaults](references/engineering-quality.md) before
editing. Use them to scale design and plan artifacts, select the applicable
coding standard, distinguish unit tests from functional acceptance, and review
the result through the relevant lenses. Apply the defaults proportionally;
they are guidance for judgment, not another workflow gate.

## Clarification gate

Ask a question only when the answer would materially change the implementation
or authorize a significant external side effect. Otherwise inspect the
workspace, make the safest narrow assumption, and continue.

## Relationship to Conductor

- `conductor-lite` governs execution inside the current session.
- `conductor` selects between bounded task-local subagents and visible,
  durable session/thread dispatch and collection.
- They can be paired: Conductor coordinates; Conductor Lite keeps each delivery
  lane direct and lightweight.
