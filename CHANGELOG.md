# Changelog

All notable changes to Codex Conductor will be documented in this file.

## Unreleased

- Clarified Conductor dispatch selection so project/session work prefers Codex
  App thread units directly instead of routing through subagents first.
- Added Conductor + ULW pairing guidance to Conductor-triggered prompts,
  reducing the need to type `CCC ULW` manually without widening the hook trigger
  surface to generic delivery prompts.
- Changed plugin icon metadata to use packaged asset paths instead of inline
  data URIs so Codex App can resolve the Conductor logo like other local
  plugins.

## 0.1.7 - 2026-07-01

- Generalized Conductor dispatch from thread-only workers to visible execution
  units, including visible subagents, worker threads, and collector units.
- Added fan-out budget and nested dispatch rules to the Conductor skills,
  generated dispatch prompt, and hook recommendation.
- Added smoke-test coverage for the visible dispatch protocol.

## 0.1.6 - 2026-07-01

- Fixed hook registration by declaring the `UserPromptSubmit` hook manifest in
  `.codex-plugin/plugin.json` and moving it under `hooks/`.
- Added smoke-test coverage that fails when a plugin package does not declare
  installable hook manifests.
- Documented the Codex prompt-based install path near the top of the English,
  Chinese, and packaged plugin READMEs.

## 0.1.5 - 2026-07-01

- Added Codex Conductor logo assets and plugin manifest icon metadata.
- Added logo previews to the English, Chinese, and packaged plugin READMEs.

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
