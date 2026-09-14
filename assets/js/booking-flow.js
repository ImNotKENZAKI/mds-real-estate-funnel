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
  let lastFocused = null;

  if (!modal || !dialog) return;

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

  function openBooking() {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mds-modal-open");
    window.setTimeout(() => dialog.focus(), 40);
  }

  function closeBooking() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mds-modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-booking-open]")) openBooking();
    if (event.target.closest("[data-booking-close]")) closeBooking();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeBooking();
  });

  if (auditComplete || previewCalendar) {
    markAuditComplete();
    window.setTimeout(openBooking, 180);
  }
})();
