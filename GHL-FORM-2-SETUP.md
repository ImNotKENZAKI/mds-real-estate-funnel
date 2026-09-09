# MDS Real Estate Lead Audit — Step 2 GHL setup

## Field visibility

Recommended production flow:

1. Enable **Sticky Contact** on BOTH Step 1 and Step 2 forms.
2. Deploy both pages on the SAME hostname before testing (for example `marydigisolutions.com`).
3. Submit Step 1 normally, arrive at Step 2, and confirm Business Email is automatically populated.
4. Only after that test passes, toggle the Step 2 **Business Email** field to **Hidden** in HighLevel.
5. Submit Step 2 and confirm the SAME contact record receives the diagnostic custom-field values.

Do not rely on a `file:///` local preview for Sticky Contact. HighLevel Sticky Contact is cookie/domain based.

## Required fields

- Business Email — Required while visible; keep the field in the form even when hidden.
- Monthly Inquiry Volume — Required
- Current Lead Sources — Required
- Biggest Lead Challenge — Required

## Submit button

Style it with HighLevel's native Button Styling panel, not Custom CSS:

- Text: `Complete My Lead System Audit`
- Background: `#0A67F2`
- Hover/background if available: `#0754CA`
- Text: `#FFFFFF`
- Width: `100%`
- Border radius: `10px`
- Font: Manrope
- Weight: 800
- Font size: 14–15px
- Min height / vertical size: about 54px
- Shadow: subtle only

The included Custom CSS intentionally avoids the submit button because the prior CSS caused the hosted preview button to render as a blank white block.

## Redirect

After the thank-you route is deployed:

Step 2 form submit -> redirect to `/real-estate/thank-you/`

Configure the redirect in HighLevel. Do not intercept the form submit in site JavaScript.

## Current Step 2 form

Form ID: `GpcWTTzFwcsi3RDNqexC`

The project package already contains the current inline iframe embed. If you later hide Business Email or HighLevel generates a different `data-height`, copy the new embed code and replace the current one.
