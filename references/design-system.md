# Technical Editorial Brief design system

## 1. Positioning

Build professional Chinese solution and technical pages that read like a concise research brief: typography first, information first, generous whitespace, restrained decoration, and traceable evidence. The result should feel editorial rather than like a generic SaaS landing page or a web version of a Word document.

## 2. Layout

- Main content width: 1120px; wide diagram width: 1280px; reading width: 760px.
- Desktop page padding: 48px to 72px; tablet: 32px; mobile: 20px to 24px.
- Section rhythm: 96px to 144px; related content gap: 20px to 32px.
- Use a 12-column grid for complex sections and 4 or 6 columns for compact comparisons.
- Keep a clear reading axis. Use asymmetry only when marginal notes or evidence benefit from it.
- Let headings and whitespace create hierarchy before adding containers.
- Use at least three supported spatial rhythms on a substantial page: reading width, asymmetric split, full-width band, wide diagram, or media field. Do not vary layout without an information reason.
- Number ordinary top-level thematic sections in formal stable deliverables as `01／02／03…`. Treat the sequence as traceable document structure and keep it separate from phase, step, priority, and milestone numbering.

## 3. Typography boundary

Use 16px as the minimum for every customer-visible authored text element, including body text, supporting labels, captions, navigation, diagram labels, table metadata, and notes. Keep all authored content at or below 60px.

| Role | Recommended size | Notes |
|---|---:|---|
| Hero title | clamp(42px, 6vw, 60px) | Maximum two or three deliberate lines |
| Section title | clamp(32px, 4vw, 48px) | Short, noun-like headings preferred |
| Subsection title | 24px to 30px | Use sparingly |
| Lead paragraph | 20px to 22px | State the conclusion or scope |
| Body | 16px to 18px | Line height 1.7 to 1.9; default baseline is 16px |
| Label, caption, note | 16px or larger | Customer-visible text floor is 16px |
| KPI value | clamp(38px, 5vw, 60px) | Pair with a concise label |

Use one system-safe Chinese sans-serif stack across headings, body text, labels, tables, and pull quotes. Create editorial emphasis with scale, weight, spacing, rules, and layout rather than switching to a serif face. Introduce a contrasting typeface only when the user explicitly requests it and the font can be delivered reliably.

## 4. Color model

Use white or near-white, neutral ink, gray surfaces, one primary accent, and a secondary brand color only for sparse auxiliary marks. Do not activate both brand colors at equal visual weight.

Generated imagery, diagrams, charts, and inline SVG must inherit the active theme palette. A customer name does not authorize adding that customer's brand color to a vendor-themed page. Use dual-brand color only when the user explicitly requests a joint-brand composition and the two roles are visually controlled.

For the Richinfo text wordmark, separate the bilingual parts structurally: render `彩讯科技` in the active Richinfo orange and `RICHINFO` in neutral charcoal. Keep both parts on one baseline with restrained spacing; do not flatten the pair into one undifferentiated black string.

Integrate hero bitmaps according to their real content bounds and aspect ratio. An opaque white image must not look pasted onto a tinted hero: use a proportion-matched visual board, restrained theme line, offset backing plane, or compatible blend treatment when needed. Do not force a frame around every image; choose the lightest treatment that makes the image and first-screen background read as one composition.

### Theme presets

| Theme | Primary accent | Secondary auxiliary | Editorial highlight | Usage |
|---|---|---|---|---|
| Richinfo | #FF642A | #FFC000 | #FDE28B | Primary lines, active states, key values; yellow may mark one launch phrase or featured orbit |
| China Mobile | #1184CF | #8DC222 | #D7EDF9 | Primary lines, active states, key values; pale blue may mark one launch phrase or featured orbit |
| Bank of China | #BC260D | #D4AF37 | #F1D8D4 | Primary lines, active states, key values; pale red may mark one launch phrase or featured orbit |

Neutral tokens:

- Canvas: #FFFFFF
- Soft canvas: #FAFAF8
- Surface: #F4F4F1
- Ink: #111111
- Body: #474747
- Muted: #717171
- Rule: #DEDED8

Never use the theme colors to create a multicolor card set. Prefer tinting the primary accent at low opacity for one featured surface.

Alternate white, soft-neutral, and theme-tinted section surfaces to expose the reading rhythm. On a substantial proposal, one compact deep theme surface may carry a decisive thesis, value summary, or transition. It must use theme-aware dark color, high-contrast text, and bounded content; never use it as a generic conversion panel or repeat it across the page.

## 5. Surfaces, borders, and depth

- Default border: 1px solid neutral rule.
- Default radius: 18px; compact controls: 999px pills only when semantically appropriate.
- Prefer no shadow. If separation is necessary, use one subtle shadow with low opacity and small spread.
- Use background grids at roughly 2% to 4% visual opacity. They must disappear behind dense reading content.
- Do not use glass, blur, glow, glossy gradients, or bevel effects.

## 6. Component grammar

### Task-specific page composition

Treat common page components as a grammar, not decoration. First choose a task-specific opening and section recipe from `composition-recipes.md`; only then select local components. A substantial page may combine several of the following roles when the source supports them:

1. **Hero orientation:** an eyebrow with a short rule, one thesis headline, a lead paragraph, source or version metadata, and one proof, visual, data, or architecture counterpart. Author deliberate semantic line breaks for long Chinese display titles; never leave one or two orphan characters on a line.
2. **Topic index:** use `.hero-chip-list` and `.topic-chip` only for a real page taxonomy, section index, status set, or filter. Labels and counts must match the authored content; chips are not decorative pills and are not a default hero requirement.
3. **Section masthead:** combine a continuous chapter index, one Chinese label, a title, an optional real count, and a one-sentence reading cue. Keep the chapter index and Chinese label together on the same first line as one eyebrow group; place the title below that group. Use `.section-heading.is-numbered` for ordinary formal chapters and `.section-heading.is-composed` when a real count or third column is also needed.
4. **Structured object group:** use `.showcase-grid` when the reader must scan or compare genuinely independent capabilities, deliverables, paths, cases, or artifacts.
5. **Card anatomy:** every `.showcase-card` should separate `.showcase-visual`, `.showcase-body`, and `.showcase-footer`. The visual explains shape or identity; the body names and summarizes the object; the footer carries evidence, status, ownership, source, or a bounded action.
6. **Rhythm contrast:** alternate white, soft-neutral, theme-tinted, and at most one deep theme section with open narrative surfaces, bounded groups, wide diagrams, evidence rails, timelines, tables, bands, or media fields. Repetition provides comparison; variation exposes changes in information shape.

Do not force all six roles into every page. In particular, do not repeat one hero composition across unrelated task families. Use enough roles to make hierarchy visible before close reading, and remove any component that lacks supported content.

- Hero: choose thesis, data, media, or architecture emphasis from the source; keep one decisive title, lead, and only supported proof.
- Editorial launch hero: use release metadata, a large thesis, one theme-aware marker, faint grid, and sparse cropped orbit geometry; use only for a genuine launch or capability introduction.
- Signature visual: make one source-derived mechanism memorable through restrained inline SVG or CSS geometry; do not reuse it as decorative wallpaper.
- Section header: use a continuous `01／02／03…` chapter number, one short Chinese label, a customer-facing title, and an optional reading cue; add a real count only when it aids scanning and does not repeat the title.
- Pull quote: one strong sentence with a primary-accent rule, not a colored card.
- Structured showcase card: visual explanation, title, concise body, and evidence, status, ownership, source, or action metadata; use for bounded objects that benefit from scanning or comparison.
- KPI band: large figures aligned on a common baseline with small labels and source notes.
- Comparison: ruled columns or rows; highlight only the decisive difference.
- Timeline: one directional axis and clear stage ownership, output, or gate; use it before a table for ordered stages.
- Evidence rail: keep source, definition, limitation, or owner adjacent to the claim it qualifies.
- Scope map: separate governed core, included scope, dependencies, exclusions, and assumptions.
- Decision ledger: align priority, finding or action, owner or evidence, and status or decision.
- Evidence chain: align source and date, fact, customer effect, and bounded response in one traceable reading row.
- Maturity register: combine a text status tag with the supporting evidence, condition, or exclusion boundary.
- Media mosaic: give the strongest approved image more space and keep every caption adjacent.
- Media story variants: use `.media-story.is-triptych` for three equal landscape images supporting one thesis, `.media-story.is-portrait-cards` for independent portrait items with separate titles, `.media-story.is-text-led` when text carries the story and one image acts as evidence, and `.media-mosaic` when one image is clearly primary. Select by count, orientation, priority, and caption relationship rather than rotating styles randomly.
- Accessible chart: use direct values, a zero-based scale, definition, unit, period, source, and adjacent interpretation.
- Long table: preserve caption, scoped headers, source note, horizontal scrolling, and deliberate print behavior. Reserve it for stable row-column comparisons or audit records, not ordinary phases or capability storytelling.
- FAQ and glossary: use ruled disclosure and definition lists for repeated questions or source-specific terminology.
- Action band: close with one bounded next action, shared confirmation, entry condition, or acceptance checkpoint on a light theme-tinted surface; avoid generic conversion copy and large dark call-to-action panels.
- Auto TOC and reading progress: use stable section IDs, keep progress noninteractive, and omit both when the page is short.
- Footer: version, date, source, confidentiality or contact information when supplied.

## 7. Motion and interaction

- Limit motion to opacity, translate, and subtle scale transitions.
- Keep durations between roughly 160ms and 500ms.
- Never animate essential reading content continuously.
- Respect prefers-reduced-motion: reduce by removing nonessential transitions and smooth scrolling.
- Provide visible keyboard focus and a skip link.
- For workbench controls, use native buttons, radios, checkboxes, and disclosure elements before custom interaction. Show the selected state in text, not color alone.
- Keep the stable explanation visible without JavaScript. Generated summaries may depend on JavaScript, but the facts, choices, consequences, and boundaries may not.
- End each consequential workbench with a reviewable text handoff or decision ledger that can be copied back into the maintained task or source.

## 8. Responsive and print behavior

- Collapse grids according to information dependency, not only viewport width.
- Preserve table meaning with horizontal scrolling or deliberate row transformation; never hide critical columns silently.
- Keep diagram text at 16px or larger. Simplify connector geometry before shrinking labels.
- Remove sticky navigation and decorative backgrounds in print.
- Avoid page breaks inside major evidence blocks where practical.
- Use responsive images with intrinsic dimensions, `alt`, captions, and `loading="lazy"` below the first viewport when real media is supplied.
- Preserve the intended media hierarchy on mobile: shared-story triptychs become a sequence under one heading, portrait cards remain independent, and text-led rows keep the text before the supporting image.
