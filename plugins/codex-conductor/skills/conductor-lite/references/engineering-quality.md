# Engineering Quality Defaults

Treat this as default judgment, not a universal law or a new approval gate.
Apply only the parts that fit the change, and keep the delivery lane direct.

## Design and plan artifacts

Create durable artifacts when the decision or coordination needs to outlive
the current conversation:

- Write a design document for architecture, public API, data model, security,
  cross-component behavior, or a tradeoff that future maintainers will need to
  understand.
- Write a plan document for multi-stage, coordinated, risky, or long-running
  work whose state needs a durable home. Keep it outcome-oriented and update it
  when reality changes.
- Use the repository's established locations and templates. Do not create a
  second ledger when an issue, RFC, plan file, or other native artifact already
  owns the state.
- For a small, local, reversible change, use a short in-conversation plan when
  needed or proceed directly. Do not manufacture both documents to satisfy a
  ritual.

The value of a document comes from preserving a decision or coordinating work,
not from its length.

## Coding standard hierarchy

Choose the applicable standard before writing code and apply it during the
implementation. Code quality begins during implementation; review checks the
residual risk instead of introducing basic discipline after the fact.

Use this precedence:

1. Follow explicit user and repository rules, including `AGENTS.md`, project
   documentation, formatter and linter configuration, compiler settings, and
   established nearby patterns.
2. Follow the language or framework's official convention when the repository
   leaves a question open.
3. If no local or official convention resolves it, choose an appropriate
   mature, widely adopted language guide. A Google style guide is a strong
   candidate when it covers the language and does not conflict with the
   project; it is an example of a sound default, not a reason to overwrite an
   established codebase.

Do not install a new formatter, reconfigure the toolchain, or reformat unrelated
files merely to impose the fallback guide. Match the codebase while improving
only the touched boundary.

## Unit tests

Put a unit test in an actual test file under the repository's test layout.
Extend the closest existing file when that keeps ownership clear; create a new
file when the unit introduces a genuinely new test boundary.

- Test behavior and meaningful failure or edge cases, not implementation trivia.
- Treat a one-off script, shell command, manual request, or reproducer as
  diagnostic or verification evidence, not as a unit test.
- Run the repository's test runner against the relevant file or suite and
  report the result.
- Do not invent a fake unit test for documentation-only, metadata-only, or
  similarly non-executable changes. Use the validation appropriate to the
  artifact and state why a unit test does not apply.

## Functional acceptance

Derive acceptance scenarios from the requested behavior and exercise the real
user, API, CLI, integration, or runtime path. Include the states that matter to
the feature, such as success, failure, empty, permission, responsive, or
restart behavior.

Passing unit tests, type checks, or a build does not by itself prove functional
acceptance. If the real path cannot be exercised, report that limitation
plainly instead of silently substituting a lower-level check.

## Review lenses

Use distinct questions without automatically creating distinct processes:

- **Design and plan:** Does the solution match the requirement, chosen
  boundaries, tradeoffs, and current execution state?
- **Code:** Is the implementation correct, safe, readable, and consistent with
  the selected coding standard?
- **Tests:** Do real test files cover the important behavior and credible
  failures without overfitting to the implementation?
- **Function:** Does the affected product path behave as requested in the
  relevant environment and states?

One focused review pass may apply all relevant lenses, and the same reviewer
may switch perspectives deliberately. Use separate reviewers or Conductor
sessions only when the user asks for them or genuine independence materially
improves confidence. Do not turn the lenses into mandatory sequential gates.

## Completion evidence

Map each completion claim to the closest evidence: a design or plan artifact,
a diff inspection, a test file and runner result, or an exercised functional
scenario. Report only evidence that exists, and keep the summary proportional
to the change.
