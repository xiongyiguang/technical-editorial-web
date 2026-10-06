#!/usr/bin/env python3
"""Regression checks for optional numbering without weakening delivery safeguards."""

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from validate_delivery import section_numbering_errors, validate
from validate_templates import check_template, TEMPLATE_DIR


class DeliveryTests(unittest.TestCase):
    def validate_page(self, content: str) -> list[str]:
        html = '''<!doctype html><html lang="zh-CN" data-theme="richinfo">
<head><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="本机技能设计规则说明"><title>设计规则说明</title></head>
<body data-composition-profile="solution-hub-roadmap">
<a class="skip-link" href="#main">跳到正文</a><main id="main"><h1>按内容选择结构</h1>
''' + content + '</main></body></html>'
        with tempfile.NamedTemporaryFile(suffix='.html', mode='w', encoding='utf-8') as file:
            file.write(html)
            file.flush()
            return validate(Path(file.name), single_file=True, allow_placeholders=False)

    def test_short_unnumbered_formal_page(self):
        self.assertEqual([], self.validate_page('<section><h2>选择依据</h2><p>同类对象沿用相同结构。</p></section>'))

    def test_numbered_formal_page(self):
        self.assertEqual([], self.validate_page('<span class="section-index">01</span><h2>依据</h2><span class="section-index">02</span><h2>检查</h2>'))

    def test_gaps_duplicates_and_wrong_start(self):
        for values in (('01', '03'), ('01', '01'), ('02',), ('00',)):
            with self.subTest(values=values):
                errors = self.validate_page(''.join(f'<span class="section-index">{v}</span><h2>检查</h2>' for v in values))
                self.assertTrue(any('continuous from 01' in e for e in errors), errors)

    def test_malformed_and_empty_indexes(self):
        for value in ('', 'A1', '1', '001'):
            with self.subTest(value=value):
                self.assertTrue(section_numbering_errors(f'<span class="section-index">{value}</span>'))

    def test_nested_text_and_unquoted_class(self):
        self.assertEqual([], section_numbering_errors('<span class=section-index><b>01</b></span>'))
        self.assertTrue(section_numbering_errors('<span class=section-index><b>03</b></span>'))

    def test_unrelated_classes_do_not_trigger_numbering(self):
        self.assertEqual([], section_numbering_errors('<span class="section-index-note">章节说明</span>'))

    def test_existing_accessibility_and_content_guards(self):
        for content, expected in (
            ('<a href="#missing">正文</a>', 'unresolved internal anchor'),
            ('<p style="font-size:12px">正文</p>', 'font-size outside 16px-60px'),
            ('<p>待填写</p>', 'placeholder'),
            ('<img src="https://example.com/image.png" alt="说明">', 'external img asset'),
        ):
            with self.subTest(expected=expected):
                self.assertTrue(any(expected in e for e in self.validate_page(content)))

    def test_template_numbering_uses_same_contract(self):
        text = (TEMPLATE_DIR / 'solution-brief.html').read_text(encoding='utf-8-sig')
        import re
        unnumbered = re.sub(r'<span class="section-index">\d+</span>', '', text)
        broken = text.replace('class="section-index">01', 'class="section-index">03', 1)
        # Validate under its actual filename and asset paths without overwriting the template.
        for variant, must_fail in ((unnumbered, False), (broken, True)):
            with patch.object(Path, 'read_text', return_value=variant):
                errors = check_template(TEMPLATE_DIR / 'solution-brief.html')
                self.assertEqual(must_fail, any('continuous from 01' in e for e in errors), errors)
                if not must_fail:
                    self.assertEqual([], errors)


if __name__ == '__main__':
    unittest.main()
