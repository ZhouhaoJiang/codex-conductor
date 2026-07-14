---
name: frontend
description: "Use for substantial user-visible frontend work where layout, interaction, responsiveness, accessibility, or visual fidelity is part of the deliverable. Skip for tiny copy-only or mechanically specified edits."
---

# Frontend Quality

Treat the visible result as the contract while respecting the product's
existing component system and visual language.

## Workflow

1. Inspect the rendered surface, nearby components, design tokens, and the
   project's existing UI conventions before changing code.
2. If the user supplied a screenshot, mockup, or URL, extract its concrete
   layout, typography, spacing, color, state, and responsive requirements.
3. Reuse existing primitives first. Introduce a new token or component only
   when the requested surface cannot be expressed cleanly with what exists.
4. Implement the smallest coherent slice, including loading, empty, error,
   hover, focus, keyboard, and mobile behavior that the feature actually needs.
5. Add or extend an actual unit test file when the feature introduces
   non-trivial testable logic. Then verify the live rendered result and user
   path at the relevant viewport sizes. Passing a build or unit tests is not
   functional acceptance; fix visible or interactive mismatches before
   completion.

## Quality bar

- Preserve product identity; avoid generic dashboard styling and decorative
  effects that are not supported by the reference or existing system.
- Keep hierarchy obvious through spacing, type, contrast, and alignment.
- Prefer semantic HTML, usable focus order, readable contrast, and reduced
  motion support.
- Measure performance or accessibility only when relevant to the request; do
  not install a new tooling stack for a small existing-project change.
