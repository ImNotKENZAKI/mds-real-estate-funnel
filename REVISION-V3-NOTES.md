# MDS Real Estate Funnel V3

Changes in this revision:

- Integrated the real GHL Step 2 form (`GpcWTTzFwcsi3RDNqexC`) into both Step 2 routes.
- Preserved Step 1 production form ID and existing hero behavior.
- Upgraded Step 2 Property-to-Pipeline visual with active diagnostic states, property camera shifts, signal pulses, and synchronized lead-volume/source/friction/audit progression.
- Upgraded the Step 2 form shell while keeping the iframe isolated from parent-page animation.
- Enhanced Thank You doorway visual with a restrained path animation and next-step signal.
- Kept all motion compatible with `prefers-reduced-motion`.
- Added `GHL-FORM-2-CSS.txt` with safe internal form styling that does not override the submit button.
- Added `GHL-FORM-2-SETUP.md` with Sticky Contact, hidden Business Email, button, and redirect instructions.

Remaining GHL-side actions:

1. Make all diagnostic fields Required.
2. Enable Sticky Contact on Step 1 and Step 2.
3. Test contact continuity on the same deployed hostname.
4. If successful, set Business Email to Hidden in Step 2.
5. Apply `GHL-FORM-2-CSS.txt`.
6. Style the submit button natively in HighLevel.
7. Configure Step 2 redirect to `/real-estate/thank-you/` once live.
8. Re-copy the embed if HighLevel changes the generated height after hiding Business Email.
