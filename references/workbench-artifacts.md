# Exploration and decision workbench artifacts

Use a workbench artifact when the reader must make, refine, or verify a decision before a formal deliverable is written. Workbenches are temporary, self-contained collaboration surfaces. They do not replace the stable deliverable templates and must not be sent as a finished customer deliverable unless the user explicitly requests that form.

## Routing boundary

- Use a narrative template when the reader needs a stable proposal, report, whitepaper, or project case.
- Use a workbench template when the reader needs to discover missing information, compare directions, answer consequential questions, inspect a mechanism, or tune a plan.
- Feed confirmed workbench decisions back into the source notes or authored narrative. Do not leave the only copy of a decision inside browser state.
- Keep source facts, inference, assumptions, and user choices visibly distinct.
- Generate only the controls supported by a real decision. Do not add interaction merely to make a page feel like an application.

## Five built-in workbench patterns

### Blindspot pass — `templates/workbench-blindspot-pass.html`

Use before drafting when the supplied materials may omit scope, evidence, roles, interfaces, acceptance criteria, security boundaries, or dates.

Required structure:

1. Known source boundary and review purpose.
2. Ruled blindspot register with status, evidence gap, consequence, and one precise follow-up question.
3. Selectable questions that assemble a ready-to-send clarification list.
4. Explicit separation between blocking gaps and non-blocking improvements.

Do not infer that a missing statement is false. Label it as not found in the reviewed source.

### Design directions — `templates/workbench-design-directions.html`

Use when layout, density, reading rhythm, or interaction direction cannot be settled through prose alone.

Required structure:

1. Three or four genuinely different directions rendered from the same content.
2. Stable comparison dimensions such as density, reading path, evidence visibility, and interaction cost.
3. Adopt, retain, or exclude controls with a generated response summary.
4. No unsupported customer copy or decorative direction that cannot serve the reader's task.

### Requirements interview — `templates/workbench-requirements-interview.html`

Use when a request is ambiguous and the unresolved choices materially affect scope, architecture, evidence, delivery form, or acceptance.

Required structure:

1. One decision per step, ordered by downstream impact.
2. Mutually exclusive options with a short consequence for each option.
3. A live decision table and generated handoff prompt.
4. A visible unanswered state; never silently select a commitment-bearing default.

### Annotated explainer — `templates/workbench-annotated-explainer.html`

Use when the reader must understand a system, evidence chain, process, control mechanism, or unfamiliar technical concept before deciding.

Required structure:

1. One source-derived map or flow.
2. Selectable nodes that reveal responsibility, evidence, boundary, and consequence.
3. A stable written explanation beside the visual; interaction must enhance rather than hide essential meaning.
4. Source and limitation notes adjacent to the explanation.

### Tweakable plan — `templates/workbench-tweakable-plan.html`

Use when a plan contains a small number of consequential choices that should be settled before mechanical execution begins.

Required structure:

1. Fixed goals and constraints separated from adjustable choices.
2. Two or three alternatives per decision with effects on scope, evidence, time, or ownership.
3. Mechanical work collapsed below decision-heavy work.
4. A generated plan summary that can be copied back into the task or source document.

## Advanced custom-editor routes

The 20-page audit also identified three useful editor archetypes that are intentionally not forced into one generic template. Build them only when the user's actual task requires the corresponding state model, using `composition-recipes.md` as the structural contract.

### Grouping editor

Use when the task is to sort, prioritize, or group a bounded set of source-backed objects. Provide explicit columns or groups, an accessible move control in addition to optional drag-and-drop, filters only when the corpus warrants them, reset, and a reviewable text export.

### Constraint editor

Use when toggles or selections have dependencies, conflicts, or commitment implications. Show the constraint warning next to the affected control, keep a pending-change diff, and export only reviewed changes. Do not silently auto-fix commitment-bearing choices.

### Live preview editor

Use when the reader must edit a template, wording rule, or parameter set against multiple representative samples. Show the source template and available fields, render at least two genuinely different samples, flag unknown fields in text, and provide a copyable final template.

## Shared interaction rules

- Use `assets/workbench.css` and `assets/workbench.js`; do not duplicate shared controls in every template.
- Keep authored content type between 16px and 60px and use the active Chinese sans-serif theme stack.
- Every stateful control needs a visible text state, keyboard focus, and an `aria-live` confirmation when it changes generated output.
- The page must remain understandable if JavaScript fails. JavaScript may progressively reveal steps or generate summaries, but it must not hold the only explanation.
- Copy/export is a convenience, not persistence. Important results must be written back to the maintained source.
- Print output should show the current selections and generated summary while hiding purely operational buttons.

## Anti-patterns

- Do not turn every proposal section into a form.
- Do not copy sample brands, metrics, code, prompts, or visual skins from an inspiration artifact.
- Do not use a workbench as a substitute for reading the source material.
- Do not present an inferred recommendation as a confirmed user choice.
- Do not add drag-and-drop when ordinary buttons, radios, or checkboxes express the decision more accessibly.
- Do not use a custom editor when the task can be completed by reading a stable page and making one explicit decision.
