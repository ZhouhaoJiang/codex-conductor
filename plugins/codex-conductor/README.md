# Codex Conductor

<p align="center">
  <img src="assets/icon.png" alt="Codex Conductor logo" width="96">
</p>

Codex Conductor is a local Codex plugin that pairs:

- a small CLI for project-scoped Codex workflows
- focused Codex skills for App-side session orchestration
- a prompt hook that suggests Conductor when a prompt looks like
  multi-session, multi-thread, worker, project, or session orchestration work

The CLI keeps human terminal workflows fast. The skill lets any Codex App
session act as a coordinator that can create or message worker sessions through
Codex App's native thread tools and summarize child results.

This is an experimental `0.1.x` plugin. The CLI and install flow are usable,
but Codex plugin manifest and hook APIs may still change.

## Ask Codex To Install It

Paste this prompt into Codex:

```text
Install Codex Conductor from https://github.com/ZhouhaoJiang/codex-conductor. Add it as a Codex plugin marketplace, install codex-conductor@codex-conductor, and link the optional CLI.
```

Codex can run the native plugin install flow for you. Approve the shell
commands and plugin trust prompt when Codex asks.

## Visible Dispatch Model

The current Codex thread stays responsible for coordination. Before creating or
messaging execution units, it should show a concise `Dispatch Plan` that names
each unit, kind, target, deliverable, expected evidence, and fan-out budget.

Worker sessions/threads are the execution units. Conductor does not add a
hidden session-operator just to call thread APIs. A collector can be a visible
session when synthesis is large enough to show separately, while the coordinator
still owns the final answer.

For project-scoped, durable, parallel, or separate-session work, use Codex App
session/thread units directly. If native session tools are unavailable, keep the
work in the coordinator or ask for a supported session path.

## Install

Install the plugin through the Git marketplace:

```bash
codex plugin marketplace add ZhouhaoJiang/codex-conductor
codex plugin add codex-conductor@codex-conductor
```

For local development, run those commands from the repository root with
`"$PWD"` as the marketplace source.

The CLI is optional. From this plugin directory:

```bash
chmod +x bin/codex-conductor
ln -sf "$PWD/bin/codex-conductor" /usr/local/bin/codex-conductor
```

Or run it directly:

```bash
./bin/codex-conductor help
```

## Upgrade

Git marketplaces are installed from snapshots. A GitHub marketplace source does
not live-sync an already installed plugin after this repo changes.

To upgrade later:

```bash
codex plugin marketplace upgrade codex-conductor
codex plugin add codex-conductor@codex-conductor
```

Start a new Codex thread after upgrading so Codex reloads the updated skills and
hooks.

## CLI Quick Start

```bash
codex-conductor project add app ~/projects/my-app
codex-conductor project use app
codex-conductor project list
codex-conductor open "inspect the current task context"
codex-conductor dispatch "split this into db, backend, and ui workers"
```

Set `CODEX_CONDUCTOR_HOME` to keep state somewhere other than
`~/.codex-conductor`.

## Codex App Usage

After installing the plugin, start a new Codex thread and say:

```text
Use Codex Conductor to split this task into worker sessions.
```

The companion skill tells Codex how to use the built-in App thread tools rather
than requiring a separate MCP server. It also keeps dispatch visible by showing
a plan before it creates or messages visible execution units.

## Skills And Hook

Installed skills:

- `conductor`
- `conductor-dispatch`
- `conductor-projects`
- `conductor-collector`

Installed hook:

- `UserPromptSubmit`: checks whether the prompt looks like Codex thread
  orchestration work and injects a short recommendation when useful.

## Prompt Hook Behavior

The plugin includes a `UserPromptSubmit` hook. It does not create threads by
itself. It only injects a short recommendation when the user's prompt strongly
looks like orchestration work, so the agent can ask whether to use Conductor or
proceed when the user explicitly requested dispatch.

When a prompt already triggers Conductor through `CCC`, a shortcut, or a
worker/session/project-shaped request, the hook also recommends pairing
Conductor with ULW for delivery-shaped work. This keeps the trigger surface
predictable while letting `CCC ...` replace the heavier `CCC ULW ...` habit.

Examples that should trigger it:

- "CCC 帮我拆成 worker 跑"
- "帮我看看这个问题 CCC"
- "codex con collect workers"
- "把这个任务拆成多个 worker 并行跑"
- "跨 session 调度一下这个项目"
- "CCC 修复提交，并更新本地的插件"
- "fork 几个线程分别查 DB/backend/frontend"

Examples that should not trigger it:

- "解释一下这个函数"
- "codex context7 帮我查 docs"
- "修这个单文件 bug"
- "不要用 conductor"
