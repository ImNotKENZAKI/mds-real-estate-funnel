# MDS Real Estate: Step 2 scene revision

Date: September 9, 2026

## Outcome

Step 2 now continues the Property-to-Pipeline story through an original dusk property environment, a doorway-registered SVG signal, and an overlapping diagnostic form surface. The repeated support list has been removed. The intro, progress indicator, form framing and motion use the existing Step 1 tokens instead of a separate design system.

Two original photographic compositions were commissioned through image generation using Step 1 as the reference. The diagnostic exterior keeps the entrance readable behind the signal. The Thank You doorway continues the stone, walnut, dusk and ivory treatment. Full prompts, paths, sizes and selection notes are in ASSET-ART-DIRECTION.md.

This is a local review package, not a production deployment or a completed CRM acceptance test.

## What changed and why

- Replaced the equal-panel presentation with one layered scene. The foreground form overlaps the architectural background while remaining technically isolated.
- Added a single scroll-linked path through Lead Activity, Entry Points, Process Friction and MDS Audit. Scrolling back reverses the path. Nodes also support focus/click navigation.
- Registered the path origin to the source image's doorway through the actual cover-crop geometry. Desktop depth movement is limited to a 1.4% push-in.
- Kept all state labels and lines editable in HTML/SVG/CSS. The page explicitly says this is an illustrated audit path, not a live interpretation of form answers.
- Paused progression when the form is hovered or its outer iframe has focus. No iframe document, fields, internal events or submission are accessed by the animation.
- Removed large outer minimum heights. The official loader controls final iframe height. The adjustable initial fallback is 480px, or 520px on mobile, in diagnostic-scene.css. Existing data-height="606" metadata remains untouched until the owner supplies a regenerated embed.
- Thank You changes are limited to its image tag and responsive image sources. Its existing layout, content, animation script, routes and calendar placeholder remain intact.
- Updated the review selector and README because their old claims that Form 2 was only a placeholder were no longer accurate.

## Files changed

Existing files:

- step-2.html
- real-estate/diagnostic/index.html
- thank-you.html (image tag only)
- real-estate/thank-you/index.html (image tag only)
- README-REVIEW.md
- START-HERE.html

New files:

- assets/css/diagnostic-scene.css
- assets/js/diagnostic-scene.js
- Five optimized WebP variants under assets/images/real-estate/diagnostic/ and assets/images/real-estate/thank-you/
- This report and ASSET-ART-DIRECTION.md

Step 1 index.html, its door animation/main.js, shared style.css, and the existing Thank You audit-steps.js were not edited. The supplied original ZIP and the separate older working folder were not overwritten.

## Responsive QA

Browser: Codex in-app browser, local HTTP preview. Layout inspection and screenshot review covered the requested widths. Horizontal overflow is measured against documentElement.clientWidth, excluding the browser scrollbar.

| Width | Horizontal overflow | Loaded GHL height observed | Layout |
| --- | --- | --- | --- |
| 1920 | 0px | 520px | Overlapping desktop scene |
| 1440 | 0px | 520px | Overlapping desktop scene |
| 1024 | 0px | 558px | Narrow desktop foreground |
| 768 | 0px | 520px | Natural vertical scene and form |
| 390 | 0px | 632px | Natural mobile flow; readable nodes |

Heights are observations of the current live form, not hardcoded final values. GHL can change them when fields, typography or viewport dimensions change.

Screenshot inspection covered headings, property crops, logo proportions, form framing and lower-page content. Full-page capture tooling caused a temporary third-party iframe resize artifact, so normal viewport screenshots and scrolling were also used. Do not interpret that capture artifact as a production height to clamp. This package does not include a complete saved five-width screenshot suite.

Thank You was visually checked at 1440px and 390px with zero measured horizontal overflow. The new doorway and existing editable progress overlay remain readable.

## Interaction and resilience QA

- Actual Form 2 loaded with three diagnostic dropdowns, submit button and legal links. Business Email was not visible during inspection.
- All three dropdowns opened. Tab moved focus from inquiry volume to lead sources to challenge; Escape closed dropdowns. No selections or test submission were sent.
- No decorative overlay intercepted the form in the tested interactions. No transform or animation is applied to the iframe.
- Forward scrolling reached MDS Audit with the full path drawn. Reverse scrolling outside the form returned to Lead Activity and the starting path. Hover/focus over the form intentionally pauses progress.
- The manual reduced-motion control hid the moving signal and removed property scaling. All four states remained visible. The OS media-query implementation was inspected; OS accessibility settings were not changed for this test.
- A separate, unshipped QA server delayed the diagnostic image by 12 seconds. Before arrival, the navy background and all HTML labels remained readable. At 768px the photo slot remained 450px, the environment 841.016px, and node positions were 734.5 / 834.5 / 934.5 / 1034.5px before and after image loading.
- New JavaScript passed Node syntax checking. A first-party error/unhandled-rejection probe on the isolated slow-load test returned an empty error list. This is not a comprehensive browser-console or cross-origin GHL console audit.
- Local HTML file references and the single-iframe/single-official-loader contract were checked during packaging.

## Preserved integration boundaries

- Form 1: Uk3maPeea8YSKDYQ3C6U
- Form 2: GpcWTTzFwcsi3RDNqexC
- Official loader: https://link.msgsndr.com/js/form_embed.js
- No custom fields, submit handler, form-reading script or CRM mutation was added.
- Canonical routes remain real-estate/diagnostic/ and real-estate/thank-you/.
- Root step-2.html and thank-you.html are complete review copies, not redirects.
- Strategy-call scheduling still points to the explicit booking placeholder. No calendar is implied to be live.

## How to review

1. Extract the entire ZIP into a new folder and open START-HERE.html. Keep assets beside the HTML files.
2. Prefer a local HTTP preview for the same environment used in QA. Internet access is required for the live GHL embeds and Google Fonts.
3. Compare Step 1's property/light treatment with Step 2, then scroll through the scene in both directions.
4. Open each diagnostic dropdown, use Tab/Escape, and try the footer's Reduce motion control.
5. Open Thank You directly from START-HERE.html to inspect its new image without creating a CRM submission.

## Remaining release checks

- Owner approval of the new compositions and final visual direction.
- Final regenerated Form 2 embed/height after HighLevel configuration is finalized.
- An authorized end-to-end submission test: contact association, CRM fields, notifications, workflow and successful-submit redirect. None of these was verified by visual inspection alone.
- Supply and approve the real strategy-call scheduling URL before treating Thank You as launch-ready.
- Production browser-console/network review, OS reduced-motion QA and real-device Safari/Android checks. Desktop responsive emulation is not a substitute for those checks.

No deployment, GitHub commit, account change, or live lead submission was performed.
