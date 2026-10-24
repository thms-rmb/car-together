# CarTogether

## Mock implementation

A small, mobile-friendly React demo based on
[CarTogether APP (Thomas).pdf](<CarTogether APP (Thomas).pdf>). The PDF introduces
taxi price comparison, shared rides, offering a ride, ratings, and an About page.
The demo uses its green/teal palette, rounded cards, and festival focus as design guidance.

**This is a mock:** all transport prices, providers, ride participants, departures,
and available seats are sample data. Show a visible “Demo – no real bookings”
notice. The views and sample interactions below are implemented with local
React state; refreshing the page resets the demo.

### 1. Keep the scope small

- Four views: **Hjem**, **Carpool**, **Mine turer**, and **Om oss**, with simple navigation.
- Review and confirmation screens for joining, offering, cancelling, and withdrawing rides.
- Norwegian interface labels, following the PDF; prices in NOK (`kr`).
- Three fixed locations selected from dropdowns: **Palmesus (festival)**,
  **Kristiansand sentrum**, and **Vågsbygd**.
- Three fictional taxi providers and one vehicle category: standard, 1–4 people.
- A fixed demo user; no registration or login.
- React state only. Refreshing the page resets the demo.

No backend, database, external APIs, maps, GPS, address search, live prices,
payments, actual taxi reservations, chat, notifications, or native mobile app.
Skip the PDF's XL/Elbil/Maxi categories, date filters, profile screen, and editable
ratings. Keep ratings as static sample values on ride cards.

### 2. Use fixed mock data

Keep all fixtures in one local JavaScript module. These provider names and prices
are invented for the demo:

| Route | Demo Taxi | Bytaxi Mock | Festivalbil Mock |
| --- | ---: | ---: | ---: |
| Palmesus ↔ Kristiansand sentrum | 120 kr | 140 kr | 130 kr |
| Palmesus ↔ Vågsbygd | 195 kr | 225 kr | 210 kr |
| Kristiansand sentrum ↔ Vågsbygd | 160 kr | 180 kr | 170 kr |

Use the same prices in both directions. Default to **Palmesus → Vågsbygd**.
Prevent comparing a location with itself and show a short validation message.

Seed three private carpool offers; prices below are per passenger and independent
of the taxi comparison table:

| Demo driver | Route | Departure* | Free seats | Price per seat | Sample rating |
| --- | --- | --- | ---: | ---: | ---: |
| Emma | Palmesus → Vågsbygd | 20:00 | 3 | 65 kr | 4.9 |
| Sofie | Palmesus → Vågsbygd | 20:30 | 2 | 70 kr | 4.7 |
| Maja | Kristiansand sentrum → Palmesus | 21:00 | 2 | 45 kr | 4.8 |

\*Fixed demo times, with no calendar or time-based availability checks.

### 3. Build the three views

**Hjem — compare a trip**

- Show the CarTogether name, location dropdowns, and a swap-direction button.
- Immediately display the three taxi prices for the selected route. Highlight
  the cheapest option; no separate search request or loading simulation.
- Add a small “Del prisen” selector for 1–4 people. Show the cheapest taxi's
  total price divided by that number, rounded to two decimals when needed.
  For example, 195 kr shared by three people is 65 kr each.
- A **Finn samkjøring** button opens Carpool with the same route selected.

**Carpool — find or offer a sample ride**

- Reuse the location dropdowns and show seeded offers matching the exact travel
  direction. Each card shows a name, initials/avatar placeholder, static rating,
  departure, free seats, and price per person.
- **Bli med** opens a review screen with the route, driver, departure, one passenger,
  and price. Back or **Avbryt** returns without changing seats.
- **Bekreft demosete** reserves one mock seat in local state and opens a confirmation
  page with a demo reference and links to **Mine turer** and Carpool.
- The ride card shows “Du er med – kun demo”. Repeat joining and joining full rides
  or the demo user's own offer are disabled.
- If no offers match, show “Ingen demoturer på denne ruten”.
- **Tilby en demotur** opens a small form for the demo user. It defaults to the
  selected route, departure 21:00, two free seats, and 60 kr per passenger.
- Edit the route, departure time, 1–4 seats, and an integer price of 1–500 kr.
  Invalid values show field errors; a route must use two different fixed locations.
- Review the details before **Publiser demotur**. Returning to edit retains the
  draft; leaving the flow discards it. Nothing is published until confirmation.
- Publishing opens a confirmation page and selects the published route in Carpool.
  One active offer is allowed at a time; withdrawing it allows a new offer.
- Keep these changes when switching views; reset everything on refresh. The
  demo user cannot join their own offer.

**Mine turer — manage the demo**

- Lists joined rides and the demo user's active offer, with details and references.
- **Avbestill demosete** opens a review screen. Confirming returns exactly one seat
  to the ride; **Behold turen** leaves it unchanged. Rejoining is then possible.
- **Trekk tilbake demotur** opens a review screen before removing the user's offer.
- Cancellation and withdrawal each have a confirmation page.
- **Nullstill demo** in the footer asks before clearing all changes and restoring
  the initial route, one-person split, seed rides, and empty Mine turer view.
- Refreshing still resets everything. No state is stored outside React.

**Om oss — explain the idea**

- Briefly describe making festival travel easier and more affordable through
  price comparison and shared rides.
- List the team shown in the PDF: Ella (CEO), Amathea (CFO), Emma (CPO),
  Sunniva (CMO), and Lucia (COO). Use initials until separate portraits are supplied.
- Include short statements about the concept's intended support for SDG 9
  (innovation), SDG 11 (sustainable cities), and SDG 13 (climate action).
  No calculated savings or emissions claims.

### 4. Implement with the existing setup

The app keeps React and webpack with no new runtime dependencies. Playwright is
a development dependency for browser tests.

- `app/app.js`: app shell, active view, selected route, and flow navigation.
- `app/demo-state.js`: state transitions, offer validation, and guarded confirmations.
- `app/mock-data.js`: locations, providers, route prices, demo user, and seeded rides.
- `app/components/`: route selector, price comparison, ride cards, review and
  confirmation pages, offer form, Mine turer, and About content.
- `app/style/style.css`: reuse the existing color variables; add the responsive
  layout, cards, buttons, and visible keyboard focus styles.

Use React state to switch views without a router. Use a text wordmark until the
separate transparent logo mentioned in the PDF is available. Build a narrow-screen
layout first, with readable cards on desktop and labelled native form controls.

### 5. Implementation order and acceptance checks

1. Add fixtures, the app shell, four views, and the demo notice.
2. Implement location selection, swapping, price comparison, and the split preview.
3. Add route-filtered carpool cards and review/confirmation flows for joining,
   offering, cancellation, and withdrawal.
4. Add About content and apply the PDF-inspired styling.
5. Run `npm test`, `npm run lint`, and `npm run build`, then manually confirm:
   - All three route pairs and their reverse directions show the table's prices.
   - Matching origin/destination is rejected, and the cheapest fare is highlighted.
   - Splitting 195 kr among three people shows 65 kr per person.
   - The selected route carries between Hjem and Carpool; unmatched routes show
     the empty message.
   - Joining changes the seat count once; full rides and the user's own offer
     cannot be joined.
   - Reviewing and abandoning a flow leaves seats and offers unchanged.
   - Offering validates details and publishes once; navigation preserves changes
     and refresh restores the fixtures.
   - Mine turer shows confirmed rides; cancellation restores a seat and withdrawal
     removes the offer. The reset action asks before restoring the fixtures.
   - Navigation and controls work on a phone-sized screen and with a keyboard.
   - All actions remain local and clearly indicate that no real booking occurs.

All flows stay local and clearly indicate demo status. Production bookings,
accounts, payments, and contact with drivers remain outside this implementation.

## Local development

React app built with webpack's experimental native HTML and CSS support.
`app/index.html` loads `app/app.js` and `app/style/style.css`; React renders into
`#root`.

Requires Node.js 22.15+.

```sh
npm ci
npm start       # Development server: http://localhost:8080
npm run build  # Production output: dist/
npm run lint   # JavaScript and CSS via ESLint + @eslint/css
```

## Testing the flows

```sh
npx playwright install firefox  # Once, for the browser tests
npm test                       # State tests + desktop and phone browser flows
npm run test:unit               # State transitions and validation only
npm run test:e2e                # Browser flows only
```

Browser tests reuse the server on port 8080, or start it if none is running.
Each test gets a fresh demo. Both desktop (1440px) and phone (390px) projects run
comparison, joining/cancellation, offering/withdrawal, abandoning a draft, reset,
and refresh/keyboard scenarios. Failed browser tests save screenshots and traces
under `test-results/`.

To use an already installed Firefox executable, set
`PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH` to its absolute path before running tests.

For a manual walkthrough:

1. On **Hjem**, split the default 195 kr fare between three people, then select
   **Finn samkjøring**.
2. Choose **Bli med** on Emma's ride. Review the details, select **Bekreft demosete**,
   and open **Se mine turer**. Try cancelling, keeping the ride, and then cancelling
   again with confirmation. Emma's seat count returns to three.
3. In **Carpool**, select **Tilby en demotur**. Edit the time, seats, or price, review,
   return to edit, and publish. Withdraw it through **Mine turer**.
4. Use **Nullstill demo** in the footer to try everything again.
