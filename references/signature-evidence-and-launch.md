# Signature visuals, evidence chains, maturity, and launch heroes

Read this reference when the page needs a content-specific hero diagram, external evidence, scope-status distinctions, or a technology or capability launch treatment. These are optional modules; use only what the source supports.

## Decision sequence

1. Identify the page thesis and reader decision.
2. Mark every material statement as confirmed, candidate, conditional, to confirm, or out of scope.
3. Identify source-backed facts that form a fact-to-response evidence chain.
4. Decide whether one real mechanism deserves a signature diagram.
5. Use the launch hero only for an announcement, release, capability introduction, or version comparison.

## Content-specific signature diagram

Use `.signature-visual` when one mechanism can explain the page better than prose alone. Derive every node and connector from the source; never use a generic network merely to signal technology.

| Information shape | Diagram form | Required meaning |
|---|---|---|
| Ordered state change | Chain | Trigger, processing states, outcome, and direction |
| Repeated operating cycle | Loop | Entry, execution, feedback, and next-cycle update |
| One shared capability serving domains | Hub | Real shared responsibility, surrounding users or domains, and exchanges |
| Trust or technical strata | Layered view | Callers, boundaries, responsibilities, governance, and infrastructure |
| Two alternatives or states | Comparison | Stable comparison dimensions and a supported conclusion |

- Keep one focal mechanism and normally three to five supporting nodes.
- Give connectors semantic meaning: request, data, control, evidence, or feedback.
- Put the strongest path in the primary accent and keep other paths neutral.
- Add a caption naming the mechanism and source status.
- Do not repeat the detailed system architecture in the hero; the signature diagram explains the governing idea, while the architecture section explains implementation.

## Evidence chain

Use `.evidence-chain` to connect an external or internal fact to the page recommendation. Each `.evidence-chain-row` contains:

1. source and date or version;
2. fact or source-faithful finding;
3. effect on the customer, project, or decision;
4. bounded response, action, or design implication.

Keep quotations short. Label inference as inference. Put uncertainty, applicability limits, or conflicting evidence in the same row instead of hiding it in a distant footnote. Do not use this module when the source supports only an unattributed opinion.

## Content maturity labels

Use `.maturity-tag` and `data-maturity` to prevent proposals from turning possibilities into commitments.

| Value | User-facing label | Meaning |
|---|---|---|
| `confirmed` | 已确认 | Supported by named source material, an approved decision, or verified current state |
| `candidate` | 候选 | Worth evaluating, but not committed to scope |
| `conditional` | 有条件纳入 | Included only when the stated data, interface, governance, budget, or schedule condition is met |
| `to-confirm` | 待确认 | Material input is missing and must be resolved before commitment |
| `out-of-scope` | 不在本期 | Explicitly excluded from the current boundary |

- Always pair color with text; never rely on green, yellow, or red alone.
- Place the condition or evidence beside the tag in a `.maturity-register` when status affects scope or acceptance.
- Do not use `confirmed` for model inference or an unsourced placeholder.

## Editorial launch hero

Use `.hero-launch` for a product, model, version, capability, or major feature announcement. It is a visual variant, not a fifth narrative template.

- Start with a compact `.launch-meta` row: version or release label, date, and category.
- Let one large two-line thesis dominate the first viewport.
- Use `.editorial-marker` on one short phrase only.
- Add a faint engineering grid that fades downward; keep the canvas white or near white.
- Use one low-saturation highlight color. In Richinfo pages this may be the auxiliary yellow; other themes use their theme-aware editorial highlight.
- Use cropped `.orbit-mark` geometry as a sparse release motif, not as a generic illustration system.
- Add `.launch-tier-grid` only when the source provides real tiers, editions, models, roles, or comparable paths. Keep all compared dimensions stable and omit unsupported prices or metrics.
- Keep the body lead at reading width and use no heavy shadow, glass effect, or decorative particles.

On mobile, place metadata before the title, collapse tier cards to one column, reduce orbit scale, and preserve a minimum 16px text size. Verify both overflow and actual computed grid columns; a zero-overflow result does not prove that the mobile composition is usable.
