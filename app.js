(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("motion-ready");
  const targets = document.querySelectorAll(".section-heading,.project-definition,.scenario-strip,.benchmark-notes,.challenge-card,.goals-list article,.roles-intro,.role-card,.state-permission,.journey-overview,.journey-step,.rest-rule,.rest-overview,.rest-story article,.surface-group,.safety-compare,.theme-compare,.palette-system,.type-system,.principle-grid article,.reflection-grid");
  targets.forEach((node, index) => {
    node.classList.add("reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });
  if (reduced || !("IntersectionObserver" in window)) targets.forEach((node) => node.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries, watch) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      watch.unobserve(entry.target);
    }), { rootMargin: "0px 0px -10% 0px", threshold: .08 });
    targets.forEach((node) => observer.observe(node));
  }
  const nav = document.querySelector(".top-nav");
  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");
  let ticking = false;
  const update = () => {
    const y = scrollY;
    nav?.classList.toggle("nav-scrolled", y > 28);
    if (!reduced && hero && heroImage && y < hero.offsetHeight * 1.15) heroImage.style.transform = `scale(1.035) translate3d(0,${y * .08}px,0)`;
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
  const links = [...document.querySelectorAll(".nav-links a")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => {
        const current = link.getAttribute("href") === `#${active.target.id}`;
        link.classList.toggle("is-active", current);
        if (current) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [.01, .2, .5] });
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
  }
  const steps = [...document.querySelectorAll(".journey-step")];
  steps.forEach((step, index) => {
    step.tabIndex = 0;
    step.setAttribute("role", "button");
    step.setAttribute("aria-label", `查看跨屏任务第 ${index + 1} 步`);
    const activate = () => {
      steps.forEach((item) => item.classList.remove("is-active"));
      step.classList.add("is-active");
    };
    ["mouseenter", "focus", "click"].forEach((event) => step.addEventListener(event, activate));
  });
  steps[0]?.classList.add("is-active");
  const compare = document.querySelector(".theme-compare");
  const visuals = document.querySelector(".theme-visuals");
  if (compare && visuals) {
    const control = document.createElement("div");
    control.className = "theme-switch";
    control.innerHTML = '<button type="button" class="is-active" data-view="night">夜间模式</button><button type="button" data-view="day">日间模式</button>';
    compare.querySelector(".theme-copy")?.append(control);
    const frames = [...visuals.querySelectorAll("figure")];
    const buttons = [...control.querySelectorAll("button")];
    const select = (view) => {
      visuals.dataset.activeTheme = view;
      buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
      frames.forEach((frame, index) => frame.classList.toggle("is-selected", view === (index ? "day" : "night")));
    };
    buttons.forEach((button) => button.addEventListener("click", () => select(button.dataset.view)));
    select("night");
  }
  addEventListener("load", () => document.body.classList.add("page-loaded"), { once: true });
})();
