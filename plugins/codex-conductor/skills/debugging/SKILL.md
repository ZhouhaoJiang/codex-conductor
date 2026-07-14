---
name: debugging
description: "Use for non-trivial runtime debugging when the cause is unclear and observed behavior matters: crashes, hangs, wrong responses, timing issues, silent failures, or resource leaks. Skip for obvious syntax, formatting, or already-localized errors."
---

# Focused Debugging

Find the smallest runtime fact that distinguishes plausible causes, then fix
the confirmed cause. Do not turn debugging into a ceremony.

## Workflow

1. Reproduce the failure with the narrowest reliable command or interaction.
   Record the exact observed output, environment, and boundary conditions.
2. Form 2-3 concrete hypotheses. Rank them by explanatory power and cost to
   test; do not enumerate speculative edge cases with no discriminating test.
3. Inspect or instrument the nearest boundary that separates the leading
   hypotheses. Runtime state outranks a story inferred only from source code.
4. State the confirmed root cause in one causal chain. If evidence is still
   ambiguous, say what remains unknown and run the next cheapest discriminator.
5. When the user asked for a fix, add or extend the smallest regression unit
   test in an actual test file in the repository's test suite. A one-off
   reproducer is diagnostic evidence, not a unit test. Make the minimal repair,
   then run that test.
6. Actually exercise the affected path once after the repair. Remove temporary
   probes, traces, fixtures, and debug flags.

## Guardrails

- Do not change production behavior merely to make a hypothesis easier to test.
- Do not fix adjacent smells unless they are required for the root-cause repair.
- Do not claim a cause from correlation; identify the mechanism and verify it.
- If a debugger or profiler is needed, use the runtime's native tool and keep
  the capture focused on the failing boundary.
