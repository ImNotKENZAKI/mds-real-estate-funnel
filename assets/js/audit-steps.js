(() => {
  "use strict";
  const page = document.querySelector("[data-audit-chapter]");
  if (!page) return;

  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width: 901px)");
  const motionButton = page.querySelector(".chapter-motion");
  const journey = page.querySelector("[data-diagnostic-journey]");
  const steps = [...page.querySelectorAll(".diagnostic-step")];
  let manualReduction = false;
  let revealObserver;
  let sequenceFrame = 0;
  let interactionUntil = 0;

  const diagnosticStates = [
    { index: "01", kicker: "LEAD ACTIVITY", title: "How much is entering the system?" },
    { index: "02", kicker: "ENTRY POINTS", title: "Where are opportunities beginning?" },
    { index: "03", kicker: "PRIMARY FRICTION", title: "Where is momentum breaking down?" },
    { index: "04", kicker: "MDS AUDIT", title: "Turn the current process into a clearer next move." }
  ];

  function activate(index) {
    const safeIndex = Math.max(0, Math.min(index, Math.max(steps.length - 1, 0)));
    steps.forEach((step, position) => {
      const active = position === safeIndex;
      step.classList.toggle("is-active", active);
      step.setAttribute("aria-pressed", String(active));
    });
    if (journey) {
      journey.style.setProperty("--journey-progress", String(safeIndex / Math.max(steps.length - 1, 1)));
      journey.dataset.activeStep = String(safeIndex);
      const state = diagnosticStates[safeIndex];
      const panel = journey.querySelector(".diagnostic-property-state");
      if (panel && state) {
        const number = panel.querySelector(".diagnostic-property-state__index");
        const kicker = panel.querySelector("small");
        const title = panel.querySelector("strong");
        panel.classList.remove("is-changing");
        void panel.offsetWidth;
        panel.classList.add("is-changing");
        if (number) number.textContent = state.index;
        if (kicker) kicker.textContent = state.kicker;
        if (title) title.textContent = state.title;
      }
    }
  }

  function followSequence() {
    sequenceFrame = 0;
    if (!journey || !desktop.matches || preference.matches || manualReduction) return;
    if (performance.now() < interactionUntil) return;
    const bounds = journey.getBoundingClientRect();
    const maximumScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const start = Math.max(0, bounds.top + scrollY - innerHeight * .55);
    const end = Math.min(maximumScroll, bounds.bottom + scrollY - innerHeight * .45);
    const progress = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, end - start)));
    activate(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
  }

  function queueSequence() {
    if (!sequenceFrame && desktop.matches && !preference.matches && !manualReduction) {
      sequenceFrame = requestAnimationFrame(followSequence);
    }
  }

  steps.forEach((step, index) => {
    const choose = () => {
      interactionUntil = performance.now() + 1600;
      activate(index);
    };
    step.addEventListener("pointerenter", choose);
    step.addEventListener("focus", choose);
    step.addEventListener("click", choose);
  });

  function configureMotion() {
    const reduced = preference.matches || manualReduction;
    page.dataset.reducedMotion = String(reduced);
    page.classList.toggle("has-chapter-motion", !reduced);
    motionButton.hidden = false;
    motionButton.setAttribute("aria-pressed", String(reduced));
    motionButton.textContent = preference.matches ? "System motion reduced" : reduced ? "Restore motion" : "Reduce motion";
    motionButton.disabled = preference.matches;
    revealObserver?.disconnect();

    if (reduced || !("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("chapter-in-view");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    page.querySelectorAll("[data-chapter-reveal]").forEach(element => revealObserver.observe(element));

    // Clamp the narrative to available scroll travel, including short desktop pages.
    // Mobile stays a natural vertical sequence with optional tap interactions.
    queueSequence();
  }

  motionButton.addEventListener("click", () => {
    manualReduction = !manualReduction;
    configureMotion();
  });
  preference.addEventListener("change", configureMotion);
  desktop.addEventListener("change", configureMotion);
  window.addEventListener("scroll", queueSequence, { passive: true });
  window.addEventListener("resize", queueSequence, { passive: true });
  activate(0);
  configureMotion();
})();
