---
name: visual-qa
description: "Use after a substantial UI change or when the user asks for screenshot comparison, responsive inspection, visual fidelity, CJK clipping, or terminal-layout QA."
---

# Focused Visual QA

Judge the rendered product, not just the code or build output.

## Workflow

1. Start the real app and reach the changed state with representative data.
2. Capture the relevant viewport and interaction state. When a reference exists,
   match viewport, scale, theme, content, and scroll position before comparing.
3. Inspect hierarchy, alignment, spacing, typography, color, clipping, overflow,
   focus, hover, loading, empty/error states, and responsive transitions.
4. Compare reference and actual by region. Separate product defects from bad or
   stale capture evidence.
5. Fix concrete mismatches, recapture the touched state once, and verify the
   interaction still works.

For terminal UIs, also check column width, wide/CJK characters, box drawing,
wrapping, resize behavior, and color-disabled output.

Return a concise pass/fail result with the inspected states and any remaining
visible gap. Do not require an independent review process unless the user or
repository explicitly asks for one.
