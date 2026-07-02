# Codex Conductor

<p align="center">
  <img src="plugins/codex-conductor/assets/icon.png" alt="Codex Conductor logo" width="96">
</p>

Codex Conductor 是一个面向 Codex 的轻量调度层。它把 CLI、Codex skill
和 prompt hook 打包成一个本地 Codex plugin，让任意一个 Codex 线程都能作为
主控线程，去协调可见 subagents 和项目级 worker threads。

[English README](./README.md)

## 让 Codex 自动安装

把这段提示词发给 Codex：

```text
Install Codex Conductor from https://github.com/ZhouhaoJiang/codex-conductor. Add it as a Codex plugin marketplace, install codex-conductor@codex-conductor, and link the optional CLI.
```

Codex 会帮你走原生 plugin 安装流程。过程中如果 Codex 要求确认 shell
命令或信任 plugin prompt，按提示确认即可。

## 状态

Codex Conductor 目前是实验性的 `0.1.x` 本地插件。CLI 和插件安装路径已经
可用，但 Codex plugin manifest 和 hook API 仍可能变化。

## 它能做什么

- 在终端里注册和切换本地项目。
- 在当前项目里打开或运行 Codex CLI。
- 生成适合丢进 Codex App 主控线程的 dispatch prompt。
- 安装多个聚焦的 Codex skills，分别处理调度、项目路由和执行结果收集。
- 安装一个保守的 `UserPromptSubmit` hook。当你的 prompt 像是多线程、多
  agent、多 session、project 或 worker 调度任务时，它会提醒 agent 可以考虑
  使用 Conductor。

Conductor 不启动 MCP server。V1 刻意保持简单，App 侧调度优先使用 Codex
App 原生线程工具，同时保持调度协议不绑定任何具体 subagent 实现。

## 可见调度模型

Conductor 保持当前 Codex thread 作为主控线程。不管底层使用哪种执行能力，
调度过程都要对用户可见：

1. 创建或发送执行单元前，先展示 `Dispatch Plan`。
2. 为有意义的工作单元派发可见 subagents、worker threads 或 collector units。
3. 每一次 nested dispatch 都要有自己的可见计划和 fan-out budget。
4. 收集子任务结果，并在主控线程里汇总最终答案。

可见 subagent 和 worker thread 本身就是执行产物。Conductor 不额外创建一个
隐藏的 session-operator，只为了代替主控线程调用 thread API。结果收集本身很重
时，可以把 collector 派发成一个可见执行单元，但最终汇总和裁决仍由主控线程
负责。

如果任务是项目级、需要持久执行，或者用户期待它有自己的 session，Conductor
应该直接优先使用 Codex App thread 单元。可见 subagent 适合短生命周期的旁路
工作或探索，不应该作为打开 project session 之前的额外一跳。

## 环境要求

- macOS 或 Linux shell
- 已安装并登录 Codex CLI，并且该 CLI 支持 plugin 安装命令
- `PATH` 中有 Node.js，用于运行 prompt hook

## 安装

### Codex 原生命令安装

用 Codex 原生 plugin 命令安装 marketplace：

```bash
codex plugin marketplace add ZhouhaoJiang/codex-conductor
codex plugin add codex-conductor@codex-conductor
```

如果是本地 clone，用 clone 目录作为 marketplace root：

```bash
git clone https://github.com/ZhouhaoJiang/codex-conductor.git
cd codex-conductor
codex plugin marketplace add "$PWD"
codex plugin add codex-conductor@codex-conductor
```

然后链接可选 CLI：

```bash
mkdir -p ~/.local/bin
ln -sf "$PWD/plugins/codex-conductor/bin/codex-conductor" ~/.local/bin/codex-conductor
```

如果你更喜欢 UI 流程，可以添加 marketplace 后在 Codex App 里打开
`/plugins`，从插件页安装。

### 便捷安装脚本

`./install.sh` 只是把上面的原生命令包了一层，并顺手链接 CLI：

```bash
./install.sh
```

安装脚本会做三件事：

1. 把当前仓库注册成 `codex-conductor` Codex plugin marketplace。
2. 安装 `codex-conductor@codex-conductor`，包括里面的 skill 和 prompt hook。
3. 默认把 CLI 链接到 `~/.local/bin/codex-conductor`。

安装脚本会自动寻找支持 `codex plugin add` 的 Codex CLI。如果你的 `PATH` 里
旧版 `codex` 排在前面，可以显式指定新版 Codex CLI：

```bash
CODEX_BIN=/Applications/Codex.app/Contents/Resources/codex ./install.sh
```

指定 CLI 安装目录：

```bash
./install.sh --cli-dir /usr/local/bin
```

只安装 Codex plugin，不安装 CLI 链接：

```bash
./install.sh --no-cli
```

只预览命令，不修改系统：

```bash
./install.sh --dry-run
```

`--dry-run` 是验证工具，不是安装步骤。

安装完成后，请新开一个 Codex thread，让 Codex 重新加载 plugin skill 和
hook。

## 升级

Git marketplace 是按快照安装的。配置了 GitHub 地址以后，已经安装到本机的
plugin 不会随着仓库更新自动实时同步。

后续升级时运行：

```bash
codex plugin marketplace upgrade codex-conductor
codex plugin add codex-conductor@codex-conductor
```

如果不确定当前 marketplace 名字：

```bash
codex plugin marketplace list
codex plugin marketplace upgrade
codex plugin add codex-conductor@codex-conductor
```

升级后请新开一个 Codex thread，让 Codex 重新加载新版 skills 和 hooks。

## CLI 快速开始

```bash
codex-conductor project add app ~/projects/my-app
codex-conductor project use app
codex-conductor project list
codex-conductor dispatch "把这个任务拆成 db、backend、ui 三个 worker 跑"
```

常用命令：

```bash
codex-conductor project add <name> <absolute-path> [profile]
codex-conductor project use <name>
codex-conductor project current
codex-conductor project list
codex-conductor project path [name]
codex-conductor open [name] [prompt...]
codex-conductor exec [name] <prompt...>
codex-conductor resume <thread-id-or-name> [prompt...]
codex-conductor fork <thread-id-or-name> [prompt...]
codex-conductor dispatch [name] <goal...>
```

如果你想把 CLI 状态放到其他位置，可以设置 `CODEX_CONDUCTOR_HOME`，默认是
`~/.codex-conductor`。

## Codex App 里怎么用

新开一个 Codex App thread 后，可以说：

```text
Use Codex Conductor to split this task into visible workers.
```

安装后的 skill 会指导主控线程：

- 查找或锁定目标项目
- 创建执行单元前展示简短的 dispatch plan
- 派发可见 subagents、worker threads 或 collector units
- 给每个 worker 分配清晰角色和 fan-out budget
- 设置可读的线程标题
- 收集子任务结果
- 在主控线程里汇总最终结论

prompt hook 只负责注入提醒，不会自己创建线程。

`CCC` 和 `/ccc` 是魔法词，只要作为独立 token 出现在 prompt 任意位置就会触发
hook。其他快捷 prompt 也会触发 hook，例如以 `codex conductor`、
`codex-conductor`、`codex con` 或 `conductor` 开头。

## 项目结构

```text
.agents/plugins/marketplace.json
plugins/codex-conductor/
  .codex-plugin/plugin.json
  assets/icon.png
  assets/logo.png
  assets/logo-dark.png
  assets/logo.svg
  bin/codex-conductor
  hooks/user-prompt-submit-recommending-conductor.json
  scripts/conductor-hook.mjs
  scripts/smoke-test
  skills/conductor/SKILL.md
  skills/conductor-dispatch/SKILL.md
  skills/conductor-projects/SKILL.md
  skills/conductor-collector/SKILL.md
```

## 开发验证

这些命令是给贡献者验证本地 checkout 用的，不是用户安装路径。

运行：

```bash
plugins/codex-conductor/scripts/smoke-test
node --check plugins/codex-conductor/scripts/conductor-hook.mjs
python3 -m json.tool plugins/codex-conductor/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/codex-conductor/hooks/user-prompt-submit-recommending-conductor.json >/dev/null
bash -n install.sh plugins/codex-conductor/bin/codex-conductor plugins/codex-conductor/scripts/smoke-test
./install.sh --dry-run
codex plugin add codex-conductor@codex-conductor --json
```

## 贡献和安全

见 [CONTRIBUTING.md](./CONTRIBUTING.md)、[SECURITY.md](./SECURITY.md) 和
[CHANGELOG.md](./CHANGELOG.md)。

## License

MIT
