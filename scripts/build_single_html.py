#!/usr/bin/env python3
"""Build a portable single-file Technical Editorial Web deliverable."""

from __future__ import annotations

import argparse
import base64
import mimetypes
import re
from pathlib import Path


EDITOR_MARKER = 'data-te-editor-asset="true"'


def read_text(path: Path) -> str:
    # Imported CSS or scripts may carry a UTF-8 BOM. It is valid at a file
    # boundary but becomes an unexpected character when embedded mid-document.
    # Strip it before composing the single-file artifact.
    return path.read_text(encoding="utf-8-sig")


def local_path(owner: Path, value: str) -> Path | None:
    if not value or value.startswith(("data:", "http://", "https://", "//", "#", "mailto:", "tel:")):
        return None
    candidate = (owner.parent / value.split("?", 1)[0].split("#", 1)[0]).resolve()
    return candidate if candidate.exists() and candidate.is_file() else None


def expand_css(path: Path, seen: set[Path] | None = None) -> str:
    seen = set() if seen is None else seen
    resolved = path.resolve()
    if resolved in seen:
        raise ValueError(f"circular CSS import: {resolved}")
    seen.add(resolved)
    text = read_text(resolved)

    def replace_import(match: re.Match[str]) -> str:
        target = local_path(resolved, match.group("path"))
        if target is None:
            return match.group(0)
        return f"/* inlined: {target.name} */\n{expand_css(target, seen.copy())}"

    expanded = re.sub(
        r"@import\s+(?:url\()?['\"]?(?P<path>[^'\")\s;]+)['\"]?\)?\s*;",
        replace_import,
        text,
        flags=re.IGNORECASE,
    )

    def replace_url(match: re.Match[str]) -> str:
        value = match.group("value").strip().strip("'\"")
        target = local_path(resolved, value)
        if target is None:
            return match.group(0)
        return f'url("{data_uri(target)}")'

    return re.sub(r"url\((?P<value>[^)]+)\)", replace_url, expanded, flags=re.IGNORECASE)


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_styles(html: str, owner: Path) -> str:
    pattern = re.compile(
        r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])(?=[^>]*\bhref=["\'](?P<href>[^"\']+)["\'])[^>]*>',
        re.IGNORECASE,
    )

    def replace(match: re.Match[str]) -> str:
        path = local_path(owner, match.group("href"))
        if path is None:
            return match.group(0)
        return f'<style data-inlined-from="{path.name}">\n{expand_css(path)}\n</style>'

    return pattern.sub(replace, html)


def inline_scripts(html: str, owner: Path, clean: bool) -> str:
    pattern = re.compile(
        r'<script\b(?P<attrs>[^>]*?)\bsrc=["\'](?P<src>[^"\']+)["\'](?P<tail>[^>]*)>\s*</script>',
        re.IGNORECASE,
    )

    def replace(match: re.Match[str]) -> str:
        attrs = f"{match.group('attrs')} {match.group('tail')}"
        if clean and EDITOR_MARKER in attrs:
            return ""
        path = local_path(owner, match.group("src"))
        if path is None:
            return match.group(0)
        kept_attrs = re.sub(r'\s*(?:src|defer)=["\'][^"\']*["\']|\s+defer\b', "", attrs, flags=re.IGNORECASE).strip()
        attr_text = f" {kept_attrs}" if kept_attrs else ""
        return f'<script{attr_text} data-inlined-from="{path.name}">\n{read_text(path)}\n</script>'

    return pattern.sub(replace, html)


def inline_media(html: str, owner: Path) -> str:
    pattern = re.compile(r'(?P<prefix>\b(?:src|poster)=["\'])(?P<value>[^"\']+)(?P<suffix>["\'])', re.IGNORECASE)

    def replace(match: re.Match[str]) -> str:
        path = local_path(owner, match.group("value"))
        if path is None:
            return match.group(0)
        return f"{match.group('prefix')}{data_uri(path)}{match.group('suffix')}"

    return pattern.sub(replace, html)


def build(source: Path, clean: bool, embed_media: bool) -> str:
    html = read_text(source)
    html = inline_styles(html, source)
    html = inline_scripts(html, source, clean=clean)
    if embed_media:
        html = inline_media(html, source)
    return html


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="source HTML file")
    parser.add_argument("-o", "--output", type=Path, help="output HTML path")
    parser.add_argument("--clean", action="store_true", help="remove the dormant editor from the delivery")
    parser.add_argument("--no-embed-media", action="store_true", help="keep local image and media paths")
    args = parser.parse_args()

    source = args.source.resolve()
    if not source.exists():
        parser.error(f"source does not exist: {source}")
    output = args.output.resolve() if args.output else source.with_name(f"{source.stem}.single.html")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(build(source, clean=args.clean, embed_media=not args.no_embed_media), encoding="utf-8")
    print(f"Built single-file HTML: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
