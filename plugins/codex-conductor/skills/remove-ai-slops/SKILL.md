---
name: remove-ai-slops
description: "Use when the user explicitly asks to remove AI-generated code smells, deslop a diff, or clean recent generated changes while preserving behavior."
---

# Remove AI Slop

Clean the requested diff or file set, not the whole repository. Preserve
behavior unless the user separately asks for a fix.

## Inspect for

- comments that restate syntax or narrate obvious edits;
- unnecessary wrappers, factories, configuration layers, or indirection;
- duplicated validation, error translation, logging, or data conversion;
- broad exception handling and fake fallbacks that hide real failures;
- speculative branches, unused options, dead helpers, and one-use abstractions;
- weakened types, unstructured maps, casts, and placeholder values;
- inconsistent naming or style that ignores nearby code;
- tests that assert implementation noise instead of observable behavior;
- oversized functions or files whose responsibilities already form clear
  seams; and
- performance workarounds with no measured problem or stated constraint.

## Workflow

1. Bound the cleanup to the user-named files or current branch diff.
2. Identify behavior that must stay stable and run the closest existing tests.
3. Remove the highest-confidence smells in one focused pass. Prefer deletion
   and simplification over introducing another framework.
4. Run the same tests and inspect the diff for accidental behavior changes.
5. Report what was simplified and call out any questionable pattern you left
   alone because its intent could not be proven.
