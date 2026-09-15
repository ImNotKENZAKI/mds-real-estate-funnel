(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const auditComplete = params.get("audit") === "complete";
  const previewCalendar = params.get("preview") === "calendar";

  const modal = document.querySelector("[data-booking-modal]");
  const dialog = modal?.querySelector(".mds-booking-modal__dialog");
  const formState = document.querySelector("[data-audit-form-state]");
  const completeState = document.querySelector("[data-audit-complete]");
  const auditProgress = document.querySelector("[data-progress-audit]");
  const bookingProgress = document.querySelector("[data-progress-booking]");
  const auditLabel = document.querySelector("[data-progress-audit-label]");
  const bookingLabel = document.querySelector("[data-progress-booking-label]");
  const formFrame = document.querySelector('iframe[data-ghl-widget="form"]');
  const calendarTemplate = document.querySelector('[data-calendar-template]');
  const calendarFrame = calendarTemplate?.content.querySelector('iframe[data-ghl-widget="calendar"]');

  let lastFocused = null;
  let embedScriptPromise = null;
  let modalBackground = [];

  function loadEmbedScript() {
    if (window.__mdsGhlEmbedLoaded) return Promise.resolve();
    if (embedScriptPromise) return embedScriptPromise;

    embedScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-mds-ghl-embed]');
      if (existing) {
        if (window.__mdsGhlEmbedLoaded) {
          resolve();
          return;
        }
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      script.type = "text/javascript";
      script.dataset.mdsGhlEmbed = "true";
      script.onload = () => {
        window.__mdsGhlEmbedLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });

    return embedScriptPromise;
  }

  async function activateWidget(frame) {
    if (!frame || frame.dataset.widgetActive === "true") return;

    const src = frame.dataset.widgetSrc;
    if (!src) return;

    frame.dataset.widgetActive = "true";
    frame.src = src;

    try {
      await loadEmbedScript();
    } catch (error) {
      console.warn("MDS: HighLevel embed helper did not load.", error);
    }
  }

  function markAuditComplete() {
    if (formState) formState.hidden = true;
    if (completeState) completeState.hidden = false;

    if (auditProgress) {
      auditProgress.classList.remove("is-current");
      auditProgress.classList.add("is-complete");
      auditProgress.removeAttribute("aria-current");
    }
    if (auditLabel) auditLabel.textContent = "Completed";

    if (bookingProgress) {
      bookingProgress.classList.add("is-current");
      bookingProgress.setAttribute("aria-current", "step");
    }
    if (bookingLabel) bookingLabel.textContent = "Current";
  }

  async function openBooking() {
    if (!modal || !dialog || modal.classList.contains('is-open')) return;

    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.inert = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mds-modal-open");
    document.documentElement.classList.add('mds-modal-open');
    for (const element of document.body.children) {
      if (element !== modal && !element.inert && !['SCRIPT','STYLE','LINK'].includes(element.tagName)) {
        element.inert = true;
        modalBackground.push(element);
      }
    }
    modal.querySelector('[data-booking-close].mds-booking-modal__close')?.focus({ preventScroll: true });
    if (calendarFrame && !calendarFrame.isConnected) calendarTemplate.replaceWith(calendarFrame);
    await activateWidget(calendarFrame);
  }

  function closeBooking() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.inert = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mds-modal-open");
    document.documentElement.classList.remove('mds-modal-open');
    modalBackground.forEach(element => { element.inert = false; });
    modalBackground = [];

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-booking-open]")) openBooking();
    if (event.target.closest("[data-booking-close]")) closeBooking();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) {
      closeBooking();
    }
  });

  /*
    Widget isolation:
    - Normal Step 2 activates only the HighLevel form.
    - Audit-complete mode activates only the Discovery Call calendar.
    This avoids initializing a hidden calendar iframe while the Step 2 form is live.
  */
  if (auditComplete || previewCalendar) {
    // An inactive form must not be discovered by the official helper in booking mode.
    formFrame?.remove();
    markAuditComplete();
    window.setTimeout(openBooking, 180);
  } else {
    activateWidget(formFrame);
  }
})();
