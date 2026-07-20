# Built-in HTML editor mode

Use the bundled editor when a generated page needs visual, human-directed refinement without a browser extension.

## Delivery modes

- Include `assets/editorial-editor.js` in an editable working HTML file.
- Keep the editor dormant during normal reading and printing.
- Activate it with `Ctrl+Shift+E`, `?te-edit=1`, or `#te-edit`.
- Export a clean snapshot only for immediate review or one-off delivery.
- Treat the authored HTML/CSS as the source of truth for reusable or maintained outputs.

## Editing workflow

1. Open the generated HTML in Chrome or Edge.
2. Press `Ctrl+Shift+E` and select a page element.
3. Edit leaf text, common typography, spacing, size, alignment, color, or an image.
4. Edit link targets, image alternatives, and nearby captions when those semantics are selected.
5. Reorder, duplicate, or hide a selected section only when the source narrative supports the structural change.
6. Choose text and background colors from the current page theme palette. Use the top row for live CSS theme tokens, the columns below for generated light/dark variants, or standard/custom colors and the eyedropper when needed.
7. Use undo and redo, local recovery, and JSON change export/import to verify or move a refinement session.
8. Open the mobile preview window before exporting.
9. Copy the structured change list and give it to Codex.
10. Apply the requested changes to the original HTML/CSS, preferring shared classes or tokens over accumulated inline styles.
11. Re-run template validation, delivery validation, and desktop/mobile visual checks.

## Safety boundaries

- Edit text only on leaf elements; select an inner element when the target contains nested markup.
- Keep explicit font sizes within 16px to 60px.
- The editor panel and color palette intentionally use compact 12px-15px chrome. This exception applies only to `data-te-editor-ui`; never reuse it in page content.
- Keep margin, padding, width, and maximum-width edits to valid CSS lengths accepted by the editor; prefer percentages, `auto`, and existing layout tokens over fixed wide values.
- Keep top-row palette choices as CSS variables such as `var(--accent)` and `var(--accent-aux)` so later theme changes remain synchronized. Treat generated light/dark variants as fixed local colors.
- Do not alter evidence, qualifications, scope status, or commitments through visual cleanup.
- Do not treat the downloaded snapshot as a portable bundle; linked assets remain external to that file.
- Use `scripts/build_single_html.py` when the edited result must become a portable file.
- Remove or omit the editor asset when a customer requires a minimal production artifact with no dormant editing code.
