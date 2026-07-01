# Changelog

All notable changes to Codex Conductor will be documented in this file.

## 0.1.4 - 2026-07-01

- Documented Codex's native marketplace install flow separately from developer
  verification commands.
- Clarified that `./install.sh` is a convenience wrapper and `--dry-run` is not
  an installation step.

## 0.1.3 - 2026-07-01

- Added open-source project governance files: contributing guide, security
  policy, changelog, and Git attributes.
- Documented the experimental release status in English and Chinese READMEs.
- Moved hook configuration to root `hooks.json` so plugin validation passes
  without relying on manifest-declared hook fields.
- Ignored local codegraph metadata to keep machine-local paths out of commits.

## 0.1.2 - 2026-06-30

- Added shortcut triggers for `CCC`, `/ccc`, `codex conductor`,
  `codex-conductor`, `codex con`, and `conductor`.
- Added focused Codex skills for dispatch, project routing, and result
  collection.
- Added a `UserPromptSubmit` hook that recommends Conductor for
  orchestration-shaped prompts.
- Added one-command installation for the local marketplace, plugin, skills,
  hook, and CLI symlink.
- Added English and Chinese README files.

## 0.1.1 - 2026-06-30

- Made hook and skill capabilities visible in the plugin package.
- Split the initial general Conductor skill into focused companion skills.

## 0.1.0 - 2026-06-30

- Initial local plugin package with CLI, Codex skill, and smoke test.
