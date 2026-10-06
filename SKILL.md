---
name: technical-editorial-web
description: "制作专业中文 HTML 连续长页，或用于需求确认、方向比较和计划调整的交互工作台。用于长页报告/方案与工作台设计；一屏一页的翻页演示由分页技能处理。"
---

# Technical Editorial Web

创建来源可追溯、可直接打开的连续阅读长页或探索工作台。接收已有材料，不自动承担独立售前研究；一屏一页演示使用 `presales-html-design`，普通业务应用开发不因“前端”一词触发本技能。

## macOS 执行说明

- 技能目录内的参考、模板和素材使用相对路径；输出按当前项目或应用的目录约定保存。旧说明中的 Windows 开发路径仅作历史示例，不作为 Mac 的工作路径。
- 需要 Python/Node 时，先通过 `load_workspace_dependencies` 获取当前应用捆绑运行时，不假定系统 `python`、`python3` 或 `node` 已安装。使用当前可用浏览器工具核验最终文件；静态校验不替代实际页面和交互检查。
- HTML 运行与 QA 从本机 HTTP 服务打开，检查后保留可移植文件；客户交付不能依赖这个测试服务。字体使用现有系统字体回退，检查中文实际换行。

## 制作流程

1. 核对来源、读者任务和最终形态。正式报告/方案选择长页；需要比较、确认、调整或逐点探索时才选择工作台，不因材料不完整自动扩大任务。
2. 新建页面先读 [page-patterns](references/page-patterns.md) 与 [template-routing](references/template-routing.md)，只选当前任务模板。选结构时读 [composition-recipes](references/composition-recipes.md) 对应原型，不读取全部模板或样例。
3. 按实际内容建立“章节→关系→形式”骨架，并按 [design-review](references/design-review.md) 写一份简短设计计划，复核后再编码。复杂章节或多节去重时查 [layout-modules](references/layout-modules.md)、[composition-variation-matrix](references/composition-variation-matrix.md) 和 [composition-contract](references/composition-contract.md) 的相关关系，不把目录变成无条件整读列表。
4. 新建/整体改版读 [design-system](references/design-system.md)。按用户选择使用 Richinfo、China Mobile、Bank of China；自定义品牌仅在提供批准色值/资产时读 [custom-theme](references/custom-theme.md)。
5. 只加载当前功能需要的细节：图表/流程读 [chart-and-diagram-style](references/chart-and-diagram-style.md)；证据主线/发布内容读 [signature-evidence-and-launch](references/signature-evidence-and-launch.md)；工作台读 [workbench-artifacts](references/workbench-artifacts.md)；人工版式编辑读 [editor-mode](references/editor-mode.md)。
6. 使用匹配模板与 tokens/base 资产，工作台才添加 workbench 资产。客户措辞定稿时读 [customer-facing-copy](references/customer-facing-copy.md)。
7. 完成后执行 [quality-checklist](references/quality-checklist.md)，运行 `python scripts/validate_delivery.py OUTPUT`，单文件加 `--single-file`；按设计计划检查实际桌面/移动画面、键盘、低动态偏好和事实覆盖。用整体截图与阅读尺寸复核主次、中文换行和无用装饰，再修正受影响布局。仅静态验证不能证明视觉与交互通过。

## 持续生效的设计边界

- 来源名字、数字、状态、条件和责任不改义，不制造指标、客户或承诺；工作台推测不能变成已确认选择，确认结果写回维护源。
- 客户可见中文文本 16–60px，统一系统中文无衬线字体；休眠编辑器控件12–15px仅为工作文件例外，clean 导出不含编辑器。
- 真实关系决定形式，不混淆流程/时间线、层次/依赖、边界/状态、分支/并列。表达形式的数量服从内容；同类比较可保持一致结构，不为凑版式数量制造内容或随机换样式。
- 白/浅底、单一品牌主色与少量辅助色；不用整页卡片墙、蓝紫渐变、玻璃光效、装饰粒子和无意义动画。特定长页规则允许紧凑深色结论区，不将该规则带入分页技能。
- 模板的页型和首屏特征服从读者任务，不能只换标题和颜色；文案可替换，共用结构变化后验证受影响模块。

## Output expectations

- Deliver a directly openable HTML file or a clearly documented static bundle.
- Make the visible page composition legible before close reading: the reader should be able to distinguish page thesis, section purpose, object groups, supporting evidence, metadata, and next action from layout alone.
- Keep content slots replaceable after generation. Titles, descriptions, labels, evidence, and statuses should be editable without reconstructing the surrounding layout; reserve structural edits for a real change in information relationship.
- Keep local paths relative and portable; do not rely on a development server unless the task requires one.
- Preserve the built-in editor in working files that need visual refinement. Use its structured change list to update the authored HTML/CSS instead of accumulating snapshot-only changes.
- Omit the editor asset or export a clean snapshot when the user explicitly requests a minimal customer-facing file with no dormant editing code.
- Use `scripts/build_single_html.py` for a truly portable single file; do not describe an external-asset snapshot as self-contained.
- Add no placeholder metrics or customer claims. Label editable structural placeholders clearly in reusable templates only.
- Include a concise source note or assumptions block when source gaps materially affect interpretation.
- For a workbench, keep a generated text handoff or decision ledger so the human result can be reviewed and written back outside browser state.

## Maintaining the skill

When a finished page is genuinely reusable, extract only its generalizable layout, diagram, or component pattern. Remove all customer names, confidential data, project metrics, and business-specific copy before adding an example. Prefer updating an existing token, reference rule, or template over accumulating near-duplicate files. After every change, run `python scripts/validate_templates.py` and `python scripts/test_validate_delivery.py`, syntax-check assets/editorial-editor.js, test the single-file builder and delivery validator, and run the skill validator.

When absorbing an external example set, audit every referenced artifact before changing the library, record the result in a source matrix, then de-duplicate it into page archetypes, section recipes, and atomic components. Reimplement the method in this skill's own semantic classes and visual system; do not copy source code, sample brands, proprietary content, or a fixed visual skin.
