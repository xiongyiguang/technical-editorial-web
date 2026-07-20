(function () {
  "use strict";

  if (window.TechnicalEditorialEditor) return;

  const UI_ATTR = "data-te-editor-ui";
  const ASSET_ATTR = "data-te-editor-asset";
  const SELECTED_CLASS = "te-editor-selected";
  const HOVER_CLASS = "te-editor-hover";
  const EDIT_MODE_CLASS = "te-editor-active";
  const MAX_SNIPPET = 600;
  const EDITOR_CHROME_COMPACT_TYPE_EXCEPTION = "12px-15px";
  const STORAGE_PREFIX = "technical-editorial-editor:";

  const themeColorColumns = [
    { variable: "--canvas", label: "画布" },
    { variable: "--ink", label: "墨色" },
    { variable: "--surface", label: "浅表面" },
    { variable: "--body", label: "正文" },
    { variable: "--accent", label: "主题色" },
    { variable: "--accent-aux", label: "对比色" },
    { variable: "--editorial-highlight", label: "强调色" },
    { variable: "--muted", label: "辅助文字" },
    { variable: "--surface-strong", label: "深表面" },
    { variable: "--line", label: "分隔线" }
  ];

  const standardColors = [
    "#c00000", "#ff0000", "#ff7a00", "#ffc000", "#fff000",
    "#8dc63f", "#00a651", "#00aeef", "#0070c0", "#002060", "#7030a0"
  ];

  const themeNames = {
    richinfo: "彩讯科技",
    "china-mobile": "中国移动",
    "bank-of-china": "中国银行"
  };

  const state = {
    active: false,
    selected: null,
    hovered: null,
    panel: null,
    history: [],
    cursor: 0,
    styleElement: null,
    colorPalette: null,
    colorProperty: null,
    colorTrigger: null,
    storageKey: `${STORAGE_PREFIX}${window.location.pathname || document.title}`
  };

  const styleControls = [
    { id: "font-size", label: "字号", type: "number", min: 16, max: 60, step: 1, unit: "px" },
    { id: "line-height", label: "行高", type: "number", min: 1, max: 3, step: 0.1, unit: "" },
    { id: "letter-spacing", label: "字距", type: "number", min: -2, max: 20, step: 0.5, unit: "px" },
    { id: "border-radius", label: "圆角", type: "number", min: 0, max: 60, step: 1, unit: "px" },
    { id: "margin", label: "外边距", type: "text", placeholder: "如 24px 0" },
    { id: "padding", label: "内边距", type: "text", placeholder: "如 24px" },
    { id: "width", label: "宽度", type: "text", placeholder: "如 100% / 640px" },
    { id: "max-width", label: "最大宽度", type: "text", placeholder: "如 760px" }
  ];

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function isEditorElement(element) {
    return Boolean(element && element.closest && element.closest(`[${UI_ATTR}]`));
  }

  function isSelectable(element) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return false;
    if (isEditorElement(element)) return false;
    if (element.closest?.("[data-long-page-ui]")) return false;
    if (element === document.documentElement || element === document.body) return false;
    return !["SCRIPT", "STYLE", "LINK", "META", "HEAD", "NOSCRIPT"].includes(element.tagName);
  }

  function describeElement(element) {
    if (!element) return "未选择元素";
    const id = element.id ? `#${element.id}` : "";
    const classes = Array.from(element.classList || [])
      .filter((name) => !name.startsWith("te-editor-"))
      .slice(0, 2)
      .map((name) => `.${name}`)
      .join("");
    const text = normalizeText(element.textContent || "");
    return `${element.tagName.toLowerCase()}${id}${classes}${text ? ` · ${clip(text, 34)}` : ""}`;
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function clip(value, length) {
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~\s])/g, "\\$1");
  }

  function nthOfType(element) {
    const parent = element.parentElement;
    if (!parent) return 1;
    const siblings = Array.from(parent.children).filter((item) => item.tagName === element.tagName);
    return Math.max(1, siblings.indexOf(element) + 1);
  }

  function createLocator(element) {
    const parts = [];
    let current = element;
    while (current && current !== document.documentElement) {
      if (current.id) {
        parts.push(`#${cssEscape(current.id)}`);
        break;
      }
      const semanticClass = Array.from(current.classList || []).find(
        (name) => !name.startsWith("te-editor-") && name.length <= 40
      );
      const base = semanticClass
        ? `${current.tagName.toLowerCase()}.${cssEscape(semanticClass)}`
        : `${current.tagName.toLowerCase()}:nth-of-type(${nthOfType(current)})`;
      parts.push(base);
      current = current.parentElement;
    }
    return parts.reverse().join(" > ");
  }

  function getSectionContext(element) {
    const section = element.closest("section, header, main, footer, article");
    if (!section) return "页面主体";
    if (section.id) return `#${section.id}`;
    const heading = section.querySelector("h1, h2, h3");
    return heading ? clip(normalizeText(heading.textContent), 48) : describeElement(section);
  }

  function getSnippet(element) {
    try {
      const clone = element.cloneNode(true);
      clone.querySelectorAll?.(`[${UI_ATTR}]`).forEach((item) => item.remove());
      clone.classList?.remove(SELECTED_CLASS, HOVER_CLASS);
      if (clone.getAttribute?.("class") === "") clone.removeAttribute("class");
      const html = clone.outerHTML.replace(/src="data:[^"]+"/g, 'src="[data URL omitted]"');
      return html.length > MAX_SNIPPET ? `${html.slice(0, MAX_SNIPPET)}\n…` : html;
    } catch {
      return "";
    }
  }

  function canEditText(element) {
    if (!element) return false;
    if (["IMG", "VIDEO", "SVG", "CANVAS", "IFRAME", "INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) {
      return false;
    }
    return element.children.length === 0;
  }

  function injectStyles() {
    if (state.styleElement) return;
    const style = document.createElement("style");
    style.id = "te-editor-styles";
    style.setAttribute(UI_ATTR, "true");
    style.textContent = `
      html.${EDIT_MODE_CLASS} { cursor: crosshair; }
      .${HOVER_CLASS}:not(.${SELECTED_CLASS}) { outline: 2px dashed #ff642a !important; outline-offset: 3px !important; }
      .${SELECTED_CLASS} { outline: 3px solid #ff642a !important; outline-offset: 4px !important; }
      /* Intentional compact editor chrome exception: ${EDITOR_CHROME_COMPACT_TYPE_EXCEPTION}. Customer-visible page content stays at 16px-60px. */
      [${UI_ATTR}] { box-sizing: border-box; font-family: "Microsoft YaHei", "PingFang SC", sans-serif; }
      .te-editor-panel {
        position: fixed; z-index: 2147483646; top: 12px; right: 12px; bottom: 12px;
        width: min(360px, calc(100vw - 24px)); overflow: auto; padding: 12px;
        color: #171717; background: #ffffff; border: 1px solid #d8d8d2; border-radius: 18px;
        box-shadow: 0 14px 36px rgba(0,0,0,.16); cursor: default; font-size: 13px; line-height: 1.35;
      }
      .te-editor-panel *, .te-editor-panel *::before, .te-editor-panel *::after { box-sizing: border-box; }
      .te-editor-header, .te-editor-actions, .te-editor-inline { display: flex; align-items: center; gap: 6px; }
      .te-editor-header { justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid #deded8; }
      .te-editor-header strong { font-size: 15px; }
      .te-editor-target { margin: 8px 0; padding: 7px 9px; background: #f4f4f1; border-radius: 9px; overflow-wrap: anywhere; }
      .te-editor-section { margin-top: 10px; padding-top: 8px; border-top: 1px solid #deded8; }
      .te-editor-section h2 { margin: 0 0 6px; font-size: 14px; line-height: 1.2; }
      .te-editor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px 7px; }
      .te-editor-field { display: grid; gap: 2px; min-width: 0; }
      .te-editor-field.is-wide { grid-column: 1 / -1; }
      .te-editor-field label, .te-editor-note, .te-editor-status { color: #676767; font-size: 12px; }
      .te-editor-panel input, .te-editor-panel select, .te-editor-panel textarea, .te-editor-panel button {
        min-height: 30px; border: 1px solid #cfcfc8; border-radius: 7px; font: inherit;
      }
      .te-editor-panel input, .te-editor-panel select, .te-editor-panel textarea { width: 100%; padding: 4px 7px; color: #171717; background: #fff; }
      .te-editor-panel textarea { min-height: 52px; resize: vertical; }
      .te-editor-panel button { padding: 4px 9px; color: #171717; background: #f4f4f1; cursor: pointer; }
      .te-editor-panel button:hover { border-color: #ff642a; }
      .te-editor-panel button:focus-visible, .te-editor-panel input:focus-visible,
      .te-editor-panel select:focus-visible, .te-editor-panel textarea:focus-visible { outline: 3px solid rgba(255,100,42,.28); outline-offset: 2px; }
      .te-editor-panel button.is-primary { color: #fff; background: #171717; border-color: #171717; }
      .te-editor-panel button:disabled, .te-editor-panel input:disabled, .te-editor-panel textarea:disabled { opacity: .48; cursor: not-allowed; }
      .te-editor-actions { flex-wrap: wrap; margin-top: 6px; }
      .te-editor-actions button { flex: 1 1 120px; }
      .te-editor-actions.is-compact button { flex-basis: 82px; }
      .te-editor-status { margin: 6px 0 0; min-height: 16px; }
      .te-editor-close { min-width: 30px; padding-inline: 6px !important; }
      .te-color-trigger { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; align-items: center; width: 100%; padding: 3px 6px !important; background: #fff !important; }
      .te-color-trigger-swatch { width: 20px; height: 20px; border: 1px solid #aaa; border-radius: 4px; background: var(--te-trigger-color, #fff); }
      .te-color-trigger-value { overflow: hidden; color: #424242; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
      .te-color-palette {
        position: fixed; z-index: 2147483647; width: min(348px, calc(100vw - 16px)); padding: 10px;
        color: #171717; background: #fff; border: 1px solid #bdbdb6; border-radius: 14px;
        box-shadow: 0 16px 42px rgba(0,0,0,.2); cursor: default; font-size: 13px; line-height: 1.3;
      }
      .te-color-palette[hidden] { display: none; }
      .te-color-palette button { font: inherit; cursor: pointer; }
      .te-color-palette-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
      .te-color-palette-title { display: grid; gap: 2px; }
      .te-color-palette-title strong { font-size: 14px; }
      .te-color-theme-name { color: #6b6b6b; font-size: 12px; }
      .te-color-palette-close { width: 30px; min-height: 30px; padding: 0; color: #333; background: #f4f4f1; border: 1px solid #d4d4ce; border-radius: 8px; }
      .te-color-theme-grid { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 3px; }
      .te-color-column { display: grid; grid-template-rows: 30px repeat(5, 24px); gap: 2px; }
      .te-color-swatch { position: relative; width: 100%; min-height: 0; padding: 0; border: 1px solid rgba(17,17,17,.12); border-radius: 2px; background: var(--te-swatch); }
      .te-color-swatch:hover, .te-color-swatch:focus-visible { z-index: 1; outline: 3px solid rgba(255,100,42,.32); outline-offset: 1px; }
      .te-color-swatch[aria-pressed="true"]::after { position: absolute; inset: 3px; border: 2px solid #fff; box-shadow: 0 0 0 1px #111; content: ""; }
      .te-color-palette-section { margin-top: 10px; padding-top: 8px; border-top: 1px solid #deded8; }
      .te-color-palette-section-title { display: block; margin-bottom: 6px; font-weight: 700; }
      .te-color-standard-grid { display: grid; grid-template-columns: repeat(11, minmax(0, 1fr)); gap: 4px; }
      .te-color-standard-grid .te-color-swatch { height: 24px; }
      .te-color-palette-actions { display: grid; gap: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #deded8; }
      .te-color-palette-actions button { min-height: 30px; padding: 4px 8px; color: #171717; text-align: left; background: #fff; border: 1px solid transparent; border-radius: 7px; }
      .te-color-palette-actions button:hover { background: #f4f4f1; border-color: #d4d4ce; }
      .te-color-palette-actions button:disabled { color: #999; cursor: not-allowed; }
      .te-color-palette-actions input[type="color"] { position: fixed; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
      @media (max-width: 760px) {
        .te-editor-panel { top: auto; left: 8px; right: 8px; bottom: 8px; width: auto; max-height: 52vh; }
        .te-color-palette { left: 8px !important; right: 8px; bottom: calc(52vh + 16px); width: auto; max-height: 44vh; overflow: auto; }
      }
      @media print { [${UI_ATTR}] { display: none !important; } .${SELECTED_CLASS}, .${HOVER_CLASS} { outline: 0 !important; } }
    `;
    document.head.appendChild(style);
    state.styleElement = style;
  }

  function createPanel() {
    if (state.panel) return;
    const panel = document.createElement("aside");
    panel.className = "te-editor-panel";
    panel.setAttribute(UI_ATTR, "true");
    panel.setAttribute("aria-label", "页面可视化编辑器");
    panel.innerHTML = `
      <div class="te-editor-header">
        <strong>页面编辑</strong>
        <div class="te-editor-inline">
          <button type="button" data-action="undo" title="撤销">撤销</button>
          <button type="button" data-action="redo" title="重做">重做</button>
          <button type="button" class="te-editor-close" data-action="close" aria-label="关闭编辑模式">×</button>
        </div>
      </div>
      <div class="te-editor-target" data-role="target">点击页面元素开始编辑</div>
      <section class="te-editor-section">
        <h2>文字</h2>
        <div class="te-editor-field is-wide">
          <textarea data-control="text" aria-label="元素文字" placeholder="选择无嵌套标签的文字元素"></textarea>
          <div class="te-editor-note" data-role="text-note">选择文字元素后可编辑。</div>
        </div>
      </section>
      <section class="te-editor-section">
        <h2>排版与尺寸</h2>
        <div class="te-editor-grid" data-role="style-grid"></div>
      </section>
      <section class="te-editor-section">
        <h2>对齐与颜色</h2>
        <div class="te-editor-grid">
          <div class="te-editor-field"><label for="te-text-align">文字对齐</label><select id="te-text-align" data-style="text-align"><option value="left">左对齐</option><option value="center">居中</option><option value="right">右对齐</option><option value="justify">两端对齐</option></select></div>
          <div class="te-editor-field"><label for="te-font-weight">字重</label><select id="te-font-weight" data-style="font-weight"><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option></select></div>
          <div class="te-editor-field"><label for="te-color">文字颜色</label><button id="te-color" type="button" class="te-color-trigger" data-color-property="color" aria-haspopup="dialog"><span class="te-color-trigger-swatch" aria-hidden="true"></span><span class="te-color-trigger-value">#111111</span></button></div>
          <div class="te-editor-field"><label for="te-background">背景颜色</label><button id="te-background" type="button" class="te-color-trigger" data-color-property="background-color" aria-haspopup="dialog"><span class="te-color-trigger-swatch" aria-hidden="true"></span><span class="te-color-trigger-value">#ffffff</span></button></div>
        </div>
      </section>
      <section class="te-editor-section" data-role="image-section" hidden>
        <h2>图片</h2>
        <div class="te-editor-field"><label for="te-image-file">替换图片</label><input id="te-image-file" type="file" accept="image/*" data-control="image"></div>
        <div class="te-editor-field"><label for="te-image-alt">替代文字</label><input id="te-image-alt" type="text" data-control="image-alt"></div>
        <div class="te-editor-field"><label for="te-image-caption">相邻图注</label><textarea id="te-image-caption" data-control="image-caption"></textarea></div>
      </section>
      <section class="te-editor-section" data-role="link-section" hidden>
        <h2>链接</h2>
        <div class="te-editor-field"><label for="te-link-href">链接地址</label><input id="te-link-href" type="text" data-control="link-href" placeholder="#section / https://…"></div>
      </section>
      <section class="te-editor-section" data-role="structure-section" hidden>
        <h2>区块结构</h2>
        <div class="te-editor-actions is-compact">
          <button type="button" data-action="move-up">上移</button>
          <button type="button" data-action="move-down">下移</button>
          <button type="button" data-action="duplicate-section">复制</button>
          <button type="button" data-action="hide-section">隐藏</button>
        </div>
      </section>
      <section class="te-editor-section">
        <h2>交付</h2>
        <div class="te-editor-actions">
          <button type="button" class="is-primary" data-action="copy-prompt">复制修改清单</button>
          <button type="button" data-action="export">导出当前快照</button>
          <button type="button" data-action="export-json">导出修改 JSON</button>
          <button type="button" data-action="import-json">导入修改 JSON</button>
          <button type="button" data-action="restore-local">恢复本地修改</button>
          <button type="button" data-action="mobile-preview">移动预览</button>
          <input type="file" accept="application/json,.json" data-control="import-json" hidden>
        </div>
        <p class="te-editor-note">修改会临时保存在本机浏览器；长期维护仍应复制清单并回写源码。便携交付请使用单文件构建器。</p>
      </section>
      <p class="te-editor-status" data-role="status" aria-live="polite">编辑模式已开启。点击页面元素进行选择。</p>
    `;

    const grid = panel.querySelector('[data-role="style-grid"]');
    styleControls.forEach((control) => {
      const wrapper = document.createElement("div");
      wrapper.className = "te-editor-field";
      const inputId = `te-${control.id}`;
      const attributes = [
        `id="${inputId}"`,
        `type="${control.type}"`,
        `data-style="${control.id}"`,
        control.min !== undefined ? `min="${control.min}"` : "",
        control.max !== undefined ? `max="${control.max}"` : "",
        control.step !== undefined ? `step="${control.step}"` : "",
        control.unit !== undefined ? `data-unit="${control.unit}"` : "",
        control.placeholder ? `placeholder="${control.placeholder}"` : ""
      ].filter(Boolean).join(" ");
      wrapper.innerHTML = `<label for="${inputId}">${control.label}</label><input ${attributes}>`;
      grid.appendChild(wrapper);
    });

    panel.addEventListener("click", handlePanelAction);
    panel.addEventListener("change", handlePanelChange);
    document.body.appendChild(panel);
    state.panel = panel;
    updatePanel();
  }

  function setStatus(message) {
    const status = state.panel?.querySelector('[data-role="status"]');
    if (status) status.textContent = message;
  }

  function rgbToHex(value) {
    const channels = String(value).match(/[\d.]+/g)?.map(Number) || [];
    if (channels.length < 3 || (channels.length >= 4 && channels[3] === 0)) return "#ffffff";
    return `#${channels.slice(0, 3).map((item) => Math.round(item).toString(16).padStart(2, "0")).join("")}`;
  }

  function normalizeHex(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
    if (/^#[0-9a-f]{3}$/.test(raw)) {
      return `#${raw.slice(1).split("").map((item) => item + item).join("")}`;
    }
    return rgbToHex(raw);
  }

  function hexToRgb(value) {
    const hex = normalizeHex(value).slice(1);
    return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
  }

  function rgbToHexValue(channels) {
    return `#${channels.map((item) => Math.max(0, Math.min(255, Math.round(item))).toString(16).padStart(2, "0")).join("")}`;
  }

  function mixColor(color, target, amount) {
    const sourceChannels = hexToRgb(color);
    const targetChannels = hexToRgb(target);
    return rgbToHexValue(sourceChannels.map((channel, index) => channel + (targetChannels[index] - channel) * amount));
  }

  function createColorSwatch(options) {
    const { color, value, label, currentColor } = options;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "te-color-swatch";
    button.style.setProperty("--te-swatch", color);
    button.dataset.colorValue = value;
    button.dataset.colorHex = color;
    button.title = `${label} · ${color}`;
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", String(normalizeHex(color) === normalizeHex(currentColor)));
    return button;
  }

  function getThemeContext() {
    const themedRoot = state.selected?.closest?.("[data-theme]") || document.documentElement;
    const themeId = themedRoot.getAttribute("data-theme") || document.documentElement.getAttribute("data-theme") || "richinfo";
    return {
      themeId,
      name: themeNames[themeId] || themeId,
      computed: window.getComputedStyle(state.selected || themedRoot)
    };
  }

  function getSelectedComputedColor(property) {
    if (!state.selected) return property === "color" ? "#111111" : "#ffffff";
    return rgbToHex(window.getComputedStyle(state.selected).getPropertyValue(property));
  }

  function ensureColorPalette() {
    if (state.colorPalette) return state.colorPalette;
    const palette = document.createElement("div");
    palette.className = "te-color-palette";
    palette.setAttribute(UI_ATTR, "true");
    palette.setAttribute("role", "dialog");
    palette.setAttribute("aria-label", "主题颜色选择器");
    palette.hidden = true;
    palette.innerHTML = `
      <div class="te-color-palette-header">
        <div class="te-color-palette-title"><strong>主题颜色</strong><span class="te-color-theme-name" data-role="theme-name"></span></div>
        <button type="button" class="te-color-palette-close" data-color-command="close" aria-label="关闭颜色选择器">×</button>
      </div>
      <div class="te-color-theme-grid" data-role="theme-colors"></div>
      <div class="te-color-palette-section">
        <span class="te-color-palette-section-title">标准色</span>
        <div class="te-color-standard-grid" data-role="standard-colors"></div>
      </div>
      <div class="te-color-palette-actions">
        <button type="button" data-color-command="other">◉ 其他颜色…</button>
        <button type="button" data-color-command="eyedropper">⌖ 取色器</button>
        <input type="color" data-color-command="native" aria-label="其他颜色">
      </div>
    `;
    palette.addEventListener("click", handleColorPaletteClick);
    palette.addEventListener("change", handleColorPaletteChange);
    document.body.appendChild(palette);
    state.colorPalette = palette;
    return palette;
  }

  function renderColorPalette(property) {
    const palette = ensureColorPalette();
    const context = getThemeContext();
    const currentColor = getSelectedComputedColor(property);
    palette.querySelector('[data-role="theme-name"]').textContent = `${context.name} · ${property === "color" ? "文字" : "背景"}`;
    const themeGrid = palette.querySelector('[data-role="theme-colors"]');
    const standardGrid = palette.querySelector('[data-role="standard-colors"]');
    themeGrid.replaceChildren();
    standardGrid.replaceChildren();

    themeColorColumns.forEach((definition) => {
      const raw = context.computed.getPropertyValue(definition.variable).trim() || "#ffffff";
      const base = normalizeHex(raw);
      const shades = [
        mixColor(base, "#ffffff", 0.8),
        mixColor(base, "#ffffff", 0.6),
        mixColor(base, "#ffffff", 0.4),
        mixColor(base, "#000000", 0.2),
        mixColor(base, "#000000", 0.5)
      ];
      const column = document.createElement("div");
      column.className = "te-color-column";
      column.appendChild(createColorSwatch({
        color: base,
        value: `var(${definition.variable})`,
        label: `${definition.label}（主题令牌 ${definition.variable}）`,
        currentColor
      }));
      shades.forEach((shade, index) => {
        const shadeLabels = ["浅色 80%", "浅色 60%", "浅色 40%", "深色 20%", "深色 50%"];
        column.appendChild(createColorSwatch({
          color: shade,
          value: shade,
          label: `${definition.label} · ${shadeLabels[index]}`,
          currentColor
        }));
      });
      themeGrid.appendChild(column);
    });

    standardColors.forEach((color) => {
      standardGrid.appendChild(createColorSwatch({ color, value: color, label: "标准色", currentColor }));
    });

    const eyedropper = palette.querySelector('[data-color-command="eyedropper"]');
    palette.querySelector('input[data-color-command="native"]').value = currentColor;
    eyedropper.disabled = typeof window.EyeDropper !== "function";
    eyedropper.title = eyedropper.disabled ? "当前浏览器或页面环境不支持取色器" : "从页面任意位置取色";
  }

  function positionColorPalette(trigger) {
    const palette = state.colorPalette;
    if (!palette || palette.hidden) return;
    if (window.innerWidth <= 760) {
      palette.style.top = "auto";
      palette.style.left = "8px";
      palette.style.bottom = "calc(52vh + 16px)";
      return;
    }
    palette.style.bottom = "auto";
    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = state.panel.getBoundingClientRect();
    const paletteRect = palette.getBoundingClientRect();
    const leftCandidate = panelRect.left - paletteRect.width - 10;
    const left = leftCandidate >= 8 ? leftCandidate : Math.min(window.innerWidth - paletteRect.width - 8, triggerRect.left);
    const top = Math.max(8, Math.min(triggerRect.top, window.innerHeight - paletteRect.height - 8));
    palette.style.left = `${Math.round(left)}px`;
    palette.style.top = `${Math.round(top)}px`;
  }

  function openColorPalette(property, trigger) {
    if (!state.selected) return;
    closeColorPalette();
    state.colorProperty = property;
    state.colorTrigger = trigger;
    renderColorPalette(property);
    state.colorPalette.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    positionColorPalette(trigger);
    state.colorPalette.querySelector(".te-color-swatch")?.focus();
  }

  function closeColorPalette() {
    if (state.colorTrigger) state.colorTrigger.setAttribute("aria-expanded", "false");
    if (state.colorPalette) state.colorPalette.hidden = true;
    state.colorProperty = null;
    state.colorTrigger = null;
  }

  function applyColorValue(value) {
    if (!state.colorProperty || !state.selected) return;
    const property = state.colorProperty;
    applyStyle(property, value, "");
    closeColorPalette();
    updatePanel();
  }

  async function useEyeDropper() {
    if (typeof window.EyeDropper !== "function") {
      setStatus("当前浏览器或页面环境不支持取色器。");
      return;
    }
    try {
      const property = state.colorProperty;
      const result = await new window.EyeDropper().open();
      if (!property || !result?.sRGBHex) return;
      state.colorProperty = property;
      applyColorValue(result.sRGBHex);
    } catch {
      setStatus("已取消取色。");
    }
  }

  function handleColorPaletteClick(event) {
    const swatch = event.target.closest("button[data-color-value]");
    if (swatch) {
      applyColorValue(swatch.dataset.colorValue);
      return;
    }
    const command = event.target.closest("button[data-color-command]")?.dataset.colorCommand;
    if (!command) return;
    if (command === "close") closeColorPalette();
    if (command === "other") {
      const input = state.colorPalette.querySelector('input[data-color-command="native"]');
      input.value = getSelectedComputedColor(state.colorProperty);
      input.click();
    }
    if (command === "eyedropper") useEyeDropper();
  }

  function handleColorPaletteChange(event) {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.dataset.colorCommand === "native") {
      applyColorValue(input.value);
    }
  }

  function numberFromComputed(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? String(Math.round(parsed * 10) / 10) : "";
  }

  function selectedImage() {
    return state.selected?.tagName === "IMG" ? state.selected : null;
  }

  function selectedLink() {
    return state.selected?.closest?.("a") || null;
  }

  function selectedSection() {
    return state.selected?.closest?.("section") || null;
  }

  function adjacentCaption(image) {
    return image?.closest?.("figure")?.querySelector?.("figcaption") || null;
  }

  function updatePanel() {
    if (!state.panel) return;
    const target = state.panel.querySelector('[data-role="target"]');
    const undoButton = state.panel.querySelector('[data-action="undo"]');
    const redoButton = state.panel.querySelector('[data-action="redo"]');
    undoButton.disabled = state.cursor === 0;
    redoButton.disabled = state.cursor >= state.history.length;
    target.textContent = state.selected ? describeElement(state.selected) : "点击页面元素开始编辑";

    const controls = state.panel.querySelectorAll("[data-style], [data-control], [data-color-property]");
    controls.forEach((control) => { control.disabled = control.dataset.control === "import-json" ? false : !state.selected; });
    if (!state.selected) return;

    const computed = window.getComputedStyle(state.selected);
    state.panel.querySelectorAll("[data-style]").forEach((control) => {
      const property = control.dataset.style;
      const value = computed.getPropertyValue(property).trim();
      if (control.type === "number") {
        if (property === "line-height") {
          const lineHeight = Number.parseFloat(value);
          const fontSize = Number.parseFloat(computed.getPropertyValue("font-size"));
          control.value = Number.isFinite(lineHeight) && Number.isFinite(fontSize) && fontSize > 0
            ? String(Math.round((lineHeight / fontSize) * 100) / 100)
            : "1.5";
        } else {
          control.value = numberFromComputed(value);
        }
      } else if (control.tagName === "SELECT") {
        const option = Array.from(control.options).find((item) => item.value === value || value.startsWith(item.value));
        if (option) control.value = option.value;
      } else {
        control.value = value;
      }
    });

    state.panel.querySelectorAll("[data-color-property]").forEach((trigger) => {
      const property = trigger.dataset.colorProperty;
      const color = getSelectedComputedColor(property);
      trigger.style.setProperty("--te-trigger-color", color);
      trigger.querySelector(".te-color-trigger-value").textContent = color;
      trigger.setAttribute("aria-label", `${property === "color" ? "文字" : "背景"}颜色：${color}`);
      trigger.setAttribute("aria-expanded", String(state.colorTrigger === trigger && !state.colorPalette?.hidden));
    });

    const textControl = state.panel.querySelector('[data-control="text"]');
    const textNote = state.panel.querySelector('[data-role="text-note"]');
    const textEditable = canEditText(state.selected);
    textControl.disabled = !textEditable;
    textControl.value = textEditable ? state.selected.textContent || "" : "";
    textNote.textContent = textEditable
      ? "修改后离开输入框即可记录。"
      : "当前元素包含嵌套结构，请选择内部的具体文字元素，避免破坏标记。";

    const image = selectedImage();
    const imageSection = state.panel.querySelector('[data-role="image-section"]');
    imageSection.hidden = !image;
    if (image) {
      state.panel.querySelector('[data-control="image-alt"]').value = image.getAttribute("alt") || "";
      const caption = adjacentCaption(image);
      const captionControl = state.panel.querySelector('[data-control="image-caption"]');
      captionControl.disabled = !caption;
      captionControl.value = caption?.textContent || "";
    }

    const link = selectedLink();
    state.panel.querySelector('[data-role="link-section"]').hidden = !link;
    if (link) state.panel.querySelector('[data-control="link-href"]').value = link.getAttribute("href") || "";

    const section = selectedSection();
    state.panel.querySelector('[data-role="structure-section"]').hidden = !section;
  }

  function selectElement(element) {
    if (!isSelectable(element)) return;
    closeColorPalette();
    state.selected?.classList.remove(SELECTED_CLASS);
    state.selected = element;
    state.selected.classList.add(SELECTED_CLASS);
    updatePanel();
    setStatus(`已选择：${describeElement(element)}`);
  }

  function handlePageClick(event) {
    if (!state.active || isEditorElement(event.target)) return;
    const element = event.target instanceof Element ? event.target : null;
    if (!isSelectable(element)) return;
    event.preventDefault();
    event.stopPropagation();
    selectElement(element);
  }

  function handlePageHover(event) {
    if (!state.active || isEditorElement(event.target)) return;
    const element = event.target instanceof Element ? event.target : null;
    if (!isSelectable(element) || element === state.hovered) return;
    state.hovered?.classList.remove(HOVER_CLASS);
    state.hovered = element;
    if (state.hovered !== state.selected) state.hovered.classList.add(HOVER_CLASS);
  }

  function clearHover() {
    state.hovered?.classList.remove(HOVER_CLASS);
    state.hovered = null;
  }

  function makePatchFor(element, kind, details) {
    return {
      kind,
      element,
      descriptor: describeElement(element),
      locator: createLocator(element),
      section: getSectionContext(element),
      snippet: getSnippet(element),
      createdAt: Date.now(),
      ...details
    };
  }

  function makePatch(kind, details) {
    return makePatchFor(state.selected, kind, details);
  }

  function serializablePatch(patch) {
    const copy = {};
    Object.entries(patch).forEach(([key, value]) => {
      if (["element", "parent", "cloneElement"].includes(key)) return;
      copy[key] = value;
    });
    return copy;
  }

  function sessionPayload() {
    return {
      version: 1,
      page: document.title,
      location: window.location.pathname,
      cursor: state.cursor,
      patches: state.history.map(serializablePatch)
    };
  }

  function saveSession() {
    try {
      window.localStorage?.setItem(state.storageKey, JSON.stringify(sessionPayload()));
    } catch {
      setStatus("修改已记录，但本地存储空间不足；请导出修改 JSON。");
    }
  }

  function resolvePatchElement(patch) {
    if (patch.element?.isConnected) return patch.element;
    try {
      patch.element = document.querySelector(patch.locator);
    } catch {
      patch.element = null;
    }
    return patch.element;
  }

  function recordPatch(patch) {
    if (!patch || patch.before === patch.after) return;
    state.history.splice(state.cursor);
    state.history.push(patch);
    state.cursor = state.history.length;
    saveSession();
    updatePanel();
    setStatus(`已记录 ${state.history.length} 项修改。`);
  }

  function isSafeLayoutValue(property, value) {
    if (!value) return true;
    if (/[;{}<>]|url\s*\(/i.test(value)) return false;
    if (!window.CSS?.supports?.(property, value)) return false;
    if (["width", "max-width"].includes(property)) {
      const fixed = value.match(/^(-?\d+(?:\.\d+)?)px$/);
      if (fixed && Number(fixed[1]) > 1280) return false;
    }
    return true;
  }

  function applyStyle(property, rawValue, unit) {
    if (!state.selected || !(state.selected instanceof HTMLElement || state.selected instanceof SVGElement)) return;
    let value = String(rawValue || "").trim();
    if (value && unit && /^-?\d+(\.\d+)?$/.test(value)) value += unit;
    if (property === "font-size") {
      const size = Number.parseFloat(value);
      if (!Number.isFinite(size) || size < 16 || size > 60) {
        setStatus("字号必须在 16px 到 60px 之间。");
        updatePanel();
        return;
      }
    }
    if (["margin", "padding", "width", "max-width"].includes(property) && !isSafeLayoutValue(property, value)) {
      setStatus("该尺寸值不安全或会超出 1280px 版式边界，请使用有效长度、百分比、auto 或现有变量。");
      updatePanel();
      return;
    }
    const before = state.selected.style.getPropertyValue(property);
    if (value) state.selected.style.setProperty(property, value);
    else state.selected.style.removeProperty(property);
    const after = state.selected.style.getPropertyValue(property);
    recordPatch(makePatch("style", { property, before, after }));
  }

  function handlePanelChange(event) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement)) return;
    if (control.dataset.control === "import-json") {
      const file = control.files?.[0];
      if (file) importChangesFile(file);
      control.value = "";
      return;
    }
    if (!state.selected) return;

    if (control.dataset.style) {
      applyStyle(control.dataset.style, control.value, control.dataset.unit || "");
      return;
    }

    if (control.dataset.control === "text" && canEditText(state.selected)) {
      const before = state.selected.textContent || "";
      state.selected.textContent = control.value;
      recordPatch(makePatch("text", { before, after: control.value }));
      return;
    }

    if (control.dataset.control === "image" && state.selected.tagName === "IMG") {
      const file = control.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const before = state.selected.getAttribute("src") || "";
        const after = String(reader.result || "");
        state.selected.setAttribute("src", after);
        recordPatch(makePatch("attribute", { attribute: "src", before, after: `[embedded image: ${file.name}]`, appliedAfter: after }));
      });
      reader.readAsDataURL(file);
      return;
    }

    if (control.dataset.control === "image-alt" && selectedImage()) {
      const image = selectedImage();
      const before = image.getAttribute("alt") || "";
      image.setAttribute("alt", control.value);
      recordPatch(makePatchFor(image, "attribute", { attribute: "alt", before, after: control.value }));
      return;
    }

    if (control.dataset.control === "image-caption") {
      const caption = adjacentCaption(selectedImage());
      if (!caption) return;
      const before = caption.textContent || "";
      caption.textContent = control.value;
      recordPatch(makePatchFor(caption, "text", { before, after: control.value }));
      return;
    }

    if (control.dataset.control === "link-href") {
      const link = selectedLink();
      if (!link) return;
      const value = control.value.trim();
      if (/^javascript:/i.test(value)) {
        setStatus("链接地址不能使用 javascript: 协议。");
        updatePanel();
        return;
      }
      const before = link.getAttribute("href") || "";
      if (value) link.setAttribute("href", value);
      else link.removeAttribute("href");
      recordPatch(makePatchFor(link, "attribute", { attribute: "href", before, after: value }));
    }
  }

  function applyPatch(patch, direction) {
    const value = direction === "undo" ? patch.before : (patch.appliedAfter || patch.after);
    const element = resolvePatchElement(patch);
    if (!element) return;
    if (patch.kind === "style") {
      if (value) element.style.setProperty(patch.property, value);
      else element.style.removeProperty(patch.property);
    } else if (patch.kind === "text") {
      element.textContent = value;
    } else if (patch.kind === "attribute") {
      if (value) element.setAttribute(patch.attribute, value);
      else element.removeAttribute(patch.attribute);
    } else if (patch.kind === "move") {
      let parent = patch.parent?.isConnected ? patch.parent : null;
      if (!parent && patch.parentLocator) {
        try { parent = document.querySelector(patch.parentLocator); } catch { parent = null; }
      }
      if (!parent) return;
      const targetIndex = direction === "undo" ? patch.beforeIndex : patch.afterIndex;
      const siblings = Array.from(parent.children).filter((item) => item !== element && !isEditorElement(item));
      parent.insertBefore(element, siblings[targetIndex] || null);
    } else if (patch.kind === "duplicate") {
      if (direction === "undo") {
        patch.cloneElement?.remove();
      } else {
        const template = document.createElement("template");
        template.innerHTML = patch.after;
        patch.cloneElement = template.content.firstElementChild;
        element.insertAdjacentElement("afterend", patch.cloneElement);
      }
    }
  }

  function undo() {
    if (state.cursor === 0) return;
    const patch = state.history[state.cursor - 1];
    applyPatch(patch, "undo");
    state.cursor -= 1;
    saveSession();
    updatePanel();
    setStatus("已撤销上一项修改。");
  }

  function redo() {
    if (state.cursor >= state.history.length) return;
    const patch = state.history[state.cursor];
    applyPatch(patch, "redo");
    state.cursor += 1;
    saveSession();
    updatePanel();
    setStatus("已重做一项修改。");
  }

  function groupedChanges() {
    const activePatches = state.history.slice(0, state.cursor);
    const groups = new Map();
    activePatches.forEach((patch) => {
      const key = patch.locator;
      if (!groups.has(key)) {
        groups.set(key, {
          descriptor: patch.descriptor,
          locator: patch.locator,
          section: patch.section,
          snippet: patch.snippet,
          changes: new Map()
        });
      }
      const changeKey = patch.kind === "style" ? `style:${patch.property}` : patch.kind === "attribute" ? `attribute:${patch.attribute}` : patch.kind;
      const group = groups.get(key);
      const existing = group.changes.get(changeKey);
      if (existing) existing.after = patch.after;
      else group.changes.set(changeKey, { ...patch });
    });
    return Array.from(groups.values());
  }

  function buildPrompt() {
    const groups = groupedChanges();
    if (!groups.length) return "";
    const lines = [
      "Technical Editorial Web 页面修改清单",
      "",
      `页面：${document.title || "未命名页面"}`,
      `地址：${window.location.href}`,
      "",
      "执行规则：",
      "1. 在原始 HTML/CSS 中落实修改，不要把浏览器快照作为长期源文件。",
      "2. 保持无关内容、结构和行为不变，采用尽可能小的源码改动。",
      "3. 优先修改语义化 class、组件规则或设计令牌；只有真正局部的例外才保留内联样式。",
      "4. 保持页面证据、限定条件和范围状态不变；文字修改不得扩大承诺。",
      "5. 所有显式字号继续保持在 16px 到 60px 之间。",
      "",
      "修改任务："
    ];
    groups.forEach((group, index) => {
      lines.push("");
      lines.push(`TASK-${index + 1}`);
      lines.push(`- 目标：${group.descriptor}`);
      lines.push(`- 定位：${group.locator}`);
      lines.push(`- 所属区块：${group.section}`);
      group.changes.forEach((change) => {
        if (change.kind === "style") lines.push(`- 样式：${change.property} 从 ${JSON.stringify(change.before)} 改为 ${JSON.stringify(change.after)}`);
        if (change.kind === "text") lines.push(`- 文字：从 ${JSON.stringify(normalizeText(change.before))} 改为 ${JSON.stringify(normalizeText(change.after))}`);
        if (change.kind === "attribute") lines.push(`- 属性：${change.attribute} 改为 ${JSON.stringify(change.after)}`);
        if (change.kind === "move") lines.push(`- 结构：区块从同级位置 ${change.beforeIndex + 1} 移到 ${change.afterIndex + 1}`);
        if (change.kind === "duplicate") lines.push("- 结构：复制该区块；回写源码前检查重复 ID 和内容必要性");
      });
      if (group.snippet) {
        lines.push("- 局部 HTML：");
        lines.push("```html");
        lines.push(group.snippet);
        lines.push("```");
      }
    });
    return lines.join("\n");
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute(UI_ATTR, "true");
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  async function copyPrompt() {
    const prompt = buildPrompt();
    if (!prompt) {
      setStatus("尚未记录修改。");
      return;
    }
    try {
      await copyText(prompt);
      setStatus("修改清单已复制，可直接交给 Codex 回写源码。");
    } catch {
      setStatus("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  function cleanClone() {
    const clone = document.documentElement.cloneNode(true);
    clone.classList.remove(EDIT_MODE_CLASS);
    clone.querySelectorAll(`[${UI_ATTR}], script[${ASSET_ATTR}]`).forEach((item) => item.remove());
    clone.querySelectorAll(`.${SELECTED_CLASS}, .${HOVER_CLASS}`).forEach((item) => item.classList.remove(SELECTED_CLASS, HOVER_CLASS));
    clone.querySelectorAll("[data-te-node-key]").forEach((item) => item.removeAttribute("data-te-node-key"));
    return clone;
  }

  function exportSnapshot() {
    const clone = cleanClone();
    const html = `<!doctype html>\n${clone.outerHTML}`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(document.title || "technical-editorial").replace(/[\\/:*?"<>|]+/g, "-")}-snapshot.html`;
    link.setAttribute(UI_ATTR, "true");
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("已导出不含编辑器界面的 HTML 快照；长期维护请仍将修改回写原始源码。");
  }

  function downloadText(filename, value, type) {
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.setAttribute(UI_ATTR, "true");
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportChangesJson() {
    const filename = `${(document.title || "technical-editorial").replace(/[\\/:*?"<>|]+/g, "-")}-changes.json`;
    downloadText(filename, JSON.stringify(sessionPayload(), null, 2), "application/json;charset=utf-8");
    setStatus("已导出修改 JSON。");
  }

  function loadSession(payload, apply = true) {
    if (!payload || payload.version !== 1 || !Array.isArray(payload.patches)) {
      throw new Error("不支持的修改文件格式");
    }
    while (state.cursor > 0) undo();
    state.history = payload.patches.map((patch) => ({ ...patch, element: null }));
    state.cursor = 0;
    const targetCursor = Math.min(Number(payload.cursor) || state.history.length, state.history.length);
    if (apply) {
      while (state.cursor < targetCursor) {
        applyPatch(state.history[state.cursor], "redo");
        state.cursor += 1;
      }
    }
    saveSession();
    updatePanel();
  }

  function importChangesFile(file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        loadSession(JSON.parse(String(reader.result || "{}")), true);
        setStatus(`已导入 ${state.cursor} 项修改。`);
      } catch (error) {
        setStatus(`导入失败：${error.message || error}`);
      }
    });
    reader.readAsText(file, "utf-8");
  }

  function restoreLocalSession() {
    try {
      const raw = window.localStorage?.getItem(state.storageKey);
      if (!raw) {
        setStatus("没有找到本页的本地修改。");
        return;
      }
      loadSession(JSON.parse(raw), true);
      setStatus(`已恢复 ${state.cursor} 项本地修改。`);
    } catch (error) {
      setStatus(`恢复失败：${error.message || error}`);
    }
  }

  function moveSelectedSection(offset) {
    const section = selectedSection();
    const parent = section?.parentElement;
    if (!section || !parent) return;
    const siblings = Array.from(parent.children).filter((item) => !isEditorElement(item));
    const beforeIndex = siblings.indexOf(section);
    const afterIndex = Math.max(0, Math.min(siblings.length - 1, beforeIndex + offset));
    if (afterIndex === beforeIndex) {
      setStatus("区块已位于可移动边界。");
      return;
    }
    const parentLocator = createLocator(parent);
    const patch = makePatchFor(section, "move", { parent, parentLocator, beforeIndex, afterIndex, before: beforeIndex, after: afterIndex });
    applyPatch(patch, "redo");
    recordPatch(patch);
    selectElement(section);
  }

  function duplicateSelectedSection() {
    const section = selectedSection();
    if (!section) return;
    const clone = section.cloneNode(true);
    clone.querySelectorAll("[id]").forEach((item) => item.removeAttribute("id"));
    clone.removeAttribute("id");
    section.insertAdjacentElement("afterend", clone);
    const patch = makePatchFor(section, "duplicate", { before: "", after: clone.outerHTML, cloneElement: clone });
    recordPatch(patch);
    selectElement(clone);
  }

  function hideSelectedSection() {
    const section = selectedSection();
    if (!section) return;
    const before = section.style.getPropertyValue("display");
    section.style.setProperty("display", "none");
    recordPatch(makePatchFor(section, "style", { property: "display", before, after: "none" }));
    section.classList.remove(SELECTED_CLASS);
    state.selected = null;
    updatePanel();
  }

  function openMobilePreview() {
    const url = new URL(window.location.href);
    url.searchParams.delete("te-edit");
    url.searchParams.set("te-preview", "1");
    url.hash = "";
    const preview = window.open(url.toString(), "te-mobile-preview", "popup,width=430,height=844,resizable=yes,scrollbars=yes");
    if (!preview) setStatus("浏览器阻止了预览窗口，请允许本页弹出窗口。");
    else setStatus("已打开 430×844 移动预览窗口。");
  }

  function handlePanelAction(event) {
    const colorTrigger = event.target.closest("button[data-color-property]");
    if (colorTrigger) {
      const property = colorTrigger.dataset.colorProperty;
      if (state.colorTrigger === colorTrigger && !state.colorPalette?.hidden) closeColorPalette();
      else openColorPalette(property, colorTrigger);
      return;
    }
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "undo") undo();
    if (action === "redo") redo();
    if (action === "close") deactivate();
    if (action === "copy-prompt") copyPrompt();
    if (action === "export") exportSnapshot();
    if (action === "export-json") exportChangesJson();
    if (action === "import-json") state.panel.querySelector('[data-control="import-json"]').click();
    if (action === "restore-local") restoreLocalSession();
    if (action === "mobile-preview") openMobilePreview();
    if (action === "move-up") moveSelectedSection(-1);
    if (action === "move-down") moveSelectedSection(1);
    if (action === "duplicate-section") duplicateSelectedSection();
    if (action === "hide-section") hideSelectedSection();
  }

  function handleGlobalKeydown(event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "e") {
      event.preventDefault();
      toggle();
      return;
    }
    if (!state.active) return;
    if (event.key === "Escape" && state.colorPalette && !state.colorPalette.hidden) {
      event.preventDefault();
      const trigger = state.colorTrigger;
      closeColorPalette();
      trigger?.focus?.();
      return;
    }
    const typing = event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']");
    if (!typing && event.ctrlKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }
    if (!typing && event.key === "Escape") {
      event.preventDefault();
      if (state.selected) {
        state.selected.classList.remove(SELECTED_CLASS);
        state.selected = null;
        updatePanel();
      } else {
        deactivate();
      }
    }
  }

  function handleWindowResize() {
    if (state.colorTrigger && state.colorPalette && !state.colorPalette.hidden) {
      positionColorPalette(state.colorTrigger);
    }
  }

  function activate() {
    if (state.active) return;
    state.active = true;
    injectStyles();
    createPanel();
    document.documentElement.classList.add(EDIT_MODE_CLASS);
    document.addEventListener("click", handlePageClick, true);
    document.addEventListener("mouseover", handlePageHover, true);
    document.addEventListener("mouseleave", clearHover, true);
    window.addEventListener("resize", handleWindowResize);
    setStatus("编辑模式已开启。点击页面元素进行选择。");
  }

  function deactivate() {
    if (!state.active) return;
    state.active = false;
    document.documentElement.classList.remove(EDIT_MODE_CLASS);
    state.selected?.classList.remove(SELECTED_CLASS);
    closeColorPalette();
    clearHover();
    state.selected = null;
    document.removeEventListener("click", handlePageClick, true);
    document.removeEventListener("mouseover", handlePageHover, true);
    document.removeEventListener("mouseleave", clearHover, true);
    window.removeEventListener("resize", handleWindowResize);
    state.panel?.remove();
    state.panel = null;
    state.colorPalette?.remove();
    state.colorPalette = null;
  }

  function toggle() {
    state.active ? deactivate() : activate();
  }

  window.TechnicalEditorialEditor = {
    activate,
    deactivate,
    toggle,
    undo,
    redo,
    buildPrompt,
    getChanges: () => state.history.slice(0, state.cursor),
    isActive: () => state.active
  };

  document.addEventListener("keydown", handleGlobalKeydown, true);
  ready(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("te-edit") === "1" || window.location.hash === "#te-edit") activate();
    if (params.get("te-preview") === "1") restoreLocalSession();
  });
})();
