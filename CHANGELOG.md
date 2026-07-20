# Changelog

All notable changes to Codex Conductor will be documented in this file.

## Unreleased

- Added quiet `SessionStart` guidance for a concise `.ccc/<session-id>.md`
  report with work, completion, and verification summaries.
- Limited report updates to substantive project work and durable findings;
  simple Q&A, clarification, planning-only, and status-only turns are skipped.
- Kept reporting non-blocking and cumulative per session, with no per-message
  section, completion check, or extra user-facing Hook response.
- Kept report content model-authored and excluded chain-of-thought, prompts,
  raw transcripts, secrets, and routine tool logs from the report contract.

## 0.2.2 - 2026-07-15

- Restored bounded native subagents as Codex's task-local execution primitive
  for independent investigation, review, comparison, testing, and verification.
- Reserved Codex App sessions/threads for explicitly requested durable,
  user-visible, cross-turn, handoff, or independent-worktree execution.
- Replaced the blanket ban on subagent terminology with semantic smoke coverage
  for execution-unit selection and finite fan-out.

## 0.2.1 - 2026-07-14

- Added proportional engineering-quality defaults to `conductor-lite`: scale
  design and plan artifacts to the work, choose coding standards before
  implementation, put unit tests in real repository test files, and keep
  functional acceptance distinct from lower-level checks.
- Defined design/plan, code, test, and functional review lenses without turning
  them into automatic multi-reviewer or multi-session gates.
- Tightened the focused debugging, refactor, and frontend skills around real
  regression-test files and user-path acceptance.
- Added a durable design decision and implementation plan for the quality model.

## 0.2.0 - 2026-07-14

- Made Conductor dispatch session-first: project, durable, parallel, and
  worker-shaped work now uses Codex App session/thread units directly.
- Integrated the explicit `conductor-lite` execution lane: direct work by
  default, brief planning only around real decisions or risk, no duplicate
  workflow state, and one focused verification pass.
- Replaced the external execution-loop pairing in generated dispatch prompts
  and hook guidance with the bundled lightweight lane.
- Added grep.app, Context7, LSP, Windows Git Bash, and optional CodeGraph MCPs.
- Added non-blocking project-rule and Git Bash reminder hooks while excluding
  automatic updates, telemetry, background provisioning, post-edit blockers,
  stop continuation, and forced execution loops.
- Added selected and adapted engineering skills for AST search, coding-session
  discovery, debugging, frontend work, Git, LSP, strict opt-in programming,
  refactoring, cleanup, browsing escalation, project rules, and visual QA.
- Added explicit third-party attribution and per-directory licenses for the
  MIT and Sustainable Use components selected from OMO 4.17.1.
- Added an explicit `--with-codegraph` installer option; session hooks never
  download the large optional runtime.
- Changed plugin icon metadata to use packaged asset paths instead of inline
  data URIs so Codex App can resolve the Conductor logo like other local
  plugins.

## 0.1.7 - 2026-07-01

- Generalized Conductor dispatch from thread-only workers to visible execution
  units, including worker sessions/threads and collector units.
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
