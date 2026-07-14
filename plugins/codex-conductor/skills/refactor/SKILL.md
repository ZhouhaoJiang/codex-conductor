---
name: refactor
description: "Use when the user explicitly asks to refactor, restructure, extract, simplify, or modernize code while preserving behavior."
---

# Focused Refactor

Refactoring changes structure without silently changing the product contract.

## Workflow

1. Define the exact structural problem and the behavior that must stay stable.
2. Read callers, tests, public types, configuration, and data boundaries around
   the target. Prefer language-aware references or AST search when available.
3. Establish a behavior lock with existing tests or one narrow characterization
   test in an actual test file in the repository's test suite when coverage is
   missing.
4. Make the smallest sequence of coherent transformations. Keep each step
   understandable and avoid mixing unrelated cleanup into the same change.
5. Run the closest tests, then one consumer-facing verification of the affected
   path. Review the diff for accidental API, error, logging, or formatting
   changes.

## Guardrails

- Do not invent an abstraction for a single use unless it removes a real
  boundary problem.
- Do not preserve dead compatibility layers without evidence of a consumer.
- Do not turn a requested local refactor into a repository-wide rewrite.
- If behavior must change, name it explicitly and treat that part as a feature
  or bug fix rather than hiding it inside the refactor.
