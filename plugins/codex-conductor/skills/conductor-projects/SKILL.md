---
name: conductor-projects
description: "Use when registering, switching, or targeting local projects through the codex-conductor CLI."
---

# Conductor Projects

Use this skill when the user wants Codex Conductor to remember named local
projects or route CLI actions into a project directory.

## CLI Commands

```bash
codex-conductor project add <name> <absolute-path> [profile]
codex-conductor project use <name>
codex-conductor project current
codex-conductor project list
codex-conductor project path [name]
```

## Behavior

- Require absolute project paths when adding a project.
- Treat the current project as the default target when the user omits a name.
- Use `CODEX_CONDUCTOR_HOME` only when the user needs an alternate state
  directory.
- Prefer reporting the active project before dispatching workers if there is
  ambiguity.
