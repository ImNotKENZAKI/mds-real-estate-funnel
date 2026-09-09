# MDS Easy Review Package

## Open these files

1. Extract the complete ZIP into one folder.
2. Open START-HERE.html to choose a page without submitting a form.
3. Or open index.html, step-2.html, and thank-you.html directly.

The assets folder must remain alongside these HTML files. Internet access is needed for Google Fonts and both HighLevel forms.

## Current scene revision (September 9, 2026)

Read STEP-2-SCENE-REVISION-AND-QA.md for the current implementation and test status. Read ASSET-ART-DIRECTION.md for the new original imagery and generation prompts. Older handoff documents are historical references and may describe superseded placeholders.

## What is included

- index.html: unchanged Step 1 landing page.
- step-2.html: full diagnostic page, not a redirect shortcut.
- thank-you.html: full Audit Received page, not a redirect shortcut.
- START-HERE.html: review-only page selector.
- assets/: shared CSS, JavaScript, icons and images.
- real-estate/diagnostic/index.html and real-estate/thank-you/index.html: original route versions.
- STEP-2-AND-THANK-YOU-HANDOFF.md: engineering and integration report.

The two root-level review copies only adjust relative asset and Audit Overview/home links so they work beside index.html. Their content and styling are otherwise identical to the original route versions.

## Production source of truth

Use the original real-estate/ routes for production. The root-level copies and START-HERE.html are review conveniences, not new funnel redirects. If revising the canonical route files later, regenerate the root copies to avoid drift.

## Integration status

Step 2 embeds the actual HighLevel form GpcWTTzFwcsi3RDNqexC. The live form displayed three diagnostic dropdowns during this review. Its internal styling, submission behavior, and official loader have not been changed. Provider-driven height updates take priority over the configurable initial fallback.

The Thank You CTA still points to #booking-placeholder. No fake calendar or CRM integration has been added.

Existing Step 1 form ID: Uk3maPeea8YSKDYQ3C6U. Step 1's code and door animation are unchanged.

Confirm the real successful-submit redirects and contact association inside HighLevel before launch. No live submission, deployment, or GHL setting change was performed for this package.
