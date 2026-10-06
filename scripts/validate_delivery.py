#!/usr/bin/env python3
"""Validate finished Technical Editorial Web HTML deliverables."""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
PLACEHOLDERS = ("请替换", "待填写", "待补充", "TBD", "TODO", "Lorem ipsum", "XXX")
STABLE_COMPOSITION_PROFILES = {
    "solution-hub-roadmap",
    "executive-ledger-data",
    "whitepaper-layered-flow",
    "showcase-media-story",
    "plan-milestone-control",
    "explainer-path-annotation",
}
CUSTOMER_HEADING_JARGON = (
    "决策门",
    "分开表达",
    "只用于",
    "不替代",
    "形成有边界的设计启示",
    "Scope maturity",
    "Validation gates",
    "Next action",
    "Gotchas",
    "Evidence scope",
)


class DeliveryParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.errors: list[str] = []
        self.ids: list[str] = []
        self.hrefs: list[str] = []
        self.assets: list[tuple[str, str]] = []
        self.headings: list[int] = []
        self.lang: str | None = None
        self.theme: str | None = None
        self.composition_profile: str | None = None
        self.has_viewport = False
        self.has_description = False
        self.has_title = False
        self.has_main = False
        self.has_skip = False
        self.images_without_alt = 0
        self.tables: list[dict[str, int]] = []
        self.current_table: dict[str, int] | None = None
        self.media_story_variants: list[tuple[str, bool]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        classes = set(attr.get("class", "").split())
        if tag not in VOID_TAGS:
            self.stack.append(tag)
        if tag == "html":
            self.lang = attr.get("lang")
            self.theme = attr.get("data-theme")
        if tag == "body":
            self.composition_profile = attr.get("data-composition-profile")
        if tag == "meta" and attr.get("name") == "viewport":
            self.has_viewport = True
        if tag == "meta" and attr.get("name") == "description" and attr.get("content", "").strip():
            self.has_description = True
        if tag == "title":
            self.has_title = True
        if value := attr.get("id"):
            self.ids.append(value)
            if value == "main":
                self.has_main = True
        if tag == "a" and (href := attr.get("href")):
            self.hrefs.append(href)
            if href == "#main" and "skip-link" in attr.get("class", "").split():
                self.has_skip = True
        if tag in {"link", "script", "img", "source", "video", "audio"}:
            value = attr.get("href") or attr.get("src") or attr.get("poster")
            if value:
                self.assets.append((tag, value))
        if tag == "img" and "alt" not in attr:
            self.images_without_alt += 1
        if "media-story" in classes:
            variants = classes & {"is-triptych", "is-portrait-cards", "is-text-led", "is-lead-mosaic"}
            variant = next(iter(variants), "unclassified") if len(variants) == 1 else "ambiguous"
            self.media_story_variants.append((variant, attr.get("data-media-series") == "true"))
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(int(tag[1]))
        if tag == "table":
            self.current_table = {"caption": 0, "th": 0, "scoped_th": 0}
            self.tables.append(self.current_table)
        if self.current_table is not None and tag == "caption":
            self.current_table["caption"] += 1
        if self.current_table is not None and tag == "th":
            self.current_table["th"] += 1
            if attr.get("scope") in {"row", "col", "rowgroup", "colgroup"}:
                self.current_table["scoped_th"] += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
        if tag == "table":
            self.current_table = None
        if not self.stack:
            self.errors.append(f"unexpected closing tag </{tag}>")
            return
        if self.stack[-1] == tag:
            self.stack.pop()
            return
        self.errors.append(f"closing </{tag}> found while <{self.stack[-1]}> is open")
        if tag in self.stack:
            while self.stack and self.stack[-1] != tag:
                self.stack.pop()
            if self.stack:
                self.stack.pop()



class SectionIndexParser(HTMLParser):
    """Read optional chapter indexes, including nested text and unquoted classes."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, list[str] | None]] = []
        self.indexes: list[list[str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        classes = (dict(attrs).get("class") or "").split()
        parts = [] if "section-index" in classes else None
        if parts is not None:
            self.indexes.append(parts)
        if tag not in VOID_TAGS:
            self.stack.append((tag, parts))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data: str) -> None:
        for _, parts in self.stack:
            if parts is not None:
                parts.append(data)


def section_numbering_errors(text: str) -> list[str]:
    """No chapter numbers is valid; present numbers must be well formed and continuous."""
    parser = SectionIndexParser()
    parser.feed(visible_markup(text))
    values = ["".join(parts).strip() for parts in parser.indexes]
    if not values:
        return []
    if any(not re.fullmatch(r"(?:[0-9]{2}|[1-9][0-9]{2,})", value) for value in values):
        return ["thematic section indexes must contain chapter numbers such as 01: " + ", ".join(values)]
    indexes = [int(value) for value in values]
    if indexes != list(range(1, len(indexes) + 1)):
        return ["thematic section indexes must be continuous from 01: " + ", ".join(values)]
    return []


def is_remote(value: str) -> bool:
    return value.startswith(("data:", "http://", "https://", "//", "#", "mailto:", "tel:"))


def visible_markup(text: str) -> str:
    content = re.sub(r"<script\b[^>]*>.*?</script>", "", text, flags=re.IGNORECASE | re.DOTALL)

    def replace_embedded_asset(match: re.Match[str]) -> str:
        attribute, quote = match.group(1), match.group(2)
        return f"{attribute}={quote}data:embedded-asset{quote}"

    return re.sub(
        r"\b(src|href|poster)\s*=\s*([\"'])data:.*?\2",
        replace_embedded_asset,
        content,
        flags=re.IGNORECASE | re.DOTALL,
    )


def validate(path: Path, single_file: bool, allow_placeholders: bool) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    parser = DeliveryParser()
    parser.feed(text)
    parser.close()
    errors.extend(parser.errors)
    if parser.stack:
        errors.append(f"unclosed tags: {', '.join(parser.stack)}")
    duplicates = [key for key, count in Counter(parser.ids).items() if count > 1]
    if duplicates:
        errors.append(f"duplicate ids: {', '.join(duplicates)}")
    if parser.lang != "zh-CN":
        errors.append("html lang must be zh-CN")
    if parser.theme not in {"richinfo", "china-mobile", "bank-of-china", "custom"}:
        errors.append(f"unsupported or missing data-theme: {parser.theme}")
    if parser.theme == "custom":
        for token in ("--accent", "--accent-rgb", "--accent-aux", "--accent-aux-rgb", "--editorial-highlight", "--editorial-highlight-soft"):
            if not re.search(rf"{re.escape(token)}\s*:", text):
                errors.append(f"custom theme missing token: {token}")
    if not parser.has_viewport:
        errors.append("missing viewport meta")
    if not parser.has_description:
        errors.append("missing non-empty meta description")
    if not parser.has_title:
        errors.append("missing title")
    if not parser.has_main:
        errors.append("missing id=main")
    if not parser.has_skip:
        errors.append("missing skip link to #main")
    if not parser.headings or parser.headings[0] != 1:
        errors.append("first heading must be h1")
    for previous, current in zip(parser.headings, parser.headings[1:]):
        if current > previous + 1:
            errors.append(f"heading level jumps from h{previous} to h{current}")
    id_set = set(parser.ids)
    for href in parser.hrefs:
        if href.startswith("#") and href[1:] not in id_set:
            errors.append(f"unresolved internal anchor: {href}")
    for tag, value in parser.assets:
        if single_file and not value.startswith(("data:", "#")):
            errors.append(f"single-file delivery keeps external {tag} asset: {value}")
            continue
        if is_remote(value):
            continue
        candidate = (path.parent / value.split("?", 1)[0].split("#", 1)[0]).resolve()
        if single_file:
            errors.append(f"single-file delivery keeps local {tag} asset: {value}")
        elif not candidate.exists():
            errors.append(f"missing local {tag} asset: {value}")
    if parser.images_without_alt:
        errors.append(f"images missing alt attribute: {parser.images_without_alt}")
    for variant, _ in parser.media_story_variants:
        if variant in {"unclassified", "ambiguous"}:
            errors.append(f"media-story has {variant} composition variant")
    if len(parser.media_story_variants) > 1:
        for previous, current in zip(parser.media_story_variants, parser.media_story_variants[1:]):
            if previous[0] == current[0] and not (previous[1] and current[1]):
                errors.append(
                    "consecutive media stories repeat the same composition without "
                    'data-media-series="true"'
                )
    for index, table in enumerate(parser.tables, start=1):
        if table["caption"] == 0:
            errors.append(f"table {index} missing caption")
        if table["th"] and table["scoped_th"] != table["th"]:
            errors.append(f"table {index} has th elements without scope")
    content = visible_markup(text)
    structural_labels = re.findall(
        r'class=["\'][^"\']*\b(?:eyebrow|section-label|context-label)\b[^"\']*["\'][^>]*>([^<]+)',
        content,
        re.IGNORECASE,
    )
    for label in structural_labels:
        cleaned = label.strip()
        if re.search(r"[A-Za-z]", cleaned) and not re.search(r"[\u4e00-\u9fff]", cleaned):
            errors.append(f"Chinese delivery keeps English structural label: {cleaned}")
    heading_texts = [
        re.sub(r"<[^>]+>", "", value).strip()
        for value in re.findall(r"<h[1-3]\b[^>]*>(.*?)</h[1-3]>", content, re.IGNORECASE | re.DOTALL)
    ]
    for heading in heading_texts:
        for term in CUSTOMER_HEADING_JARGON:
            if term.lower() in heading.lower():
                errors.append(f"customer-visible heading keeps authoring jargon: {term} -> {heading}")
    if parser.composition_profile in STABLE_COMPOSITION_PROFILES:
        errors.extend(section_numbering_errors(content))
    if not allow_placeholders:
        for marker in PLACEHOLDERS:
            if marker.lower() in content.lower():
                errors.append(f"delivery contains placeholder marker: {marker}")
    for match in re.finditer(r"font-size\s*:\s*([^;\"}]+)", content):
        for number in re.findall(r"(\d+(?:\.\d+)?)px", match.group(1)):
            value = float(number)
            if not 16 <= value <= 60:
                errors.append(f"content font-size outside 16px-60px: {value}px")
    if single_file:
        for match in re.finditer(r"url\(([^)]+)\)", content, re.IGNORECASE):
            value = match.group(1).strip().strip("'\"")
            if not value.startswith(("data:", "#")):
                errors.append(f"single-file CSS keeps external url(): {value}")
        if re.search(r"@import\s", content, re.IGNORECASE):
            errors.append("single-file CSS keeps @import rule")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--single-file", action="store_true")
    parser.add_argument("--allow-placeholders", action="store_true")
    args = parser.parse_args()
    failures: list[str] = []
    for path in args.paths:
        for error in validate(path.resolve(), args.single_file, args.allow_placeholders):
            failures.append(f"{path}: {error}")
    if failures:
        print("Delivery validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"Validated {len(args.paths)} delivery file(s) successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
