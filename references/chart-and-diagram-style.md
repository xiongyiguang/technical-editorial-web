# Chart and diagram style

## General rules

- Use a visual only when it clarifies relationships, sequence, ownership, state, or quantified comparison.
- Give every figure a title and, when needed, a concise source or interpretation note at 16px or larger.
- Keep all diagram labels, primary nodes, and reading copy at 16px or larger.
- Use the active primary accent for the key path or focal module. Use the secondary color only for a sparse marker.
- Prefer CSS Grid, semantic HTML, or inline SVG. Keep essential labels as selectable text where practical.
- Avoid decorative connectors, crossing lines, and unexplained icons.

## Architecture diagrams

- Choose horizontal layers for technical strata, a left-to-right chain for state or data movement, or a hub map for one real shared platform serving several domains.
- Show boundaries such as channels, platform, data, integration, infrastructure, and governance only when present in the source.
- Keep module names short; put detailed explanation below or beside the diagram.
- Use neutral surfaces for most modules and primary accent for the central platform or critical path.
- Show trust boundaries, external systems, and data direction when they affect the design.
- Do not use a hub map merely to make the page look varied; the center must own shared responsibilities.

## Process and swimlane diagrams

- Use five to eight major nodes when possible.
- Name actors or systems explicitly when responsibility matters.
- Show inputs, outputs, decisions, exception paths, and closed-loop returns selectively.
- Use orthogonal or gently curved connectors and one dominant reading direction.
- Do not convert every source paragraph into a node.

## Timelines and roadmaps

- Define the time scale, phase goal, key activity, output, and acceptance gate.
- Align stages on one axis and distinguish future or optional items with line style, not new colors.
- Avoid implying exact dates if the source only provides relative stages.
- Use a roadmap or milestone rail instead of a table whenever the primary relationship is ordered stages rather than cross-row comparison.

## KPI and charts

- Include metric definition, period, unit, and source when available.
- Do not fabricate baselines or targets.
- Prefer direct labels over legends.
- Use neutral series with one primary-accent highlight. The secondary color may mark one auxiliary threshold or status only.
- Avoid 3D charts, gauges, rainbow palettes, and truncated axes that exaggerate differences.
- Use `.chart-figure` and `.bar-chart` for a small sourced comparison. Put direct values in visible text and add a concise text alternative or adjacent table.
- Use `.line-chart` for a real ordered series with a declared interval and `.waterfall-chart` only when the source supports an auditable start-change-end reconciliation.
- Use CSS bars only when the scale starts at zero and the declared width encodes the stated value. For time series, distributions, or more than roughly eight values, create a purposeful inline SVG or accessible data table instead.

## Comparison matrices

- Compare on a stable set of dimensions.
- Put the decisive dimension first and use short evidence-based wording.
- Use rules and whitespace instead of a full boxed grid.
- Highlight one preferred or changed state with the primary accent, not every cell.

## Tables

- Use strong header hierarchy, restrained horizontal rules, generous cell padding, and minimal vertical lines.
- Keep numeric alignment and units consistent.
- Group related rows and add source notes below the table.
- For mobile, allow horizontal scrolling with an accessible label; keep table body text, supporting headers, and notes at 16px or larger.
- Add a `<caption>`, `scope="col"` or `scope="row"` on headers, and a source note. Use `.table-wrap.is-sticky` only when the visible table height materially improves navigation.

## Accessibility

- Do not use color as the sole carrier of meaning.
- Keep contrast sufficient on white and tinted backgrounds.
- Add text alternatives or adjacent explanations for complex figures.
- Preserve a logical DOM reading order even when the visual layout is asymmetric.
