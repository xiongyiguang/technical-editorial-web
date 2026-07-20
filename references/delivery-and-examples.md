# Delivery and examples

Read this reference when starting a real task, building a portable file, validating a finished page, or learning the source-to-output method.

## Prompt shape

Provide the source path, reader, decision, preferred theme, delivery form, and evidence limits. The page pattern may be left to the skill.

When the request is not ready for a stable deliverable, ask for one of the five workbenches explicitly or let the skill route to it:

```text
使用 $technical-editorial-web 完整读取这些材料。先不要生成正式方案页，
请使用材料盲点检查工作台，区分阻断项和改进项，生成可直接发送的补充确认清单。
确认完成后，再把结果写回来源说明并生成正式页面。
```

```text
使用 $technical-editorial-web，完整读取 C:\资料\项目材料.docx。
面向客户管理层和技术负责人，生成中文技术长页。
主题使用 Richinfo；保留来源、范围和待确认状态。
输出一个可直接发送的 clean 单文件 HTML，同时保留一个可编辑工作版。
验证 1440px、768px、390px 和打印布局。
```

## Working and delivery files

- Keep relative CSS, JavaScript, and images in the editable working bundle.
- Build one portable file with `python scripts/build_single_html.py working.html -o delivery.html`.
- Add `--clean` to remove the dormant editor from a customer-facing delivery.
- The builder expands local CSS imports, embeds local CSS `url()` resources, inlines local scripts, and embeds local media as data URLs by default.
- Use `--no-embed-media` only when the recipient will receive the full static bundle.
- Keep `assets/long-page-enhancements.js` when the page uses reading progress or an automatic table of contents; the builder inlines it with other local scripts.

## Validation

Run both levels:

```text
python scripts/validate_templates.py
python scripts/validate_delivery.py delivery.html --single-file
```

The delivery validator rejects unresolved local assets, internal anchors, missing image alternatives, inaccessible table headers, out-of-range content font sizes, and common placeholder markers. Use `--allow-placeholders` only for reusable templates.

For a public web deployment, also add a real canonical URL, Open Graph metadata, social image, and structured data only when the publishing address and supplied facts are known. Offline proposal files do not need fabricated public metadata.

The editor chrome is intentionally compact at 12px-15px and is excluded from the 16px-60px customer-visible authored-content rule. Do not expand the editor exemption into page content; clean customer-facing exports omit the editor.

## Sanitized example

- `examples/source-brief.md` is a synthetic source with explicit evidence and limitations.
- `examples/solution-example.html` is the corresponding working output.
- Use the pair to study source fidelity, module routing, accessible tables, references, and closing actions. Do not reuse the example copy as a customer claim.
