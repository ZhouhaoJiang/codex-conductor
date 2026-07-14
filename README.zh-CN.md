# Codex Conductor

<p align="center">
  <img src="plugins/codex-conductor/assets/icon.png" alt="Codex Conductor logo" width="96">
</p>

Codex Conductor 现在既是 Codex 的轻量项目/session 调度层，也是一个精选的
开发能力包。它保留 OMO 里真正好用的工具、知识和非阻断 Hook，同时去掉容易让
强模型过度规划、过度验证、任务完成后还继续推进的默认治理。

[English README](./README.md)

## 让 Codex 自动安装

把下面这段发给 Codex：

```text
Install Codex Conductor from https://github.com/ZhouhaoJiang/codex-conductor. Add it as a Codex plugin marketplace, install codex-conductor@codex-conductor, and link the optional CLI.
```

Codex 会执行原生插件安装流程。过程中按提示确认 shell 命令和插件信任即可。

## 状态

Codex Conductor 0.2.x 仍是实验版本。CLI、精选 MCP、skills、hooks 和本地
marketplace 安装路径已经可用，但 Codex 插件 API 未来仍可能变化。

## 设计边界

Conductor 把“能力”和“治理”分开：

| 层 | 保留内容 | 默认行为 |
| --- | --- | --- |
| Session 调度 | 可见 Dispatch Plan、项目路由、结果收集 | 只在明确要求或任务明显需要调度时启用 |
| 轻量执行 | `conductor-lite` | 显式启用；能直接做就直接做，只在必要时写短计划，只做一轮聚焦验证 |
| 工程质量 | 按规模创建设计/计划产物、项目规范优先、真实测试文件、功能验收 | 在实现过程中执行；review 视角不是自动门禁 |
| 代码智能 | LSP、grep.app、Context7、可选 CodeGraph、Windows Git Bash | 按需使用，不挂每次编辑后的阻断诊断 |
| 项目上下文 | 项目规则加载、文件规则匹配 | 只注入上下文；不携带上游模型专用规则 |
| 专业知识 | 精选或改写后的工程 skills | 软触发或显式触发 |

插件明确不包含自动更新、遥测、配置迁移、后台 CodeGraph 初始化、强制规划、
goal/ledger 循环、Stop 续跑、执行证据门禁，以及上游 comment-checker 阻断器。

## 按规模执行的工程质量

对实质交付，Conductor Lite 会按需读取一份紧凑的工程质量参考，并根据任务本身
决定做到什么程度：

- 架构和关键取舍需要长期保留时写设计文档；多阶段协作状态需要长期保留时写计划
  文档。小而局部的改动不为了仪式强造两份文档。
- 写代码前先确定规范。用户要求和仓库现有规则优先，其次是语言/生态官方惯例；
  仍无规定时，才选择适合该语言、成熟且大规模验证过的规范，例如与项目兼容的
  Google Style Guide。
- 单元测试必须存在于仓库真实测试文件中。临时命令和手工复现属于验证证据，不叫
  单元测试。
- 功能通过真实 UI、API、CLI、集成或运行时路径验收；构建或单测通过不能替代功能
  验收。
- 设计/计划、代码、测试、功能是不同 review 视角，但可以由同一个 reviewer 在
  一轮聚焦检查中切换；默认不因此增加 session。

完整决策见[工程质量模型](docs/design/engineering-quality-model.md)，本次仓库改动由
[融合计划](docs/plans/2026-07-14-engineering-quality-integration.md)记录。

## 它能做什么

- 在终端注册和切换本地项目。
- 在当前项目打开或运行 Codex CLI。
- 为 Codex App 主控任务生成 session-first dispatch prompt。
- 提供调度、直接执行、代码搜索、历史 session 检索、Git、LSP、调试、前端、
  重构和 QA 等聚焦 skills。
- 提供五个 MCP：grep.app、Context7、LSP、Windows Git Bash、可选 CodeGraph。
- 用非阻断生命周期 Hook 加载项目规则。
- 用保守的 prompt hook 提醒是否该使用 Conductor，但不会自行创建 session 或
  修改工作区。

## 可见调度模型

Conductor 保持当前 Codex task 为主控：

1. 创建或发送执行单元前，先展示简短的 `Dispatch Plan`。
2. 用 Codex App session/thread 单元承载有意义的独立工作。
3. Nested dispatch 也要展示计划，并受 fan-out budget 约束。
4. 收集子结果，在主控 task 汇总最终答案。

Session/thread 本身就是用户可见的执行产物。Conductor 不会额外创建一个隐藏的
session operator 只为调用 thread API。当前环境没有原生 session 工具时，它会
留在主控 task 处理，或询问可用的 session 路径。

## 环境要求

- macOS 或 Linux shell
- 已安装并登录 Codex CLI，且支持 plugin 命令
- Node.js 20 或更新版本，用于本地 Hook 和 MCP runtime
- 只有显式使用带 Python helper 的 skill 时才需要 Python 3

## 安装

### Codex 原生命令

安装 Git marketplace 和插件：

```bash
codex plugin marketplace add ZhouhaoJiang/codex-conductor
codex plugin add codex-conductor@codex-conductor
```

本地 clone：

```bash
git clone https://github.com/ZhouhaoJiang/codex-conductor.git
cd codex-conductor
codex plugin marketplace add "$PWD"
codex plugin add codex-conductor@codex-conductor
```

然后可选地链接 CLI：

```bash
mkdir -p ~/.local/bin
ln -sf "$PWD/plugins/codex-conductor/bin/codex-conductor" ~/.local/bin/codex-conductor
```

### 便捷安装脚本

`./install.sh` 会注册本地 marketplace、安装插件并链接 CLI：

```bash
./install.sh
```

常用参数：

```bash
./install.sh --no-cli
./install.sh --cli-dir /usr/local/bin
./install.sh --dry-run
```

如果 `PATH` 前面是旧版 Codex CLI：

```bash
CODEX_BIN=/Applications/Codex.app/Contents/Resources/codex ./install.sh
```

### 可选 CodeGraph

CodeGraph 的平台 runtime 体积较大，所以 Conductor 永远不会在 SessionStart
偷偷下载。需要时显式安装固定版本：

```bash
./install.sh --with-codegraph
```

默认安装到 `~/.local/share/codex-conductor/codegraph`。可以用
`CODEX_CONDUCTOR_RUNTIME_HOME` 更换 runtime 根目录，或用
`CODEX_CONDUCTOR_CODEGRAPH_BIN` 指向已有可执行文件。

安装或升级后请新开一个 Codex task，让 Codex 加载更新后的 skills、hooks 和
MCP manifest。

## 升级

Git marketplace 按快照安装。刷新并重装：

```bash
codex plugin marketplace upgrade codex-conductor
codex plugin add codex-conductor@codex-conductor
```

如果使用本地 checkout，重新运行 `./install.sh` 就会刷新已安装快照。

## CLI 快速开始

```bash
codex-conductor project add app ~/projects/my-app
codex-conductor project use app
codex-conductor project list
codex-conductor dispatch "把这个任务拆成 db、backend、ui 三个 session"
```

可用命令：

```text
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

设置 `CODEX_CONDUCTOR_HOME` 可以把 CLI 项目状态放到
`~/.codex-conductor` 之外的位置。

## Codex App 里怎么用

需要可见的多 session 调度时：

```text
CCC 把这个任务拆成几个聚焦 session，最后收集结果。
```

需要在当前 task 快速直接完成时：

```text
Conductor Lite：直接完成这个修改，只验证一次受影响路径。
```

`CCC` 和 `/ccc` 作为独立 token 时会触发调度提醒。以 `codex conductor`、
`codex-conductor`、`codex con` 或 `conductor` 开头也会触发。`CCC Lite` 和
`Conductor Lite` 选择直接执行通道，因此不会被送进调度 Hook。

对交付型 Conductor 任务，Hook 会把调度和内置 `conductor-lite` 纪律配对，
不再依赖外部执行循环。

## 内置能力

MCP：

- `grep_app`：远程公共代码搜索
- `context7`：远程库文档检索
- `lsp`：本地诊断、符号、定义、引用和安全重命名
- `git_bash`：原生 Windows 下本地 Git Bash 执行
- `codegraph`：可选的本地仓库图 MCP

非阻断 Hook：

- 对调度型 prompt 注入 Conductor 提醒
- SessionStart 和 UserPromptSubmit 加载项目规则
- `apply_patch` 后匹配项目文件规则
- compact 后重置项目规则缓存
- Windows Git Bash 提醒和 compact 后提醒重置

精选 skills 包括四个原有 Conductor skill，以及 `conductor-lite`、
`ast-grep`、`coding-agent-sessions`、`debugging`、`frontend`、`git-master`、
`lsp`、`lsp-setup`、`programming-strict`、`refactor`、`remove-ai-slops`、
`rules`、`ultimate-browsing` 和 `visual-qa`。

`programming-strict` 保留深度严格编程资料，但只能显式启用。改写后的调试、
前端、重构、清理和视觉 QA skill 使用聚焦单轮流程，不再默认发起并行复审门禁。

## 项目结构

```text
.agents/plugins/marketplace.json
plugins/codex-conductor/
  .codex-plugin/plugin.json
  .mcp.json
  bin/codex-conductor
  hooks/
  runtime/
  scripts/
  skills/
  THIRD_PARTY_NOTICES.md
```

## 开发验证

```bash
plugins/codex-conductor/scripts/smoke-test
node --check plugins/codex-conductor/scripts/conductor-hook.mjs
node --check plugins/codex-conductor/scripts/codegraph-mcp.mjs
node --check plugins/codex-conductor/scripts/rules-hook.mjs
python3 -m json.tool plugins/codex-conductor/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/codex-conductor/.mcp.json >/dev/null
bash -n install.sh plugins/codex-conductor/bin/codex-conductor \
  plugins/codex-conductor/scripts/install-codegraph-runtime \
  plugins/codex-conductor/scripts/smoke-test
./install.sh --dry-run
```

## 贡献和安全

见 [CONTRIBUTING.md](./CONTRIBUTING.md)、[SECURITY.md](./SECURITY.md) 和
[CHANGELOG.md](./CHANGELOG.md)。

## License

Conductor 原创代码使用 MIT。精选的 OMO shared skills 和 Git Bash 组件仍使用
Sustainable Use License 1.0；MIT 的 Rules/LSP 组件和所有修改归属记录在
[THIRD_PARTY_NOTICES.md](./plugins/codex-conductor/THIRD_PARTY_NOTICES.md)，每个
第三方目录内也保留了对应许可文本。
