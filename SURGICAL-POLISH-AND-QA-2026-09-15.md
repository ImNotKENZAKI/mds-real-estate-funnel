# MDS Real Estate Funnel — Surgical Polish & QA

Date: 15 September 2026  
Package: `MDS-REAL-ESTATE-FUNNEL-CINEMATIC-VIDEO-STORY-2026-09-15`

## Scope

This revision is intentionally limited to the three approved areas in the supplied brief:

1. the cinematic YouTube story on the canonical landing page;
2. the Step 2 branded-host form presentation and widget isolation; and
3. the calendar modal shell around HighLevel calendar widget `DH8Z9XycUL5sRi9xQo7W`.

The production HighLevel form ID `GpcWTTzFwcsi3RDNqexC` is preserved. No fake form fields were added, and the HighLevel iframe's internal styling was not modified.

## Implemented

### Cinematic story

- Preserved the existing YouTube video `64HUMVre1QM`, muted autoplay, sticky scroll beats, and the original property/hero motion.
- Added a real watch-mode lifecycle: exact scroll-position save/restore, root/body scroll lock, inert background siblings, Escape/Return controls, keyboard focus containment, and cancellation of late YouTube readiness.
- Explicit watch starts at `0` and unmutes only after the user activates “Watch the system film with sound”. Background autoplay remains muted.
- Watch mode is viewport-contained at desktop, tablet, and mobile sizes; the following sections do not bleed into the film stage.
- The persistent mobile audit CTA is scoped out while the story is in view so it cannot cover the story's own control.
- Reduced-motion behavior now keeps the static story available while still allowing explicit user-initiated viewing.
- Added a small editable fallback message/link for YouTube loading or playback failures. No text is baked into imagery.

### Step 2

- Kept the original property scene animation and GHL form markup/configuration.
- Kept the form iframe as the only active form widget on the page; the calendar remains inert until booking is opened.
- Added isolation hardening for modal/background stacking and inactive widget teardown on completion. This addresses common host-layer interference without changing the form itself.

The previously reported intermittent branded-host click issue was not reproducible as a deterministic overlay in local QA: hit-testing returned the iframe at the visible form coordinates, and keyboard traversal reached the form controls. A real pointer test on the deployed branded host is still required because browser automation cannot safely click fractional coordinates inside this cross-origin iframe.

### Calendar modal

- Reduced the shell to a lighter editorial composition: navy status panel, white calendar surface, restrained border/shadow, and persistent close button.
- Replaced the numbered process treatment with the status path: Audit received → MDS review → Discovery call.
- Made the modal full-screen on mobile and internally scrollable, with the outer page locked while open.
- Preserved the calendar widget ID and the existing success redirect to `thank-you.html`.

## QA evidence

Local preview used: `http://127.0.0.1:4176/`

| Viewport | Result |
|---|---|
| 1440 × 900 | Story autoplay/scroll beats, watch lock, Return control, calendar open/close/reopen passed; no local first-party errors observed. |
| 1024 × 768 | Story layout and watch mode passed; close control remained visible at the top-right; no horizontal overflow. |
| 768 × 1024 | Story layout and watch mode passed; contained media measured 728 × 410; no horizontal overflow. |
| 390 × 844 | Mobile CTA no longer covers Watch; contained media remained visible; close control remained visible; no horizontal overflow; exact scroll restore passed. |

Additional checks:

- Node syntax checks passed for `video-story.js` and `booking-flow.js`.
- Lifecycle harness passed: late-ready cancellation, no delayed audio, reduced-motion explicit playback, restart-at-zero, focus, and scroll restoration.
- Step 2 keyboard traversal opened the HighLevel dropdown controls and reached the submit button without creating a submission.
- Calendar reopened with one iframe and one official helper script; no duplicate widget was created.
- External Cloudflare/Turnstile messages were observed inside the third-party HighLevel frame. These are not first-party errors; live anti-bot behavior still needs verification on the deployed host.

## Production gates still pending

This is review-ready code, not a production submission sign-off. Before deployment, manually verify on the branded host:

- real mouse/touch clicks inside the cross-origin Step 2 form;
- controlled test submission → CRM contact/pipeline → notification/follow-up;
- calendar availability, Google Meet/calendar invite, and success redirect;
- the finalized regenerated form embed after First Name is required and Email is renamed Business Email;
- browser console and network behavior with the production domain and anti-bot challenge.

No live lead, booking, email/SMS, account setting, or deployment action was performed during this QA pass.

## Files changed

- `index.html`
- `assets/js/video-story.js`
- `assets/css/video-story.css`
- `step-2.html`
- `assets/js/booking-flow.js`
- `assets/css/booking-flow.css`
- this report

All protected sections, routes, branding assets, Step 1/property animation code, Thank You page files, and GHL IDs/configuration outside the scoped shell remain unchanged.

