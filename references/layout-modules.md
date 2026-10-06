# Layout modules and routing

Use this reference after selecting the primary page pattern. Treat the stable deliverable files in `templates/` as task-specific shells and the modules below as composable spatial patterns. Select modules from the source evidence; do not fill a quota or add a module merely for visual variety.

For exploration and decision workbenches, read `workbench-artifacts.md` first. Reuse the modules below for evidence, scope, comparison, process, and maturity, then add only the bounded controls required by the chosen workbench task.

## Selection sequence

1. State the reader's task in one sentence: understand, decide, compare, verify, or reuse.
2. Choose one hero that exposes the page thesis.
3. Establish the visible page anatomy: hero orientation, section mastheads, real topic or status chips, bounded object groups, evidence or diagrams, and the closing action or outcome.
4. Mark each source block by information shape: claim, evidence, hierarchy, sequence, comparison, ownership, boundary, status, quantity, dependency, media, risk, or action. Then read `composition-variation-matrix.md` for the complete thirteen-family routing matrix.
5. Mark scope-sensitive statements by content maturity and identify any fact-to-impact-to-response evidence chains.
6. Route each block to the closest module below, and give every component exactly one information job.
7. Choose reading width, asymmetric split, structured object grid, full-width band, wide diagram, or media field by the source relationship; no layout-count minimum applies.
8. Repeat comparable evidence or tasks consistently; reselect the composition when the information relationship changes.
9. Remove any empty module. Never invent metrics, screenshots, dates, actors, or outcomes to complete a layout.
10. Record the chosen variant for every major content block; color or surface changes do not count as composition changes.

## Hero variants

### Thesis hero — `.hero-grid`

Use when a proposal or whitepaper has one decisive conclusion plus scope or proof. Put the title and lead in the main column and a compact `.hero-proof` evidence panel in the side column.

### Data hero — `.hero-data`

Use for executive reports with sourced measures or a clear status. Lead with the decision, then place two to four definition-rich measures in a ruled band. Do not use placeholder numbers in a finished page.

### Media hero — `.hero-media`

Use for project showcases when an approved screenshot, site photograph, product surface, or delivery artifact is central evidence. Pair the media with a concise case thesis; provide a caption and source status.

### Architecture hero — `.hero-architecture`

Use for technical documents whose main argument is a system boundary or flow. Show only the highest-level chain in the hero and defer detailed modules to the body.

### Editorial launch hero — `.hero-launch`

Use for a product, model, version, or capability release. Lead with release metadata, one large thesis, one marked phrase, and optionally real comparable tiers. Follow `signature-evidence-and-launch.md`; do not turn routine proposals into launch pages.

## Editorial modules

| Information shape | Module | Class | Use |
|---|---|---|---|
| Page taxonomy or section index | Topic chips | `.hero-chip-list` + `.topic-chip` | Expose real categories, sections, statuses, or filters with accurate labels and counts; do not use pills as decoration. |
| Independent capabilities, deliverables, paths, cases, or artifacts | Structured showcase | `.showcase-grid` + `.showcase-card` | Give each object a visual, title, concise summary, and evidence, status, ownership, source, or action footer. |
| Claim plus sources | Evidence split | `.split-layout` + `.evidence-rail` | Put the conclusion in the main column and source, definition, limitation, or owner in the rail. |
| One decisive statement | Thesis band | `.thesis-band` | Create a light theme-tinted full-width pause between analytical sections; keep it to one claim and one support line. |
| Current versus target | Before/after comparison | `.comparison` | Compare stable dimensions; label both states and highlight only the decisive change. |
| One primary measure plus context | Metric story | `.metric-story` | Pair the measure with its definition, period, driver, and implication. |
| Findings or actions by priority | Decision ledger | `.decision-grid` | Show priority, finding/action, owner, evidence, and status without turning every cell into a card. |
| Scope and exclusions | Scope map | `.scope-map` | Put the governed core beside included, dependent, and excluded items. |
| Difficulty, method, result | Case narrative | `.case-narrative` | Tell one implementation story in three linked stages. |
| Three equal landscape images supporting one thesis | Shared triptych | `.media-story.is-triptych` | Put one conclusion and one shared note above three equal visual proofs; do not invent separate stories for each image. |
| Independent portrait images with separate titles | Portrait cards | `.media-story.is-portrait-cards` | Keep each image, title, source, and status together; use only when the items can stand alone. |
| One supporting image for a text-led story | Compact text-image row | `.media-story.is-text-led` | Give the text the wider column and keep one compact image at the edge as evidence, not decoration. |
| Images with unequal importance | Media mosaic | `.media-mosaic` | Give the strongest approved image more space and keep captions adjacent. |
| Same object before and after | Image comparison | `.image-compare` | Keep observation angle, date, and caption comparable; do not imply causation from unrelated images. |
| Outcome plus applicability | Evidence strip | `.evidence-strip` | Align sourced outcome, acceptance fact, reusable lesson, and boundary. |
| Source fact to design response | Evidence chain | `.evidence-chain` | Keep source/date, fact, customer effect, response, and limitation in one traceable row. |
| Commitment or scope status | Maturity register | `.maturity-register` + `.maturity-tag` | Distinguish confirmed, candidate, conditional, to-confirm, and out-of-scope items with text and evidence. |
| Quantified comparison | Accessible chart | `.chart-figure` + `.bar-chart` | Show definition, unit, period, direct values, source note, and a text alternative. |
| Dense capability or interface list | Long table | `.table-wrap.is-sticky` | Preserve caption, scoped headers, source note, horizontal scrolling, and print readability. |
| Repeated reader questions | FAQ | `.faq-list` | Answer only material questions; keep conditions and exceptions with the answer. |
| Terms and sources | Glossary and references | `.glossary-grid` + `.reference-list` | Define source-specific terms and list traceable editions or dates. |
| One bounded next step | Action band | `.action-band` | Close with one supported action, owner, stage confirmation, or acceptance checkpoint on a light theme-tinted surface rather than a large dark CTA or generic marketing copy. |
| Many traceable sections | Auto TOC and progress | `.auto-toc` + `data-reading-progress` | Use only on genuinely long pages; generate links from stable section IDs and keep print output clean. |

## Diagram modules

### Content-specific signature — `.signature-visual`

Use once when the page has a governing chain, loop, hub, boundary, or comparison that deserves a memorable explanation. Keep the hero diagram conceptual and the detailed architecture technical; do not duplicate the same boxes twice.

### Full system architecture — `.system-architecture` + `.architecture`

Use when the page must show the complete system view: callers or channels at the top, access/application/platform/data layers in the center, cross-cutting governance beside them, and infrastructure at the bottom. Keep only layers supported by the source, show one key layer with the primary accent, and keep module names consistent with interface and responsibility tables.

Use `.architecture` alone for a smaller layered view when external callers, governance, or deployment context are out of scope.

### Left-to-right chain — `.process-chain`

Use for requests, data movement, operating flows, and value chains. Use five to eight nodes, one dominant direction, and optional decision or return labels.

### Hub and capabilities — `.hub-map`

Use when one platform, control plane, or capability center serves several surrounding domains. The center must represent a real shared responsibility, not a decorative circle.

### Roadmap and checkpoints — `.roadmap`

Use when stages have goals, outputs, owners, entry conditions, or acceptance checkpoints. Keep the internal class name `.roadmap-gate`, but write the customer-visible label as `阶段确认`、`进入条件`、`验收节点` or another natural term that matches its actual function.

Use this before a table whenever the primary relationship is a sequence of phases, rollout batches, events, or gates. A table is appropriate only when the reader must compare stable fields row by row.

### Conditional decision tree — `.decision-tree`

Use when a real condition, threshold, approval, or source state sends the reader into different paths. Write the decision question first, then one condition and one bounded result per branch. Do not use it for ordinary parallel options without routing logic.

### Responsibility swimlane — `.swimlane-flow`

Use when one workflow crosses roles, departments, systems, or approval domains. Keep each lane tied to one accountable actor and show handoffs in reading order. Use a ledger instead when the task is row-by-row responsibility auditing rather than flow comprehension.

### Dependency map — `.dependency-map`

Use when upstream inputs, the governed core, downstream consumers, and foundational conditions affect one another. Label dependency direction and avoid implying orchestration when the source establishes only coexistence.

## Section-heading behavior

- Add chapter numbers when cross-reference, source structure, or navigation benefits. Unnumbered formal sections are valid; when used, keep `.section-index` continuous from `01`.
- Keep chapter numbers independent from stage, step, priority, and milestone numbers inside the section.
- Use `.section-heading.is-numbered` for an index, one Chinese section label, a title, and an optional reading cue. The index and label must read as one horizontal eyebrow group such as `01  项目理解`; never isolate the number in a separate visual column.
- Add `.section-count` only when it truthfully summarizes the objects in that section and improves scanning; remove it when the title already states the same quantity.
- Use `.section-heading.is-composed` when a real count or a third reading column is also required.
- Use `.section-heading.is-compact` for unnumbered formal sections, interludes, or modules that already supply hierarchy. Workbenches may remain unnumbered when controls define the task sequence.
- Vary the reading axis deliberately: do not center every heading above every module.

## Recipe components

Read `composition-recipes.md` before using the following modules. They are shared semantic components, not a mandatory page checklist.

- `.context-panel`: task, prompt, source boundary, or reading instruction that governs the next modules.
- `.summary-strip`: three to five defined facts or statuses; numerical values require period, unit, definition, and source.
- `.milestone-rail`: real phase, time, event, or rollout sequence with output and gate.
- `.annotated-panel`: evidence surface paired with location-specific notes.
- `.specimen-grid`: variants, reference specimens, or media objects with stable comparison dimensions.
- `.control-strip`: a small set of consequential parameters in a sandbox or editor.
- `.code-tour`: key code, configuration, interface, or contract organized for explanatory reading.
- `.mockup-pair`: two related surfaces or states whose relationship must be agreed before implementation.
- `.risk-ledger`: risk, severity, impact, mitigation, and responsibility aligned in a table.
- `.question-list`: unresolved scope, implementation, or acceptance questions with decision owner and deadline.
- `.handoff-bar`: one bounded export, decision, or next action at the end of a workbench or plan.

## Pattern routing

### Solution Brief

Prefer thesis hero, evidence split or evidence chain, maturity register, one supported signature diagram, hub or layered architecture, process chain, roadmap, and evidence strip. Use a comparison only when the source establishes a current and target state.

### Executive Report

Prefer data hero, metric story, decision ledger, risk/action comparison, and roadmap. Keep the conclusion and requested decision visible before detailed evidence.

### Technical Whitepaper

Prefer architecture hero, scope map, layered architecture or process chain, interface table, evidence rail, and control ledger. Use diagrams to expose boundaries and direction, not decorate modules.

### Project Showcase

Prefer media hero, structured showcase for independent deliverables, case narrative, scope map, media-story variants, media mosaic, before/after comparison, and evidence strip. Treat images and acceptance evidence as primary proof rather than decorative content.

## Composition guardrails

- Keep one primary narrative and one memorable structural signature.
- Use white, soft-neutral, and theme-tinted surfaces for meaningful groups or transitions, without a rotation quota. One compact deep theme section may carry a sourced thesis, never a generic conversion message.
- Use structured cards confidently for bounded objects, and use rules, bands, rails, diagrams, tables, and open grids for continuous or relational content.
- When chapter numbering is useful, use one continuous sequence; keep it separate from process-stage numbering.
- Do not place a KPI band when the source lacks definitions, periods, units, and evidence.
- Do not force every module into equal columns; let importance control span.
- For every media block, record four routing facts before styling: image count, dominant orientation, relative importance, and shared versus independent captions. Use those facts to choose triptych, portrait cards, text-led row, or lead mosaic.
- Do not reuse the same media composition twice on one page unless the blocks form a deliberate comparison series. Across related pages, vary composition when the source relationship or image geometry differs; do not rotate styles randomly when the evidence shape is unchanged.
- Reuse a card anatomy to make comparable objects easy to scan, but do not repeat the same three-card grid for unrelated information shapes.
- Keep supporting labels, primary reading copy, and diagram labels at 16px or larger, and preserve logical DOM order on asymmetric layouts.
- Use an accessible HTML table for dense comparisons; use charts only when magnitude or trend is the reader's task.
- Keep FAQs, glossaries, and references as optional appendices or nearby support, not mandatory closing furniture.
- In a workbench, interaction must expose a real choice, question, or explanation. Keep the stable explanation in the DOM and provide a generated text handoff for confirmed results.

Preview the reusable modules in `templates/layout-sampler.html`. Use it as a visual catalog, never as the primary narrative template for a finished deliverable.
