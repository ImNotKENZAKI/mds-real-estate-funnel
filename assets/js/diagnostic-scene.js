(() => {
  "use strict";
  const page = document.querySelector(".diagnostic-chapter");
  if (!page) return;
  const scene = page.querySelector("[data-diagnostic-scene]");
  const environment = scene.querySelector(".scene-environment");
  const photo = scene.querySelector("[data-scene-image]");
  const svg = scene.querySelector("[data-scene-svg]");
  const wire = scene.querySelector("[data-scene-wire]");
  const trace = scene.querySelector("[data-scene-trace]");
  const origin = scene.querySelector("[data-scene-origin]");
  const signal = scene.querySelector("[data-scene-signal]");
  const steps = [...scene.querySelectorAll(".scene-step")];
  const form = scene.querySelector(".scene-form");
  const motionButton = page.querySelector(".chapter-motion");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 901px)");
  let reduced = preference.matches;
  let manualReduction = false;
  let hoveringForm = false;
  let frame = 0;
  let measureFrame = 0;
  let progress = 0;
  let target = 0;
  let length = 1;
  let stops = [.25, .5, .75, 1];
  let manualUntil = 0;
  let startPoint = { x: 0, y: 0 };
  let selected = -1;

  function select(index) {
    if (index === selected) return;
    selected = index;
    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i === index);
      step.classList.toggle("is-passed", i < index);
      step.setAttribute("aria-pressed", String(i === index));
    });
  }

  function draw() {
    const point = wire.getPointAtLength(length * progress);
    trace.style.strokeDashoffset = String(length * (1 - progress));
    signal.setAttribute("cx", point.x.toFixed(2));
    signal.setAttribute("cy", point.y.toFixed(2));
    // Keep the doorway registration fixed while the scene makes a tiny push-in.
    const scale = !reduced && desktop.matches ? 1 + progress * .014 : 1;
    environment.style.setProperty("--scene-scale", String(scale));
    photo.style.transformOrigin = startPoint.x + "px " + startPoint.y + "px";
    let index = 0;
    stops.forEach((stop, i) => { if (progress >= stop - .002) index = i; });
    select(index);
  }

  function render() {
    frame = 0;
    if (reduced) return;
    const difference = target - progress;
    progress = Math.abs(difference) < .001 ? target : progress + difference * .13;
    draw();
    if (progress !== target) frame = requestAnimationFrame(render);
  }

  function moveTo(next, immediate = false) {
    target = Math.max(0, Math.min(1, next));
    if (reduced || immediate) {
      progress = target;
      draw();
    } else if (!frame) {
      frame = requestAnimationFrame(render);
    }
  }

  function measure() {
    measureFrame = 0;
    const box = environment.getBoundingClientRect();
    const imageBox = photo.parentElement.getBoundingClientRect();
    const naturalWidth = photo.naturalWidth || Number(photo.getAttribute("width"));
    const naturalHeight = photo.naturalHeight || Number(photo.getAttribute("height"));
    const scale = Math.max(imageBox.width / naturalWidth, imageBox.height / naturalHeight);
    const focalX = Number(photo.dataset.focalX || .69);
    const focalY = Number(photo.dataset.focalY || .52);
    startPoint = {
      x: focalX * naturalWidth * scale - (naturalWidth * scale - imageBox.width),
      y: focalY * naturalHeight * scale - (naturalHeight * scale - imageBox.height) / 2
    };
    // The source focal point is mapped through object-fit: cover, not a viewport guess.
    const points = steps.map(step => {
      const node = step.querySelector(".scene-node").getBoundingClientRect();
      return { x: node.left - box.left + node.width / 2, y: node.top - box.top + node.height / 2 };
    });
    const first = points[0];
    let path = "M " + startPoint.x + " " + startPoint.y +
      " C " + startPoint.x + " " + (startPoint.y + 70) +
      " " + first.x + " " + (first.y - 70) + " " + first.x + " " + first.y;
    svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
    wire.setAttribute("d", path);
    const distances = [wire.getTotalLength()];
    points.slice(1).forEach((point, i) => {
      const previous = points[i];
      if (point.x !== previous.x) {
        // Tablet's compact two-column reading order routes between rows, outside text.
        const bendY = previous.y + 52;
        path += " L " + previous.x + " " + bendY + " L " + point.x + " " + bendY;
      }
      path += " L " + point.x + " " + point.y;
      wire.setAttribute("d", path);
      distances.push(wire.getTotalLength());
    });
    const last = points[points.length - 1];
    if (desktop.matches) path += " L " + last.x + " " + (last.y + 45) + " L " + (box.width - 18) + " " + (last.y + 45);
    wire.setAttribute("d", path);
    trace.setAttribute("d", path);
    length = wire.getTotalLength();
    stops = distances.map(distance => distance / length);
    trace.style.strokeDasharray = String(length);
    origin.setAttribute("cx", startPoint.x);
    origin.setAttribute("cy", startPoint.y);
    environment.style.setProperty("--signal-label-x", (startPoint.x + 12) + "px");
    environment.style.setProperty("--signal-label-y", (startPoint.y - 6) + "px");
    page.classList.add("has-scene-geometry");
    draw();
    followScroll();
  }

  function queueMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  }

  function formHasFocus() {
    // Inspect only the parent iframe element, never its document, values or events.
    return form.contains(document.activeElement);
  }

  function followScroll() {
    if (reduced || hoveringForm || formHasFocus() || performance.now() < manualUntil) return;
    const box = scene.getBoundingClientRect();
    const top = box.top + scrollY;
    const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const start = Math.max(0, top - innerHeight * .64);
    const end = Math.min(maximum, top + box.height - innerHeight * .7);
    moveTo((scrollY - start) / Math.max(end - start, 1));
  }

  function configureMotion() {
    reduced = preference.matches || manualReduction;
    page.dataset.reducedMotion = String(reduced);
    page.classList.toggle("has-scene-motion", !reduced);
    motionButton.hidden = false;
    motionButton.disabled = preference.matches;
    motionButton.setAttribute("aria-pressed", String(reduced));
    motionButton.textContent = preference.matches ? "System motion reduced" : reduced ? "Restore motion" : "Reduce motion";
    cancelAnimationFrame(frame);
    frame = 0;
    if (reduced) moveTo(1, true);
    else followScroll();
  }

  steps.forEach((step, index) => {
    function choose() {
      manualUntil = performance.now() + 1800;
      moveTo(stops[index], reduced);
    }
    step.addEventListener("click", choose);
    step.addEventListener("focus", choose);
  });
  form.addEventListener("pointerenter", () => {
    hoveringForm = true;
    target = progress;
  });
  form.addEventListener("pointerleave", () => { hoveringForm = false; });
  window.addEventListener("blur", () => {
    if (formHasFocus()) target = progress;
  });
  motionButton.addEventListener("click", () => {
    manualReduction = !manualReduction;
    configureMotion();
  });
  preference.addEventListener("change", configureMotion);
  desktop.addEventListener("change", queueMeasure);
  window.addEventListener("resize", queueMeasure, { passive: true });
  window.addEventListener("scroll", followScroll, { passive: true });
  photo.addEventListener("load", queueMeasure);
  if ("ResizeObserver" in window) new ResizeObserver(queueMeasure).observe(scene);
  document.fonts?.ready.then(queueMeasure);
  measure();
  configureMotion();
})();
