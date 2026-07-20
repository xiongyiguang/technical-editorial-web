(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const one = (selector, root = document) => root.querySelector(selector);

  function announce(message, root = document) {
    const status = one("[data-artifact-status]", root) || one("[data-artifact-status]");
    if (status) status.textContent = message;
  }

  async function copyText(value, root) {
    if (!value.trim()) {
      announce("当前没有可复制的结果。", root);
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("aria-hidden", "true");
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      announce("结果已复制，可粘贴回任务或来源文档。", root);
    } catch (error) {
      announce("复制失败，请手动选择结果文本。", root);
    }
  }

  function targetValue(target) {
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) return target.value;
    return target?.textContent || "";
  }

  function initCopyButtons(root = document) {
    all("[data-copy-target]", root).forEach((button) => {
      button.addEventListener("click", () => {
        const target = one(button.dataset.copyTarget);
        if (target) copyText(targetValue(target), root);
      });
    });
  }

  function initBlindspot(root) {
    const output = one("[data-blindspot-output]", root);
    if (!output) return;
    const checkboxes = all("[data-blindspot-question]", root);

    function render() {
      const selected = checkboxes.filter((checkbox) => checkbox.checked);
      const intro = "请补充确认以下事项：";
      output.value = selected.length
        ? `${intro}\n${selected.map((checkbox, index) => `${index + 1}. ${checkbox.value}`).join("\n")}`
        : "尚未选择需要补充确认的问题。";
      announce(`已选择 ${selected.length} 个补充问题。`, root);
    }

    checkboxes.forEach((checkbox) => checkbox.addEventListener("change", render));
    root.addEventListener("workbenchreset", render);
    render();
  }

  const directionLabels = {
    adopt: "采纳",
    retain: "保留参考",
    exclude: "排除",
    undecided: "未判断",
  };

  function initDirections(root) {
    const cards = all("[data-direction-id]", root);
    const output = one("[data-direction-output]", root);
    if (!cards.length || !output) return;

    function render() {
      const groups = { adopt: [], retain: [], exclude: [], undecided: [] };
      cards.forEach((card) => {
        const state = card.dataset.directionState || "undecided";
        groups[state].push(card.dataset.directionTitle || card.dataset.directionId);
        const label = one("[data-direction-state-label]", card);
        if (label) label.textContent = directionLabels[state];
      });
      output.value = [
        `优先采用：${groups.adopt.join("、") || "尚未选择"}`,
        `保留参考：${groups.retain.join("、") || "无"}`,
        `明确排除：${groups.exclude.join("、") || "无"}`,
        `仍待判断：${groups.undecided.join("、") || "无"}`,
        "后续要求：仅提取被采纳方向的方法，按当前材料重新组织内容，不复制示例文案。",
      ].join("\n");
      announce("方向判断结果已更新。", root);
    }

    all("[data-direction-action]", root).forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-direction-id]");
        const state = button.dataset.directionAction || "undecided";
        if (!card) return;
        card.dataset.directionState = state;
        all("[data-direction-action]", card).forEach((candidate) => {
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
        render();
      });
    });
    root.addEventListener("workbenchreset", render);
    render();
  }

  function initInterview(root) {
    const questions = all("[data-interview-question]", root);
    if (!questions.length) return;
    const progress = one("[data-interview-progress]", root);
    const ledger = one("[data-interview-ledger]", root);
    const output = one("[data-interview-output]", root);
    let current = 0;

    function selectedAnswer(question) {
      return one("input[type='radio']:checked", question);
    }

    function renderLedger() {
      const rows = questions.map((question, index) => {
        const answer = selectedAnswer(question);
        const decision = answer?.dataset.answerLabel || "未回答";
        return `<li><strong>${index + 1}. ${question.dataset.questionShort}</strong><br>${decision}</li>`;
      });
      if (ledger) ledger.innerHTML = rows.join("");
      if (output) {
        const decisions = questions.map((question, index) => {
          const answer = selectedAnswer(question);
          const value = answer?.dataset.answerHandoff || "待确认";
          return `${index + 1}. ${question.dataset.questionShort}：${value}`;
        });
        output.value = [
          "请基于以下已确认决策继续工作：",
          ...decisions,
          "对仍标记为待确认的事项，不得推断承诺；先补充提问或保留状态标识。",
        ].join("\n");
      }
    }

    function show(index) {
      current = Math.max(0, Math.min(index, questions.length - 1));
      questions.forEach((question, questionIndex) => {
        question.hidden = questionIndex !== current;
      });
      if (progress) progress.textContent = `第 ${current + 1} 项，共 ${questions.length} 项`;
      const previous = one("[data-interview-prev]", root);
      const next = one("[data-interview-next]", root);
      if (previous) previous.disabled = current === 0;
      if (next) next.textContent = current === questions.length - 1 ? "完成确认" : "下一项";
      questions[current].focus({ preventScroll: true });
    }

    all("input[type='radio']", root).forEach((input) => {
      input.addEventListener("change", () => {
        renderLedger();
        announce("当前决策已记录。", root);
      });
    });
    one("[data-interview-prev]", root)?.addEventListener("click", () => show(current - 1));
    one("[data-interview-next]", root)?.addEventListener("click", () => {
      if (!selectedAnswer(questions[current])) {
        announce("请先选择当前问题的答案；如果无法确认，请选择“待确认”。", root);
        one("input[type='radio']", questions[current])?.focus();
        return;
      }
      if (current < questions.length - 1) show(current + 1);
      else announce("访谈已完成，请复核并复制交接文本。", root);
    });
    root.addEventListener("workbenchreset", () => {
      renderLedger();
      show(0);
    });
    renderLedger();
    show(0);
  }

  function initExplainer(root) {
    const nodes = all("[data-explainer-node]", root);
    const title = one("[data-explainer-title]", root);
    const body = one("[data-explainer-body]", root);
    const responsibility = one("[data-explainer-responsibility]", root);
    const evidence = one("[data-explainer-evidence]", root);
    const boundary = one("[data-explainer-boundary]", root);
    if (!nodes.length || !title || !body) return;

    function activate(node) {
      nodes.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === node)));
      title.textContent = node.dataset.title || "说明";
      body.textContent = node.dataset.body || "";
      if (responsibility) responsibility.textContent = node.dataset.responsibility || "待确认";
      if (evidence) evidence.textContent = node.dataset.evidence || "待补充";
      if (boundary) boundary.textContent = node.dataset.boundary || "待确认";
      announce(`已打开“${title.textContent}”说明。`, root);
    }

    nodes.forEach((node) => node.addEventListener("click", () => activate(node)));
    root.addEventListener("workbenchreset", () => activate(nodes[0]));
    activate(nodes[0]);
  }

  function initPlan(root) {
    const groups = all("[data-plan-decision]", root);
    const output = one("[data-plan-output]", root);
    if (!groups.length || !output) return;

    function render() {
      const decisions = groups.map((group, index) => {
        const choice = one("input[type='radio']:checked", group);
        const value = choice?.dataset.planHandoff || "待确认";
        return `${index + 1}. ${group.dataset.planDecision}：${value}`;
      });
      output.value = [
        "实施计划调整结果",
        ...decisions,
        "固定边界保持不变；机械性工作在上述决策确认后执行。",
      ].join("\n");
      announce("计划摘要已根据当前选择更新。", root);
    }

    all("input[type='radio']", root).forEach((input) => input.addEventListener("change", render));
    root.addEventListener("workbenchreset", render);
    render();
  }

  function initReset(root) {
    const form = one("form", root);
    form?.addEventListener("reset", () => {
      window.setTimeout(() => {
        all("[data-direction-id]", root).forEach((card) => {
          card.dataset.directionState = "undecided";
          all("[data-direction-action]", card).forEach((button) => button.setAttribute("aria-pressed", "false"));
        });
        root.dispatchEvent(new CustomEvent("workbenchreset"));
        announce("工作台已恢复模板初始状态。", root);
      }, 0);
    });
    one("[data-workbench-reset]", root)?.addEventListener("click", () => form?.reset());
  }

  function initWorkbench(root) {
    initCopyButtons(root);
    initBlindspot(root);
    initDirections(root);
    initInterview(root);
    initExplainer(root);
    initPlan(root);
    initReset(root);
  }

  document.addEventListener("DOMContentLoaded", () => {
    all("[data-workbench]").forEach(initWorkbench);
  });
})();
