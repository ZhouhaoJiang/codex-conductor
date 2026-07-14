# 工程质量模型融合计划

状态：已完成
日期：2026-07-14

## 目标

把设计/计划文档、编码规范、真实单元测试、功能验收和多视角 review 融入
Conductor Lite，同时不增加默认编排、重复状态或强制关卡。

## 范围

- 增加一份按需加载的工程质量 reference。
- 在 `conductor-lite` 建立入口，并在调试、重构、前端技能中补场景化约束。
- 用 smoke test 固化核心契约。
- 更新插件版本、README 和 changelog。
- 刷新本地插件并验证安装快照。

## 验收

- 小任务不会被要求强制创建设计和计划文档。
- 编码规范按“用户/仓库 → 官方惯例 → 成熟大规模规范”的顺序选择。
- 单元测试必须能对应到真实测试文件，功能验收必须对应真实行为路径。
- 多种 review 视角不自动等于多个 reviewer 或多个 session。
- source 和本地安装快照通过同一套 smoke test。

## 结果

- 工程质量 reference 已由 `conductor-lite` 在实质编码或技术设计时按需加载。
- 调试、重构和前端技能已分别区分真实测试文件、临时复现和功能验收。
- source 与 `0.2.1` 安装快照均通过 smoke test，18 个安装技能通过结构验证，
  source 与缓存内容一致。
- Codex 插件列表显示 `codex-conductor@codex-conductor` 已启用为 `0.2.1`；完整
  OMO 仍禁用，独立 `omo-lite` 未修改。
- 官方静态插件 validator 仍不接受 manifest 的 `hooks` 字段；真实 Codex 安装、
  hook 契约测试和缓存运行均通过，因此保留实际生效的 hooks。
