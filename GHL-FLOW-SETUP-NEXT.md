# MDS Real Estate Funnel — GHL Direct Redirect Setup

## Final live flow

1. Landing / Form 1
   `https://realestate.marydigisolutions.com/`

2. Form 1 success redirects DIRECTLY to:
   `https://realestate.marydigisolutions.com/step-2.html`

3. Step 2 / Form 2 success redirects DIRECTLY to:
   `https://realestate.marydigisolutions.com/step-2.html?audit=complete#book`

4. The same Step 2 page detects `audit=complete`, switches the form card to the Audit Complete state, and automatically opens the Discovery Call calendar modal.

5. Calendar booking success redirects DIRECTLY to:
   `https://realestate.marydigisolutions.com/thank-you.html`

No bridge HTML pages are required.

## Form 1

Form: `MDS | Real Estate Lead System Audit`

Recommended fields:
- Full Name — required
- Email — required
- Phone — required
- Company / Team — required
- Text Message Consent — optional, one checkbox option

Recommended non-marketing SMS consent checkbox:

Label:
`Text Message Consent`

Single checkbox option:
`I consent to receive non-marketing text messages from Mary Digi Solutions about my Lead System Audit and Discovery Call. Message frequency may vary. Message & data rates may apply. Text HELP for assistance. Reply STOP to opt out.`

Settings:
- Checkbox Required: OFF
- Checkbox pre-selected/default checked: OFF
- Sticky Contact: ON
- Enable Timezone: ON
- Save progress for forms: OFF
- Create Conversation on Submission: OFF for now
- On Submit: Redirect to URL
- Redirect URL:
  `https://realestate.marydigisolutions.com/step-2.html`

Keep the visible Privacy Policy and Terms links in the form. If marketing SMS is added later, collect that consent separately from this non-marketing appointment/audit consent.

## Form 2

Form: `MDS | Real Estate Lead Audit - Step 2`
Form ID: `GpcWTTzFwcsi3RDNqexC`

Settings:
- Sticky Contact: ON
- Keep Business Email in the form for contact association; hide it only after same-contact testing passes.
- On Submit: Redirect to URL
- Redirect URL:
  `https://realestate.marydigisolutions.com/step-2.html?audit=complete#book`

Challenge field:
- Label: `What are the biggest challenges in your current lead process?`
- Helper text: `Select up to 3`
- Use a multiple-choice field.
- HighLevel does not reliably provide a native hard maximum of 3 selections in all form configurations, so treat “Select up to 3” as guidance unless we implement a separate strict-control solution.

## Discovery Call calendar

Calendar: `MDS | Real Estate Discovery Call`
Booking widget ID: `DH8Z9XycUL5sRi9xQo7W`

The calendar iframe is already embedded in the Step 2 modal.

Calendar confirmation:
- Use Redirect URL
- Redirect to:
  `https://realestate.marydigisolutions.com/thank-you.html`

## Test order

1. Open the landing page in a normal browser tab.
2. Submit Form 1.
3. Confirm the browser moves to `/step-2.html`.
4. Confirm Sticky Contact associates the same person in Form 2.
5. Submit Form 2.
6. Confirm the browser returns to `/step-2.html?audit=complete#book`.
7. Confirm the Audit Complete state appears and the calendar modal opens.
8. Book one test Discovery Call.
9. Confirm the appointment is created and a unique Google Meet link is generated.
10. Confirm the browser redirects to `/thank-you.html`.
11. Only after this baseline works, configure workflow notifications/reminders.
