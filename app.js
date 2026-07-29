
document.documentElement.classList.add("js-ready");

const revealTargets = document.querySelectorAll(
  ".section-heading, .project-definition, .challenge-card, .role-card, .journey-step, .rest-story article, .surface-group, .safety-compare, .palette-system, .type-system, .reflection-points article"
);
revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
revealTargets.forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  const active = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!active) return;
  navLinks.forEach((link) => {
    link.toggleAttribute("aria-current", link.getAttribute("href") === "#" + active.target.id);
  });
}, { rootMargin: "-30% 0px -58% 0px", threshold: [0, .1, .4] });
sections.forEach((section) => navObserver.observe(section));

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.closest("figure")?.classList.add("image-load-error");
  }, { once: true });
});
