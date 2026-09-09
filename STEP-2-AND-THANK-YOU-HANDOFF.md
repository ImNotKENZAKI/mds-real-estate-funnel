# MDS Real Estate Funnel: Step 2 and Thank You Handoff

Date: 8 September 2026
Status: Local implementation ready for visual review. HighLevel integrations and production release remain pending.

## Outcome

Step 2 has been recomposed around the existing Step 1 Property-to-Pipeline identity. The former outline illustration and tall empty form shell have been replaced by property photography, a readable interactive diagnostic sequence, and a compact integration placeholder.

The new Thank You page continues that visual story through an open doorway, completed journey states, an editorial next-step sequence, and a clearly labelled temporary booking destination. It does not claim that an audit has already been completed.

Both pages were visually compared with the existing Step 1 in the browser before handoff. They reuse its Manrope typography, 1220px content width, navy/ivory palette, champagne line details, transparent logo treatment, optimized photography, and button geometry. These focused steps use a normal-flow compact header, not Step 1's full marketing navigation or cinematic hero.

## Files changed

| File | Change |
| --- | --- |
| real-estate/diagnostic/index.html | Replaced the previous Step 2 composition; preserved route and one marked future form insertion point. |
| real-estate/thank-you/index.html | Added the Audit Received page and future booking insertion points. |
| assets/css/style.css | Replaced only the old Step 2 tail starting at line 312. New shared chapter, diagnostic, Thank You, motion, and responsive sections are readable multiline CSS. |
| assets/js/audit-steps.js | Added a standalone 3.6KB narrative motion module, loaded only by the new funnel steps. No dependencies. |
| STEP-2-AND-THANK-YOU-HANDOFF.md | Current implementation and integration report. |
| STEP-2-DIAGNOSTIC-HANDOFF.md | Superseded-note pointer to this report. |

A recoverable pre-change copy of the old Step 2 HTML, stylesheet, and handoff is stored in:
review-backups/step-2-before-recomposition-2026-09-08/

Do not include review backups in a production upload.

## Routes

- Step 1: /
- Step 2: /real-estate/diagnostic/
- Audit Received: /real-estate/thank-you/

Local preview while the development server is running:

- http://127.0.0.1:4173/real-estate/diagnostic/
- http://127.0.0.1:4173/real-estate/thank-you/

These are static directory-index routes. Production hosting must serve each index.html at its corresponding directory URL.

## Step 1 preservation

Unchanged Step 1 files, verified by SHA-256 before and after this revision:

- index.html: 984A6FB0C829425D390BF85095EA0EC61CFE5B34D0FD2BF0F1F7F9B4BFE94CEB
- assets/js/main.js: A19E7E693A2DDD6C8E9E741121D2B0DCA9D7EE84B76406E9ECA8786FE4A07FC7

The stylesheet prefix containing Step 1's existing rules was also compared and preserved. No new motion module is loaded by Step 1.

The existing production form remains Uk3maPeea8YSKDYQ3C6U with its original iframe and official form_embed.js loader. That ID is not present in either new page. No Step 1 form submission was made during this task.

## Exact Step 2 embed location

File: real-estate/diagnostic/index.html
Start marker: line 59
End marker: line 63

<!-- GHL STEP 2 FORM EMBED START -->
<div class="diagnostic-form-shell">
  <!-- Real GHL Step 2 form is integrated in the V3 package. See GHL-FORM-2-SETUP.md before changing it. -->
</div>
<!-- GHL STEP 2 FORM EMBED END -->

When the real embed is supplied:

1. Keep the markers and diagnostic-form-shell wrapper.
2. Replace only the diagnostic-form-placeholder element with the supplied official GHL iframe and its supplied loader.
3. Preserve the newly supplied form ID and official script. Do not reuse the Step 1 ID.
4. Align the wrapper's --diagnostic-form-height fallback with the actual regenerated embed height. The current 560px variable is a future fallback, not a verified height for the unknown form.
5. Let official GHL inline height updates take precedence. There is no !important height, max-height, clipping container, sticky form, or animation on the form or its ancestors.
6. Confirm the actual GHL form supplies Business Email, Monthly Inquiry Volume, Current Lead Sources, and Biggest Lead Challenge.

The visible placeholder is only 204px high on desktop/tablet and 180px on mobile. Its size is deliberately independent from the future iframe fallback.

No fake form, inputs, submit handler, CRM simulation, or submission interception has been added.

## Exact booking locations

File: real-estate/thank-you/index.html

- Line 62: <!-- Replace with official MDS Real Estate Strategy Call URL -->
- Line 63: Schedule My Strategy Call uses href="#booking-placeholder".
- Line 68: Visible booking-placeholder target, with honest unavailable-state copy.
- Line 72: <!-- GHL CALENDAR EMBED CAN GO HERE --> inside calendar-shell.

Two supported integration choices:

- Hosted calendar: replace the CTA href with the official MDS URL. Remove or update the temporary unavailable section once it no longer applies.
- Embedded calendar: retain the anchor destination and insert the official embed at the calendar marker. Replace the unavailable heading/copy with the real booking instructions. Set --calendar-height to the embed's required initial height and verify the provider's resizing.

No calendar URL, calendar iframe, or booking functionality has been fabricated.

## Assets reused

No new image generation, stock-image downloads, autoplay video, framework, or animation library.

| Existing asset | Used for | Size |
| --- | --- | --- |
| assets/images/real-estate-doorway-hero-v1.webp | Step 2 property context; same residence as Step 1 hero | 237,148 bytes |
| assets/images/showing-booking-campaign-v1.webp | Thank You architectural opening | 112,676 bytes |
| assets/images/logo-horizontal-transparent-optimized.png | Both headers and footers | 105,577 bytes |

Photos use explicit dimensions, fixed layout boxes, and object-fit: cover. Logos retain their intrinsic proportions through object-fit: contain, using the same white treatment as Step 1. Critical labels and journey text are HTML, not baked into graphics. The photo is an above-the-fold narrative asset on desktop; no additional below-the-fold images were introduced.

## Motion and interaction

- Thin progress lines reveal in a short, staggered sequence.
- Narrative text and the Thank You visual use a restrained 10px entrance. Content is visible without JavaScript.
- Step 2 supports pointer, click/tap, and keyboard focus to highlight diagnostic states and advance a champagne connector.
- Desktop passive scrolling follows the four diagnostic stages. Its travel is bounded by the available document scroll range, so short desktop pages can still reach MDS Audit.
- The desktop automatic sequence is disabled at widths of 900px and below. Mobile keeps a normal vertical sequence with optional tap interactions.
- The form, form ancestors, and future iframe are not animated or pinned.
- Existing Step 1 button geometry and hover treatment are reused.
- OS prefers-reduced-motion is respected. An additional footer control allows manual motion reduction; it also disables smooth anchor scrolling.
- No wheel interception, touchmove interception, scroll lock, particles, bouncing, or cursor effects.

## Responsive and functional QA

Browser: Codex in-app Chromium. Visual inspection plus DOM layout measurements; this is not an all-browser or real-device certification.

| Viewport | Step 2 | Thank You |
| --- | --- | --- |
| 1920 x 1080 | No horizontal overflow; readable two-column composition | No horizontal overflow; balanced hero and editorial sequence |
| 1440 x 1000 | No horizontal overflow; compact 204px placeholder | No horizontal overflow; readable hero and property journey |
| 1024 x 900 | No horizontal overflow or clipped headings | No horizontal overflow or clipped headings |
| 768 x 1024 | No horizontal overflow; form remains in normal flow | No horizontal overflow; legible progress and image labels |
| 390 x 844 | No horizontal overflow; natural stacked layout; 180px placeholder | No horizontal overflow; natural stacked layout and full-width CTA |

Additional checks:

- All referenced local assets resolve; all rendered images loaded.
- One h1 per page; no clipped heading or paragraph widths detected.
- Logo fit and property image crop visually inspected at the requested widths.
- Footer and lower-page content inspected on desktop and mobile.
- No em dashes or en dashes in either new page.
- Diagnostic controls support Tab focus, visible focus outlines, and Enter activation.
- Booking CTA resolves to the real placeholder element and changes the hash correctly.
- Manual reduced-motion mode tested on both pages: transitions disabled and anchor scrolling set to auto.
- OS preference handling reviewed in CSS and JavaScript. The actual OS accessibility preference was not changed during QA.
- Mobile scrolling tested without a pinned or trapped narrative.
- Desktop scroll endpoint retested after a correction: Lead Volume at the beginning, MDS Audit with a fully extended connector at the bottom.
- No error or warning console entries observed on the new pages.
- JavaScript syntax check passed.
- No fake HTML form controls or reused Step 1 form ID on either page.
- Step 1 source hashes and CSS prefix preservation verified.

## Assumptions and remaining dependencies

1. These pages are public static shells, not protected confirmation endpoints. A direct visitor can open Thank You without submitting a form. Its confirmation copy assumes arrival through the future successful GHL submission redirect.
2. Progress states communicate intended funnel position; they are not verified CRM state.
3. Keep noindex, nofollow while these integration shells are under review. Production indexing policy can be decided separately.
4. The actual Step 2 embed and form ID remain pending.
5. The official strategy call URL or calendar embed remains pending.
6. Configure Step 1 -> Step 2 and Step 2 -> Thank You successful-submit redirects in HighLevel itself.
7. Decide the actual CRM/contact matching behavior for repeated Business Email inside HighLevel; the front end does not identify, deduplicate, or prefill contacts.
8. After integration, run an approved end-to-end submission: form -> contact/CRM -> workflow/notification -> pipeline/log -> redirect -> booking. Verify email association, field mapping, validation, autoresizing, and mobile iframe behavior.
9. Actual iframe resizing and typing cannot be certified until the real embeds exist. CSS readiness is not evidence of a working CRM integration.
10. Production deployment and final user visual approval remain separate gates. No commit, push, deployment, live GHL configuration, or live submission was performed.

## Review instructions

Open both local preview routes. Compare them with Step 1, scroll naturally through the narrative, use Tab/Enter on the diagnostic sequence, test the footer motion control, and follow Schedule My Strategy Call to the clearly labelled unavailable state. Then supply the official Step 2 embed and calendar destination for the integration pass.
