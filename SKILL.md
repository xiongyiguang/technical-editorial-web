---
name: technical-editorial-web
description: Create, redesign, and visually refine professional Chinese HTML deliverables and exploration workbenches in a restrained Technical Editorial Brief style. Use for solution briefs, AI and industry solutions, bid or presales presentations, technology or capability launches, executive reports, technical whitepapers, project case showcases, material blindspot checks, design-direction comparisons, requirements interviews, annotated explainers, and tweakable plans that require source-faithful content, structured diagrams, responsive layouts, in-page interaction, and Richinfo, China Mobile, or Bank of China themes.
---

# Technical Editorial Web

Create source-grounded, directly openable HTML pages whose visual hierarchy supports professional reading. Treat typography, whitespace, evidence, diagrams, and conclusions as the primary design material.

## Required workflow

1. Read the source material completely. Preserve names, metrics, terminology, qualifications, and scope; never invent missing facts.
2. Classify the reader's task with references/page-patterns.md. Then read references/composition-recipes.md and choose one page archetype before choosing a template. Use a stable deliverable when the reader needs a proposal, report, whitepaper, case, implementation plan, or explainer. Read references/workbench-artifacts.md and use a workbench only when the reader must discover, compare, confirm, inspect, reorder, or tune something before the deliverable is authored.
3. Read references/layout-modules.md and references/composition-variation-matrix.md. Mark each source block by its primary relationship: single thesis, parallel items, hierarchy, sequence, cycle, comparison, causal evidence, branching decision, ownership, boundary, status, quantitative relationship, or dependency network. Build and review the section-to-form skeleton before polishing copy: relationship, reading axis, object weight, connectors, responsive order, and visual rhythm are the hard-to-change deliverable; wording remains replaceable content inside that structure. Then select one task-specific opening archetype and route supported content into a primary section recipe plus at most two auxiliary recipes. Choose a relationship-faithful variant rather than repeating the previous section's structure. Common components are an optional vocabulary, not required furniture: use context panels, summary strips, taxonomy chips, comparison boards, milestone rails, annotations, code tours, risk ledgers, evidence rails, diagrams, media, and handoff bars only when they perform a real information job.
4. Read references/signature-evidence-and-launch.md when the source contains a governing mechanism, external evidence, scope-status distinctions, a release, or comparable editions. Classify content maturity before styling it.
5. Read references/design-system.md before styling. Select one built-in theme: Richinfo, China Mobile, or Bank of China. When the user supplies approved brand tokens, read references/custom-theme.md and use a validated `custom` theme. Activate one primary accent; reserve the secondary color for sparse auxiliary marks.
6. Read references/chart-and-diagram-style.md before creating architecture, process, timeline, comparison, KPI, or table components.
7. Start from the matching stable-deliverable or workbench file in templates/. Reuse assets/tokens.css and assets/base.css; workbenches also reuse assets/workbench.css and assets/workbench.js. Use templates/layout-sampler.html only as a visual module catalog. Never normalize all tasks to one homepage: preserve the template's task-specific opening signature and replace it only with another supported opening archetype. For a single-file request, run `python scripts/build_single_html.py SOURCE -o OUTPUT`; add `--clean` for a customer-facing file without the editor.
8. Read references/editor-mode.md when the page needs human visual refinement. Keep assets/editorial-editor.js in the editable working file, preserve stable section IDs and semantic classes, and use `Ctrl+Shift+E` to activate the dormant editor.
9. Establish the information hierarchy before decoration: conclusion, evidence, structure, detail, action or outcome. Remove every empty or unsupported module.
10. Read references/customer-facing-copy.md before final wording. Rewrite every navigation label, eyebrow, section label, heading, caption, status, note, and closing action as natural customer-facing Chinese; keep authoring instructions, evidence-handling methods, and internal consulting jargon out of the finished page.
11. Verify against references/quality-checklist.md, including desktop and mobile layouts, keyboard focus, reduced motion, content fidelity, layout routing, editor dormancy, Chinese visible labels, customer-facing copy, and the 16px-60px authored-content type boundary. Run `python scripts/validate_delivery.py OUTPUT` for a finished bundle or add `--single-file` for a portable file.

## Template routing

- Use templates/solution-brief.html for Chinese proposals, AI solutions, presales and bid presentations.
- Use templates/executive-report.html for management briefings, phase reviews, findings, risks, and actions.
- Use templates/technical-whitepaper.html for architecture, modules, data flow, security, deployment, and technical trade-offs.
- Use templates/project-showcase.html for customer context, construction scope, highlights, evidence, and outcomes.
- Use templates/implementation-plan.html for an implementer-ready plan with delivery summary, milestones, data or responsibility flow, mockups, risks, and open questions.
- Use templates/technical-explainer.html for a source-grounded feature or mechanism explainer with TL;DR, request path, evidence or code tour, gotchas, FAQ, and glossary.
- Use templates/workbench-blindspot-pass.html before drafting when source gaps may affect scope, evidence, responsibility, interfaces, or acceptance.
- Use templates/workbench-design-directions.html when the same supported content must be compared across genuinely different reading and layout directions.
- Use templates/workbench-requirements-interview.html when unresolved choices materially change scope, narrative, evidence treatment, delivery, or validation.
- Use templates/workbench-annotated-explainer.html when the reader must inspect a mechanism, process, evidence chain, or technical concept node by node.
- Use templates/workbench-tweakable-plan.html when fixed boundaries are known but a small number of consequential plan choices remain adjustable.
- Never use templates/layout-sampler.html as a finished-page narrative. Borrow only modules supported by the source.
- Read references/html-effectiveness-audit.md when maintaining or extending this skill. It records the full 20-page audit and the boundary between reusable method and copied appearance.
- Read references/delivery-and-examples.md for prompt examples, single-file delivery, final validation, and the sanitized source-to-output example.
- Read references/custom-theme.md only when the user requests a non-built-in brand and supplies approved colors or a source artifact.

## Non-negotiable rules

- Keep every customer-visible authored text element at 16px or larger, including body text, labels, captions, badges, navigation, diagram text, table metadata, and notes; keep all authored content at or below 60px. The dormant editor chrome intentionally uses compact 12px-15px controls and is the only bundled exception below 16px; clean customer-facing exports do not include it.
- On Chinese deliverables, write every visible structural label in Chinese, including eyebrows, section labels, counts, statuses, table headings, diagram headings, and action labels. Keep English only for a source term, official product name, code identifier, or explicitly requested bilingual display; CSS classes and `data-*` values may remain English.
- Use one system-safe Chinese sans-serif stack across headings, body text, labels, tables, and pull quotes unless the user explicitly requests a contrasting typeface.
- Number ordinary top-level thematic sections in formal stable deliverables as `01／02／03…` to create a traceable document structure and meeting rhythm. Keep these chapter numbers independent from phase, step, priority, and milestone numbering. Workbenches may omit chapter numbers when task controls, rather than document reading, define the navigation.
- Before building a substantial page, create a section-to-form inventory and use at least four fitting presentation forms across the page, such as open narrative, evidence rail, asymmetric cards, process, timeline, diagram, comparison, table, or emphasis band. Do not repeat the same composition in more than two consecutive sections without a content reason.
- Treat composition as the durable part of the HTML and copy as replaceable content. Complete a low-copy structural pass before final wording, and test every major module with representative short and long Chinese titles, different paragraph lengths, and realistic item counts. A later wording change should not require rebuilding the module or rewriting its CSS.
- Create visual richness through genuinely different information geometries, reading axes, object weights, connectors, and surface rhythms. Do not claim richness from color, decoration, or minor card variations; every form must make the content easier to understand, compare, decide, or verify.
- Route every major block through references/composition-variation-matrix.md. Distinguish single thesis, parallel, hierarchy, sequence, cycle, comparison, causal evidence, branching, ownership, boundary, status, quantitative, and dependency relationships. Select by information weight, reading order, shared responsibility, evidence density, conditions, measurement task, and feedback direction. Do not treat color, radius, icon, or column count alone as a composition change.
- Do not collapse process into timeline, hierarchy into dependency, boundary into status, or branching into parallel items. Preserve the relationship that changes what the reader must understand or decide.
- Use a white or near-white canvas, neutral ink and gray, one primary accent, and only sparse secondary-color marks from the active theme. Generated illustrations and diagrams must inherit the selected theme; never introduce a customer's brand color merely because that customer appears in the project. Mix vendor and customer palettes only when the user explicitly requests a dual-brand composition.
- Create meeting rhythm by alternating white, soft-neutral, and theme-tinted sections. A substantial proposal may use one compact deep theme surface for a decisive thesis, value summary, or transition; keep it readable, source-supported, and distinct from a generic dark call to action. Do not allow more than two consecutive sections to share the same surface treatment.
- Build a deliberate component rhythm: open hero, oriented section masthead, bounded object groups, evidence or diagram modules, and a clear close. A substantial page should not read as one repeated container type.
- Keep a distinct first-screen signature and a unique `data-composition-profile` for each task family. A solution, executive report, whitepaper, case, implementation plan, explainer, and editor must not differ only by heading text or accent color.
- Use taxonomy chips only for a real taxonomy, filter, status set, or compact index that materially helps navigation. Never add them merely because another template has them.
- Use structured showcase cards freely for genuinely independent, parallel, comparable, or actionable objects. Give each card a clear anatomy such as visual explanation, title, concise summary, and evidence, status, or action metadata. Do not use an undifferentiated card wall for continuous narrative.
- Do not normalize every image-plus-text block to the same card grid. Before composing media, classify image count, orientation, relative importance, and whether captions are shared or independent. Route equal landscape evidence for one thesis to a triptych strip, independent portrait items to portrait cards, a text-led story with one supporting image to a compact text-image row, and unequal evidence to a lead mosaic. Repeating one media composition is allowed only for a deliberate comparison series; otherwise change the composition when the information relationship changes.
- Route ordered phases, rollout stages, events, and gates to a timeline, milestone rail, or roadmap before considering a table. Use tables only for dense records with stable comparison columns, interface contracts, or audit registers. Do not express more than two major sections with table or matrix grammar on one substantial page when another information-faithful form is available.
- Use CSS and inline SVG for purposeful diagrams. Keep connectors readable and labels concise.
- Give proposal and solution heroes one project-specific visual counterpart when the source supports a governing loop, hub, boundary, channel path, or layered relationship. Use at most one content-specific signature diagram to explain the page's governing mechanism; derive every node and connector from source material and do not duplicate the detailed architecture.
- Distinguish confirmed, candidate, conditional, to-confirm, and out-of-scope content whenever the difference affects commitment, scope, or acceptance.
- Use evidence chains to connect source facts to customer impact and bounded response; label inference and applicability limits.
- Use the editorial launch hero only for an actual announcement, release, or capability introduction. Add tier cards only when the source provides real comparable editions, roles, or paths.
- Write direct, formal Chinese suitable for proposals and technical reports. Customer-visible headings must state a customer conclusion, construction object, business value, or action direction; never expose instructions about how the author should express scope, use evidence, or control commitments. Avoid generic AI marketing language, defensive meta-writing, untranslated structural labels, and internal jargon such as `Decision Gate`, `Scope maturity`, or `Gotchas` unless the source explicitly requires the term.
- Provide responsive behavior without collapsing every section into identical stacked cards.
- Treat workbench browser state as temporary. Copy confirmed decisions back into the maintained source or task; do not let an inferred recommendation appear as a confirmed user choice.

## Prohibited patterns

Do not use blue-purple gradients, glassmorphism, neon glow, heavy shadows, full-page card walls, excessive icons, multicolored KPI tiles, decorative particle effects, meaningless animation, or mixed illustration styles.

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

When a finished page is genuinely reusable, extract only its generalizable layout, diagram, or component pattern. Remove all customer names, confidential data, project metrics, and business-specific copy before adding an example. Prefer updating an existing token, reference rule, or template over accumulating near-duplicate files. After every change, run `python scripts/validate_templates.py`, syntax-check assets/editorial-editor.js, test the single-file builder and delivery validator, and run the skill validator.

When absorbing an external example set, audit every referenced artifact before changing the library, record the result in a source matrix, then de-duplicate it into page archetypes, section recipes, and atomic components. Reimplement the method in this skill's own semantic classes and visual system; do not copy source code, sample brands, proprietary content, or a fixed visual skin.
