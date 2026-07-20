# Custom theme

Read this reference only when the user requests a non-built-in brand and provides approved brand colors or a source artifact. Do not infer a high-stakes brand palette from memory.

1. Set `data-theme="custom"` on `<html>`.
2. Add one scoped token block after the shared CSS.
3. Define every required token below; keep neutral surfaces readable and activate one primary accent.
4. Verify contrast, charts, maturity labels, focus rings, mobile, and print output.

```css
[data-theme="custom"] {
  --accent: #123456;
  --accent-rgb: 18, 52, 86;
  --accent-aux: #789abc;
  --accent-aux-rgb: 120, 154, 188;
  --editorial-highlight: #e8eef3;
  --editorial-highlight-soft: #f7f9fb;
}
```

Replace every example value. Do not add a customer theme to `tokens.css` unless it is approved as a reusable preset.
