(function () {
  "use strict";

  function buildProgress() {
    if (document.body.dataset.readingProgress !== "true") return;
    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("data-long-page-ui", "true");
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-label", "页面阅读进度");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.innerHTML = '<span class="reading-progress-bar"></span>';
    document.body.prepend(progress);
    const bar = progress.firstElementChild;
    const update = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const value = Math.max(0, Math.min(100, (window.scrollY / total) * 100));
      bar.style.transform = `scaleX(${value / 100})`;
      progress.setAttribute("aria-valuenow", String(Math.round(value)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function buildToc() {
    document.querySelectorAll("[data-auto-toc]").forEach((container) => {
      const rootSelector = container.getAttribute("data-auto-toc") || "main";
      const root = document.querySelector(rootSelector);
      if (!root) return;
      const entries = Array.from(root.querySelectorAll("section[id] h2")).filter((heading) => {
        const section = heading.closest("section");
        return section?.id && !section.hasAttribute("data-toc-exclude");
      });
      if (!entries.length) return;
      const list = document.createElement("ol");
      entries.forEach((heading) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${heading.closest("section").id}`;
        link.textContent = heading.textContent.trim();
        item.appendChild(link);
        list.appendChild(item);
      });
      container.replaceChildren(list);
    });
  }

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(() => {
    buildProgress();
    buildToc();
  });
})();
