#!/usr/bin/env python3
"""Validate Technical Editorial Web templates with Python standard library only."""

from __future__ import annotations

import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = ROOT / "templates"
CSS_FILES = [
    ROOT / "assets" / "tokens.css",
    ROOT / "assets" / "base.css",
    ROOT / "assets" / "workbench.css",
]
EDITOR_FILE = ROOT / "assets" / "editorial-editor.js"
ENHANCEMENTS_FILE = ROOT / "assets" / "long-page-enhancements.js"
WORKBENCH_FILE = ROOT / "assets" / "workbench.js"
BUILD_FILE = ROOT / "scripts" / "build_single_html.py"
DELIVERY_VALIDATOR_FILE = ROOT / "scripts" / "validate_delivery.py"
EXAMPLE_SOURCE = ROOT / "examples" / "source-brief.md"
EXAMPLE_OUTPUT = ROOT / "examples" / "solution-example.html"
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
THEMES = {"richinfo", "china-mobile", "bank-of-china", "custom"}
LAYOUT_GROUPS = {
    "hero": {"hero-grid", "hero-data", "hero-media", "hero-architecture", "hero-launch"},
    "evidence": {"split-layout", "evidence-rail", "evidence-strip", "evidence-chain"},
    "band": {"thesis-band"},
    "comparison": {"comparison"},
    "metric": {"metric-story", "hero-metrics"},
    "decision": {"decision-grid"},
    "scope": {"scope-map"},
    "flow": {"process-chain"},
    "architecture": {"system-architecture", "architecture"},
    "hub": {"hub-map"},
    "roadmap": {"roadmap"},
    "case": {"case-narrative"},
    "media": {"media-mosaic", "hero-visual"},
    "signature": {"signature-visual"},
    "maturity": {"maturity-register", "maturity-tag"},
    "showcase": {"showcase-grid", "showcase-card"},
    "single-point": {"single-point"},
    "parallel": {"parallel-cluster"},
    "hierarchy": {"hierarchy-branches"},
    "cycle": {"cycle-orbit", "cycle-loop"},
    "branching": {"decision-tree"},
    "ownership": {"swimlane-flow"},
    "dependency": {"dependency-map"},
}
NARRATIVE_TEMPLATES = {
    "solution-brief.html",
    "executive-report.html",
    "technical-whitepaper.html",
    "project-showcase.html",
}
SPECIALIZED_TEMPLATES = {
    "implementation-plan.html",
    "technical-explainer.html",
}
STABLE_TEMPLATES = NARRATIVE_TEMPLATES | SPECIALIZED_TEMPLATES
TEMPLATE_SIGNATURES = {
    "solution-brief.html": {"hero-architecture", "signature-visual"},
    "executive-report.html": {"hero-data", "hero-metrics"},
    "technical-whitepaper.html": {"hero-architecture", "architecture-mini"},
    "project-showcase.html": {"hero-media", "hero-visual"},
    "implementation-plan.html": {"hero-plan", "summary-strip", "milestone-rail"},
    "technical-explainer.html": {"hero-explainer", "mechanism-path", "code-tour"},
}
WORKBENCH_TEMPLATES = {
    "workbench-blindspot-pass.html",
    "workbench-design-directions.html",
    "workbench-requirements-interview.html",
    "workbench-annotated-explainer.html",
    "workbench-tweakable-plan.html",
}
COMPOSITION_PROFILES = {
    "solution-brief.html": "solution-hub-roadmap",
    "executive-report.html": "executive-ledger-data",
    "technical-whitepaper.html": "whitepaper-layered-flow",
    "project-showcase.html": "showcase-media-story",
    "implementation-plan.html": "plan-milestone-control",
    "technical-explainer.html": "explainer-path-annotation",
    "layout-sampler.html": "sampler-variation-catalog",
    "workbench-blindspot-pass.html": "workbench-gap-register",
    "workbench-design-directions.html": "workbench-direction-compare",
    "workbench-requirements-interview.html": "workbench-question-decision",
    "workbench-annotated-explainer.html": "workbench-mechanism-inspection",
    "workbench-tweakable-plan.html": "workbench-plan-controls",
}
COMPOSITION_FAMILIES = {
    "single-thesis",
    "parallel",
    "hierarchy",
    "sequence",
    "cycle",
    "comparison",
    "causal-evidence",
    "branching",
    "ownership",
    "boundary",
    "status",
    "quantitative",
    "dependency",
}


class TemplateParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.errors: list[str] = []
        self.ids: list[str] = []
        self.hrefs: list[str] = []
        self.assets: list[str] = []
        self.classes: set[str] = set()
        self.lang: str | None = None
        self.theme: str | None = None
        self.composition_profile: str | None = None
        self.composition_pairs: list[tuple[str | None, str | None]] = []
        self.has_viewport = False
        self.has_skip_link = False
        self.heading_levels: list[int] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        if tag not in VOID_TAGS:
            self.stack.append(tag)
        if tag == "html":
            self.lang = attr.get("lang")
            self.theme = attr.get("data-theme")
        if tag == "body":
            self.composition_profile = attr.get("data-composition-profile")
        if "data-composition-family" in attr or "data-composition-variant" in attr:
            self.composition_pairs.append(
                (attr.get("data-composition-family"), attr.get("data-composition-variant"))
            )
        if tag == "meta" and attr.get("name") == "viewport":
            self.has_viewport = True
        if value := attr.get("id"):
            self.ids.append(value)
        if value := attr.get("class"):
            self.classes.update(value.split())
        if tag == "a" and (href := attr.get("href")):
            self.hrefs.append(href)
            if "skip-link" in attr.get("class", "").split() and href == "#main":
                self.has_skip_link = True
        if tag in {"link", "img", "script", "source"}:
            value = attr.get("href") or attr.get("src")
            if value:
                self.assets.append(value)
        if re.fullmatch(r"h[1-6]", tag):
            self.heading_levels.append(int(tag[1]))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS and self.stack and self.stack[-1] == tag:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
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


def check_template(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    parser = TemplateParser()
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
    if parser.theme not in THEMES:
        errors.append(f"unsupported or missing data-theme: {parser.theme}")
    expected_profile = COMPOSITION_PROFILES.get(path.name)
    if expected_profile and parser.composition_profile != expected_profile:
        errors.append(
            "missing or incorrect composition profile: "
            f"expected {expected_profile}, found {parser.composition_profile or 'none'}"
        )
    for family, variant in parser.composition_pairs:
        if family not in COMPOSITION_FAMILIES:
            errors.append(f"unsupported composition family: {family or 'none'}")
        if not variant:
            errors.append(f"composition variant missing for family: {family or 'none'}")
    if not parser.has_viewport:
        errors.append("missing viewport meta")
    if not parser.has_skip_link:
        errors.append("missing skip link to #main")
    if "main" not in parser.ids:
        errors.append("missing id=main")
    editor_reference = '<script src="../assets/editorial-editor.js" data-te-editor-asset="true" defer></script>'
    if editor_reference not in text:
        errors.append("missing dormant built-in editor asset")
    enhancements_reference = '<script src="../assets/long-page-enhancements.js" defer></script>'
    if enhancements_reference not in text:
        errors.append("missing long-page enhancements asset")
    if 'data-reading-progress="true"' not in text:
        errors.append("missing reading progress opt-in")
    if not parser.heading_levels or parser.heading_levels[0] != 1:
        errors.append("first heading must be h1")
    for previous, current in zip(parser.heading_levels, parser.heading_levels[1:]):
        if current > previous + 1:
            errors.append(f"heading level jumps from h{previous} to h{current}")

    id_set = set(parser.ids)
    for href in parser.hrefs:
        if href.startswith("#") and href[1:] not in id_set:
            errors.append(f"unresolved internal anchor: {href}")
    for asset in parser.assets:
        if asset.startswith(("http://", "https://", "data:", "#")):
            continue
        if not (path.parent / asset).resolve().exists():
            errors.append(f"missing local asset: {asset}")

    if path.name in NARRATIVE_TEMPLATES:
        groups = {
            name for name, classes in LAYOUT_GROUPS.items() if parser.classes & classes
        }
        if len(groups) < 4:
            errors.append(
                "insufficient layout variety: expected at least 4 module groups, "
                f"found {', '.join(sorted(groups)) or 'none'}"
            )
        for required_class in {"eyebrow", "section-heading"}:
            if required_class not in parser.classes:
                errors.append(f"missing common page composition class: {required_class}")

    if path.name in SPECIALIZED_TEMPLATES:
        for required_class in {"eyebrow", "section-heading", "context-panel"}:
            if required_class not in parser.classes:
                errors.append(f"missing specialized deliverable class: {required_class}")

    if path.name in STABLE_TEMPLATES:
        section_indexes = [
            int(value)
            for value in re.findall(
                r'class=["\'][^"\']*\bsection-index\b[^"\']*["\'][^>]*>\s*(\d{2})\s*<',
                text,
                re.IGNORECASE,
            )
        ]
        if not section_indexes:
            errors.append("formal stable template missing numbered thematic sections")
        elif section_indexes != list(range(1, len(section_indexes) + 1)):
            errors.append(
                "thematic section indexes must be continuous from 01: "
                + ", ".join(f"{value:02d}" for value in section_indexes)
            )
        visible_labels = re.findall(
            r'class=["\'][^"\']*\b(?:eyebrow|section-label|context-label)\b[^"\']*["\'][^>]*>([^<]+)',
            text,
            re.IGNORECASE,
        )
        for label in visible_labels:
            cleaned = label.strip()
            if re.search(r"[A-Za-z]", cleaned) and not re.search(r"[\u4e00-\u9fff]", cleaned):
                errors.append(f"Chinese stable template keeps English structural label: {cleaned}")

    if path.name in TEMPLATE_SIGNATURES:
        missing_signature = sorted(TEMPLATE_SIGNATURES[path.name] - parser.classes)
        if missing_signature:
            errors.append(
                "missing task-specific first-screen signature: "
                + ", ".join(missing_signature)
            )

    if path.name == "solution-brief.html":
        for required_class in {"is-soft", "is-tinted", "is-deep", "roadmap"}:
            if required_class not in parser.classes:
                errors.append(f"solution brief missing rhythm or sequence class: {required_class}")
        for required_class in {"is-richinfo", "brand-cn", "brand-en"}:
            if required_class not in parser.classes:
                errors.append(f"solution brief missing bilingual Richinfo wordmark class: {required_class}")
    if path.name in WORKBENCH_TEMPLATES:
        required_workbench_markers = {
            'data-workbench',
            '../assets/workbench.css',
            '../assets/workbench.js',
            'data-artifact-status',
        }
        for marker in required_workbench_markers:
            if marker not in text:
                errors.append(f"missing workbench capability: {marker}")

    if path.name == "workbench-annotated-explainer.html":
        required_overview_markers = {
            "mechanism-overview-band",
            "mechanism-overview-figure",
            "mechanism-main-flow",
            "mechanism-feedback",
        }
        for marker in required_overview_markers:
            if marker not in parser.classes:
                errors.append(f"missing mechanism overview graphic: {marker}")

    if path.name in {"layout-sampler.html", "technical-whitepaper.html"}:
        if "system-architecture" not in parser.classes:
            errors.append("missing full system architecture layout")

    if path.name == "layout-sampler.html":
        required_sampler_modules = {
            "hero-launch",
            "launch-tier-grid",
            "signature-visual",
            "evidence-chain",
            "maturity-register",
            "maturity-tag",
            "chart-figure",
            "bar-chart",
            "line-chart",
            "waterfall-chart",
            "faq-list",
            "glossary-grid",
            "reference-list",
            "image-compare",
            "action-band",
            "is-sticky",
            "hero-chip-list",
            "topic-chip",
            "section-heading",
            "is-composed",
            "section-title-row",
            "section-count",
            "showcase-grid",
            "showcase-card",
            "showcase-visual",
            "showcase-body",
            "showcase-footer",
            "context-panel",
            "summary-strip",
            "milestone-rail",
            "annotated-panel",
            "mockup-pair",
            "code-tour",
            "risk-ledger",
            "question-list",
            "media-story",
            "is-triptych",
            "is-portrait-cards",
            "is-text-led",
            "is-lead-mosaic",
            "single-point",
            "is-annotated",
            "parallel-cluster",
            "hierarchy-branches",
            "timeline",
            "cycle-orbit",
            "cycle-loop",
            "decision-tree",
            "decision-question",
            "decision-branches",
            "swimlane-flow",
            "swimlane-row",
            "dependency-map",
            "dependency-foundation",
        }
        missing_sampler_modules = sorted(required_sampler_modules - parser.classes)
        if missing_sampler_modules:
            errors.append(
                "missing launch/signature/evidence/maturity sampler modules: "
                + ", ".join(missing_sampler_modules)
            )
        represented_families = {family for family, _ in parser.composition_pairs if family}
        missing_families = sorted(COMPOSITION_FAMILIES - represented_families)
        if missing_families:
            errors.append(
                "composition sampler does not cover all relationship families: "
                + ", ".join(missing_families)
            )

    for match in re.finditer(r"font-size\s*:\s*([^;\"]+)", text):
        for number in re.findall(r"(\d+(?:\.\d+)?)px", match.group(1)):
            value = float(number)
            if not 16 <= value <= 60:
                errors.append(f"inline font-size outside 16px-60px: {value}px")
    if "<table" in text:
        if "<caption" not in text:
            errors.append("table missing caption")
        for match in re.finditer(r"<th\b([^>]*)>", text, re.IGNORECASE):
            if not re.search(r'\bscope=["\'](?:row|col|rowgroup|colgroup)["\']', match.group(1), re.IGNORECASE):
                errors.append("table header missing scope")
    return errors


def check_css() -> list[str]:
    errors: list[str] = []
    text = "\n".join(path.read_text(encoding="utf-8") for path in CSS_FILES)
    declarations = re.findall(r"(?:font-size\s*:|--fs-[\w-]+\s*:)([^;]+)", text)
    for declaration in declarations:
        for number in re.findall(r"(\d+(?:\.\d+)?)px", declaration):
            value = float(number)
            if not 16 <= value <= 60:
                errors.append(f"CSS font-size outside 16px-60px: {value}px")
    token_text = (ROOT / "assets" / "tokens.css").read_text(encoding="utf-8")
    body_match = re.search(r"--fs-body\s*:\s*(\d+(?:\.\d+)?)px", token_text)
    if not body_match or float(body_match.group(1)) < 16:
        errors.append("body reading baseline must be at least 16px")
    meta_match = re.search(r"--fs-meta\s*:\s*(\d+(?:\.\d+)?)px", token_text)
    if not meta_match or float(meta_match.group(1)) < 16:
        errors.append("supporting text baseline must be at least 16px")
    forbidden = {
        "Inter": r"\bInter\b",
        "serif font variable": r"font-serif",
        "Noto Serif": r"Noto Serif",
        "SimSun": r"\bSimSun\b",
        "unstable weight 760/780": r"font-weight\s*:\s*7[68]0",
    }
    for label, pattern in forbidden.items():
        if re.search(pattern, text, re.IGNORECASE):
            errors.append(f"forbidden font rule remains: {label}")
    for selector in ("thesis-band", "scope-core", "action-band"):
        match = re.search(rf"\.{selector}\s*\{{([^}}]+)\}}", text, re.DOTALL)
        if not match:
            errors.append(f"missing large-surface rule: .{selector}")
            continue
        declarations = match.group(1)
        if re.search(r"background\s*:\s*var\(--ink\)", declarations):
            errors.append(f"large reading surface must not use ink background: .{selector}")
        if "var(--accent" not in declarations:
            errors.append(f"large reading surface must use a theme-derived tint or edge: .{selector}")
    required_markers = [
        "@media (max-width: 900px)",
        "@media (max-width: 640px)",
        "@media (prefers-reduced-motion: reduce)",
        "@media print",
        ".split-layout",
        ".comparison",
        ".decision-grid",
        ".process-chain",
        ".system-architecture",
        ".hero-launch",
        ".signature-visual",
        ".evidence-chain",
        ".maturity-register",
        ".maturity-tag",
        ".media-mosaic",
        ".media-story",
        ".media-story.is-triptych",
        ".media-story.is-portrait-cards",
        ".media-story.is-text-led",
        ".media-story.is-lead-mosaic",
        ".single-point.is-annotated",
        ".parallel-cluster",
        ".hierarchy-branches",
        ".cycle-orbit",
        ".cycle-loop",
        ".decision-tree",
        ".decision-question",
        ".decision-branches",
        ".swimlane-flow",
        ".swimlane-row",
        ".dependency-map",
        ".dependency-foundation",
        ".chart-figure",
        ".bar-chart",
        ".line-chart",
        ".waterfall-chart",
        ".faq-list",
        ".glossary-grid",
        ".reference-list",
        ".image-compare",
        ".action-band",
        ".table-wrap.is-sticky",
        ".reading-progress",
        ".auto-toc",
        ".hero-chip-list",
        ".topic-chip",
        ".section-heading.is-composed",
        ".section-heading.is-numbered",
        ".brand.is-richinfo",
        ".section.is-soft",
        ".section.is-tinted",
        ".section.is-deep",
        ".section-title-row",
        ".section-count",
        ".showcase-grid",
        ".showcase-card",
        ".showcase-visual",
        ".showcase-body",
        ".showcase-footer",
        ".hero-plan",
        ".hero-explainer",
        ".context-panel",
        ".summary-strip",
        ".milestone-rail",
        ".annotated-panel",
        ".specimen-grid",
        ".control-strip",
        ".code-tour",
        ".mockup-pair",
        ".risk-ledger",
        ".question-list",
        ".handoff-bar",
        ".mechanism-path",
        "--editorial-highlight",
        ".workbench-hero",
        ".artifact-output",
        ".blindspot-register",
        ".direction-grid",
        ".interview-shell",
        ".explainer-layout",
        ".mechanism-overview-band",
        ".mechanism-main-flow",
        ".mechanism-feedback",
        ".plan-decisions",
    ]
    for marker in required_markers:
        if marker not in text:
            errors.append(f"missing CSS capability: {marker}")
    return errors


def check_editor() -> list[str]:
    errors: list[str] = []
    if not EDITOR_FILE.exists():
        return ["missing assets/editorial-editor.js"]
    text = EDITOR_FILE.read_text(encoding="utf-8")
    required_markers = [
        "window.TechnicalEditorialEditor",
        "function activate()",
        "function deactivate()",
        "function undo()",
        "function redo()",
        "function buildPrompt()",
        "function exportSnapshot()",
        "const themeColorColumns",
        "function renderColorPalette(",
        "window.EyeDropper",
        "EDITOR_CHROME_COMPACT_TYPE_EXCEPTION",
        "window.localStorage",
        "function exportChangesJson()",
        "function restoreLocalSession()",
        "function moveSelectedSection(",
        'data-control="link-href"',
        'data-control="image-alt"',
        'data-action="mobile-preview"',
        'id: "font-size", label: "字号", type: "number", min: 16, max: 60',
        'params.get("te-edit")',
        'event.key.toLowerCase() === "e"',
        "data-te-editor-ui",
    ]
    for marker in required_markers:
        if marker not in text:
            errors.append(f"missing editor capability: {marker}")
    compact_sizes = [
        float(value)
        for declaration in re.findall(r"font-size\s*:\s*([^;]+)", text)
        for value in re.findall(r"(\d+(?:\.\d+)?)px", declaration)
    ]
    for value in compact_sizes:
        if not 12 <= value <= 15:
            errors.append(f"editor chrome font-size outside intentional 12px-15px exception: {value}px")
    return errors


def check_enhancements() -> list[str]:
    if not ENHANCEMENTS_FILE.exists():
        return ["missing assets/long-page-enhancements.js"]
    text = ENHANCEMENTS_FILE.read_text(encoding="utf-8")
    markers = ["function buildProgress()", "function buildToc()", "data-auto-toc", "aria-valuenow"]
    return [f"missing long-page enhancement: {marker}" for marker in markers if marker not in text]


def check_workbench() -> list[str]:
    if not WORKBENCH_FILE.exists():
        return ["missing assets/workbench.js"]
    text = WORKBENCH_FILE.read_text(encoding="utf-8")
    markers = [
        "function initBlindspot(",
        "function initDirections(",
        "function initInterview(",
        "function initExplainer(",
        "function initPlan(",
        "function initReset(",
        "data-copy-target",
        "aria-pressed",
        "workbenchreset",
    ]
    return [f"missing workbench enhancement: {marker}" for marker in markers if marker not in text]


def main() -> int:
    failures: list[str] = []
    templates = sorted(TEMPLATE_DIR.glob("*.html"))
    expected = NARRATIVE_TEMPLATES | SPECIALIZED_TEMPLATES | WORKBENCH_TEMPLATES | {"layout-sampler.html"}
    missing = expected - {path.name for path in templates}
    if missing:
        failures.append(f"templates: missing files: {', '.join(sorted(missing))}")
    profile_values = list(COMPOSITION_PROFILES.values())
    duplicate_profiles = [
        profile for profile, count in Counter(profile_values).items() if count > 1
    ]
    if duplicate_profiles:
        failures.append(
            "templates: repeated composition profiles: "
            + ", ".join(sorted(duplicate_profiles))
        )
    for path in templates:
        for error in check_template(path):
            failures.append(f"{path.relative_to(ROOT)}: {error}")
    for error in check_css():
        failures.append(f"assets: {error}")
    for error in check_editor():
        failures.append(f"editor: {error}")
    for error in check_enhancements():
        failures.append(f"enhancements: {error}")
    for error in check_workbench():
        failures.append(f"workbench: {error}")
    for path in [BUILD_FILE, DELIVERY_VALIDATOR_FILE, EXAMPLE_SOURCE, EXAMPLE_OUTPUT]:
        if not path.exists():
            failures.append(f"missing reusable resource: {path.relative_to(ROOT)}")
    if BUILD_FILE.exists() and 'encoding="utf-8-sig"' not in BUILD_FILE.read_text(encoding="utf-8"):
        failures.append("builder: imported text must strip UTF-8 BOM before inline composition")

    if failures:
        print("Template validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"Validated {len(templates)} templates, shared CSS, built-in editor, and workbench interactions successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
