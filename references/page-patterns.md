# Page patterns

Choose a pattern from the user's purpose and source structure. Reorder or omit sections when the evidence does not support them.

First decide whether the user needs a stable deliverable or an exploration and decision workbench. Use the four narrative patterns below for proposals, reports, whitepapers, and cases. Route implementer-ready plans and technical explainers through the specialized stable patterns below. When the reader must discover gaps, compare directions, answer consequential questions, inspect a mechanism, reorder items, or tune a plan before authoring the deliverable, route through `workbench-artifacts.md` instead. Use `composition-recipes.md` to choose the opening and section recipe after the task family is known.

## Solution Brief

Use for AI solutions, Chinese presales proposals, bid showcases, and industry solution introductions.

1. Hero conclusion: project object, one-sentence value, scope, version.
2. Context: policy, business environment, existing foundation.
3. Pain points: evidence-backed gaps, grouped by business impact.
4. Overall solution: design principles, scope boundary, target state.
5. Architecture: layers, shared capabilities, integrations, governance.
6. Core capabilities: capability clusters with outputs and users.
7. Business workflow: actors, key decisions, closed loop.
8. Delivery path: phases, milestones, prerequisites, acceptance evidence.
9. Expected outcomes: sourced metrics or qualitative outcomes clearly labeled.
10. Closing summary: why this design is feasible and what happens next.
11. Optional FAQ, terms, references, or next-action band when the reader needs them.

## Executive Report

Use for leadership briefings, phase reviews, operating summaries, and decision support.

1. Executive conclusion: decision or status in one paragraph.
2. KPI band: three to five sourced measures with period and definition.
3. Key findings: what changed and why it matters.
4. Driver analysis: evidence, causes, and uncertainty.
5. Risks and issues: severity, owner, effect, mitigation.
6. Priority actions: ordered by impact and urgency.
7. Next-stage plan: milestones, stage confirmations, acceptance checkpoints, and required support.
8. Evidence note: source date, coverage, and limitations.
9. Optional appendix: metric definitions, decision log, or references.

## Technical Whitepaper

Use for product technology, architecture, AI platforms, integration, security, and deployment design.

1. Abstract and scope.
2. Problem definition and assumptions.
3. Design principles and non-goals.
4. System architecture and trust boundaries.
5. Module responsibilities and interfaces.
6. Data or request flow.
7. AI model, knowledge, orchestration, or evaluation design when applicable.
8. Security, privacy, governance, and auditability.
9. Deployment, operations, observability, and resilience.
10. Trade-offs, comparison, and roadmap.
11. Glossary, references, or appendix.
12. Optional next action when the document requests a bounded review or decision.

## Project Showcase

Use for completed or representative project cases.

1. Case headline: customer type, project scope, core outcome.
2. Customer and business context.
3. Construction scope and boundary.
4. Solution overview and architecture.
5. Key implementation highlights.
6. Outcome evidence: metrics, acceptance facts, or qualitative proof.
7. Screenshots, diagrams, or media with captions and source status.
8. Reusable experience and applicability boundary.
9. Optional media comparison, references, or contact action when supported.

## Implementation Plan

Use for a plan that will be handed directly to an implementer or delivery owner.

1. Goal, fixed boundaries, and source or prompt context.
2. Delivery summary with only supported effort, surfaces, tables, flags, owners, or outputs.
3. Milestones with a real sequence, outputs, ownership, and review or acceptance gates.
4. Data, responsibility, or dependency flow.
5. Low-fidelity mockups or interface contracts when they remove ambiguity.
6. Key implementation evidence: code, schema, API, configuration, or work package.
7. Risks, mitigations, and open decisions.

## Technical Explainer

Use when the primary task is to help a reader understand how a feature, mechanism, or concept works.

1. TL;DR and evidence scope.
2. End-to-end path or governing mechanism.
3. Step-by-step walkthrough with adjacent source evidence.
4. Configuration, code, interface, or comparison where it aids understanding.
5. Gotchas, limitations, FAQ, and source-specific glossary.

## Pattern selection rules

- After choosing the primary narrative, route each source block through `layout-modules.md`; the numbered lists above define coverage, not a fixed page composition.
- Add `01／02／03…` chapter numbers only when meeting cross-reference, source structure, or navigation benefits from them. Unnumbered formal sections are valid. When used, keep one continuous chapter sequence independent of phases, steps, priorities, and milestones.
- Prefer Solution Brief when the source argues for a future target state.
- Prefer Executive Report when the reader must decide or prioritize.
- Prefer Technical Whitepaper when architecture and implementation detail are the main evidence.
- Prefer Project Showcase when the main proof comes from completed work.
- Treat a technology, model, version, or capability release as a visual variant of the closest narrative pattern; use the editorial launch hero without creating a separate fixed page sequence.
- If a document combines patterns, choose one primary narrative and borrow no more than two modules from another pattern.
- Do not create empty canonical sections. Merge thin sections and label missing evidence explicitly.
- A workbench may precede a stable template, but it is not itself a customer-facing narrative unless explicitly requested. Write confirmed workbench decisions back into the task or source before generating the stable deliverable.
